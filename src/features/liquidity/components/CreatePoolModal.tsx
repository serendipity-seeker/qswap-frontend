import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/custom";
import { useCreatePool } from "@/core/hooks/pool/useCreatePool";
import { useQubicConnect } from "@/shared/lib/wallet-connect/QubicConnectContext";
import { toast } from "sonner";
import type { Token } from "@/shared/constants/tokens";
import { getPoolBasicState } from "@/shared/services/sc.service";

interface CreatePoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  availableTokens: Token[];
}

const CreatePoolModal: React.FC<CreatePoolModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  availableTokens,
}) => {
  const { connected, toggleConnectModal } = useQubicConnect();
  const { handleCreatePool } = useCreatePool();
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [poolExists, setPoolExists] = useState(false);

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

  const filteredTokens = availableTokens.filter(
    (token) =>
      token.assetName !== "QUBIC" &&
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

    const success = await handleCreatePool({
      assetIssuer: selectedToken.issuer,
      assetName: selectedToken.assetName,
    });

    if (success) {
      onClose();
      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000); // Wait for pool to be indexed
      }
    }
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
                    Select a token to create a QUBIC/Token pool
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 transition-colors hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

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
                {filteredTokens.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <p>No tokens found</p>
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
                      />
                      <div className="flex-1 text-left">
                        <div className="font-bold">{token.assetName}</div>
                        <div className="text-xs text-muted-foreground">
                          {token.issuer.slice(0, 15)}...
                        </div>
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
