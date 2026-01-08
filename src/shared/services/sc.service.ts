import { base64ToUint8Array, createPayload, uint8ArrayToBase64 } from "@/shared/utils";
import { QubicHelper } from "@qubic-lib/qubic-ts-library/dist/qubicHelper";

import { createSCTx } from "./tx.service";
import { fetchQuerySC } from "./rpc.service";

/**
 * QSWAP SC integration (see `qswap.sc.h`)
 *
 * User functions (querySmartContract inputType):
 * - Fees: 1
 * - GetPoolBasicState: 2
 * - GetLiquidityOf: 3
 * - QuoteExactQuInput: 4
 * - QuoteExactQuOutput: 5
 * - QuoteExactAssetInput: 6
 * - QuoteExactAssetOutput: 7
 * - InvestRewardsInfo: 8
 *
 * User procedures (tx inputType):
 * - IssueAsset: 1
 * - TransferShareOwnershipAndPossession: 2
 * - CreatePool: 3
 * - AddLiquidity: 4
 * - RemoveLiquidity: 5
 * - SwapExactQuForAsset: 6
 * - SwapQuForExactAsset: 7
 * - SwapExactAssetForQu: 8
 * - SwapAssetForExactQu: 9
 * - SetInvestRewardsInfo: 10
 * - TransferShareManagementRights: 11
 */

const qHelper = new QubicHelper();

// Default kept as 12 for backwards compatibility; override via env.
export const SC_INDEX = Number(import.meta.env.VITE_QSWAP_SC_INDEX || 13);

const getResponseValues = (res: any) => {
  if (!res.responseData) return null;
  const responseBytes = base64ToUint8Array(res.responseData);
  const responseView = new DataView(responseBytes.buffer);

  return {
    getUint64: (offset: number) => Number(responseView.getBigUint64(offset, true)),
    getInt64: (offset: number) => Number(responseView.getBigInt64(offset, true)),
    getUint32: (offset: number) => responseView.getUint32(offset, true),
    getUint8: (offset: number) => responseView.getUint8(offset),
    getBool: (offset: number) => responseView.getUint8(offset) !== 0,
    getID: (offset: number) => qHelper.getIdentity(responseBytes.slice(offset, offset + 32)),
  };
};

// -------------------------
// Query (user function) APIs
// -------------------------

export type QSwapFees = {
  assetIssuanceFee: number;
  poolCreationFee: number;
  transferFee: number;
  swapFee: number;
  shareholderFee: number;
  investRewardsFee: number;
  qxFee: number;
  burnFee: number;
};

export const getFees = async (): Promise<QSwapFees | null> => {
  const res = await fetchQuerySC({
    contractIndex: SC_INDEX,
    inputType: 1,
    inputSize: 0,
    requestData: "",
  });

  const v = getResponseValues(res);
  if (!v) return null;

  return {
    assetIssuanceFee: v.getUint32(0),
    poolCreationFee: v.getUint32(4),
    transferFee: v.getUint32(8),
    swapFee: v.getUint32(12),
    shareholderFee: v.getUint32(16),
    investRewardsFee: v.getUint32(20),
    qxFee: v.getUint32(24),
    burnFee: v.getUint32(28),
  };
};

export type PoolBasicState = {
  poolExists: number;
  reservedQuAmount: number;
  reservedAssetAmount: number;
  totalLiquidity: number;
};

export const getPoolBasicState = async (params: { assetIssuer: string; assetName: number }): Promise<PoolBasicState> => {
  const payload = createPayload([
    { data: qHelper.getIdentityBytes(params.assetIssuer), type: "id" },
    { data: params.assetName, type: "uint64" },
  ]);

  const res = await fetchQuerySC({
    contractIndex: SC_INDEX,
    inputType: 2,
    inputSize: payload.getPackageSize(),
    requestData: uint8ArrayToBase64(payload.getPackageData()),
  });

  const v = getResponseValues(res);
  if (!v) return { poolExists: 0, reservedQuAmount: 0, reservedAssetAmount: 0, totalLiquidity: 0 };

  return {
    poolExists: v.getInt64(0),
    reservedQuAmount: v.getInt64(8),
    reservedAssetAmount: v.getInt64(16),
    totalLiquidity: v.getInt64(24),
  };
};

