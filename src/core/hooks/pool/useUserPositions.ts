import { useState, useEffect } from "react";
import { useQubicConnect } from "@/shared/lib/wallet-connect/QubicConnectContext";
import { getLiquidityOf, getPoolBasicState } from "@/shared/services/sc.service";
import { fetchQubicPrice } from "@/shared/services/price.service";
import { useQswapTokenList } from "./useQswapTokenList";
import { isAsset, type Token } from "@/shared/constants/tokens";

export interface UserPosition {
  token: Token;
  liquidity: number;
  share: number; // percentage
  quAmount: number;
  assetAmount: number;
  valueUSD: number;
}

export const useUserPositions = () => {
  const { wallet, connected } = useQubicConnect();
  const [positions, setPositions] = useState<UserPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { tokenList } = useQswapTokenList();

  useEffect(() => {
    if (!connected || !wallet?.publicKey) {
      setPositions([]);
      return;
    }

    const fetchPositions = async () => {
      setLoading(true);
      setError(null);

      try {
        const qubicPrice = await fetchQubicPrice();
        const userPositions: UserPosition[] = [];

        for (const token of tokenList.filter(isAsset)) {
          try {
            // Get user's liquidity in this pool
            const liquidityData = await getLiquidityOf({
              assetIssuer: token.issuer,
              assetName: token.assetName,
              account: wallet.publicKey,
            });

            if (!liquidityData || liquidityData.liquidity === 0) {
              continue; // Skip pools with no liquidity
            }

            // Get pool state
            const poolState = await getPoolBasicState({
              assetIssuer: token.issuer,
              assetName: token.assetName,
            });

            if (!poolState || poolState.totalLiquidity === 0) {
              continue;
            }

            // Calculate user's share
            const sharePercentage = (liquidityData.liquidity / poolState.totalLiquidity) * 100;

            // Calculate user's underlying amounts
            const userQuAmount = (poolState.reservedQuAmount * liquidityData.liquidity) / poolState.totalLiquidity;
            const userAssetAmount =
              (poolState.reservedAssetAmount * liquidityData.liquidity) / poolState.totalLiquidity;

            // Calculate USD value (only QU has price for now)
            const valueUSD = userQuAmount * qubicPrice;

            userPositions.push({
              token,
              liquidity: liquidityData.liquidity,
              share: sharePercentage,
              quAmount: userQuAmount,
              assetAmount: userAssetAmount,
              valueUSD,
            });
          } catch (err) {
            console.error(`Error fetching position for ${token.assetName}:`, err);
            // Continue with other tokens
          }
        }

        setPositions(userPositions);
      } catch (err) {
        console.error("Error fetching user positions:", err);
        setError((err as Error).message || "Failed to load positions");
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, [connected, wallet?.publicKey, tokenList]);

  return { positions, loading, error };
};

