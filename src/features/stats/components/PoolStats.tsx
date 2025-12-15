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
    pairName: "CFB/QUBIC",
    tokenA: "CFB",
    tokenB: "QUBIC",
    iconA: "/assets/asset_CFB-CFBMEMZOIDEXQAUXYYSZIURADQLAPWPMNJXQSNVQZAHYVOPYUKKJBJUCTVJL_logo_dark.png",
    iconB: "/assets/qubic-coin.png",
    tvl: "$8.3M",
    volume24h: "$234K",
    apy: "32.8%",
    priceChange: -3.2,
  },
  {
    pairName: "QCAP/QUBIC",
    tokenA: "QCAP",
    tokenB: "QUBIC",
    iconA: "/assets/asset_QCAP-QCAPWMYRSHLBJHSTTZQVCIBARVOASKDENASAKNOBRGPFWWKRCUVUAXYEZVOG_logo_dark.png",
    iconB: "/assets/qubic-coin.png",
    tvl: "$24.1M",
    volume24h: "$892K",
    apy: "28.5%",
    priceChange: 5.7,
  },
];

const PoolStats: React.FC = () => {
  return (
    <div className="glass-effect rounded-2xl p-4 shadow-2xl sm:p-5 md:rounded-3xl md:p-6">
      <div className="mb-4 flex items-center justify-between md:mb-6">
        <h2 className="text-xl font-bold sm:text-2xl">Top Pools</h2>
        <div className="text-muted-foreground text-xs sm:text-sm">24h Statistics</div>
      </div>

      <div className="space-y-2 md:space-y-3">
        {mockPools.map((pool, index) => (
          <motion.div
            key={pool.pairName}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-muted/30 hover:bg-muted/50 group cursor-pointer rounded-xl p-3 transition-all md:p-4"
          >
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              {/* Pool Info */}
              <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                <div className="flex flex-shrink-0 items-center -space-x-2">
                  <img
                    src={pool.iconA}
                    alt={pool.tokenA}
                    className="border-background h-8 w-8 rounded-full border-2 sm:h-10 sm:w-10"
                  />
                  <img
                    src={pool.iconB}
                    alt={pool.tokenB}
                    className="border-background h-8 w-8 rounded-full border-2 sm:h-10 sm:w-10"
                  />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-base font-bold sm:text-lg">{pool.pairName}</div>
                  <div className="text-muted-foreground text-xs sm:text-sm">TVL: {pool.tvl}</div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:flex-nowrap sm:gap-4 md:gap-6">
                <div className="flex-1 text-left sm:flex-initial sm:text-right">
                  <div className="text-muted-foreground mb-1 text-[10px] sm:text-xs">Volume 24h</div>
                  <div className="text-sm font-medium sm:text-base">{pool.volume24h}</div>
                </div>
                <div className="flex-1 text-left sm:flex-initial sm:text-right">
                  <div className="text-muted-foreground mb-1 text-[10px] sm:text-xs">APY</div>
                  <div className="text-success-40 text-sm font-bold sm:text-base">{pool.apy}</div>
                </div>
                <div className="flex-1 text-left sm:flex-initial sm:text-right">
                  <div className="text-muted-foreground mb-1 text-[10px] sm:text-xs">24h</div>
                  <div
                    className={`flex items-center gap-1 text-sm font-bold sm:text-base ${
                      pool.priceChange >= 0 ? "text-success-40" : "text-error-40"
                    }`}
                  >
                    {pool.priceChange >= 0 ? (
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    ) : (
                      <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
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
