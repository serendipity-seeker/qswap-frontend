import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownUp, Settings, RefreshCw, Info } from "lucide-react";
import TokenInput from "@/components/composed/swap/TokenInput";
import TokenSelectorModal from "@/components/composed/swap/TokenSelectorModal";
import SwapStats from "@/components/composed/swap/SwapStats";
import SwapSettings from "@/components/composed/swap/SwapSettings";
import PriceChart from "@/components/composed/stats/PriceChart";
import PoolStats from "@/components/composed/stats/PoolStats";

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
    <div className="min-h-screen pt-24 pb-12 px-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary-40/20 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-primary-60/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-[1fr_480px_1fr] gap-6 items-start">
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
          <div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-40 to-primary-60 bg-clip-text text-transparent mb-2">
            Swap
          </h1>
          <p className="text-muted-foreground">Trade tokens in an instant</p>
        </motion.div>

        {/* Main Swap Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-3xl p-6 shadow-2xl"
        >
          {/* Settings Bar */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-primary-40/10 text-primary-40 text-sm font-medium">
                Swap
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <RefreshCw className="w-5 h-5" />
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
            <div className="text-sm text-muted-foreground mb-2">You pay</div>
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
          <div className="flex justify-center -my-3 relative z-10">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSwapTokens}
              className="p-3 bg-card hover:bg-muted border-4 border-background rounded-xl shadow-lg transition-colors"
            >
              <ArrowDownUp className="w-5 h-5 text-primary-40" />
            </motion.button>
          </div>

          {/* To Token */}
          <div className="mb-4">
            <div className="text-sm text-muted-foreground mb-2">You receive</div>
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
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <SwapStats
                fromToken={fromToken}
                toToken={toToken}
                fromAmount={fromAmount}
                toAmount={toAmount || "0"}
              />
            </motion.div>
          )}

          {/* Swap Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSwap}
            disabled={!fromAmount || parseFloat(fromAmount) <= 0}
            className="w-full py-4 bg-gradient-to-r from-primary-40 to-primary-60 hover:from-primary-50 hover:to-primary-70 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 animate-glow"
          >
            {!fromAmount || parseFloat(fromAmount) <= 0 ? "Enter an amount" : "Swap"}
          </motion.button>

          {/* Info Footer */}
          <div className="mt-4 p-3 bg-muted/50 rounded-lg flex items-start gap-2">
            <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              This is a mock interface. No real transactions will be executed.
            </p>
          </div>
        </motion.div>

          {/* Additional Info Cards - Mobile Only */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 grid grid-cols-3 gap-4 lg:hidden"
          >
            <div className="glass-effect rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-primary-40">$1.2M</div>
              <div className="text-xs text-muted-foreground mt-1">24h Volume</div>
            </div>
            <div className="glass-effect rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-primary-40">$45M</div>
              <div className="text-xs text-muted-foreground mt-1">TVL</div>
            </div>
            <div className="glass-effect rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-primary-40">1,234</div>
              <div className="text-xs text-muted-foreground mt-1">Users</div>
            </div>
          </motion.div>
        </div>

        {/* Right: Pool Stats */}
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

