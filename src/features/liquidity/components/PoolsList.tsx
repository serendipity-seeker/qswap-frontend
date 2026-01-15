import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, TrendingDown, Plus } from "lucide-react";
import PoolCard, { type PoolCardData } from "./PoolCard";
import CreatePoolModal from "./CreatePoolModal";
import type { Token } from "@/shared/constants/tokens";
import { Button } from "@/shared/components/custom";

interface PoolsListProps {
  pools: PoolCardData[];
  loading: boolean;
  error: string | null;
  swapFee: number;
  onSelectPool: (pool: PoolCardData) => void;
  availableTokens: Token[];
  onPoolCreated?: () => void;
}

const PoolsList: React.FC<PoolsListProps> = ({
  pools,
  loading,
  error,
  swapFee,
  onSelectPool,
  availableTokens,
  onPoolCreated,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredPools = pools.filter((pool) => pool.token.assetName.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="text-primary-40 mx-auto mb-4 h-12 w-12 animate-spin" />
          <p className="text-muted-foreground">Loading pools...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <TrendingDown className="text-destructive mx-auto mb-4 h-12 w-12" />
          <p className="text-destructive text-lg font-semibold">Failed to load pools</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar and Create Button */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search pools by token name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-effect focus:ring-primary-40 w-full rounded-xl py-3 pr-4 pl-12 transition-all outline-none focus:ring-2"
          />
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsCreateModalOpen(true)}
          className="m-1 flex flex-row items-center gap-2"
          icon={<Plus className="h-5 w-5" />}
        >
          <span className="hidden md:flex">Create Pool</span>
        </Button>
      </motion.div>

      {/* Pools Grid */}
      {filteredPools.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground text-lg font-semibold">
              {searchTerm ? "No pools found" : "No pools available"}
            </p>
            {searchTerm && <p className="text-muted-foreground mt-2 text-sm">Try a different search term</p>}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPools.map((pool, index) => (
            <motion.div
              key={`${pool.token.issuer}-${pool.token.assetName}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PoolCard pool={pool} onSelect={() => onSelectPool(pool)} swapFee={swapFee} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {filteredPools.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-effect mt-6 rounded-xl p-4"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-primary-40 font-bold md:text-2xl">{filteredPools.length}</div>
              <div className="text-muted-foreground text-sm">Total Pools</div>
            </div>
            <div>
              <div className="text-primary-40 font-bold md:text-2xl">
                $
                {filteredPools
                  .reduce((sum, pool) => sum + pool.tvlUSD, 0)
                  .toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-muted-foreground text-sm">Total TVL</div>
            </div>
            <div>
              <div className="text-primary-40 font-bold md:text-2xl">
                {filteredPools
                  .reduce((sum, pool) => sum + pool.reservedQuAmount, 0)
                  .toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-muted-foreground text-sm">Total QU Locked</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Create Pool Modal */}
      <CreatePoolModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          if (onPoolCreated) {
            onPoolCreated();
          }
        }}
        availableTokens={availableTokens}
      />
    </div>
  );
};

export default PoolsList;
