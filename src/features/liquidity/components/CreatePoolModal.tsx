import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, AlertCircle, Loader2, Wallet } from "lucide-react";
import { Button } from "@/shared/components/custom";
import { useCreatePool } from "@/core/hooks";
import { useQubicConnect } from "@/shared/lib/wallet-connect/QubicConnectContext";
import { toast } from "sonner";
import { getPoolBasicState } from "@/core/services/sc.service";
import { fetchAggregatedAssetsBalance } from "@/shared/services/rpc.service";

interface TokenWithBalance {
  assetName: string;
  issuer: string;
  balance: number;
  logo: string;
}

interface CreatePoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreatePoolModal: React.FC<CreatePoolModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { connected, toggleConnectModal, wallet } = useQubicConnect();
  const { handleCreatePool } = useCreatePool();
  const [selectedToken, setSelectedToken] = useState<TokenWithBalance | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [poolExists, setPoolExists] = useState(false);
  const [userTokens, setUserTokens] = useState<TokenWithBalance[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(false);

  const LOGO_BASE_URL = import.meta.env.VITE_LOGO_BASE_URL;

  // Fetch user's owned tokens when modal opens
  useEffect(() => {
    if (!isOpen || !wallet?.publicKey) {
      setUserTokens([]);
      return;
    }

    const fetchUserTokens = async () => {
      setLoadingTokens(true);
      try {
        const aggregatedBalances = await fetchAggregatedAssetsBalance(wallet.publicKey);
        
        // Filter out QUBIC and map to TokenWithBalance
        const tokens: TokenWithBalance[] = aggregatedBalances
          .filter((asset) => asset.assetName !== "QUBIC" && asset.totalBalance > 0)
          .map((asset) => ({
            assetName: asset.assetName,
            issuer: asset.issuer,
            balance: asset.totalBalance,
            logo: `${LOGO_BASE_URL}/asset_${asset.assetName}-${asset.issuer}_logo_dark.png`,
          }));

        setUserTokens(tokens);
      } catch (error) {
        console.error("Error fetching user tokens:", error);
        toast.error("Failed to load your tokens");
        setUserTokens([]);
      } finally {
        setLoadingTokens(false);
      }
    };

    fetchUserTokens();
  }, [isOpen, wallet?.publicKey, LOGO_BASE_URL]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedToken(null);
      setSearchTerm("");
      setPoolExists(false);
    }
  }, [isOpen]);

  // Check if pool exists when token is selected
  useEffect(() => {
    if (!selectedToken) {
      setPoolExists(false);
      return;
    }

    const checkPool = async () => {
      setIsChecking(true);
      try {
        const poolState = await getPoolBasicState({
          assetIssuer: selectedToken.issuer,
          assetName: selectedToken.assetName,
        });
        setPoolExists(poolState && poolState.poolExists !== 0);
      } catch (error) {
        console.error("Error checking pool:", error);
        setPoolExists(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkPool();
  }, [selectedToken]);

  const filteredTokens = userTokens.filter((token) =>
    token.assetName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async () => {
    if (!connected) {
      toggleConnectModal();
      return;
    }

    if (!selectedToken) {
      toast.error("Please select a token");
      return;
    }

    if (poolExists) {
      toast.error("Pool already exists for this token");
      return;
    }

    await handleCreatePool({
      assetIssuer: selectedToken.issuer,
      assetName: selectedToken.assetName,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-effect relative w-full max-w-lg rounded-3xl p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Create New Pool</h2>
                  <p className="text-sm text-muted-foreground">
                    Select a token from your wallet to create a QUBIC/Token pool
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 transition-colors hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Wallet Info */}
              {connected && wallet?.publicKey && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-muted/30 px-4 py-2">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {wallet.publicKey.slice(0, 10)}...{wallet.publicKey.slice(-10)}
                  </span>
                  <span className="ml-auto text-sm font-medium text-primary-40">
                    {userTokens.length} {userTokens.length === 1 ? "token" : "tokens"}
                  </span>
                </div>
              )}

              {/* Search Bar */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search tokens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl bg-muted/30 px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-primary-40"
                />
              </div>

              {/* Selected Token Display */}
              {selectedToken && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-4 rounded-xl bg-muted/30 p-4"
                >
                  <div className="mb-2 text-xs text-muted-foreground">
                    Selected Token
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedToken.logo}
                        alt={selectedToken.assetName}
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <div className="font-bold">
                          QUBIC / {selectedToken.assetName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {selectedToken.issuer.slice(0, 10)}...
                        </div>
                      </div>
                    </div>
                    {isChecking ? (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    ) : poolExists ? (
                      <div className="flex items-center gap-2 text-warning-40">
                        <AlertCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Exists</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-success-40">
                        <Plus className="h-5 w-5" />
                        <span className="text-sm font-medium">Available</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Token List */}
              <div className="mb-6 max-h-[400px] space-y-2 overflow-y-auto">
                {loadingTokens ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-40" />
                  </div>
                ) : !connected ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <Wallet className="mx-auto mb-3 h-12 w-12 opacity-50" />
                    <p className="font-semibold">Connect your wallet</p>
                    <p className="mt-2 text-sm">
                      to see your tokens and create pools
                    </p>
                  </div>
                ) : filteredTokens.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    {searchTerm ? (
                      <>
                        <p>No tokens found matching "{searchTerm}"</p>
                        <p className="mt-2 text-sm">Try a different search term</p>
                      </>
                    ) : (
                      <>
                        <Wallet className="mx-auto mb-3 h-12 w-12 opacity-50" />
                        <p className="font-semibold">No tokens in your wallet</p>
                        <p className="mt-2 text-sm">
                          You need to own tokens to create pools
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  filteredTokens.map((token) => (
                    <motion.button
                      key={`${token.issuer}-${token.assetName}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedToken(token)}
                      className={`flex w-full items-center gap-3 rounded-xl p-3 transition-all ${
                        selectedToken?.assetName === token.assetName
                          ? "bg-primary-40/20 ring-2 ring-primary-40"
                          : "bg-muted/30 hover:bg-muted/50"
                      }`}
                    >
                      <img
                        src={token.logo}
                        alt={token.assetName}
                        className="h-10 w-10 rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/40";
                        }}
                      />
                      <div className="flex-1 text-left">
                        <div className="font-bold">{token.assetName}</div>
                        <div className="text-xs text-muted-foreground">
                          {token.issuer.slice(0, 15)}...
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          {token.balance.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Balance</div>
                      </div>
                    </motion.button>
                  ))
                )}
              </div>

              {/* Info Message */}
              <div className="mb-4 flex items-start gap-2 rounded-lg bg-muted/50 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Creating a pool requires a pool creation fee. Once created,
                  you'll need to add initial liquidity to activate the pool.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={onClose}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleCreate}
                  disabled={!selectedToken || poolExists || isChecking}
                  fullWidth
                >
                  {!connected
                    ? "Connect Wallet"
                    : !selectedToken
                    ? "Select Token"
                    : poolExists
                    ? "Pool Exists"
                    : "Create Pool"}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreatePoolModal;
