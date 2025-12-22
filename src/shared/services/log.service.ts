import type { IEvent, TickEvents } from "@/shared/types";
import { base64ToUint8Array } from "@/shared/utils";

import { SC_INDEX } from "./sc.service";
import { QubicHelper } from "@qubic-lib/qubic-ts-library/dist/qubicHelper";

enum EventType {
  QU_TRANSFER = 0,
  ASSET_ISSUANCE = 1,
  ASSET_OWNERSHIP_CHANGE = 2,
  ASSET_POSSESSION_CHANGE = 3,
  CONTRACT_ERROR_MESSAGE = 4,
  CONTRACT_WARNING_MESSAGE = 5,
  CONTRACT_INFORMATION_MESSAGE = 6,
  CONTRACT_DEBUG_MESSAGE = 7,
  BURNING = 8,
  DUST_BURNING = 9,
  SPECTRUM_STATS = 10,
  ASSET_OWNERSHIP_MANAGING_CONTRACT_CHANGE = 11,
  ASSET_POSSESSION_MANAGING_CONTRACT_CHANGE = 12,
  CUSTOM_MESSAGE = 255,
}

// `qswap.sc.h`:
// enum QSWAPLogInfo {
//   QSWAPAddLiquidity = 4,
//   QSWAPRemoveLiquidity = 5,
//   QSWAPSwapExactQuForAsset = 6,
//   QSWAPSwapQuForExactAsset = 7,
//   QSWAPSwapExactAssetForQu = 8,
//   QSWAPSwapAssetForExactQu = 9,
//   QSWAPFailedDistribution = 10,
// };
enum QSWAP_LOGS {
  QSWAPAddLiquidity = 4,
  QSWAPRemoveLiquidity = 5,
  QSWAPSwapExactQuForAsset = 6,
  QSWAPSwapQuForExactAsset = 7,
  QSWAPSwapExactAssetForQu = 8,
  QSWAPSwapAssetForExactQu = 9,
  QSWAPFailedDistribution = 10,
}

const checkSCLog = (event: IEvent) => {
  let result = false;
  if (
    event.eventType === EventType.CONTRACT_ERROR_MESSAGE ||
    event.eventType === EventType.CONTRACT_WARNING_MESSAGE ||
    event.eventType === EventType.CONTRACT_INFORMATION_MESSAGE ||
    event.eventType === EventType.CONTRACT_DEBUG_MESSAGE
  ) {
    result = true;
  }
  return result;
};

const decodeLogHeader = (eventData: string) => {
  const eventDataArray = base64ToUint8Array(eventData);
  const dataView = new DataView(eventDataArray.buffer);
  const SCIdx = dataView.getUint32(0, true);
  const eventType = dataView.getUint32(4, true);

  return { contractIdx: SCIdx, rawType: eventType, logType: (QSWAP_LOGS as any)[eventType] as string | undefined };
};

const decodeLogBody = async (eventData: string, rawType: number) => {
  const bytes = base64ToUint8Array(eventData);
  const view = new DataView(bytes.buffer);
  const qHelper = new QubicHelper();

  const getID = async (offset: number) => qHelper.getIdentity(bytes.slice(offset, offset + 32));
  const getU64 = (offset: number) => Number(view.getBigUint64(offset, true));
  const getI64 = (offset: number) => Number(view.getBigInt64(offset, true));

  switch (rawType) {
    case QSWAP_LOGS.QSWAPAddLiquidity: {
      return {
        assetIssuer: await getID(8),
        assetName: getU64(40),
        userIncreaseLiquidity: getI64(48),
        quAmount: getI64(56),
        assetAmount: getI64(64),
      };
    }
    case QSWAP_LOGS.QSWAPRemoveLiquidity: {
      return {
        quAmount: getI64(8),
        assetAmount: getI64(16),
      };
    }
    case QSWAP_LOGS.QSWAPSwapExactQuForAsset:
    case QSWAP_LOGS.QSWAPSwapQuForExactAsset:
    case QSWAP_LOGS.QSWAPSwapExactAssetForQu:
    case QSWAP_LOGS.QSWAPSwapAssetForExactQu: {
      return {
        assetIssuer: await getID(8),
        assetName: getU64(40),
        assetAmountIn: getI64(48),
        assetAmountOut: getI64(56),
      };
    }
    case QSWAP_LOGS.QSWAPFailedDistribution: {
      return {
        dst: await getID(8),
        amount: getU64(40),
      };
    }
    default:
      return null;
  }
};

const decodeQswapLog = async (log: TickEvents) => {
  const result: any[] = [];

  for (const tx of log.txEvents) {
    for (const event of tx.events) {
      const isSCLog = checkSCLog(event);
      if (!isSCLog) continue;

      const { contractIdx, rawType, logType } = decodeLogHeader(event.eventData);
      if (contractIdx !== SC_INDEX) continue;

      const eventData = await decodeLogBody(event.eventData, rawType);
      if (eventData && logType) {
        result.push({
          tick: log.tick,
          eventId: Number(event.header.eventId),
          logType,
          ...eventData,
        });
      }
    }
  }

  return result;
};

export { decodeQswapLog };
