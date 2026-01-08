import { useCallback } from "react";
import { useAtom } from "jotai";
import { toast } from "sonner";
import { useQubicConnect } from "@/shared/lib/wallet-connect/QubicConnectContext";
import { settingsAtom } from "@/shared/store/settings";
import { fetchTickInfo, broadcastTx } from "@/shared/services/rpc.service";
import { swapExactQuForAsset, swapExactAssetForQu, quoteExactQuInput, quoteExactAssetInput } from "@/shared/services/sc.service";
import { useTxMonitor } from "@/shared/store/txMonitor";

export interface SwapParams {
  fromToken: {
    issuer: string;
    assetName: number;
    symbol: string;
  };
  toToken: {
    issuer: string;
    assetName: number;
    symbol: string;
  };
  amountIn: number;
  slippage?: number; // percentage, e.g., 0.5 for 0.5%
}

export const useSwap = () => {
  const [settings] = useAtom(settingsAtom);
  const { wallet, connected, getSignedTx, toggleConnectModal } = useQubicConnect();
  const { startMonitoring } = useTxMonitor();

  const handleSwap = useCallback(
    async (params: SwapParams) => {
      if (!connected || !wallet?.publicKey) {
        toggleConnectModal();
        return;
      }

      const { fromToken, toToken, amountIn, slippage = 0.5 } = params;

      if (!Number.isFinite(amountIn) || amountIn <= 0) {
        toast.error("Enter a valid amount");
        return;
      }

      const amountInFloor = Math.floor(amountIn);
      const slip = Math.max(0, slippage) / 100;

      try {
        toast.loading("Preparing transaction…");
        const tickInfo = await fetchTickInfo();
        const tick = tickInfo.tick + settings.tickOffset;

        // Determine swap direction: QUBIC -> Asset or Asset -> QUBIC
        // QSWAP pools are always QUBIC/Asset pairs
        const isQuToAsset = fromToken.symbol === "QUBIC" || fromToken.issuer === "";

        if (isQuToAsset) {
          // Swap QUBIC for Asset
          const quote = await quoteExactQuInput({
            assetIssuer: toToken.issuer,
            assetName: toToken.assetName,
            quAmountIn: amountInFloor,
          });

          if (!quote) {
            toast.error("Failed to get quote");
            return;
          }

          const minOut = Math.max(0, Math.floor(quote.assetAmountOut * (1 - slip)));
          const tx = await swapExactQuForAsset({
            sourceID: wallet.publicKey,
            assetIssuer: toToken.issuer,
            assetName: toToken.assetName,
            quAmountIn: amountInFloor,
            assetAmountOutMin: minOut,
            tick,
          });

          const signed = await getSignedTx(tx);
          const res = await broadcastTx(signed.tx);

          const taskId = `swap-qu-asset-${wallet.publicKey}-${tick}-${Date.now()}`;

          startMonitoring(
            taskId,
            {
              checker: async () => false,
              onSuccess: async () => {
                toast.success(`Swapped ${amountInFloor} ${fromToken.symbol} for ${toToken.symbol}`);
              },
              onFailure: async () => {
                toast.error("Swap failed");
              },
              targetTick: tick,
              txHash: res?.transactionId,
            },
            "v3",
          );

          toast.success(`Swap transaction sent: ${res?.transactionId ?? "OK"}`);
        } else {
          // Swap Asset for QUBIC
          const quote = await quoteExactAssetInput({
            assetIssuer: fromToken.issuer,
            assetName: fromToken.assetName,
            assetAmountIn: amountInFloor,
          });

          if (!quote) {
            toast.error("Failed to get quote");
            return;
          }

          const minOut = Math.max(0, Math.floor(quote.quAmountOut * (1 - slip)));
          const tx = await swapExactAssetForQu({
            sourceID: wallet.publicKey,
            assetIssuer: fromToken.issuer,
            assetName: fromToken.assetName,
            assetAmountIn: amountInFloor,
            quAmountOutMin: minOut,
            tick,
          });

          const signed = await getSignedTx(tx);
          const res = await broadcastTx(signed.tx);

          const taskId = `swap-asset-qu-${wallet.publicKey}-${tick}-${Date.now()}`;

          startMonitoring(
            taskId,
            {
              checker: async () => false,
              onSuccess: async () => {
                toast.success(`Swapped ${amountInFloor} ${fromToken.symbol} for ${toToken.symbol}`);
              },
              onFailure: async () => {
                toast.error("Swap failed");
              },
              targetTick: tick,
              txHash: res?.transactionId,
            },
            "v3",
          );

          toast.success(`Swap transaction sent: ${res?.transactionId ?? "OK"}`);
        }
      } catch (e) {
        console.error(e);
        toast.error((e as Error)?.message || "Swap failed");
      }
    },
    [connected, wallet, settings, getSignedTx, toggleConnectModal, startMonitoring],
  );

  return { handleSwap };
};

