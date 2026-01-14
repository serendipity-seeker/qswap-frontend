import { useCallback } from "react";
import { useAtom } from "jotai";
import { toast } from "sonner";
import { useQubicConnect } from "@/shared/lib/wallet-connect/QubicConnectContext";
import { settingsAtom } from "@/shared/store/settings";
import { 
  fetchTickInfo, 
  broadcastTx,
  fetchAggregatedAssetsBalance,
  calculateRequiredTransfer,
} from "@/shared/services/rpc.service";
import { addLiquidity, getLiquidityOf } from "@/shared/services/sc.service";
import { useTxMonitor } from "@/shared/store/txMonitor";

export interface AddLiquidityParams {
  assetIssuer: string;
  assetName: string;
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
        // Check if user has enough asset balance under QSwap management
        const aggregatedBalances = await fetchAggregatedAssetsBalance(wallet.publicKey);
        const transferInfo = calculateRequiredTransfer(assetName, aggregatedBalances, assetDesired);
        
        if (transferInfo.needsTransfer && transferInfo.transferAmount > 0) {
          // User needs to transfer management rights from QX to QSwap
          const totalAvailable = transferInfo.qxBalance + transferInfo.qswapBalance;
          
          if (totalAvailable < assetDesired) {
            toast.error(
              `Insufficient ${assetName} balance. You have ${totalAvailable.toLocaleString()} total ` +
              `(${transferInfo.qxBalance.toLocaleString()} under QX, ${transferInfo.qswapBalance.toLocaleString()} under QSwap), ` +
              `but you need ${assetDesired.toLocaleString()}.`
            );
            return;
          }
          
          toast.error(
            `You need to transfer ${transferInfo.transferAmount.toLocaleString()} ${assetName} ` +
            `from QX management to QSwap management (contract 13) before adding liquidity. ` +
            `You currently have ${transferInfo.qswapBalance.toLocaleString()} under QSwap and ` +
            `${transferInfo.qxBalance.toLocaleString()} under QX.`,
            { duration: 10000 }
          );
          return;
        }
        
        const tickInfo = await fetchTickInfo();
        const tick = tickInfo.tick + settings.tickOffset;

        // Capture initial liquidity position
        const initialLiquidity = await getLiquidityOf({
          assetIssuer,
          assetName,
          account: wallet.publicKey,
        });
        const initialLiquidityAmount = initialLiquidity?.liquidity || 0;

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
            checker: async () => {
              try {
                // Check if liquidity position increased
                const currentLiquidity = await getLiquidityOf({
                  assetIssuer,
                  assetName,
                  account: wallet.publicKey,
                });
                const currentLiquidityAmount = currentLiquidity?.liquidity || 0;
                
                // If liquidity increased, operation was successful
                const liquidityIncreased = currentLiquidityAmount > initialLiquidityAmount;
                console.log(`Add liquidity checker: initial=${initialLiquidityAmount}, current=${currentLiquidityAmount}, success=${liquidityIncreased}`);
                return liquidityIncreased;
              } catch (error) {
                console.error("Checker error:", error);
                return false;
              }
            },
            onSuccess: async () => {
              toast.success("Liquidity added successfully");
            },
            onFailure: async () => {
              toast.error("Add liquidity failed");
            },
            targetTick: tick,
            txHash: res?.transactionId,
          },
          "v1",
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

