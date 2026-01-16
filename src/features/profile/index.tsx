import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Coins, TrendingUp, Loader2, ArrowLeftRight } from "lucide-react";
import { SEO, Button } from "@/shared/components/custom";
import { useQubicConnect } from "@/shared/lib/wallet-connect/QubicConnectContext";
import { fetchAggregatedAssetsBalance } from "@/shared/services/rpc.service";
import { useTransferManagementRights, useUserPositions } from "@/core/hooks";
import { QUBIC_TOKEN } from "@/core/constants/tokens";
import type { AggregatedAssetBalance } from "@/shared/types";
import { WalletHeader, TokenBalanceCard, TransactionHistory, TransferRightsModal } from "./components";

const LOGO_BASE_URL = import.meta.env.VITE_LOGO_BASE_URL;

const Profile: React.FC = () => {
  const { wallet, connected } = useQubicConnect();
  const { handleTransferManagementRights } = useTransferManagementRights();
  const { positions, loading: positionsLoading } = useUserPositions();

  const [tokenBalances, setTokenBalances] = useState<AggregatedAssetBalance[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const loadTokenBalances = useCallback(async () => {
    if (!connected || !wallet?.publicKey) {
      setTokenBalances([]);
      return;
    }

    setLoadingTokens(true);
    try {
      const balances = await fetchAggregatedAssetsBalance(wallet.publicKey);
      setTokenBalances(balances);
    } catch (error) {
      console.error("Failed to load token balances:", error);
    } finally {
      setLoadingTokens(false);
    }
  }, [connected, wallet?.publicKey]);

  useEffect(() => {
    loadTokenBalances();
  }, [loadTokenBalances]);

  const handleTransfer = async (
    assetIssuer: string,
    assetName: string,
    numberOfShares: number,
    newManagingContractIndex: number,
  ) => {
    setIsTransferring(true);
    try {
      await handleTransferManagementRights({
        assetIssuer,
        assetName,
        numberOfShares,
        newManagingContractIndex,
        fallback: async () => {
          await loadTokenBalances();
        },
      });
    } finally {
      setIsTransferring(false);
    }
  };

  const getTokenLogo = (asset: AggregatedAssetBalance) => {
    return `${LOGO_BASE_URL}/asset_${asset.assetName}-${asset.issuer}_logo_dark.png`;
  };

  return (
    <>
      <SEO
        title="Wallet Profile"
        description="View your wallet balance, token holdings, and transaction history on QSWAP"
        keywords="QSWAP, wallet, profile, balance, tokens, Qubic"
        canonical="https://qubicportal.org/profile"
      />
      <div className="min-h-screen px-3 pt-24 pb-12 sm:px-4 md:px-6 md:pt-28">
        <div className="mx-auto max-w-6xl space-y-4">
          {/* Wallet Header with Balance */}
          <WalletHeader />

          {connected && wallet?.publicKey && (
            <>
              {/* Two Column Layout: Token Balances & QSWAP Positions */}
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Token Balances Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-effect rounded-2xl p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-xl font-bold sm:text-2xl">Token Balances</h2>
                    <div className="flex items-center gap-2">
                      {loadingTokens && <Loader2 className="text-primary h-4 w-4 animate-spin" />}
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<ArrowLeftRight className="h-3.5 w-3.5" />}
                        onClick={() => setShowTransferModal(true)}
                      >
                        Transfer
                      </Button>
                    </div>
                  </div>

                  {(() => {
                    const tokensWithBalance = tokenBalances.filter((t) => t.totalBalance > 0);
                    
                    if (loadingTokens) {
                      return (
                        <div className="py-8 text-center">
                          <Loader2 className="text-primary mx-auto mb-2 h-6 w-6 animate-spin" />
                          <p className="text-muted-foreground text-base">Loading...</p>
                        </div>
                      );
                    }
                    
                    if (tokensWithBalance.length === 0) {
                      return (
                        <div className="py-8 text-center">
                          <Coins className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                          <p className="text-muted-foreground text-base">No tokens found</p>
                        </div>
                      );
                    }
                    
                    return (
                      <div className="space-y-1">
                        {tokensWithBalance.map((asset) => (
                          <TokenBalanceCard
                            key={`${asset.issuer}-${asset.assetName}`}
                            asset={asset}
                            logo={getTokenLogo(asset)}
                          />
                        ))}
                      </div>
                    );
                  })()}

                  <p className="text-muted-foreground mt-3 text-sm">
                    Click a token to see contract breakdown
                  </p>
                </motion.div>

                {/* QSWAP Positions Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="glass-effect rounded-2xl p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-xl font-bold sm:text-2xl">QSWAP Positions</h2>
                    {positionsLoading ? (
                      <Loader2 className="text-primary h-4 w-4 animate-spin" />
                    ) : (
                      <span className="bg-success-40/20 text-success-40 rounded-full px-2.5 py-1 text-sm font-medium">
                        {positions.length} Active
                      </span>
                    )}
                  </div>

                  {positionsLoading ? (
                    <div className="py-8 text-center">
                      <Loader2 className="text-primary mx-auto mb-2 h-6 w-6 animate-spin" />
                      <p className="text-muted-foreground text-base">Loading...</p>
                    </div>
                  ) : positions.length === 0 ? (
                    <div className="py-8 text-center">
                      <TrendingUp className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                      <p className="text-muted-foreground text-base">No liquidity positions</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {positions.map((position) => (
                        <div
                          key={`${position.token.assetName}-QUBIC`}
                          className="bg-muted/30 hover:bg-muted/50 rounded-xl p-3 transition-all"
                        >
                          {/* Pool Pair */}
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center -space-x-1.5">
                                <img
                                  src={position.token.logo}
                                  alt={position.token.assetName}
                                  className="border-background h-6 w-6 rounded-full border"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/assets/default-coin.svg";
                                  }}
                                />
                                <img
                                  src={QUBIC_TOKEN.logo}
                                  alt="QUBIC"
                                  className="border-background h-6 w-6 rounded-full border"
                                />
                              </div>
                              <span className="font-bold">{position.token.assetName}/QUBIC</span>
                            </div>
                            <span className="text-muted-foreground text-xs">
                              {position.share.toFixed(2)}% share
                            </span>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-4 gap-2 text-xs">
                            <div>
                              <div className="text-muted-foreground">Liquidity</div>
                              <div className="font-medium">{position.liquidity.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Value</div>
                              <div className="text-primary font-medium">${position.valueUSD.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">QUBIC</div>
                              <div className="font-medium">{position.quAmount.toFixed(0)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">{position.token.assetName}</div>
                              <div className="font-medium">{position.assetAmount.toFixed(0)}</div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Summary */}
                      <div className="border-border flex justify-between border-t pt-2 text-base">
                        <span className="text-muted-foreground">Total Value</span>
                        <span className="text-primary font-bold">
                          ${positions.reduce((sum, pos) => sum + pos.valueUSD, 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Transaction History - Full Width */}
              <TransactionHistory />
            </>
          )}
        </div>
      </div>

      {/* Transfer Rights Modal */}
      <TransferRightsModal
        open={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        tokens={tokenBalances}
        getTokenLogo={getTokenLogo}
        onTransfer={handleTransfer}
        isTransferring={isTransferring}
      />
    </>
  );
};

export default Profile;