export const getLiquidityOf = async (params: {
  assetIssuer: string;
  assetName: number;
  account: string;
}): Promise<{ liquidity: number } | null> => {
  const payload = createPayload([
    { data: qHelper.getIdentityBytes(params.assetIssuer), type: "id" },
    { data: params.assetName, type: "uint64" },
    { data: qHelper.getIdentityBytes(params.account), type: "id" },
  ]);

  const res = await fetchQuerySC({
    contractIndex: SC_INDEX,
    inputType: 3,
    inputSize: payload.getPackageSize(),
    requestData: uint8ArrayToBase64(payload.getPackageData()),
  });

  const v = getResponseValues(res);
  if (!v) return null;
  return { liquidity: v.getInt64(0) };
};

export const quoteExactQuInput = async (params: {
  assetIssuer: string;
  assetName: number;
  quAmountIn: number;
}): Promise<{ assetAmountOut: number } | null> => {
  const payload = createPayload([
    { data: qHelper.getIdentityBytes(params.assetIssuer), type: "id" },
    { data: params.assetName, type: "uint64" },
    { data: params.quAmountIn, type: "int64" },
  ]);

  const res = await fetchQuerySC({
    contractIndex: SC_INDEX,
    inputType: 4,
    inputSize: payload.getPackageSize(),
    requestData: uint8ArrayToBase64(payload.getPackageData()),
  });

  const v = getResponseValues(res);
  if (!v) return null;
  return { assetAmountOut: v.getInt64(0) };
};

export const quoteExactQuOutput = async (params: {
  assetIssuer: string;
  assetName: number;
  quAmountOut: number;
}): Promise<{ assetAmountIn: number } | null> => {
  const payload = createPayload([
    { data: qHelper.getIdentityBytes(params.assetIssuer), type: "id" },
    { data: params.assetName, type: "uint64" },
    { data: params.quAmountOut, type: "int64" },
  ]);

  const res = await fetchQuerySC({
    contractIndex: SC_INDEX,
    inputType: 5,
    inputSize: payload.getPackageSize(),
    requestData: uint8ArrayToBase64(payload.getPackageData()),
  });

  const v = getResponseValues(res);
  if (!v) return null;
  return { assetAmountIn: v.getInt64(0) };
};

export const quoteExactAssetInput = async (params: {
  assetIssuer: string;
  assetName: number;
  assetAmountIn: number;
}): Promise<{ quAmountOut: number } | null> => {
  const payload = createPayload([
    { data: qHelper.getIdentityBytes(params.assetIssuer), type: "id" },
    { data: params.assetName, type: "uint64" },
    { data: params.assetAmountIn, type: "int64" },
  ]);

  const res = await fetchQuerySC({
    contractIndex: SC_INDEX,
    inputType: 6,
    inputSize: payload.getPackageSize(),
    requestData: uint8ArrayToBase64(payload.getPackageData()),
  });

  const v = getResponseValues(res);
  if (!v) return null;
  return { quAmountOut: v.getInt64(0) };
};

export const quoteExactAssetOutput = async (params: {
  assetIssuer: string;
  assetName: number;
  assetAmountOut: number;
}): Promise<{ quAmountIn: number } | null> => {
  const payload = createPayload([
    { data: qHelper.getIdentityBytes(params.assetIssuer), type: "id" },
    { data: params.assetName, type: "uint64" },
    { data: params.assetAmountOut, type: "int64" },
  ]);

  const res = await fetchQuerySC({
    contractIndex: SC_INDEX,
    inputType: 7,
    inputSize: payload.getPackageSize(),
    requestData: uint8ArrayToBase64(payload.getPackageData()),
  });

  const v = getResponseValues(res);
  if (!v) return null;
  return { quAmountIn: v.getInt64(0) };
};

