import { useCallback } from "react";
import { useAtom } from "jotai";
import { toast } from "sonner";
import { useQubicConnect } from "@/shared/lib/wallet-connect/QubicConnectContext";
import { settingsAtom } from "@/shared/store/settings";
import { fetchTickInfo, broadcastTx } from "@/shared/services/rpc.service";
import { addLiquidity } from "@/shared/services/sc.service";
import { useTxMonitor } from "@/shared/store/txMonitor";

export interface AddLiquidityParams {
  assetIssuer: string;
  assetName: number;
  assetAmountDesired: number;
  quAmountDesired: number;
  slippage?: number; // percentage, e.g., 0.5 for 0.5%
}

export const useAddLiquidity = () => {
  const [settings] = useAtom(settingsAtom);
  const { wallet, connected, getSignedTx, toggleConnectModal } = useQubicConnect();
  const { startMonitoring } = useTxMonitor();

  const handleAddLiquidity = useCallback(
    async (params: AddLiquidityParams) => {
      if (!connected || !wallet?.publicKey) {
        toggleConnectModal();
        return;
      }

      const { assetIssuer, assetName, assetAmountDesired, quAmountDesired, slippage = 0.5 } = params;

      const quDesired = Math.floor(quAmountDesired);
      const assetDesired = Math.floor(assetAmountDesired);

      if (!Number.isFinite(quDesired) || !Number.isFinite(assetDesired) || quDesired <= 0 || assetDesired <= 0) {
        toast.error("Enter valid amounts");
        return;
      }

      try {
        toast.loading("Preparing transaction…");
        const tickInfo = await fetchTickInfo();
        const tick = tickInfo.tick + settings.tickOffset;

        const slip = Math.max(0, slippage) / 100;
        const tx = await addLiquidity({
          sourceID: wallet.publicKey,
          assetIssuer,
          assetName,
          assetAmountDesired: assetDesired,
          quAmountDesired: quDesired,
          quAmountMin: Math.max(0, Math.floor(quDesired * (1 - slip))),
          assetAmountMin: Math.max(0, Math.floor(assetDesired * (1 - slip))),
          tick,
        });

        const signed = await getSignedTx(tx);
        const res = await broadcastTx(signed.tx);

        const taskId = `add-liquidity-${wallet.publicKey}-${tick}-${Date.now()}`;

        startMonitoring(
          taskId,
          {
            checker: async () => false,
            onSuccess: async () => {
              toast.success("Liquidity added successfully");
            },
            onFailure: async () => {
              toast.error("Add liquidity failed");
            },
            targetTick: tick,
            txHash: res?.transactionId,
          },
          "v3",
        );

        toast.success(`Add liquidity transaction sent: ${res?.transactionId ?? "OK"}`);
      } catch (e) {
        console.error(e);
        toast.error((e as Error)?.message || "Add liquidity failed");
      }
    },
    [connected, wallet, settings, getSignedTx, toggleConnectModal, startMonitoring],
  );

  return { handleAddLiquidity };
};

