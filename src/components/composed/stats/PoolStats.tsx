import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Pool {
  pairName: string;
  tokenA: string;
  tokenB: string;
  iconA: string;
  iconB: string;
  tvl: string;
  volume24h: string;
  apy: string;
  priceChange: number;
}

const mockPools: Pool[] = [
  {
    pairName: "QUBIC/USDT",
    tokenA: "QUBIC",
    tokenB: "USDT",
    iconA: "/qubic.svg",
    iconB: "/qubic-coin.svg",
    tvl: "$12.5M",
    volume24h: "$456K",
    apy: "45.2%",
    priceChange: 12.5,
  },
  {
    pairName: "QX/QUBIC",
    tokenA: "QX",
    tokenB: "QUBIC",
    iconA: "/qubic-coin.svg",
    iconB: "/qubic.svg",
    tvl: "$8.3M",
    volume24h: "$234K",
    apy: "32.8%",
    priceChange: -3.2,
  },
  {
    pairName: "WETH/USDT",
    tokenA: "WETH",
    tokenB: "USDT",
    iconA: "/qubic-coin.svg",
    iconB: "/qubic-coin.svg",
    tvl: "$24.1M",
    volume24h: "$892K",
    apy: "28.5%",
    priceChange: 5.7,
  },
];

const PoolStats: React.FC = () => {
  return (
    <div className="glass-effect rounded-3xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Top Pools</h2>
        <div className="text-sm text-muted-foreground">24h Statistics</div>
      </div>

      <div className="space-y-3">
        {mockPools.map((pool, index) => (
          <motion.div
            key={pool.pairName}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-muted/30 hover:bg-muted/50 rounded-xl p-4 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              {/* Pool Info */}
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center -space-x-2">
                  <img
                    src={pool.iconA}
                    alt={pool.tokenA}
                    className="w-10 h-10 rounded-full border-2 border-background"
                  />
                  <img
                    src={pool.iconB}
                    alt={pool.tokenB}
                    className="w-10 h-10 rounded-full border-2 border-background"
                  />
                </div>
                <div>
                  <div className="font-bold text-lg">{pool.pairName}</div>
                  <div className="text-sm text-muted-foreground">
                    TVL: {pool.tvl}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">Volume 24h</div>
                  <div className="font-medium">{pool.volume24h}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">APY</div>
                  <div className="font-bold text-success-40">{pool.apy}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">24h</div>
                  <div
                    className={`font-bold flex items-center gap-1 ${
                      pool.priceChange >= 0 ? "text-success-40" : "text-error-40"
                    }`}
                  >
                    {pool.priceChange >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {Math.abs(pool.priceChange)}%
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PoolStats;

