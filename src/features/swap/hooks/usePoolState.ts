import { useState, useEffect, useCallback } from "react";
import { getPoolBasicState, getLiquidityOf, type PoolBasicState } from "@/shared/services/sc.service";

export interface PoolState extends PoolBasicState {
  userLiquidity: number;
}

export const usePoolState = (assetIssuer: string | undefined, assetName: number | undefined, userAccount: string | undefined) => {
  const [poolState, setPoolState] = useState<PoolState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPoolState = useCallback(async () => {
    if (!assetIssuer || !assetName) {
      setPoolState(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [poolResult, liquidityResult] = await Promise.all([
        getPoolBasicState({ assetIssuer, assetName }),
        userAccount
          ? getLiquidityOf({
              assetIssuer,
              assetName,
              account: userAccount,
            })
          : Promise.resolve({ liquidity: 0 }),
      ]);

      setPoolState({
        poolExists: poolResult.poolExists,
        reservedQuAmount: poolResult.reservedQuAmount,
        reservedAssetAmount: poolResult.reservedAssetAmount,
        totalLiquidity: poolResult.totalLiquidity,
        userLiquidity: liquidityResult?.liquidity || 0,
      });
    } catch (e) {
      console.error("Error fetching pool state:", e);
      setError(e as Error);
      setPoolState(null);
    } finally {
      setLoading(false);
    }
  }, [assetIssuer, assetName, userAccount]);

  useEffect(() => {
    fetchPoolState();
  }, [fetchPoolState]);

  return { poolState, loading, error, refetch: fetchPoolState };
};

