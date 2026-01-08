import { toast } from "sonner";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { monitoringTasksAtom, monitorStrategyAtom, useTxMonitor, resultAtom } from "@/shared/store/txMonitor";
import { fetchTickInfo, fetchApprovedTx } from "@/shared/services/rpc.service";

function useResultHandlers(setResult: (val: boolean) => void) {
  return {
    onSuccess: async () => {
      setResult(true);
    },
    onFailure: async () => {
      setResult(false);
    },
  };
}

/**
 * Global transaction monitor component
 * Monitors transaction status and calls success/failure callbacks
 */
const useGlobalTxMonitor = () => {
  const [monitoringTasks] = useAtom(monitoringTasksAtom);
  const [monitorStrategy] = useAtom(monitorStrategyAtom);
  const { isMonitoring, stopMonitoring } = useTxMonitor();
  const [, setResult] = useAtom(resultAtom);
  const [latestTick, setLatestTick] = useState<number>(0);

  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const resultHandlers = useResultHandlers(setResult);

  // Poll for latest tick every 5 seconds when monitoring
  useEffect(() => {
    if (isMonitoring) {
      // Initial fetch
      fetchTickInfo().then((tickInfo) => {
        setLatestTick(tickInfo.tick);
      });

      // Set up polling interval
      intervalIdRef.current = setInterval(() => {
        fetchTickInfo().then((tickInfo) => {
          setLatestTick(tickInfo.tick);
        });
      }, 5000);
    } else {
      // Clear interval when not monitoring
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [isMonitoring]);

  /**
   * v1: Custom checker function (manual implementation required)
   * pros: Most flexible
   * cons: Requires custom check function per operation
   */
  useEffect(() => {
    if (!isMonitoring || monitorStrategy !== "v1") return;

    Object.entries(monitoringTasks).forEach(async ([taskId, task]) => {
      const onSuccess = async () => {
        await task.onSuccess?.();
        await resultHandlers.onSuccess();
      };
      const onFailure = async () => {
        await task.onFailure?.();
        await resultHandlers.onFailure();
      };

      const { checker } = task;
      if (!latestTick) return;

      const TIMEOUT_TICKS = 10;
      if (latestTick > task.targetTick + TIMEOUT_TICKS) {
        stopMonitoring(taskId);
        toast.error("Transaction timed out");
        await onFailure();
        return;
      }

      console.log("v1 progress", latestTick, task.targetTick);
      if (latestTick > task.targetTick) {
        checker().then(async (success) => {
          if (success) {
            stopMonitoring(taskId);
            await onSuccess();
          }
        });
      }
    });
  }, [latestTick, isMonitoring, monitoringTasks, monitorStrategy, stopMonitoring, resultHandlers]);

  /**
   * v2: Check approved transactions list
   * pros: Simple, no custom logic needed
   * cons: Can't determine why transaction failed
   */
  useEffect(() => {
    if (!isMonitoring || monitorStrategy !== "v2") return;

    Object.entries(monitoringTasks).forEach(async ([taskId, task]) => {
      const onSuccess = async () => {
        await task.onSuccess?.();
        await resultHandlers.onSuccess();
      };
      const onFailure = async () => {
        await task.onFailure?.();
        await resultHandlers.onFailure();
      };

      if (!latestTick || !task.txHash) return;

      const TIMEOUT_TICKS = 10;
      if (latestTick > task.targetTick + TIMEOUT_TICKS) {
        stopMonitoring(taskId);
        toast.error("Transaction timed out");
        await onFailure();
        return;
      }

      console.log("v2 progress", latestTick, task.targetTick);
      if (latestTick > task.targetTick) {
        try {
          const approvedTxs = await fetchApprovedTx(task.targetTick);
          stopMonitoring(taskId);

          if (approvedTxs && approvedTxs.length > 0) {
            const tx = approvedTxs.find((tx) => tx.txId === task.txHash);
            if (tx) {
              await onSuccess();
            } else {
              toast.error("Transaction not found in approved list");
              await onFailure();
            }
          } else {
            toast.error("No approved transactions in target tick");
            await onFailure();
          }
        } catch (error) {
          console.error("Error checking transaction:", error);
          stopMonitoring(taskId);
          await onFailure();
        }
      }
    });
  }, [latestTick, isMonitoring, monitoringTasks, monitorStrategy, stopMonitoring, resultHandlers]);

  /**
   * v3: Using smart contract logs (requires SC logging implementation)
   * pros: Can determine exact reason for failure
   * cons: Requires SC to emit logs
   * 
   * Note: QSWAP contract has LOG_INFO calls, so this should work
   */
  useEffect(() => {
    if (!isMonitoring || monitorStrategy !== "v3") return;

    Object.entries(monitoringTasks).forEach(async ([taskId, task]) => {
      const onSuccess = async () => {
        await task.onSuccess?.();
        await resultHandlers.onSuccess();
      };
      const onFailure = async () => {
        await task.onFailure?.();
        await resultHandlers.onFailure();
      };

      if (!latestTick) return;

      const TIMEOUT_TICKS = 10;
      if (latestTick > task.targetTick + TIMEOUT_TICKS) {
        stopMonitoring(taskId);
        toast.error("Transaction timed out");
        await onFailure();
        return;
      }

      console.log("v3 progress", latestTick, task.targetTick);
      
      // Wait a couple ticks after target to ensure transaction is processed
      if (latestTick > task.targetTick + 2) {
        try {
          // For v3, we check if the transaction was included in approved list
          // Since QSWAP doesn't have a separate event endpoint like qraffle,
          // we fall back to v2 behavior for now
          const approvedTxs = await fetchApprovedTx(task.targetTick);
          stopMonitoring(taskId);

          if (approvedTxs && approvedTxs.length > 0) {
            const tx = approvedTxs.find((tx) => tx.txId === task.txHash);
            if (tx) {
              // Transaction was approved - assume success
              await onSuccess();
            } else {
              toast.error("Transaction not approved");
              await onFailure();
            }
          } else {
            toast.error("No transactions found in target tick");
            await onFailure();
          }
        } catch (error) {
          console.error("Error checking transaction:", error);
          stopMonitoring(taskId);
          toast.error("Error checking transaction status");
          await onFailure();
        }
      }
    });
  }, [latestTick, isMonitoring, monitoringTasks, monitorStrategy, stopMonitoring, resultHandlers]);

  // Show monitoring toast
  useEffect(() => {
    if (!isMonitoring) return;
    
    const toastId = toast.loading("Monitoring transaction...", {
      position: "bottom-right",
    });
    
    return () => {
      toast.dismiss(toastId);
    };
  }, [isMonitoring]);

  return null;
};

export default useGlobalTxMonitor;

