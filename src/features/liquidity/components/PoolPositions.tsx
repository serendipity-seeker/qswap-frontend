import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Loader2 } from "lucide-react";
import { useUserPositions } from "../hooks/useUserPositions";
import { QUBIC_TOKEN } from "@/shared/constants/tokens";

const PoolPositions: React.FC = () => {
  const { positions, loading, error } = useUserPositions();
  if (error) {
    return (
      <div className="glass-effect rounded-3xl p-6 shadow-2xl">
        <div className="py-12 text-center">
          <p className="text-error-40 mb-2">Failed to load positions</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-3xl p-6 shadow-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Positions</h2>
        {loading ? (
          <Loader2 className="text-primary h-5 w-5 animate-spin" />
        ) : (
          <div className="bg-success-40/20 text-success-40 rounded-full px-3 py-1 text-sm font-medium">
            {positions.length} Active
          </div>
        )}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="text-primary mx-auto mb-4 h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Loading positions...</p>
          </div>
        ) : positions.length === 0 ? (
          <div className="py-12 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <TrendingUp className="text-muted-foreground h-8 w-8" />
            </div>
            <p className="text-muted-foreground mb-2">No liquidity positions yet</p>
            <p className="text-muted-foreground text-sm">Add liquidity to start earning fees</p>
          </div>
        ) : (
          positions.map((position, index) => (
            <motion.div
              key={`${position.token.symbol}-QUBIC`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-muted/30 hover:bg-muted/50 group cursor-pointer rounded-2xl p-4 transition-all"
            >
              {/* Pool Pair */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center -space-x-2">
                    <img
                      src={position.token.icon}
                      alt={position.token.symbol}
                      className="border-background h-10 w-10 rounded-full border-2"
                    />
                    <img
                      src={QUBIC_TOKEN.icon}
                      alt="QUBIC"
                      className="border-background h-10 w-10 rounded-full border-2"
                    />
                  </div>
                  <div>
                    <div className="text-lg font-bold">
                      {position.token.symbol}/QUBIC
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Pool share: {position.share.toFixed(4)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-muted-foreground mb-1 text-xs">Your Liquidity</div>
                  <div className="font-bold">{position.liquidity.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1 text-xs">Value (USD)</div>
                  <div className="text-primary-40 font-bold">${position.valueUSD.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1 text-xs">QUBIC Amount</div>
                  <div className="font-bold">{position.quAmount.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1 text-xs">{position.token.symbol} Amount</div>
                  <div className="font-bold">{position.assetAmount.toFixed(2)}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="bg-muted h-1 overflow-hidden rounded-full">
                  <div 
                    className="bg-primary h-full" 
                    style={{ width: `${Math.min(position.share * 10, 100)}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {!loading && positions.length > 0 && (
        <div className="border-border mt-6 border-t pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-muted-foreground mb-1 text-sm">Total Value (USD)</div>
              <div className="text-2xl font-bold">
                ${positions.reduce((sum, pos) => sum + pos.valueUSD, 0).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1 text-sm">Total QUBIC</div>
              <div className="text-primary-40 text-2xl font-bold">
                {positions.reduce((sum, pos) => sum + pos.quAmount, 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoolPositions;
