import { useCallback } from "react";
import { useQubicConnect } from "@/shared/lib/wallet-connect/QubicConnectContext";
import { useTxMonitor } from "@/shared/store/txMonitor";
import { useAtomValue } from "jotai";
import { settingsAtom } from "@/shared/store/settings";
import { createPool, getPoolBasicState } from "@/core/services/sc.service";
import { fetchTickInfo, broadcastTx } from "@/shared/services/rpc.service";
import { toast } from "sonner";

export interface CreatePoolParams {
  assetIssuer: string;
  assetName: string;
}

export const useCreatePool = () => {
  const { wallet, connected, toggleConnectModal, getSignedTx } = useQubicConnect();
  const { startMonitoring } = useTxMonitor();
  const settings = useAtomValue(settingsAtom);

  const handleCreatePool = useCallback(
    async (params: CreatePoolParams) => {
      if (!connected || !wallet) {
        toggleConnectModal();
        return;
      }

      try {
        toast.info("Preparing pool creation...");

        // Check if pool already exists
        const existingPool = await getPoolBasicState({
          assetIssuer: params.assetIssuer,
          assetName: params.assetName,
        });

        if (existingPool && existingPool.poolExists === 1) {
          toast.error("Pool already exists for this asset");
          return;
        }

        // Get current tick
        const tickInfo = await fetchTickInfo();
        const tick = tickInfo.tick + settings.tickOffset;

        // Create transaction
        const tx = await createPool({
          sourceID: wallet.publicKey,
          assetIssuer: params.assetIssuer,
          assetName: params.assetName,
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
        const taskId = `create-pool-${Date.now()}`;
        startMonitoring(
          taskId,
          {
            checker: async () => {
              // Check if pool now exists
              const poolState = await getPoolBasicState({
                assetIssuer: params.assetIssuer,
                assetName: params.assetName,
              });

              const poolCreated = poolState && poolState.poolExists === 1;
              console.log(`Create Pool checker: poolExists=${poolState?.poolExists}, success=${poolCreated}`);
              return poolCreated;
            },
            onSuccess: async () => {
              toast.success("Pool created successfully! You can now add liquidity.");
            },
            onFailure: async () => {
              toast.error("Pool creation failed");
            },
            targetTick: tick,
            txHash: res?.transactionId,
          },
          "v1"
        );
      } catch (error) {
        console.error("Create pool error:", error);
        toast.error((error as Error).message || "Failed to create pool");
      }
    },
    [connected, wallet, settings, getSignedTx, toggleConnectModal, startMonitoring]
  );

  return { handleCreatePool };
};

