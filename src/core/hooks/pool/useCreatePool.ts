import { useCallback } from "react";
import { useAtom } from "jotai";
import { toast } from "sonner";
import { useQubicConnect } from "@/shared/lib/wallet-connect/QubicConnectContext";
import { settingsAtom } from "@/shared/store/settings";
import { fetchTickInfo, broadcastTx } from "@/shared/services/rpc.service";
import { createPool, getPoolBasicState } from "@/shared/services/sc.service";
import { useTxMonitor } from "@/shared/store/txMonitor";

export interface CreatePoolParams {
  assetIssuer: string;
  assetName: string;
}

export const useCreatePool = () => {
  const [settings] = useAtom(settingsAtom);
  const { wallet, connected, getSignedTx, toggleConnectModal } = useQubicConnect();
  const { startMonitoring } = useTxMonitor();

  const handleCreatePool = useCallback(
    async (params: CreatePoolParams) => {
      if (!connected || !wallet?.publicKey) {
        toggleConnectModal();
        return;
      }

      const { assetIssuer, assetName } = params;

      try {
        // Check if pool already exists
        const existingPool = await getPoolBasicState({
          assetIssuer,
          assetName,
        });

        if (existingPool && existingPool.poolExists !== 0) {
          toast.error(`Pool for ${assetName} already exists`);
          return;
        }

        const tickInfo = await fetchTickInfo();
        const tick = tickInfo.tick + settings.tickOffset;

        const tx = await createPool({
          sourceID: wallet.publicKey,
          assetIssuer,
          assetName,
          tick,
        });

        const signed = await getSignedTx(tx);
        const res = await broadcastTx(signed.tx);

        const taskId = `create-pool-${wallet.publicKey}-${tick}-${Date.now()}`;

        startMonitoring(
          taskId,
          {
            checker: async () => {
              try {
                // Check if pool now exists
                const poolState = await getPoolBasicState({
                  assetIssuer,
                  assetName,
                });
                
                const poolCreated = poolState && poolState.poolExists !== 0;
                console.log(`Create pool checker: poolExists=${poolState?.poolExists}, success=${poolCreated}`);
                return poolCreated;
              } catch (error) {
                console.error("Checker error:", error);
                return false;
              }
            },
            onSuccess: async () => {
              toast.success(`Pool created successfully for ${assetName}`);
            },
            onFailure: async () => {
              toast.error("Pool creation failed");
            },
            targetTick: tick,
            txHash: res?.transactionId,
          },
          "v1",
        );

        return true;
      } catch (e) {
        console.error(e);
        toast.error((e as Error)?.message || "Pool creation failed");
        return false;
      }
    },
    [connected, wallet, settings, getSignedTx, toggleConnectModal, startMonitoring],
  );

  return { handleCreatePool };
};
