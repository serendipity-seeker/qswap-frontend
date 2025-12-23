import axios from "axios";

// Cache for price data
let priceCache: { price: number; timestamp: number } | null = null;
const CACHE_DURATION = 60000; // 1 minute cache

/**
 * Fetches QUBIC price from CoinMarketCap API
 * Falls back to alternative APIs if CMC fails
 */
export const fetchQubicPrice = async (): Promise<number> => {
  // Check cache first
  if (priceCache && Date.now() - priceCache.timestamp < CACHE_DURATION) {
    return priceCache.price;
  }

  try {
    // Try CoinGecko first (free, no API key needed)
    const coingeckoResponse = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=qubic-network&vs_currencies=usd",
      { timeout: 5000 }
    );
    
    if (coingeckoResponse.data?.["qubic-network"]?.usd) {
      const price = coingeckoResponse.data["qubic-network"].usd;
      priceCache = { price, timestamp: Date.now() };
      return price;
    }
  } catch (error) {
    console.warn("CoinGecko API failed, trying alternatives:", error);
  }

  try {
    // Fallback to CoinMarketCap (requires API key, but try anyway)
    const cmcApiKey = import.meta.env.VITE_CMC_API_KEY;
    if (cmcApiKey) {
      const cmcResponse = await axios.get(
        "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
        {
          params: {
            symbol: "QUBIC",
            convert: "USD",
          },
          headers: {
            "X-CMC_PRO_API_KEY": cmcApiKey,
          },
          timeout: 5000,
        }
      );

      if (cmcResponse.data?.data?.QUBIC?.[0]?.quote?.USD?.price) {
        const price = cmcResponse.data.data.QUBIC[0].quote.USD.price;
        priceCache = { price, timestamp: Date.now() };
        return price;
      }
    }
  } catch (error) {
    console.warn("CoinMarketCap API failed:", error);
  }

  // If all APIs fail, return cached price or default fallback
  if (priceCache) {
    return priceCache.price;
  }

  // Default fallback price (0.15 as mentioned in the issue)
  console.warn("All price APIs failed, using fallback price");
  return 0.15;
};
