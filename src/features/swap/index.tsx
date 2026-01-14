import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownUp, Settings, RefreshCw, Info } from "lucide-react";
import TokenInput from "@/features/swap/components/TokenInput";
import TokenSelectorModal from "@/features/swap/components/TokenSelectorModal";
import SwapStats from "@/features/swap/components/SwapStats";
import SwapSettings from "@/features/swap/components/SwapSettings";
import PriceChart from "@/features/stats/components/PriceChart";
import { Button, SEO } from "@/shared/components/custom";
import { isAsset, isQubic, type TokenDisplay } from "@/shared/constants/tokens";
import { useQubicConnect } from "@/shared/lib/wallet-connect/QubicConnectContext";
import { fetchAssetsBalance, fetchBalance } from "@/shared/services/rpc.service";
import { useSwap } from "@/core/hooks";
import { toast } from "sonner";
import { useQswapTokenList } from "@/core/hooks/pool/useQswapTokenList";

const Swap: React.FC = () => {
  const { wallet, connected, toggleConnectModal } = useQubicConnect();
  const { handleSwap } = useSwap();

  const { tokenList } = useQswapTokenList();

  const [tokens, setTokens] = useState<TokenDisplay[]>(
    tokenList.map((t) => ({ ...t, balance: "0" })),
  );

  const defaultFrom = useMemo(() => tokens.find(isQubic) ?? tokens[0], [tokens]);
  const defaultTo = useMemo(() => tokens.find(isAsset) ?? tokens[1], [tokens]);
  
  console.log({tokens, defaultFrom, defaultTo});

  const [fromToken, setFromToken] = useState<TokenDisplay>(defaultFrom);
  const [toToken, setToToken] = useState<TokenDisplay>(defaultTo);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectingToken, setSelectingToken] = useState<"from" | "to">("from");
  const [slippage, setSlippage] = useState("0.5");

  // Keep selected tokens in sync when token list updates (balances refresh)
  useEffect(() => {
    setFromToken((prev) => tokens.find((t) => t.assetName === prev.assetName) ?? defaultFrom);
    setToToken((prev) => tokens.find((t) => t.assetName === prev.assetName) ?? defaultTo);
  }, [tokens, defaultFrom, defaultTo]);

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

        for (const t of tokenList) {
          if (isQubic(t)) {
            next.push({ ...t, balance: Number(qubicBal.balance || 0).toLocaleString() });
          } else {
            const assetBal = await fetchAssetsBalance(wallet.publicKey, t.assetName, 1);
            next.push({ ...t, balance: Number(assetBal || 0).toLocaleString() });
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
  }, [wallet?.publicKey]);

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleTokenSelect = (token: TokenDisplay) => {
    if (selectingToken === "from") {
      // If selecting from token, ensure to token is valid (QUBIC-asset pairs only)
      if (isQubic(token)) {
        // From is QUBIC, to can be any asset
        setFromToken(token);
      } else if (isAsset(token)) {
        // From is asset, to must be QUBIC
        setFromToken(token);
        if (!isQubic(toToken)) {
          const qubicToken = tokens.find(isQubic) ?? defaultFrom;
          setToToken(qubicToken);
        }
      }
    } else {
      // If selecting to token, ensure from token is valid (QUBIC-asset pairs only)
      if (isQubic(token)) {
        // To is QUBIC, from must be an asset
        setToToken(token);
        if (!isAsset(fromToken)) {
          const assetToken = tokens.find(isAsset) ?? defaultTo;
          setFromToken(assetToken);
        }
      } else if (isAsset(token)) {
        // To is asset, from must be QUBIC
        setToToken(token);
        if (!isQubic(fromToken)) {
          const qubicToken = tokens.find(isQubic) ?? defaultFrom;
          setFromToken(qubicToken);
        }
      }
    }
    setIsTokenModalOpen(false);
  };

  // Quote whenever input changes using the useQuote hook implicitly via manual call
  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      const amt = Number(fromAmount);
      if (!fromAmount || !Number.isFinite(amt) || amt <= 0) {
        setToAmount("");
        return;
      }

      try {
        // Import quote functions for inline use
        const { quoteExactQuInput, quoteExactAssetInput } = await import("@/shared/services/sc.service");
        
        if (isQubic(fromToken) && isAsset(toToken)) {
          const q = await quoteExactQuInput({
            assetIssuer: toToken.issuer,
            assetName: toToken.assetName,
            quAmountIn: Math.floor(amt),
          });
          if (!cancelled) setToAmount(q ? String(q.assetAmountOut) : "");
          return;
        }

        if (isAsset(fromToken) && isQubic(toToken)) {
          const q = await quoteExactAssetInput({
            assetIssuer: fromToken.issuer,
            assetName: fromToken.assetName,
            assetAmountIn: Math.floor(amt),
          });
          if (!cancelled) setToAmount(q ? String(q.quAmountOut) : "");
          return;
        }

        // Asset <-> Asset is not supported by QSWAP (pools are QU/Asset)
        setToAmount("");
      } catch (e) {
        console.error(e);
        if (!cancelled) setToAmount("");
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [fromAmount, fromToken, toToken]);

  const onSwap = async () => {
    if (!connected || !wallet?.publicKey) {
      toggleConnectModal();
      return;
    }

    const amt = Number(fromAmount);
    if (!Number.isFinite(amt) || amt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    // Only QUBIC <-> Asset swaps are supported
    if (!((isQubic(fromToken) && isAsset(toToken)) || (isAsset(fromToken) && isQubic(toToken)))) {
      toast.error("Only QUBIC ↔ token swaps are supported (QSWAP pools are QU/Asset).");
      return;
    }

    await handleSwap({
      fromToken: {
        issuer: fromToken.issuer,
        assetName: fromToken.assetName,
      },
      toToken: {
        issuer: toToken.issuer,
        assetName: toToken.assetName,
      },
      amountIn: Math.floor(amt),
      slippage: Number(slippage) || 0.5,
    });
  };

  return (
    <>
      <SEO
        title="Swap Tokens"
        description="Trade tokens instantly with the best rates on Qubic Portal. Experience lightning-fast swaps with deep liquidity and minimal slippage on the Qubic network."
        keywords="token swap, crypto swap, Qubic DEX, trade tokens, exchange crypto, swap QUBIC, decentralized trading"
        canonical="https://qubicportal.org/swap"
      />
      <div className="min-h-screen px-3 pt-28 pb-12 sm:px-4 md:px-6 md:pt-32">
        {/* Background decorations */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-primary-40/20 animate-float absolute top-1/4 -left-48 h-96 w-96 rounded-full blur-[120px]"></div>
        <div
          className="bg-primary-60/20 animate-float absolute -right-48 bottom-1/4 h-96 w-96 rounded-full blur-[120px]"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px]">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center md:mb-10"
        >
          <h1 className="text-primary mb-4 text-5xl font-black">
            Swap Tokens
          </h1>
          <p className="text-muted-foreground text-xl">
            Trade tokens instantly with the best rates on Qubic network
          </p>
        </motion.div>

        <div className="grid grid-cols-1 items-start gap-4 md:gap-6 lg:grid-cols-[1fr_480px]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="hidden lg:block"
          >
            <PriceChart />
          </motion.div>

          <div className="mx-auto w-full max-w-[920px] lg:max-w-none">
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
              <div className="mb-4 -mt-8">
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
                    slippage={Number(slippage) || 0.5}
                  />
                </motion.div>
              )}

              {/* Swap Button */}
              <Button
                variant="primary"
                size="lg"
                onClick={onSwap}
                disabled={!fromAmount || parseFloat(fromAmount) <= 0}
                fullWidth
              >
                {!connected ? "Connect wallet" : !fromAmount || parseFloat(fromAmount) <= 0 ? "Enter an amount" : "Swap"}
              </Button>

                {/* Info Footer */}
                <div className="bg-muted/50 mt-4 flex items-start gap-2 rounded-lg p-3">
                  <Info className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                  <p className="text-muted-foreground text-xs">
                    QSWAP supports pools of QUBIC ↔ Token.
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
            </div>

            {/* Price Chart - Mobile/Tablet Only (wider container) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 md:mt-6 lg:hidden"
            >
              <PriceChart />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Token Selector Modal */}
      <TokenSelectorModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        tokens={tokens}
        onSelectToken={handleTokenSelect}
        selectedToken={selectingToken === "from" ? fromToken : toToken}
      />
    </div>
    </>
  );
};

export default Swap;
