import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownUp, Settings, RefreshCw, Info } from "lucide-react";
import TokenInput from "@/features/swap/components/TokenInput";
import TokenSelectorModal from "@/features/swap/components/TokenSelectorModal";
import SwapStats from "@/features/swap/components/SwapStats";
import SwapSettings from "@/features/swap/components/SwapSettings";
import PriceChart from "@/features/stats/components/PriceChart";
import PoolStats from "@/features/stats/components/PoolStats";
import { Button } from "@/shared/components/custom";

interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance: string;
}

const mockTokens: Token[] = [
  { symbol: "QUBIC", name: "Qubic", icon: "/qubic.svg", balance: "1,234.56" },
  { symbol: "QX", name: "Qx Token", icon: "/qubic-coin.svg", balance: "5,678.90" },
  { symbol: "USDT", name: "Tether USD", icon: "/qubic-coin.svg", balance: "10,000.00" },
  { symbol: "WETH", name: "Wrapped Ethereum", icon: "/qubic-coin.svg", balance: "2.5" },
];

const Swap: React.FC = () => {
  const [fromToken, setFromToken] = useState<Token>(mockTokens[0]);
  const [toToken, setToToken] = useState<Token>(mockTokens[1]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectingToken, setSelectingToken] = useState<"from" | "to">("from");
  const [slippage, setSlippage] = useState("0.5");

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleTokenSelect = (token: Token) => {
    if (selectingToken === "from") {
      setFromToken(token);
    } else {
      setToToken(token);
    }
    setIsTokenModalOpen(false);
  };

  const handleSwap = () => {
    console.log("Swapping:", fromAmount, fromToken.symbol, "to", toToken.symbol);
    // Mock swap logic
  };

  return (
    <div className="min-h-screen px-3 pt-20 pb-12 sm:px-4 md:px-6 md:pt-24">
      {/* Background decorations */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-primary-40/20 animate-float absolute top-1/4 -left-48 h-96 w-96 rounded-full blur-[120px]"></div>
        <div
          className="bg-primary-60/20 animate-float absolute -right-48 bottom-1/4 h-96 w-96 rounded-full blur-[120px]"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 items-start gap-4 md:gap-6 lg:grid-cols-[1fr_minmax(400px,500px)_1fr] xl:grid-cols-[1fr_480px_1fr]">
          {/* Left: Price Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="hidden lg:block"
          >
            <PriceChart />
          </motion.div>

          {/* Center: Swap Card */}
          <div className="mx-auto w-full max-w-[500px] lg:max-w-none">
            {/* Main Swap Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="glass-effect rounded-2xl p-4 shadow-2xl sm:p-5 md:rounded-3xl md:p-6"
            >
              {/* Settings Bar */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-primary-40/10 text-primary-40 rounded-full px-3 py-1 text-sm font-medium">
                    Swap
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className="hover:bg-muted rounded-lg p-2 transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                  </button>
                  <button className="hover:bg-muted rounded-lg p-2 transition-colors">
                    <RefreshCw className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Settings Panel */}
              {isSettingsOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <SwapSettings slippage={slippage} onSlippageChange={setSlippage} />
                </motion.div>
              )}

              {/* From Token */}
              <div className="mb-2">
                <div className="text-muted-foreground mb-2 text-sm">You pay</div>
                <TokenInput
                  token={fromToken}
                  amount={fromAmount}
                  onAmountChange={setFromAmount}
                  onTokenClick={() => {
                    setSelectingToken("from");
                    setIsTokenModalOpen(true);
                  }}
                />
              </div>

              {/* Swap Button */}
              <div className="relative z-10 -my-3 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSwapTokens}
                  className="bg-card hover:bg-muted border-background rounded-xl border-4 p-3 shadow-lg transition-colors"
                >
                  <ArrowDownUp className="text-primary-40 h-5 w-5" />
                </motion.button>
              </div>

              {/* To Token */}
              <div className="mb-4">
                <div className="text-muted-foreground mb-2 text-sm">You receive</div>
                <TokenInput
                  token={toToken}
                  amount={toAmount}
                  onAmountChange={setToAmount}
                  onTokenClick={() => {
                    setSelectingToken("to");
                    setIsTokenModalOpen(true);
                  }}
                  readOnly
                />
              </div>

              {/* Swap Stats */}
              {fromAmount && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <SwapStats
                    fromToken={fromToken}
                    toToken={toToken}
                    fromAmount={fromAmount}
                    toAmount={toAmount || "0"}
                  />
                </motion.div>
              )}

              {/* Swap Button */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleSwap}
                disabled={!fromAmount || parseFloat(fromAmount) <= 0}
                fullWidth
              >
                {!fromAmount || parseFloat(fromAmount) <= 0 ? "Enter an amount" : "Swap"}
              </Button>

              {/* Info Footer */}
              <div className="bg-muted/50 mt-4 flex items-start gap-2 rounded-lg p-3">
                <Info className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                <p className="text-muted-foreground text-xs">
                  This is a mock interface. No real transactions will be executed.
                </p>
              </div>
            </motion.div>

            {/* Additional Info Cards - Mobile/Tablet Only */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 grid grid-cols-3 gap-2 sm:gap-4 md:mt-6 lg:hidden"
            >
              <div className="glass-effect rounded-lg p-3 text-center sm:p-4 md:rounded-xl">
                <div className="text-primary-40 text-lg font-bold sm:text-xl md:text-2xl">$1.2M</div>
                <div className="text-muted-foreground mt-1 text-[10px] sm:text-xs">24h Volume</div>
              </div>
              <div className="glass-effect rounded-lg p-3 text-center sm:p-4 md:rounded-xl">
                <div className="text-primary-40 text-lg font-bold sm:text-xl md:text-2xl">$45M</div>
                <div className="text-muted-foreground mt-1 text-[10px] sm:text-xs">TVL</div>
              </div>
              <div className="glass-effect rounded-lg p-3 text-center sm:p-4 md:rounded-xl">
                <div className="text-primary-40 text-lg font-bold sm:text-xl md:text-2xl">1,234</div>
                <div className="text-muted-foreground mt-1 text-[10px] sm:text-xs">Users</div>
              </div>
            </motion.div>

            {/* Price Chart - Mobile/Tablet Only */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 md:mt-6 lg:hidden"
            >
              <PriceChart />
            </motion.div>

            {/* Pool Stats - Tablet Only */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-4 hidden md:mt-6 md:block lg:hidden"
            >
              <PoolStats />
            </motion.div>
          </div>

          {/* Right: Pool Stats - Desktop Only */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block"
          >
            <PoolStats />
          </motion.div>
        </div>
      </div>

      {/* Token Selector Modal */}
      <TokenSelectorModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        tokens={mockTokens}
        onSelectToken={handleTokenSelect}
        selectedToken={selectingToken === "from" ? fromToken : toToken}
      />
    </div>
  );
};

export default Swap;
