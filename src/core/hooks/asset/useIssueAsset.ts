import { useCallback } from "react";
import { useQubicConnect } from "@/shared/lib/wallet-connect/QubicConnectContext";
import { useTxMonitor } from "@/shared/store/txMonitor";
import { useAtomValue } from "jotai";
import { settingsAtom } from "@/shared/store/settings";
import { issueAsset } from "@/shared/services/sc.service";
import { fetchTickInfo, broadcastTx, fetchAssetsOwnership } from "@/shared/services/rpc.service";
import { toast } from "sonner";

export interface IssueAssetParams {
  assetName: string;
  numberOfShares: number;
  unitOfMeasurement: number;
  numberOfDecimalPlaces: number;
}

export const useIssueAsset = () => {
  const { wallet, connected, toggleConnectModal, getSignedTx } = useQubicConnect();
  const { startMonitoring } = useTxMonitor();
  const settings = useAtomValue(settingsAtom);

  const handleIssueAsset = useCallback(
    async (params: IssueAssetParams) => {
      if (!connected || !wallet) {
        toggleConnectModal();
        return;
      }

      try {
        toast.info("Preparing asset issuance...");

        // Get current tick
        const tickInfo = await fetchTickInfo();
        const tick = tickInfo.tick + settings.tickOffset;

        // Get initial assets to check for new issuance
        const initialAssets = await fetchAssetsOwnership(wallet.publicKey);
        const initialAssetCount = initialAssets.length;

        // Create transaction
        const tx = await issueAsset({
          sourceID: wallet.publicKey,
          assetName: params.assetName,
          numberOfShares: params.numberOfShares,
          unitOfMeasurement: params.unitOfMeasurement,
          numberOfDecimalPlaces: params.numberOfDecimalPlaces,
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

        // Monitor transaction
        const taskId = `issue-asset-${Date.now()}`;
        startMonitoring(
          taskId,
          {
            checker: async () => {
              // Check if new asset was issued by comparing asset count
              const currentAssets = await fetchAssetsOwnership(wallet.publicKey);
              const assetIssued = currentAssets.length > initialAssetCount;
              
              // Also check if the specific asset exists
              const hasAsset = currentAssets.some(
                (asset) => asset.assetName === params.assetName
              );

              console.log(
                `Issue Asset checker: initial=${initialAssetCount}, current=${currentAssets.length}, hasAsset=${hasAsset}, success=${assetIssued && hasAsset}`
              );
              return assetIssued && hasAsset;
            },
            onSuccess: async () => {
              toast.success(`Successfully issued asset with ${params.numberOfShares} shares`);
            },
            onFailure: async () => {
              toast.error("Asset issuance failed");
            },
            targetTick: tick,
            txHash: res?.transactionId,
          },
          "v1"
        );
      } catch (error) {
        console.error("Issue asset error:", error);
        toast.error((error as Error).message || "Failed to issue asset");
      }
    },
    [connected, wallet, settings, getSignedTx, toggleConnectModal, startMonitoring]
  );

  return { handleIssueAsset };
};

