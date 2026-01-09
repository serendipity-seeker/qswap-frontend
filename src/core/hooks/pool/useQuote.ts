import { useState, useEffect, useCallback } from "react";
import { quoteExactQuInput, quoteExactQuOutput, quoteExactAssetInput, quoteExactAssetOutput } from "@/shared/services/sc.service";

export interface QuoteParams {
  fromToken: {
    issuer: string;
    assetName: number;
    symbol: string;
  };
  toToken: {
    issuer: string;
    assetName: number;
    symbol: string;
  };
  amount: number;
  exactInput?: boolean; // true = exact input amount, false = exact output amount
}

export interface QuoteResult {
  amountOut: number;
  amountIn: number;
  priceImpact?: number;
}

export const useQuote = (params: QuoteParams | null) => {
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchQuote = useCallback(async () => {
    if (!params || !params.amount || params.amount <= 0) {
      setQuote(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { fromToken, toToken, amount, exactInput = true } = params;
      const amountFloor = Math.floor(amount);

      // QSWAP pools are always QUBIC/Asset pairs
      const isQuToAsset = fromToken.symbol === "QUBIC" || fromToken.issuer === "";

      if (isQuToAsset) {
        // QUBIC -> Asset
        if (exactInput) {
          const result = await quoteExactQuInput({
            assetIssuer: toToken.issuer,
            assetName: toToken.assetName,
            quAmountIn: amountFloor,
          });

          if (result) {
            setQuote({
              amountOut: result.assetAmountOut,
              amountIn: amountFloor,
            });
          } else {
            setQuote(null);
          }
        } else {
          const result = await quoteExactQuOutput({
            assetIssuer: toToken.issuer,
            assetName: toToken.assetName,
            quAmountOut: amountFloor,
          });

          if (result) {
            setQuote({
              amountOut: amountFloor,
              amountIn: result.assetAmountIn,
            });
          } else {
            setQuote(null);
          }
        }
      } else {
        // Asset -> QUBIC
        if (exactInput) {
          const result = await quoteExactAssetInput({
            assetIssuer: fromToken.issuer,
            assetName: fromToken.assetName,
            assetAmountIn: amountFloor,
          });

          if (result) {
            setQuote({
              amountOut: result.quAmountOut,
              amountIn: amountFloor,
            });
          } else {
            setQuote(null);
          }
        } else {
          const result = await quoteExactAssetOutput({
            assetIssuer: fromToken.issuer,
            assetName: fromToken.assetName,
            assetAmountOut: amountFloor,
          });

          if (result) {
            setQuote({
              amountOut: amountFloor,
              amountIn: result.quAmountIn,
            });
          } else {
            setQuote(null);
          }
        }
      }
    } catch (e) {
      console.error("Error fetching quote:", e);
      setError(e as Error);
      setQuote(null);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchQuote();
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timeoutId);
  }, [fetchQuote]);

  return { quote, loading, error, refetch: fetchQuote };
};

