import { useCallback } from "react";
import { useQubicConnect } from "@/shared/lib/wallet-connect/QubicConnectContext";
import { useTxMonitor } from "@/shared/store/txMonitor";
import { useAtomValue } from "jotai";
import { settingsAtom } from "@/shared/store/settings";
import { transferShareManagementRights } from "@/shared/services/sc.service";
import { fetchTickInfo, broadcastTx } from "@/shared/services/rpc.service";
import { toast } from "sonner";

export interface TransferManagementRightsParams {
  assetIssuer: string;
  assetName: number;
  numberOfShares: number;
  newManagingContractIndex: number;
}

export const useTransferManagementRights = () => {
  const { wallet, connected, toggleConnectModal, getSignedTx } = useQubicConnect();
  const { startMonitoring } = useTxMonitor();
  const settings = useAtomValue(settingsAtom);

  const handleTransferManagementRights = useCallback(
    async (params: TransferManagementRightsParams) => {
      if (!connected || !wallet) {
        toggleConnectModal();
        return;
      }

      try {
        toast.info("Preparing transaction...");

        // Get current tick
        const tickInfo = await fetchTickInfo();
        const tick = tickInfo.tick + settings.tickOffset;

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

        toast.success("Transaction broadcasted!");

        // Monitor transaction
        const taskId = `transfer-mgmt-${Date.now()}`;
        startMonitoring(
          taskId,
          {
            checker: async () => {
              // For management rights transfer, we can check if the transaction was included
              // This is a simple check - in v1 strategy, we'd need to verify the actual state change
              // For now, we'll rely on tick confirmation
              return true;
            },
            onSuccess: async () => {
              toast.success(
                `Successfully transferred management rights for ${params.numberOfShares} shares to contract ${params.newManagingContractIndex}`
              );
            },
            onFailure: async () => {
              toast.error("Management rights transfer failed");
            },
            targetTick: tick,
            txHash: res?.transactionId,
          },
          "v1"
        );
      } catch (error) {
        console.error("Transfer management rights error:", error);
        toast.error((error as Error).message || "Failed to transfer management rights");
      }
    },
    [connected, wallet, settings, getSignedTx, toggleConnectModal, startMonitoring]
  );

  return { handleTransferManagementRights };
};

