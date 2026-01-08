import { useCallback } from "react";
import { useAtom } from "jotai";
import { toast } from "sonner";
import { useQubicConnect } from "@/shared/lib/wallet-connect/QubicConnectContext";
import { settingsAtom } from "@/shared/store/settings";
import { fetchTickInfo, broadcastTx } from "@/shared/services/rpc.service";
import { removeLiquidity } from "@/shared/services/sc.service";
import { useTxMonitor } from "@/shared/store/txMonitor";

export interface RemoveLiquidityParams {
  assetIssuer: string;
  assetName: number;
  burnLiquidity: number;
  slippage?: number; // percentage, e.g., 0.5 for 0.5%
}

export interface PoolState {
  reservedQuAmount: number;
  reservedAssetAmount: number;
  totalLiquidity: number;
}

export const useRemoveLiquidity = () => {
  const [settings] = useAtom(settingsAtom);
  const { wallet, connected, getSignedTx, toggleConnectModal } = useQubicConnect();
  const { startMonitoring } = useTxMonitor();

  const handleRemoveLiquidity = useCallback(
    async (params: RemoveLiquidityParams, poolState: PoolState) => {
      if (!connected || !wallet?.publicKey) {
        toggleConnectModal();
        return;
      }

      const { assetIssuer, assetName, burnLiquidity, slippage = 0.5 } = params;

      if (!poolState || poolState.totalLiquidity <= 0) {
        toast.error("No liquidity to remove");
        return;
      }

      const burnLiq = Math.floor(burnLiquidity);
      if (burnLiq <= 0) {
        toast.error("Select an amount to remove");
        return;
      }

      try {
        toast.loading("Preparing transaction…");
        const tickInfo = await fetchTickInfo();
        const tick = tickInfo.tick + settings.tickOffset;

        // Calculate expected amounts based on pool ratios
        const quAmountOut = Math.floor((poolState.reservedQuAmount * burnLiq) / poolState.totalLiquidity);
        const assetAmountOut = Math.floor((poolState.reservedAssetAmount * burnLiq) / poolState.totalLiquidity);

        const slip = Math.max(0, slippage) / 100;
        const tx = await removeLiquidity({
          sourceID: wallet.publicKey,
          assetIssuer,
          assetName,
          burnLiquidity: burnLiq,
          quAmountMin: Math.max(0, Math.floor(quAmountOut * (1 - slip))),
          assetAmountMin: Math.max(0, Math.floor(assetAmountOut * (1 - slip))),
          tick,
        });

        const signed = await getSignedTx(tx);
        const res = await broadcastTx(signed.tx);

        const taskId = `remove-liquidity-${wallet.publicKey}-${tick}-${Date.now()}`;

        startMonitoring(
          taskId,
          {
            checker: async () => false,
            onSuccess: async () => {
              toast.success("Liquidity removed successfully");
            },
            onFailure: async () => {
              toast.error("Remove liquidity failed");
            },
            targetTick: tick,
            txHash: res?.transactionId,
          },
          "v3",
        );

        toast.success(`Remove liquidity transaction sent: ${res?.transactionId ?? "OK"}`);
      } catch (e) {
        console.error(e);
        toast.error((e as Error)?.message || "Remove liquidity failed");
      }
    },
    [connected, wallet, settings, getSignedTx, toggleConnectModal, startMonitoring],
  );

  return { handleRemoveLiquidity };
};

