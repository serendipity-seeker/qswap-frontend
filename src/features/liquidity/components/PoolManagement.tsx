import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, ArrowLeft, Info } from "lucide-react";
import TokenInput from "@/features/swap/components/TokenInput";
import { Button } from "@/shared/components/custom";
import { useQubicConnect } from "@/shared/lib/wallet-connect/QubicConnectContext";
import { fetchAggregatedAssetsBalance, fetchBalance } from "@/shared/services/rpc.service";
import { useAddLiquidity, useRemoveLiquidity, usePoolState } from "@/core/hooks";
import { toast } from "sonner";
import { type TokenDisplay, QUBIC_TOKEN } from "@/shared/constants/tokens";
import type { PoolCardData } from "./PoolCard";

interface PoolManagementProps {
  pool: PoolCardData;
  onBack: () => void;
}

const PoolManagement: React.FC<PoolManagementProps> = ({ pool, onBack }) => {
  const { wallet, connected, toggleConnectModal } = useQubicConnect();
  const { handleAddLiquidity } = useAddLiquidity();
  const { handleRemoveLiquidity } = useRemoveLiquidity();

  const [mode, setMode] = useState<"add" | "remove">("add");
  const [tokenA, setTokenA] = useState<TokenDisplay>({ ...QUBIC_TOKEN, balance: "0" });
  const [tokenB, setTokenB] = useState<TokenDisplay>({
    ...pool.token,
    balance: "0",
  });
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [removePercentage, setRemovePercentage] = useState<number>(0);

  // Use the pool state hook
  const { poolState, refetch: refetchPoolState } = usePoolState(
    pool.token.issuer,
    pool.token.assetName,
    wallet?.publicKey,
  );

  // Load balances when wallet changes
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!wallet?.publicKey) {
        setTokenA({ ...QUBIC_TOKEN, balance: "0" });
        setTokenB({ ...pool.token, balance: "0" });
        return;
      }

      try {
        const qubicBal = await fetchBalance(wallet.publicKey);
        const aggregatedBal = await fetchAggregatedAssetsBalance(wallet.publicKey);

        const asset = aggregatedBal.find((a) => a.assetName === pool.token.assetName);

        if (!cancelled) {
          setTokenA({
            ...QUBIC_TOKEN,
            balance: Number(qubicBal.balance || 0).toLocaleString(),
          });
          setTokenB({
            ...pool.token,
            balance: Number(asset?.totalBalance || 0).toLocaleString(),
          });
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setTokenA({ ...QUBIC_TOKEN, balance: "0" });
          setTokenB({ ...pool.token, balance: "0" });
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [wallet?.publicKey, pool.token]);

  // Refetch pool state when component mounts or pool changes
  useEffect(() => {
    refetchPoolState();
  }, [pool, refetchPoolState]);

  const onAddLiquidity = async () => {
    if (!connected || !wallet?.publicKey) {
      toggleConnectModal();
      return;
    }

    const quDesired = Number(amountA);
    const assetDesired = Number(amountB);
    if (!Number.isFinite(quDesired) || !Number.isFinite(assetDesired) || quDesired <= 0 || assetDesired <= 0) {
      toast.error("Enter valid amounts");
      return;
    }

    await handleAddLiquidity({
      assetIssuer: pool.token.issuer,
      assetName: pool.token.assetName,
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
        assetIssuer: pool.token.issuer,
        assetName: pool.token.assetName,
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
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl bg-muted/30 px-4 py-2 transition-colors hover:bg-muted/50"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Pools
        </button>
        <div className="flex items-center gap-3">
          <img
            src={pool.token.logo}
            alt={pool.token.assetName}
            className="h-10 w-10 rounded-full ring-2 ring-background"
          />
          <div>
            <h2 className="text-2xl font-bold">
              QUBIC / {pool.token.assetName}
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage your liquidity position
            </p>
          </div>
        </div>
      </motion.div>

      {/* Pool Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-effect grid grid-cols-2 gap-4 rounded-xl p-4 sm:grid-cols-4"
      >
        <div>
          <div className="text-xs text-muted-foreground">TVL</div>
          <div className="text-lg font-bold">
            ${pool.tvlUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">QUBIC Reserve</div>
          <div className="text-lg font-bold">
            {pool.reservedQuAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{pool.token.assetName} Reserve</div>
          <div className="text-lg font-bold">
            {pool.reservedAssetAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Your Liquidity</div>
          <div className="text-lg font-bold text-primary-40">
            {poolState?.userLiquidity.toLocaleString(undefined, { maximumFractionDigits: 0 }) || "0"}
          </div>
        </div>
      </motion.div>

      {/* Add/Remove Liquidity Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-effect rounded-3xl p-6 shadow-2xl"
      >
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
              <div className="text-muted-foreground mb-2 text-sm">QUBIC Amount</div>
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
              <div className="text-muted-foreground mb-2 text-sm">{pool.token.assetName} Amount</div>
              <TokenInput
                token={tokenB}
                amount={amountB}
                onAmountChange={setAmountB}
                onTokenClick={() => {}}
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
                    QUBIC per {tokenB.assetName}
                  </span>
                  <span className="font-medium">{(parseFloat(amountA) / parseFloat(amountB)).toFixed(6)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {tokenB.assetName} per QUBIC
                  </span>
                  <span className="font-medium">{(parseFloat(amountB) / parseFloat(amountA)).toFixed(6)}</span>
                </div>
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
                  <img src={tokenB.logo} alt={tokenB.assetName} className="h-8 w-8 rounded-full" />
                  <span className="text-xl font-bold">{tokenB.assetName}</span>
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
                <span className="font-medium">{tokenB.assetName}</span>
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
        )}

        {/* Info Footer */}
        <div className="bg-muted/50 mt-4 flex items-start gap-2 rounded-lg p-3">
          <Info className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
          <p className="text-muted-foreground text-xs">
            {mode === "add"
              ? "By adding liquidity you'll earn 0.3% of all trades on this pair proportional to your share of the pool."
              : "Removing liquidity will return your proportional share of the pool reserves."}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PoolManagement;
