import React from "react";
import { ChevronDown, Info } from "lucide-react";
import { motion } from "framer-motion";

interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance: string;
}

interface SwapStatsProps {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
}

const SwapStats: React.FC<SwapStatsProps> = ({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Mock calculations
  const rate = parseFloat(toAmount) / parseFloat(fromAmount) || 0;
  const priceImpact = "0.01";
  const minimumReceived = (parseFloat(toAmount) * 0.995).toFixed(6);
  const liquidityProviderFee = (parseFloat(fromAmount) * 0.003).toFixed(6);

  return (
    <div className="mb-4">
      {/* Summary */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 bg-muted/30 hover:bg-muted/50 rounded-xl transition-all flex items-center justify-between group"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            1 {fromToken.symbol} ≈ {rate.toFixed(6)} {toToken.symbol}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </button>

      {/* Detailed Stats */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2 p-4 bg-muted/30 rounded-xl space-y-3"
        >
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>Expected Output</span>
              <Info className="w-3 h-3" />
            </div>
            <span className="font-medium">
              {toAmount} {toToken.symbol}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>Price Impact</span>
              <Info className="w-3 h-3" />
            </div>
            <span className="font-medium text-success-40">&lt; {priceImpact}%</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>Minimum received</span>
              <Info className="w-3 h-3" />
            </div>
            <span className="font-medium">
              {minimumReceived} {toToken.symbol}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>Liquidity Provider Fee</span>
              <Info className="w-3 h-3" />
            </div>
            <span className="font-medium">
              {liquidityProviderFee} {fromToken.symbol}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>Route</span>
              <Info className="w-3 h-3" />
            </div>
            <span className="font-medium">
              {fromToken.symbol} → {toToken.symbol}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SwapStats;

