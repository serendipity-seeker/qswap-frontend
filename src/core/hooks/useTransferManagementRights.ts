import { useCallback } from "react";
import { useQubicConnect } from "@/shared/lib/wallet-connect/QubicConnectContext";
import { useTxMonitor } from "@/shared/store/txMonitor";
import { useAtomValue } from "jotai";
import { settingsAtom } from "@/shared/store/settings";
import { transferShareManagementRights } from "@/core/services/sc.service";
import { fetchTickInfo, broadcastTx, fetchAssetsBalance } from "@/shared/services/rpc.service";
import { toast } from "sonner";

export interface TransferManagementRightsParams {
  assetIssuer: string;
  assetName: string;
  numberOfShares: number;
  newManagingContractIndex: number;
  fallback?: () => Promise<void>;
}

export const useTransferManagementRights = () => {
  const { wallet, connected, toggleConnectModal, getSignedTx } = useQubicConnect();
  const { startMonitoring } = useTxMonitor();
  const settings = useAtomValue(settingsAtom);

  /**
   * Check if the target contract has received the expected amount of shares
   * This is used as the checker function for v1 transaction monitoring
   */
  const checkTransferShareRights = useCallback(
    async (assetNameStr: string, contractIndex: number, expectedAmount: number): Promise<boolean> => {
      if (!wallet) {
        console.error("Please connect your wallet");
        return false;
      }

      try {
        const targetContractCurrentAmount = await fetchAssetsBalance(wallet.publicKey, assetNameStr, contractIndex);

        const success = targetContractCurrentAmount >= expectedAmount;
        console.log(
          `Transfer Share Rights checker: targetContract=${contractIndex}, expected=${expectedAmount}, current=${targetContractCurrentAmount}, success=${success}`,
        );
        return success;
      } catch (error) {
        console.error("Error checking transfer share rights:", error);
        return false;
      }
    },
    [wallet],
  );

  const handleTransferManagementRights = useCallback(
    async (params: TransferManagementRightsParams) => {
      if (!connected || !wallet) {
        toggleConnectModal();
        return;
      }

      try {
        // Get current tick
        const tickInfo = await fetchTickInfo();
        const tick = tickInfo.tick + settings.tickOffset;

        // Get current balance in target contract
        const targetContractOriginAmount = await fetchAssetsBalance(
          wallet.publicKey,
          params.assetName,
          params.newManagingContractIndex,
        );

        // Create transaction
        const tx = await transferShareManagementRights({
          sourceID: wallet.publicKey,
          assetIssuer: params.assetIssuer,
          assetName: params.assetName,
          numberOfShares: params.numberOfShares,
          newManagingContractIndex: params.newManagingContractIndex,
          tick,
        });

        // Sign transaction
        const signedTx = await getSignedTx(tx);
        if (!signedTx) {
          toast.error("Transaction signing failed");
          return;
        }

        // Broadcast transaction
        toast.info("Broadcasting transaction...");
        const res = await broadcastTx(signedTx.tx);

        if (!res?.transactionId) {
          toast.error("Transaction broadcast failed");
          return;
        }

        // Monitor transaction with balance verification
        const taskId = `transfer-mgmt-${Date.now()}`;
        const expectedAmount = targetContractOriginAmount + params.numberOfShares;

        startMonitoring(
          taskId,
          {
            checker: async () => {
              return await checkTransferShareRights(
                params.assetName,
                params.newManagingContractIndex,
                expectedAmount,
              );
            },
            onSuccess: async () => {
              toast.success(
                `Successfully transferred management rights for ${params.numberOfShares} ${params.assetName} shares to contract ${params.newManagingContractIndex}`,
              );
              // Execute fallback callback if provided (e.g., refresh UI)
              if (params.fallback) {
                await params.fallback();
              }
            },
            onFailure: async () => {
              toast.error("Management rights transfer failed");
            },
            targetTick: tick,
            txHash: res?.transactionId,
          },
          "v1",
        );
      } catch (error) {
        console.error("Transfer management rights error:", error);
        toast.error((error as Error).message || "Failed to transfer management rights");
      }
    },
    [connected, wallet, settings, getSignedTx, toggleConnectModal, startMonitoring, checkTransferShareRights],
  );

  return { handleTransferManagementRights, checkTransferShareRights };
};
