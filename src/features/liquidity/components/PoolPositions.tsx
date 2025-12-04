import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, ExternalLink } from "lucide-react";

interface PoolPosition {
  tokenA: string;
  tokenB: string;
  iconA: string;
  iconB: string;
  liquidity: string;
  share: string;
  apy: string;
  earnings: string;
}

const mockPositions: PoolPosition[] = [
  {
    tokenA: "QUBIC",
    tokenB: "USDT",
    iconA: "/qubic.svg",
    iconB: "/qubic-coin.svg",
    liquidity: "$12,345.67",
    share: "0.15%",
    apy: "45.2%",
    earnings: "$234.56",
  },
  {
    tokenA: "QX",
    tokenB: "QUBIC",
    iconA: "/qubic-coin.svg",
    iconB: "/qubic.svg",
    liquidity: "$8,901.23",
    share: "0.08%",
    apy: "32.8%",
    earnings: "$145.32",
  },
];

const PoolPositions: React.FC = () => {
  return (
    <div className="glass-effect rounded-3xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Your Positions</h2>
        <div className="px-3 py-1 bg-success-40/20 text-success-40 rounded-full text-sm font-medium">
          {mockPositions.length} Active
        </div>
      </div>

      <div className="space-y-4">
        {mockPositions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-2">No liquidity positions yet</p>
            <p className="text-sm text-muted-foreground">
              Add liquidity to start earning fees
            </p>
          </div>
        ) : (
          mockPositions.map((position, index) => (
            <motion.div
              key={`${position.tokenA}-${position.tokenB}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-muted/30 hover:bg-muted/50 rounded-2xl p-4 transition-all cursor-pointer group"
            >
              {/* Pool Pair */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center -space-x-2">
                    <img
                      src={position.iconA}
                      alt={position.tokenA}
                      className="w-10 h-10 rounded-full border-2 border-background"
                    />
                    <img
                      src={position.iconB}
                      alt={position.tokenB}
                      className="w-10 h-10 rounded-full border-2 border-background"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-lg">
                      {position.tokenA}/{position.tokenB}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Pool share: {position.share}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Liquidity</div>
                  <div className="font-bold">{position.liquidity}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">APY</div>
                  <div className="font-bold text-success-40">{position.apy}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Earnings</div>
                  <div className="font-bold text-primary-40">{position.earnings}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-40 to-primary-60"
                    style={{ width: "45%" }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {mockPositions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Liquidity</div>
              <div className="text-2xl font-bold">
                ${(
                  mockPositions.reduce(
                    (sum, pos) => sum + parseFloat(pos.liquidity.replace(/[$,]/g, "")),
                    0
                  )
                ).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Earnings</div>
              <div className="text-2xl font-bold text-primary-40">
                ${(
                  mockPositions.reduce(
                    (sum, pos) => sum + parseFloat(pos.earnings.replace(/[$,]/g, "")),
                    0
                  )
                ).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoolPositions;

