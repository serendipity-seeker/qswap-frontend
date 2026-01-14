import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, TrendingUp, Droplets, Info, AlertCircle } from "lucide-react";
import TokenInput from "@/features/swap/components/TokenInput";
import TokenSelectorModal from "@/features/swap/components/TokenSelectorModal";
import PoolPositions from "@/features/liquidity/components/PoolPositions";
import { Button, SEO } from "@/shared/components/custom";
import { useQubicConnect } from "@/shared/lib/wallet-connect/QubicConnectContext";
import { fetchAggregatedAssetsBalance, fetchBalance } from "@/shared/services/rpc.service";
import { useAddLiquidity, useRemoveLiquidity, usePoolState } from "@/core/hooks";
import { toast } from "sonner";
import { type TokenDisplay, isAsset, isQubic, QUBIC_TOKEN } from "@/shared/constants/tokens";
import { useQswapTokenList } from "@/core/hooks/pool/useQswapTokenList";

const Liquidity: React.FC = () => {
  const { wallet, connected, toggleConnectModal } = useQubicConnect();
  const { handleAddLiquidity } = useAddLiquidity();
  const { handleRemoveLiquidity } = useRemoveLiquidity();

  const [mode, setMode] = useState<"add" | "remove">("add");
  
  const { tokenList } = useQswapTokenList();
  const [tokens, setTokens] = useState<TokenDisplay[]>(tokenList.map((t) => ({ ...t, balance: "0" })));

  const assetTokens = useMemo(() => tokens.filter(isAsset), [tokens]);
  const defaultAsset = useMemo(() => assetTokens[0] ?? (tokens[1] as TokenDisplay), [assetTokens, tokens]);

  // QSWAP pools are QU/Asset; keep tokenA fixed to QUBIC
  const tokenA = useMemo<TokenDisplay>(
    () => (tokens.find((t) => t.assetName === "QUBIC") as TokenDisplay) ?? { ...QUBIC_TOKEN, balance: "0" },
    [tokens],
  );
  const [tokenB, setTokenB] = useState<TokenDisplay | undefined>(defaultAsset);
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [selectingToken, setSelectingToken] = useState<"A" | "B">("B");
  const [removePercentage, setRemovePercentage] = useState<number>(0);

  // Use the pool state hook
  const { poolState, refetch: refetchPoolState } = usePoolState(
    tokenB && isAsset(tokenB) ? tokenB.issuer : undefined,
    tokenB && isAsset(tokenB) ? tokenB.assetName : undefined,
    wallet?.publicKey,
  );

  // Load balances when wallet changes
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!wallet?.publicKey) {
        setTokens(tokenList.map((t) => ({ ...t, balance: "0" })));
        return;
      }

      try {
        const qubicBal = await fetchBalance(wallet.publicKey);
        const next: TokenDisplay[] = [];
        
        // Fetch aggregated balances (QX + QSwap combined)
        const aggregatedBal = await fetchAggregatedAssetsBalance(wallet.publicKey);
        
        for (const t of tokenList) {
          if (isQubic(t)) {
            next.push({ ...t, balance: Number(qubicBal.balance || 0).toLocaleString() });
          } else {
            // Show total balance (QX + QSwap) for display purposes
            const asset = aggregatedBal.find((a) => a.assetName === t.assetName);
            next.push({ ...t, balance: Number(asset?.totalBalance || 0).toLocaleString() });
          }
        }
        if (!cancelled) setTokens(next);
      } catch (e) {
        console.error(e);
        if (!cancelled) setTokens(tokenList.map((t) => ({ ...t, balance: "0" })));
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [wallet?.publicKey, tokenList]);

  // Refetch pool state when tokenB changes
  useEffect(() => {
    refetchPoolState();
  }, [tokenB, refetchPoolState]);

  const handleTokenSelect = (token: TokenDisplay) => {
    if (selectingToken === "A") {
      // tokenA is fixed to QUBIC for QSWAP
      return;
    } else {
      setTokenB(token);
    }
    setIsTokenModalOpen(false);
  };

  const onAddLiquidity = async () => {
    if (!connected || !wallet?.publicKey) {
      toggleConnectModal();
      return;
    }
    if (!tokenB || !isAsset(tokenB)) {
      toast.error("Select an asset token (QSWAP pools are QUBIC/Token).");
      return;
    }

    const quDesired = Number(amountA);
    const assetDesired = Number(amountB);
    if (!Number.isFinite(quDesired) || !Number.isFinite(assetDesired) || quDesired <= 0 || assetDesired <= 0) {
      toast.error("Enter valid amounts");
      return;
    }

    await handleAddLiquidity({
      assetIssuer: tokenB.issuer,
      assetName: tokenB.assetName,
      assetAmountDesired: assetDesired,
      quAmountDesired: quDesired,
      slippage: 0.5,
    });

    // Clear inputs and refetch pool state on success
    setAmountA("");
    setAmountB("");
    setTimeout(() => refetchPoolState(), 2000);
  };

  const onRemoveLiquidity = async () => {
    if (!connected || !wallet?.publicKey) {
      toggleConnectModal();
      return;
    }
    if (!tokenB || !isAsset(tokenB)) {
      toast.error("Select an asset token (QSWAP pools are QUBIC/Token).");
      return;
    }
    if (!poolState || poolState.userLiquidity <= 0) {
      toast.error("No liquidity to remove");
      return;
    }

    const burnLiq = Math.floor((poolState.userLiquidity * removePercentage) / 100);
    if (burnLiq <= 0) {
      toast.error("Select an amount to remove");
      return;
    }

    await handleRemoveLiquidity(
      {
        assetIssuer: tokenB.issuer,
        assetName: tokenB.assetName,
        burnLiquidity: burnLiq,
        slippage: 0.5,
      },
      {
        reservedQuAmount: poolState.reservedQuAmount,
        reservedAssetAmount: poolState.reservedAssetAmount,
        totalLiquidity: poolState.totalLiquidity,
      },
    );

    // Reset remove percentage and refetch pool state
    setRemovePercentage(0);
    setTimeout(() => refetchPoolState(), 2000);
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

              {/* Rewrite begins here for meaningful UI when tokenB is undefined */}
              {(!tokenB || !isAsset(tokenB)) ? (
                <div className="flex flex-col items-center justify-center py-14">
                  <AlertCircle className="text-primary mb-4 h-12 w-12 opacity-70" />
                  <h2 className="mb-2 text-xl font-bold text-primary">Select an Asset Token</h2>
                  <p className="mb-4 text-sm text-muted-foreground text-center max-w-xs">
                    Please select a token to pair with QUBIC to add or remove liquidity.
                  </p>
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => {
                      setSelectingToken("B");
                      setIsTokenModalOpen(true);
                    }}
                  >
                    Select Token
                  </Button>
                </div>
              ) : (
                mode === "add" ? (
                  <>
                    {/* Token A Input */}
                    <div className="mb-4">
                      <div className="text-muted-foreground mb-2 text-sm">Token A</div>
                      <TokenInput
                        token={tokenA}
                        amount={amountA}
                        onAmountChange={setAmountA}
                        onTokenClick={() => {}}
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
                    {amountA && amountB && poolState && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-muted/30 mb-4 space-y-2 rounded-xl p-4"
                      >
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Pool Share</span>
                          <span className="font-medium">
                            {poolState.totalLiquidity > 0
                              ? ((parseFloat(amountA) / (poolState.reservedQuAmount + parseFloat(amountA))) * 100).toFixed(4)
                              : "100.00"}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {tokenA.assetName} per {tokenB?.assetName}
                          </span>
                          <span className="font-medium">{(parseFloat(amountA) / parseFloat(amountB)).toFixed(6)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {tokenB?.assetName} per {tokenA.assetName}
                          </span>
                          <span className="font-medium">{(parseFloat(amountB) / parseFloat(amountA)).toFixed(6)}</span>
                        </div>
                        {poolState.totalLiquidity > 0 && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Current Pool Reserves</span>
                              <span className="font-medium">
                                {poolState.reservedQuAmount.toLocaleString()} / {poolState.reservedAssetAmount.toLocaleString()}
                              </span>
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}

                    {/* Add Button */}
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={onAddLiquidity}
                      disabled={!amountA || !amountB || parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0}
                      fullWidth
                    >
                      {!connected ? "Connect wallet" : !amountA || !amountB ? "Enter amounts" : "Add Liquidity"}
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Remove Liquidity Interface */}
                    <div className="mb-6">
                      <div className="text-muted-foreground mb-2 text-sm">Amount to Remove</div>
                      <div className="bg-muted/30 rounded-2xl p-4">
                        <div className="mb-4 flex items-center gap-3">
                          <img src={tokenA.logo} alt={tokenA.assetName} className="h-8 w-8 rounded-full" />
                          <span className="text-xl font-bold">{tokenA.assetName}</span>
                          <span className="text-muted-foreground">/</span>
                          <img src={tokenB?.logo} alt={tokenB?.assetName} className="h-8 w-8 rounded-full" />
                          <span className="text-xl font-bold">{tokenB?.assetName}</span>
                        </div>

                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={removePercentage}
                          onChange={(e) => setRemovePercentage(Number(e.target.value))}
                          className="bg-muted accent-primary-40 h-2 w-full cursor-pointer appearance-none rounded-lg"
                        />

                        <div className="mt-2 flex justify-between">
                          {["25%", "50%", "75%", "Max"].map((label) => (
                            <button
                              key={label}
                              onClick={() => setRemovePercentage(label === "Max" ? 100 : Number(label.replace("%", "")))}
                              className="bg-muted/50 hover:bg-muted rounded-lg px-3 py-1 text-sm transition-colors"
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                        
                        {poolState?.userLiquidity === 0 && (
                          <div className="text-muted-foreground mt-2 text-center text-sm">
                            No liquidity position found for this pool
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-muted/30 mb-6 space-y-2 rounded-xl p-4">
                      <div className="text-muted-foreground mb-2 text-sm">You will receive:</div>
                      <div className="flex justify-between">
                        <span className="font-medium">{tokenA.assetName}</span>
                        <span className="font-bold">
                          {poolState && poolState.userLiquidity > 0
                            ? ((poolState.reservedQuAmount * (poolState.userLiquidity * removePercentage) / 100) / poolState.totalLiquidity).toFixed(6)
                            : "0.00"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">{tokenB?.assetName}</span>
                        <span className="font-bold">
                          {poolState && poolState.userLiquidity > 0
                            ? ((poolState.reservedAssetAmount * (poolState.userLiquidity * removePercentage) / 100) / poolState.totalLiquidity).toFixed(6)
                            : "0.00"}
                        </span>
                      </div>
                    </div>

                    <Button 
                      variant="danger" 
                      size="lg" 
                      onClick={onRemoveLiquidity} 
                      disabled={!connected || !poolState || poolState.userLiquidity <= 0 || removePercentage <= 0}
                      fullWidth
                    >
                      {!connected ? "Connect wallet" : !poolState || poolState.userLiquidity <= 0 ? "No liquidity to remove" : removePercentage <= 0 ? "Select amount" : "Remove Liquidity"}
                    </Button>
                  </>
                )
              )}
              {/* Rewrite ends here */}

              {/* Info Footer */}
              <div className="bg-muted/50 mt-4 flex items-start gap-2 rounded-lg p-3">
                <Info className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
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
        tokens={tokens.filter((t) => t.assetName !== "QUBIC")}
        onSelectToken={handleTokenSelect}
        selectedToken={tokenB ?? undefined}
      />
    </div>
    </>
  );
};

export default Liquidity;