export const getInvestRewardsInfo = async (): Promise<{ investRewardsFee: number; investRewardsId: string } | null> => {
  const res = await fetchQuerySC({
    contractIndex: SC_INDEX,
    inputType: 8,
    inputSize: 0,
    requestData: "",
  });

  const v = getResponseValues(res);
  if (!v) return null;
  return { investRewardsFee: v.getUint32(0), investRewardsId: await v.getID(4) };
};

// ------------------------------
// Transaction (user procedure) APIs
// ------------------------------

export const issueAsset = async (params: {
  sourceID: string;
  assetName: number;
  numberOfShares: number;
  unitOfMeasurement: number;
  numberOfDecimalPlaces: number;
  tick: number;
  feeQu?: number;
}) => {
  const payload = createPayload([
    { data: params.assetName, type: "uint64" },
    { data: params.numberOfShares, type: "int64" },
    { data: params.unitOfMeasurement, type: "uint64" },
    { data: params.numberOfDecimalPlaces, type: "uint8" },
  ]);
  const feeQu = params.feeQu ?? (await getFees())?.assetIssuanceFee ?? 0;
  return await createSCTx(params.sourceID, SC_INDEX, 1, payload.getPackageSize(), feeQu, params.tick, payload);
};

export const transferShareOwnershipAndPossession = async (params: {
  sourceID: string;
  assetIssuer: string;
  assetName: number;
  newOwnerAndPossessor: string;
  amount: number;
  tick: number;
  feeQu?: number;
}) => {
  const payload = createPayload([
    { data: qHelper.getIdentityBytes(params.assetIssuer), type: "id" },
    { data: params.assetName, type: "uint64" },
    { data: qHelper.getIdentityBytes(params.newOwnerAndPossessor), type: "id" },
    { data: params.amount, type: "int64" },
  ]);
  const feeQu = params.feeQu ?? (await getFees())?.transferFee ?? 0;
  return await createSCTx(params.sourceID, SC_INDEX, 2, payload.getPackageSize(), feeQu, params.tick, payload);
};

export const createPool = async (params: {
  sourceID: string;
  assetIssuer: string;
  assetName: number;
  tick: number;
  feeQu?: number;
}) => {
  const payload = createPayload([
    { data: qHelper.getIdentityBytes(params.assetIssuer), type: "id" },
    { data: params.assetName, type: "uint64" },
  ]);
  const feeQu = params.feeQu ?? (await getFees())?.poolCreationFee ?? 0;
  return await createSCTx(params.sourceID, SC_INDEX, 3, payload.getPackageSize(), feeQu, params.tick, payload);
};

export const addLiquidity = async (params: {
  sourceID: string;
  assetIssuer: string;
  assetName: number;
  assetAmountDesired: number;
  quAmountDesired: number;
  quAmountMin: number;
  assetAmountMin: number;
  tick: number;
}) => {
  const payload = createPayload([
    { data: qHelper.getIdentityBytes(params.assetIssuer), type: "id" },
    { data: params.assetName, type: "uint64" },
    { data: params.assetAmountDesired, type: "int64" },
    { data: params.quAmountMin, type: "int64" },
    { data: params.assetAmountMin, type: "int64" },
  ]);
  // quAmountDesired is sent as invocationReward (tx amount)
  return await createSCTx(params.sourceID, SC_INDEX, 4, payload.getPackageSize(), params.quAmountDesired, params.tick, payload);
};

export const removeLiquidity = async (params: {
  sourceID: string;
  assetIssuer: string;
  assetName: number;
  burnLiquidity: number;
  quAmountMin: number;
  assetAmountMin: number;
  tick: number;
}) => {
  const payload = createPayload([
    { data: qHelper.getIdentityBytes(params.assetIssuer), type: "id" },
    { data: params.assetName, type: "uint64" },
    { data: params.burnLiquidity, type: "int64" },
    { data: params.quAmountMin, type: "int64" },
    { data: params.assetAmountMin, type: "int64" },
  ]);
  return await createSCTx(params.sourceID, SC_INDEX, 5, payload.getPackageSize(), 0, params.tick, payload);
};

