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
    tokenA: "QCAP",
    tokenB: "QUBIC",
    iconA: "/assets/asset_QCAP-QCAPWMYRSHLBJHSTTZQVCIBARVOASKDENASAKNOBRGPFWWKRCUVUAXYEZVOG_logo_dark.png",
    iconB: "/assets/qubic-coin.png",
    liquidity: "$12,345.67",
    share: "0.15%",
    apy: "45.2%",
    earnings: "$234.56",
  },
  {
    tokenA: "CFB",
    tokenB: "QUBIC",
    iconA: "/assets/asset_CFB-CFBMEMZOIDEXQAUXYYSZIURADQLAPWPMNJXQSNVQZAHYVOPYUKKJBJUCTVJL_logo_dark.png",
    iconB: "/assets/qubic-coin.png",
    liquidity: "$8,901.23",
    share: "0.08%",
    apy: "32.8%",
    earnings: "$145.32",
  },
];

const PoolPositions: React.FC = () => {
  return (
    <div className="glass-effect rounded-3xl p-6 shadow-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Positions</h2>
        <div className="bg-success-40/20 text-success-40 rounded-full px-3 py-1 text-sm font-medium">
          {mockPositions.length} Active
        </div>
      </div>

      <div className="space-y-4">
        {mockPositions.length === 0 ? (
          <div className="py-12 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <TrendingUp className="text-muted-foreground h-8 w-8" />
            </div>
            <p className="text-muted-foreground mb-2">No liquidity positions yet</p>
            <p className="text-muted-foreground text-sm">Add liquidity to start earning fees</p>
          </div>
        ) : (
          mockPositions.map((position, index) => (
            <motion.div
              key={`${position.tokenA}-${position.tokenB}`}
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
                      src={position.iconA}
                      alt={position.tokenA}
                      className="border-background h-10 w-10 rounded-full border-2"
                    />
                    <img
                      src={position.iconB}
                      alt={position.tokenB}
                      className="border-background h-10 w-10 rounded-full border-2"
                    />
                  </div>
                  <div>
                    <div className="text-lg font-bold">
                      {position.tokenA}/{position.tokenB}
                    </div>
                    <div className="text-muted-foreground text-sm">Pool share: {position.share}</div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Open pool info in explorer (adjust URL based on your explorer)
                    const explorerUrl = `https://explorer.qubic.org/pool/${position.tokenA}-${position.tokenB}`;
                    window.open(explorerUrl, "_blank", "noopener,noreferrer");
                  }}
                  className="text-muted-foreground hover:text-foreground opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <ExternalLink className="h-5 w-5" />
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-muted-foreground mb-1 text-xs">Liquidity</div>
                  <div className="font-bold">{position.liquidity}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1 text-xs">APY</div>
                  <div className="text-success-40 font-bold">{position.apy}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1 text-xs">Earnings</div>
                  <div className="text-primary-40 font-bold">{position.earnings}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="bg-muted h-1 overflow-hidden rounded-full">
                  <div className="bg-primary h-full" style={{ width: "45%" }}></div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {mockPositions.length > 0 && (
        <div className="border-border mt-6 border-t pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-muted-foreground mb-1 text-sm">Total Liquidity</div>
              <div className="text-2xl font-bold">
                $
                {mockPositions
                  .reduce((sum, pos) => sum + parseFloat(pos.liquidity.replace(/[$,]/g, "")), 0)
                  .toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1 text-sm">Total Earnings</div>
              <div className="text-primary-40 text-2xl font-bold">
                $
                {mockPositions
                  .reduce((sum, pos) => sum + parseFloat(pos.earnings.replace(/[$,]/g, "")), 0)
                  .toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoolPositions;
