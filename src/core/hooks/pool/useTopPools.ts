import { useState, useEffect } from "react";
import { getPoolBasicState, getFees } from "@/shared/services/sc.service";
import { fetchQubicPrice } from "@/shared/services/price.service";
import { useQswapTokenList } from "./useQswapTokenList";
import { type Token } from "@/shared/constants/tokens";

export interface PoolInfo {
  token: Token;
  poolExists: boolean;
  reservedQuAmount: number;
  reservedAssetAmount: number;
  totalLiquidity: number;
  tvlUSD: number;
}

export const useTopPools = () => {
  const [pools, setPools] = useState<PoolInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [swapFee, setSwapFee] = useState<number>(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { tokenList } = useQswapTokenList();

  const refetch = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchPools = async () => {
      setLoading(true);
      setError(null);

      try {
        const qubicPrice = await fetchQubicPrice();
        const fees = await getFees();
        if (fees) {
          setSwapFee(fees.swapFee / 1000000); // Convert to percentage
        }

        const poolInfos: PoolInfo[] = [];

        for (const asset of tokenList) {
          try {
            const poolState = await getPoolBasicState({
              assetIssuer: asset.issuer,
              assetName: asset.assetName,
            });

            if (!poolState || poolState.poolExists === 0) {
              continue; // Skip non-existent pools
            }

            // Calculate TVL in USD (only QU has price for now)
            const tvlUSD = poolState.reservedQuAmount * qubicPrice;

            poolInfos.push({
              token: asset,
              poolExists: poolState.poolExists === 1,
              reservedQuAmount: poolState.reservedQuAmount,
              reservedAssetAmount: poolState.reservedAssetAmount,
              totalLiquidity: poolState.totalLiquidity,
              tvlUSD,
            });
          } catch (err) {
            console.error(`Error fetching pool for ${asset.assetName}:`, err);
            // Continue with other tokens
          }
        }

        // Sort by TVL descending
        poolInfos.sort((a, b) => b.tvlUSD - a.tvlUSD);

        setPools(poolInfos);
      } catch (err) {
        console.error("Error fetching pools:", err);
        setError((err as Error).message || "Failed to load pools");
      } finally {
        setLoading(false);
      }
    };

    fetchPools();
  }, [tokenList, refreshTrigger]);

  return { pools, loading, error, swapFee, refetch };
};

