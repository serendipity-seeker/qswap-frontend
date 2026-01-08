import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useTopPools } from "../hooks/useTopPools";
import { QUBIC_TOKEN } from "@/shared/constants/tokens";

const PoolStats: React.FC = () => {
  const { pools, loading, error, swapFee } = useTopPools();
  if (error) {
    return (
      <div className="glass-effect rounded-2xl p-4 shadow-2xl sm:p-5 md:rounded-3xl md:p-6">
        <div className="py-12 text-center">
          <p className="text-error-40 mb-2">Failed to load pools</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-2xl p-4 shadow-2xl sm:p-5 md:rounded-3xl md:p-6">
      <div className="mb-4 flex items-center justify-between md:mb-6">
        <h2 className="text-xl font-bold sm:text-2xl">Top Pools</h2>
        {loading ? (
          <Loader2 className="text-primary h-5 w-5 animate-spin" />
        ) : (
          <div className="text-muted-foreground text-xs sm:text-sm">
            {swapFee > 0 && `Fee: ${(swapFee * 100).toFixed(2)}%`}
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <Loader2 className="text-primary mx-auto mb-4 h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading pools...</p>
        </div>
      ) : pools.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No pools available</p>
        </div>
      ) : (
        <div className="space-y-2 md:space-y-3">
          {pools.map((pool, index) => (
            <motion.div
              key={`${pool.token.symbol}-QUBIC`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-muted/30 hover:bg-muted/50 group cursor-pointer rounded-xl p-3 transition-all md:p-4"
            >
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                {/* Pool Info */}
                <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                  <div className="flex shrink-0 items-center -space-x-2">
                    <img
                      src={pool.token.icon}
                      alt={pool.token.symbol}
                      className="border-background h-8 w-8 rounded-full border-2 sm:h-10 sm:w-10"
                    />
                    <img
                      src={QUBIC_TOKEN.icon}
                      alt="QUBIC"
                      className="border-background h-8 w-8 rounded-full border-2 sm:h-10 sm:w-10"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-base font-bold sm:text-lg">
                      {pool.token.symbol}/QUBIC
                    </div>
                    <div className="text-muted-foreground text-xs sm:text-sm">
                      TVL: ${pool.tvlUSD.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:flex-nowrap sm:gap-4 md:gap-6">
                  <div className="flex-1 text-left sm:flex-initial sm:text-right">
                    <div className="text-muted-foreground mb-1 text-[10px] sm:text-xs">QUBIC Reserve</div>
                    <div className="text-sm font-medium sm:text-base">
                      {pool.reservedQuAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  <div className="flex-1 text-left sm:flex-initial sm:text-right">
                    <div className="text-muted-foreground mb-1 text-[10px] sm:text-xs">
                      {pool.token.symbol} Reserve
                    </div>
                    <div className="text-sm font-medium sm:text-base">
                      {pool.reservedAssetAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  <div className="flex-1 text-left sm:flex-initial sm:text-right">
                    <div className="text-muted-foreground mb-1 text-[10px] sm:text-xs">Total Liquidity</div>
                    <div className="text-primary-40 text-sm font-bold sm:text-base">
                      {pool.totalLiquidity.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PoolStats;
