import { useCallback } from "react";
import { useAtom } from "jotai";
import { toast } from "sonner";
import { useQubicConnect } from "@/shared/lib/wallet-connect/QubicConnectContext";
import { settingsAtom } from "@/shared/store/settings";
import { 
  fetchTickInfo, 
  broadcastTx, 
  fetchBalance, 
  fetchAssetsBalance,
  fetchAggregatedAssetsBalance,
  calculateRequiredTransfer,
} from "@/shared/services/rpc.service";
import { swapExactQuForAsset, swapExactAssetForQu, quoteExactQuInput, quoteExactAssetInput, SC_INDEX } from "@/shared/services/sc.service";
import { useTxMonitor } from "@/shared/store/txMonitor";

export interface SwapParams {
  fromToken: {
    issuer: string;
    assetName: string;
  };
  toToken: {
    issuer: string;
    assetName: string;
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
        const tickInfo = await fetchTickInfo();
        const tick = tickInfo.tick + settings.tickOffset;

        // Determine swap direction: QUBIC -> Asset or Asset -> QUBIC
        // QSWAP pools are always QUBIC/Asset pairs
        const isQuToAsset = fromToken.assetName === "QUBIC" || fromToken.issuer === "";

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

          // Capture initial balance before swap
          const initialAssetBalance = await fetchAssetsBalance(
            wallet.publicKey,
            toToken.assetName,
            SC_INDEX // QSWAP contract index
          );

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
              checker: async () => {
                try {
                  // Check if asset balance increased
                  const currentAssetBalance = await fetchAssetsBalance(
                    wallet.publicKey,
                    toToken.assetName,
                    SC_INDEX
                  );
                  
                  // If balance increased, swap was successful
                  const balanceIncreased = currentAssetBalance > initialAssetBalance;
                  console.log(`Swap checker: initial=${initialAssetBalance}, current=${currentAssetBalance}, success=${balanceIncreased}`);
                  return balanceIncreased;
                } catch (error) {
                  console.error("Checker error:", error);
                  return false;
                }
              },
              onSuccess: async () => {
                toast.success(`Swapped ${amountInFloor} ${fromToken.assetName} for ${toToken.assetName}`);
              },
              onFailure: async () => {
                toast.error("Swap failed");
              },
              targetTick: tick,
              txHash: res?.transactionId,
            },
            "v1",
          );

        } else {
          // Swap Asset for QUBIC
          // First, check if user has enough balance under QSwap management
          const aggregatedBalances = await fetchAggregatedAssetsBalance(wallet.publicKey);
          const transferInfo = calculateRequiredTransfer(fromToken.assetName, aggregatedBalances, amountInFloor);
          
          if (transferInfo.needsTransfer && transferInfo.transferAmount > 0) {
            // User needs to transfer management rights from QX to QSwap
            const totalAvailable = transferInfo.qxBalance + transferInfo.qswapBalance;
            
            if (totalAvailable < amountInFloor) {
              toast.error(
                `Insufficient balance. You have ${totalAvailable.toLocaleString()} ${fromToken.assetName} total ` +
                `(${transferInfo.qxBalance.toLocaleString()} under QX, ${transferInfo.qswapBalance.toLocaleString()} under QSwap), ` +
                `but you need ${amountInFloor.toLocaleString()}.`
              );
              return;
            }
            
            toast.error(
              `You need to transfer ${transferInfo.transferAmount.toLocaleString()} ${fromToken.assetName} ` +
              `from QX management to QSwap management (contract 13) before swapping. ` +
              `You currently have ${transferInfo.qswapBalance.toLocaleString()} under QSwap and ` +
              `${transferInfo.qxBalance.toLocaleString()} under QX.`,
              { duration: 10000 }
            );
            return;
          }

          const quote = await quoteExactAssetInput({
            assetIssuer: fromToken.issuer,
            assetName: fromToken.assetName,
            assetAmountIn: amountInFloor,
          });

          if (!quote) {
            toast.error("Failed to get quote");
            return;
          }

          // Capture initial QU balance before swap
          const initialBalance = await fetchBalance(wallet.publicKey);
          const initialQuBalance = Number(initialBalance.balance || "0");

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
              checker: async () => {
                try {
                  // Check if QU balance increased (accounting for tx fee)
                  const currentBalance = await fetchBalance(wallet.publicKey);
                  const currentQuBalance = Number(currentBalance.balance || "0");
                  
                  // Balance should increase by at least minOut minus some buffer for fees
                  // We consider it successful if balance is higher than initial
                  const balanceIncreased = currentQuBalance > initialQuBalance;
                  console.log(`Swap checker: initial=${initialQuBalance}, current=${currentQuBalance}, success=${balanceIncreased}`);
                  return balanceIncreased;
                } catch (error) {
                  console.error("Checker error:", error);
                  return false;
                }
              },
              onSuccess: async () => {
                toast.success(`Swapped ${amountInFloor} ${fromToken.assetName} for ${toToken.assetName}`);
              },
              onFailure: async () => {
                toast.error("Swap failed");
              },
              targetTick: tick,
              txHash: res?.transactionId,
            },
            "v1",
          );

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

