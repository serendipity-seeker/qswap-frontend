import { useState, useEffect } from "react";
import { getPoolBasicState, getFees } from "@/shared/services/sc.service";
import { DEFAULT_TOKENS, isAsset, type Token } from "@/shared/constants/tokens";
import { fetchQubicPrice } from "@/shared/services/price.service";

export interface PoolInfo {
  token: Token;
  poolExists: boolean;
  reservedQuAmount: number;
  reservedAssetAmount: number;
  totalLiquidity: number;
  tvlUSD: number;
  // Note: volume24h and priceChange require historical data not available yet
}

export const useTopPools = () => {
  const [pools, setPools] = useState<PoolInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [swapFee, setSwapFee] = useState<number>(0);

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

        const assetTokens = DEFAULT_TOKENS.filter(isAsset);
        const poolInfos: PoolInfo[] = [];

        for (const token of assetTokens) {
          try {
            const poolState = await getPoolBasicState({
              assetIssuer: token.issuer,
              assetName: token.assetName,
            });

            if (!poolState || poolState.poolExists === 0) {
              continue; // Skip non-existent pools
            }

            // Calculate TVL in USD (only QU has price for now)
            const tvlUSD = poolState.reservedQuAmount * qubicPrice;

            poolInfos.push({
              token,
              poolExists: poolState.poolExists === 1,
              reservedQuAmount: poolState.reservedQuAmount,
              reservedAssetAmount: poolState.reservedAssetAmount,
              totalLiquidity: poolState.totalLiquidity,
              tvlUSD,
            });
          } catch (err) {
            console.error(`Error fetching pool for ${token.symbol}:`, err);
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
  }, []);

  return { pools, loading, error, swapFee };
};