export const swapExactQuForAsset = async (params: {
  sourceID: string;
  assetIssuer: string;
  assetName: number;
  quAmountIn: number;
  assetAmountOutMin: number;
  tick: number;
}) => {
  const payload = createPayload([
    { data: qHelper.getIdentityBytes(params.assetIssuer), type: "id" },
    { data: params.assetName, type: "uint64" },
    { data: params.assetAmountOutMin, type: "int64" },
  ]);
  return await createSCTx(params.sourceID, SC_INDEX, 6, payload.getPackageSize(), params.quAmountIn, params.tick, payload);
};

export const swapQuForExactAsset = async (params: {
  sourceID: string;
  assetIssuer: string;
  assetName: number;
  quAmountInMax: number;
  assetAmountOut: number;
  tick: number;
}) => {
  const payload = createPayload([
    { data: qHelper.getIdentityBytes(params.assetIssuer), type: "id" },
    { data: params.assetName, type: "uint64" },
    { data: params.assetAmountOut, type: "int64" },
  ]);
  // quAmountInMax is sent as invocationReward; unused part is refunded by SC
  return await createSCTx(params.sourceID, SC_INDEX, 7, payload.getPackageSize(), params.quAmountInMax, params.tick, payload);
};

export const swapExactAssetForQu = async (params: {
  sourceID: string;
  assetIssuer: string;
  assetName: number;
  assetAmountIn: number;
  quAmountOutMin: number;
  tick: number;
}) => {
  const payload = createPayload([
    { data: qHelper.getIdentityBytes(params.assetIssuer), type: "id" },
    { data: params.assetName, type: "uint64" },
    { data: params.assetAmountIn, type: "int64" },
    { data: params.quAmountOutMin, type: "int64" },
  ]);
  // For asset->QU swaps, SC refunds any invocationReward; send 0.
  return await createSCTx(params.sourceID, SC_INDEX, 8, payload.getPackageSize(), 0, params.tick, payload);
};

export const swapAssetForExactQu = async (params: {
  sourceID: string;
  assetIssuer: string;
  assetName: number;
  assetAmountInMax: number;
  quAmountOut: number;
  tick: number;
}) => {
  const payload = createPayload([
    { data: qHelper.getIdentityBytes(params.assetIssuer), type: "id" },
    { data: params.assetName, type: "uint64" },
    { data: params.assetAmountInMax, type: "int64" },
    { data: params.quAmountOut, type: "int64" },
  ]);
  // For asset->QU swaps, SC refunds any invocationReward; send 0.
  return await createSCTx(params.sourceID, SC_INDEX, 9, payload.getPackageSize(), 0, params.tick, payload);
};

export const setInvestRewardsInfo = async (params: { sourceID: string; newInvestRewardsId: string; tick: number }) => {
  const payload = createPayload([{ data: qHelper.getIdentityBytes(params.newInvestRewardsId), type: "id" }]);
  return await createSCTx(params.sourceID, SC_INDEX, 10, payload.getPackageSize(), 0, params.tick, payload);
};

export const transferShareManagementRights = async (params: {
  sourceID: string;
  assetIssuer: string;
  assetName: number;
  numberOfShares: number;
  newManagingContractIndex: number;
  tick: number;
  feeQu?: number;
}) => {
  // QSWAP expects `Asset asset;` which is 32-byte issuer id + uint64 assetName
  const payload = createPayload([
    { data: qHelper.getIdentityBytes(params.assetIssuer), type: "id" },
    { data: params.assetName, type: "uint64" },
    { data: params.numberOfShares, type: "int64" },
    { data: params.newManagingContractIndex, type: "uint32" },
  ]);
  // Contract checks invocationReward() >= 100 (QSWAP_FEE_BASE_100)
  const feeQu = params.feeQu ?? 100;
  return await createSCTx(params.sourceID, SC_INDEX, 11, payload.getPackageSize(), feeQu, params.tick, payload);
};
