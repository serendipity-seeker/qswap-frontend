import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, TrendingUp, Droplets, Info } from "lucide-react";
import TokenInput from "@/features/swap/components/TokenInput";
import TokenSelectorModal from "@/features/swap/components/TokenSelectorModal";
import PoolPositions from "@/features/liquidity/components/PoolPositions";
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

const Liquidity: React.FC = () => {
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [tokenA, setTokenA] = useState<Token>(mockTokens[0]);
  const [tokenB, setTokenB] = useState<Token>(mockTokens[1]);
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [selectingToken, setSelectingToken] = useState<"A" | "B">("A");

  const handleTokenSelect = (token: Token) => {
    if (selectingToken === "A") {
      setTokenA(token);
    } else {
      setTokenB(token);
    }
    setIsTokenModalOpen(false);
  };

  const handleAddLiquidity = () => {
    console.log("Adding liquidity:", amountA, tokenA.symbol, "+", amountB, tokenB.symbol);
  };

  const handleRemoveLiquidity = () => {
    console.log("Removing liquidity");
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary-40/20 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-primary-60/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-40 to-primary-60 bg-clip-text text-transparent mb-2">
            Liquidity
          </h1>
          <p className="text-muted-foreground">Add liquidity to earn fees from swaps</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Add/Remove Liquidity Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="glass-effect rounded-3xl p-6 shadow-2xl">
              {/* Mode Selector */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setMode("add")}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    mode === "add"
                      ? "bg-gradient-to-r from-primary-40 to-primary-60 text-white shadow-lg"
                      : "bg-muted/30 hover:bg-muted/50"
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  Add Liquidity
                </button>
                <button
                  onClick={() => setMode("remove")}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    mode === "remove"
                      ? "bg-gradient-to-r from-primary-40 to-primary-60 text-white shadow-lg"
                      : "bg-muted/30 hover:bg-muted/50"
                  }`}
                >
                  <Minus className="w-5 h-5" />
                  Remove Liquidity
                </button>
              </div>

              {mode === "add" ? (
                <>
                  {/* Token A Input */}
                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-2">Token A</div>
                    <TokenInput
                      token={tokenA}
                      amount={amountA}
                      onAmountChange={setAmountA}
                      onTokenClick={() => {
                        setSelectingToken("A");
                        setIsTokenModalOpen(true);
                      }}
                    />
                  </div>

                  {/* Plus Icon */}
                  <div className="flex justify-center -my-2 relative z-10">
                    <div className="p-2 bg-muted rounded-full">
                      <Plus className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Token B Input */}
                  <div className="mb-6">
                    <div className="text-sm text-muted-foreground mb-2">Token B</div>
                    <TokenInput
                      token={tokenB}
                      amount={amountB}
                      onAmountChange={setAmountB}
                      onTokenClick={() => {
                        setSelectingToken("B");
                        setIsTokenModalOpen(true);
                      }}
                    />
                  </div>

                  {/* Pool Info */}
                  {amountA && amountB && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mb-4 p-4 bg-muted/30 rounded-xl space-y-2"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pool Share</span>
                        <span className="font-medium">0.01%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {tokenA.symbol} per {tokenB.symbol}
                        </span>
                        <span className="font-medium">
                          {(parseFloat(amountA) / parseFloat(amountB)).toFixed(6)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {tokenB.symbol} per {tokenA.symbol}
                        </span>
                        <span className="font-medium">
                          {(parseFloat(amountB) / parseFloat(amountA)).toFixed(6)}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Add Button */}
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleAddLiquidity}
                    disabled={!amountA || !amountB || parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0}
                    fullWidth
                  >
                    {!amountA || !amountB ? "Enter amounts" : "Add Liquidity"}
                  </Button>
                </>
              ) : (
                <>
                  {/* Remove Liquidity Interface */}
                  <div className="mb-6">
                    <div className="text-sm text-muted-foreground mb-2">Amount to Remove</div>
                    <div className="bg-muted/30 rounded-2xl p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <img src={tokenA.icon} alt={tokenA.symbol} className="w-8 h-8 rounded-full" />
                        <span className="text-xl font-bold">{tokenA.symbol}</span>
                        <span className="text-muted-foreground">/</span>
                        <img src={tokenB.icon} alt={tokenB.symbol} className="w-8 h-8 rounded-full" />
                        <span className="text-xl font-bold">{tokenB.symbol}</span>
                      </div>
                      
                      <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="0"
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary-40"
                      />
                      
                      <div className="flex justify-between mt-2">
                        {["25%", "50%", "75%", "Max"].map((label) => (
                          <button
                            key={label}
                            className="px-3 py-1 bg-muted/50 hover:bg-muted rounded-lg text-sm transition-colors"
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 p-4 bg-muted/30 rounded-xl space-y-2">
                    <div className="text-sm text-muted-foreground mb-2">You will receive:</div>
                    <div className="flex justify-between">
                      <span className="font-medium">{tokenA.symbol}</span>
                      <span className="font-bold">0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{tokenB.symbol}</span>
                      <span className="font-bold">0.00</span>
                    </div>
                  </div>

                  <Button
                    variant="danger"
                    size="lg"
                    onClick={handleRemoveLiquidity}
                    fullWidth
                  >
                    Remove Liquidity
                  </Button>
                </>
              )}

              {/* Info Footer */}
              <div className="mt-4 p-3 bg-muted/50 rounded-lg flex items-start gap-2">
                <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  By adding liquidity you'll earn 0.3% of all trades on this pair proportional to your share of the pool.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Your Positions */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <PoolPositions />
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary-40/20 rounded-lg">
                <Droplets className="w-6 h-6 text-primary-40" />
              </div>
              <div>
                <div className="text-2xl font-bold">$45.2M</div>
                <div className="text-sm text-muted-foreground">Total Liquidity</div>
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-success-40/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-success-40" />
              </div>
              <div>
                <div className="text-2xl font-bold">$1.2M</div>
                <div className="text-sm text-muted-foreground">24h Volume</div>
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-warning-40/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-warning-40" />
              </div>
              <div>
                <div className="text-2xl font-bold">$85.4K</div>
                <div className="text-sm text-muted-foreground">24h Fees</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Token Selector Modal */}
      <TokenSelectorModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        tokens={mockTokens}
        onSelectToken={handleTokenSelect}
        selectedToken={selectingToken === "A" ? tokenA : tokenB}
      />
    </div>
  );
};

export default Liquidity;

