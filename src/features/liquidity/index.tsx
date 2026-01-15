import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Droplets } from "lucide-react";
import PoolsList from "@/features/liquidity/components/PoolsList";
import PoolManagement from "@/features/liquidity/components/PoolManagement";
import type { PoolCardData } from "@/features/liquidity/components/PoolCard";
import PoolPositions from "@/features/liquidity/components/PoolPositions";
import { SEO } from "@/shared/components/custom";
import { useTopPools } from "@/core/hooks/pool/useTopPools";
import { useQswapTokenList } from "@/core/hooks/pool/useQswapTokenList";

const Liquidity: React.FC = () => {
  const { pools, loading, error, swapFee, refetch } = useTopPools();
  const { tokenList } = useQswapTokenList();
  const [selectedPool, setSelectedPool] = useState<PoolCardData | null>(null);

  const handleSelectPool = (pool: PoolCardData) => {
    setSelectedPool(pool);
  };

  const handleBackToPools = () => {
    setSelectedPool(null);
  };

  return (
    <>
      <SEO
        title="Liquidity Pools"
        description="Browse liquidity pools and earn fees from swaps. Provide liquidity to earn passive income with competitive APY rates on the Qubic network."
        keywords="liquidity pools, add liquidity, earn fees, DeFi yield, liquidity mining, LP tokens, passive income, Qubic liquidity"
        canonical="https://qubicportal.org/liquidity"
      />
      <div className="min-h-screen px-4 pt-32 pb-12">
        {/* Background decorations */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="bg-primary-40/20 animate-float absolute top-1/4 -left-48 h-96 w-96 rounded-full blur-[120px]"></div>
          <div
            className="bg-primary-60/20 animate-float absolute -right-48 bottom-1/4 h-96 w-96 rounded-full blur-[120px]"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative z-10 mx-auto max-w-[1400px]">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-8 text-center"
          >
            <h1 className="text-primary mb-4 text-5xl font-black">
              {selectedPool ? "Manage Liquidity" : "Liquidity Pools"}
            </h1>
            <p className="text-muted-foreground text-xl">
              {selectedPool 
                ? "Add or remove liquidity from the pool"
                : "Browse pools and provide liquidity to earn fees from swaps"}
            </p>
          </motion.div>

          {/* Main Content */}
          {selectedPool ? (
            <PoolManagement pool={selectedPool} onBack={handleBackToPools} />
          ) : (
            <div className="space-y-6">
              {/* Pools List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <PoolsList
                  pools={pools}
                  loading={loading}
                  error={error}
                  swapFee={swapFee}
                  onSelectPool={handleSelectPool}
                  availableTokens={tokenList}
                  onPoolCreated={refetch}
                />
              </motion.div>

              {/* Your Positions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="glass-effect rounded-3xl p-6">
                  <h2 className="mb-6 text-2xl font-bold">Your Positions</h2>
                  <PoolPositions />
                </div>
              </motion.div>

              {/* Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 gap-4 md:grid-cols-3"
              >
                <div className="glass-effect rounded-xl p-6">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="bg-primary-40/20 rounded-lg p-2">
                      <Droplets className="text-primary-40 h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        ${pools.reduce((sum, p) => sum + p.tvlUSD, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                      <div className="text-muted-foreground text-sm">Total Liquidity</div>
                    </div>
                  </div>
                </div>

                <div className="glass-effect rounded-xl p-6">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="bg-success-40/20 rounded-lg p-2">
                      <TrendingUp className="text-success-40 h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{pools.length}</div>
                      <div className="text-muted-foreground text-sm">Active Pools</div>
                    </div>
                  </div>
                </div>

                <div className="glass-effect rounded-xl p-6">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="bg-warning-40/20 rounded-lg p-2">
                      <TrendingUp className="text-warning-40 h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{swapFee}%</div>
                      <div className="text-muted-foreground text-sm">Swap Fee</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Liquidity;
