import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, TrendingUp, Droplets, Info } from "lucide-react";
import TokenInput from "@/features/swap/components/TokenInput";
import TokenSelectorModal from "@/features/swap/components/TokenSelectorModal";
import PoolPositions from "@/features/liquidity/components/PoolPositions";
import { Button, SEO } from "@/shared/components/custom";

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
    <>
      <SEO
        title="Liquidity Pools"
        description="Add liquidity to Qubic Portal pools and earn fees from swaps. Provide liquidity to earn passive income with competitive APY rates on the Qubic network."
        keywords="liquidity pools, add liquidity, earn fees, DeFi yield, liquidity mining, LP tokens, passive income, Qubic liquidity"
        canonical="https://qubicportal.org/liquidity"
      />
      <div className="min-h-screen px-4 pt-32 pb-12">
        {/* Background decorations */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-primary-40/20 animate-float absolute top-1/4 -left-48 h-96 w-96 rounded-full blur-[120px]"></div>
        <div
          className="bg-primary-60/20 animate-float absolute -right-48 bottom-1/4 h-96 w-96 rounded-full blur-[120px]"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px]">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
          <h1 className="text-primary mb-4 text-5xl font-black">
            Liquidity
          </h1>
          <p className="text-muted-foreground text-xl">Add liquidity to earn fees from swaps</p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Add/Remove Liquidity Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="glass-effect rounded-3xl p-6 shadow-2xl">
              {/* Mode Selector */}
              <div className="mb-6 flex gap-2">
                <button
                  onClick={() => setMode("add")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-bold transition-all ${
                    mode === "add"
                      ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                      : "bg-muted/30 hover:bg-muted/50"
                  }`}
                >
                  <Plus className="h-5 w-5" />
                  Add Liquidity
                </button>
                <button
                  onClick={() => setMode("remove")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-bold transition-all ${
                    mode === "remove"
                      ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                      : "bg-muted/30 hover:bg-muted/50"
                  }`}
                >
                  <Minus className="h-5 w-5" />
                  Remove Liquidity
                </button>
              </div>

              {mode === "add" ? (
                <>
                  {/* Token A Input */}
                  <div className="mb-4">
                    <div className="text-muted-foreground mb-2 text-sm">Token A</div>
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
                  <div className="relative z-10 -my-2 flex justify-center">
                    <div className="bg-muted rounded-full p-2">
                      <Plus className="text-muted-foreground h-5 w-5" />
                    </div>
                  </div>

                  {/* Token B Input */}
                  <div className="mb-6">
                    <div className="text-muted-foreground mb-2 text-sm">Token B</div>
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
                      className="bg-muted/30 mb-4 space-y-2 rounded-xl p-4"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pool Share</span>
                        <span className="font-medium">0.01%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {tokenA.symbol} per {tokenB.symbol}
                        </span>
                        <span className="font-medium">{(parseFloat(amountA) / parseFloat(amountB)).toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {tokenB.symbol} per {tokenA.symbol}
                        </span>
                        <span className="font-medium">{(parseFloat(amountB) / parseFloat(amountA)).toFixed(6)}</span>
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
                    <div className="text-muted-foreground mb-2 text-sm">Amount to Remove</div>
                    <div className="bg-muted/30 rounded-2xl p-4">
                      <div className="mb-4 flex items-center gap-3">
                        <img src={tokenA.icon} alt={tokenA.symbol} className="h-8 w-8 rounded-full" />
                        <span className="text-xl font-bold">{tokenA.symbol}</span>
                        <span className="text-muted-foreground">/</span>
                        <img src={tokenB.icon} alt={tokenB.symbol} className="h-8 w-8 rounded-full" />
                        <span className="text-xl font-bold">{tokenB.symbol}</span>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="0"
                        className="bg-muted accent-primary-40 h-2 w-full cursor-pointer appearance-none rounded-lg"
                      />

                      <div className="mt-2 flex justify-between">
                        {["25%", "50%", "75%", "Max"].map((label) => (
                          <button
                            key={label}
                            className="bg-muted/50 hover:bg-muted rounded-lg px-3 py-1 text-sm transition-colors"
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 mb-6 space-y-2 rounded-xl p-4">
                    <div className="text-muted-foreground mb-2 text-sm">You will receive:</div>
                    <div className="flex justify-between">
                      <span className="font-medium">{tokenA.symbol}</span>
                      <span className="font-bold">0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{tokenB.symbol}</span>
                      <span className="font-bold">0.00</span>
                    </div>
                  </div>

                  <Button variant="danger" size="lg" onClick={handleRemoveLiquidity} fullWidth>
                    Remove Liquidity
                  </Button>
                </>
              )}

              {/* Info Footer */}
              <div className="bg-muted/50 mt-4 flex items-start gap-2 rounded-lg p-3">
                <Info className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                <p className="text-muted-foreground text-xs">
                  By adding liquidity you'll earn 0.3% of all trades on this pair proportional to your share of the
                  pool.
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
          className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          <div className="glass-effect rounded-xl p-6">
            <div className="mb-2 flex items-center gap-3">
              <div className="bg-primary-40/20 rounded-lg p-2">
                <Droplets className="text-primary-40 h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">$45.2M</div>
                <div className="text-muted-foreground text-sm">Total Liquidity</div>
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <div className="mb-2 flex items-center gap-3">
              <div className="bg-success-40/20 rounded-lg p-2">
                <TrendingUp className="text-success-40 h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">$1.2M</div>
                <div className="text-muted-foreground text-sm">24h Volume</div>
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <div className="mb-2 flex items-center gap-3">
              <div className="bg-warning-40/20 rounded-lg p-2">
                <TrendingUp className="text-warning-40 h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">$85.4K</div>
                <div className="text-muted-foreground text-sm">24h Fees</div>
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
    </>
  );
};

export default Liquidity;
