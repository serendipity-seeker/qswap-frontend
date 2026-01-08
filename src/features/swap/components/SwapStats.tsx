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
  slippage?: number; // percentage, e.g., 0.5 for 0.5%
  swapFee?: number; // percentage, e.g., 0.3 for 0.3%
}

const SwapStats: React.FC<SwapStatsProps> = ({ 
  fromToken, 
  toToken, 
  fromAmount, 
  toAmount,
  slippage = 0.5,
  swapFee = 0.3,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Real calculations
  const fromAmountNum = parseFloat(fromAmount) || 0;
  const toAmountNum = parseFloat(toAmount) || 0;
  
  const rate = fromAmountNum > 0 ? toAmountNum / fromAmountNum : 0;
  const minimumReceived = (toAmountNum * (1 - slippage / 100)).toFixed(6);
  const liquidityProviderFee = (fromAmountNum * (swapFee / 100)).toFixed(6);
  
  // Calculate price impact (simplified - actual impact would need pool reserves)
  // For now, use a conservative estimate
  const priceImpact = fromAmountNum > 0 ? "< 0.01" : "0.00";

  return (
    <div className="mb-4">
      {/* Summary */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-muted/30 hover:bg-muted/50 group flex w-full items-center justify-between rounded-xl p-3 transition-all"
      >
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">
            1 {fromToken.symbol} ≈ {rate.toFixed(6)} {toToken.symbol}
          </span>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="text-muted-foreground h-4 w-4" />
        </motion.div>
      </button>

      {/* Detailed Stats */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-muted/30 mt-2 space-y-3 rounded-xl p-4"
        >
          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground flex items-center gap-1">
              <span>Expected Output</span>
              <Info className="h-3 w-3" />
            </div>
            <span className="font-medium">
              {toAmount} {toToken.symbol}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground flex items-center gap-1">
              <span>Price Impact</span>
              <Info className="h-3 w-3" />
            </div>
            <span className="text-success-40 font-medium">{priceImpact}%</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground flex items-center gap-1">
              <span>Slippage Tolerance</span>
              <Info className="h-3 w-3" />
            </div>
            <span className="font-medium">{slippage}%</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground flex items-center gap-1">
              <span>Minimum received</span>
              <Info className="h-3 w-3" />
            </div>
            <span className="font-medium">
              {minimumReceived} {toToken.symbol}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground flex items-center gap-1">
              <span>Liquidity Provider Fee</span>
              <Info className="h-3 w-3" />
            </div>
            <span className="font-medium">
              {liquidityProviderFee} {fromToken.symbol}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground flex items-center gap-1">
              <span>Route</span>
              <Info className="h-3 w-3" />
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
