import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Droplets, ArrowRight } from "lucide-react";
import type { Token } from "@/core/constants/tokens";
import { QUBIC_TOKEN } from "@/core/constants/tokens";

export interface PoolCardData {
  token: Token;
  poolExists: boolean;
  reservedQuAmount: number;
  reservedAssetAmount: number;
  totalLiquidity: number;
  tvlUSD: number;
}

interface PoolCardProps {
  pool: PoolCardData;
  onSelect: () => void;
  swapFee: number;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool, onSelect, swapFee }) => {
  const price = pool.reservedAssetAmount > 0 
    ? pool.reservedQuAmount / pool.reservedAssetAmount 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="glass-effect cursor-pointer rounded-xl p-4 transition-all hover:shadow-lg sm:p-5"
      onClick={onSelect}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={pool.token.logo}
              alt={pool.token.assetName}
              className="h-10 w-10 rounded-full ring-2 ring-background sm:h-12 sm:w-12"
            />
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-40 text-[10px] font-bold text-white">
              <img src={QUBIC_TOKEN.logo} alt="QUBIC" className="h-5 w-5 rounded-full" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold sm:text-xl">
              QUBIC / {pool.token.assetName}
            </h3>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Fee: {swapFee}%
            </p>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* TVL */}
        <div className="rounded-lg bg-muted/30 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Droplets className="h-3.5 w-3.5" />
            TVL
          </div>
          <div className="text-base font-bold sm:text-lg">
            ${pool.tvlUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {pool.reservedQuAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} QU
          </div>
        </div>

        {/* Total Liquidity */}
        <div className="rounded-lg bg-muted/30 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" />
            Liquidity
          </div>
          <div className="text-base font-bold text-success-40 sm:text-lg">
            {pool.totalLiquidity.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            LP Index
          </div>
        </div>

        {/* Price */}
        <div className="rounded-lg bg-muted/30 p-3">
          <div className="mb-1 text-xs text-muted-foreground">
            1 {pool.token.assetName}
          </div>
          <div className="text-sm font-bold sm:text-base">
            {price.toLocaleString(undefined, { maximumFractionDigits: 4 })} QU
          </div>
        </div>

        {/* Liquidity */}
        <div className="rounded-lg bg-muted/30 p-3">
          <div className="mb-1 text-xs text-muted-foreground">
            Pool Size
          </div>
          <div className="text-sm font-bold sm:text-base">
            {pool.reservedAssetAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-muted-foreground">
            {pool.token.assetName}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PoolCard;
