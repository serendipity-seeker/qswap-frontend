import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/custom";
import type { AggregatedAssetBalance } from "@/shared/types";

// Known contract names
const CONTRACT_NAMES: Record<number, string> = {
  1: "QX",
  // 12: "QBAY",
  13: "QSWAP",
  // 14: "NOST",
  // 17: "QBOND",
  // 18: "QIP",
  // 19: "QRAFFLE",
};

const getContractName = (index: number): string => {
  return CONTRACT_NAMES[index] || `Contract ${index}`;
};

interface ContractBalance {
  contractIndex: number;
  name: string;
  amount: number;
}

interface TransferRightsModalProps {
  open: boolean;
  onClose: () => void;
  tokens: AggregatedAssetBalance[];
  getTokenLogo: (asset: AggregatedAssetBalance) => string;
  onTransfer: (
    assetIssuer: string,
    assetName: string,
    numberOfShares: number,
    newManagingContractIndex: number,
  ) => Promise<void>;
  isTransferring: boolean;
}

const TransferRightsModal: React.FC<TransferRightsModalProps> = ({
  open,
  onClose,
  tokens,
  getTokenLogo,
  onTransfer,
  isTransferring,
}) => {
  const [selectedToken, setSelectedToken] = useState<AggregatedAssetBalance | null>(null);
  const [sourceContract, setSourceContract] = useState<number | null>(null);
  const [targetContract, setTargetContract] = useState<number>(13); // Default to QSWAP
  const [amount, setAmount] = useState("");

  const handleClose = () => {
    setSelectedToken(null);
    setSourceContract(null);
    setTargetContract(13);
    setAmount("");
    onClose();
  };

  // Get all contract balances for selected token
  const tokenContractBalances = useMemo((): ContractBalance[] => {
    if (!selectedToken) return [];
    
    const balances: ContractBalance[] = [];
    
    if (selectedToken.qxBalance > 0) {
      balances.push({ contractIndex: 1, name: "QX", amount: selectedToken.qxBalance });
    }
    if (selectedToken.qswapBalance > 0) {
      balances.push({ contractIndex: 13, name: "QSWAP", amount: selectedToken.qswapBalance });
    }
    for (const other of selectedToken.otherBalances) {
      if (other.amount > 0) {
        balances.push({
          contractIndex: other.managingContractIndex,
          name: getContractName(other.managingContractIndex),
          amount: other.amount,
        });
      }
    }
    
    return balances.sort((a, b) => a.contractIndex - b.contractIndex);
  }, [selectedToken]);

  // Get available target contracts (all known contracts except source)
  const availableTargets = useMemo(() => {
    const targets = Object.entries(CONTRACT_NAMES)
      .map(([idx, name]) => ({ contractIndex: parseInt(idx), name }))
      .filter((t) => t.contractIndex !== sourceContract);
    return targets;
  }, [sourceContract]);

  const handleTransfer = async () => {
    if (!selectedToken || sourceContract === null || !amount) return;
    const numAmount = parseInt(amount);
    if (numAmount <= 0) return;

    await onTransfer(selectedToken.issuer, selectedToken.assetName, numAmount, targetContract);
    handleClose();
  };

  const sourceBalance = tokenContractBalances.find((b) => b.contractIndex === sourceContract)?.amount || 0;

  // Filter tokens that have balance
  const tokensWithBalance = tokens.filter((t) => t.totalBalance > 0);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background border-border relative z-10 w-full max-w-md rounded-2xl border p-5 shadow-xl"
          >
            <button
              onClick={handleClose}
              className="hover:bg-muted absolute top-4 right-4 rounded-lg p-1.5"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="mb-1 text-lg font-bold">Transfer Management Rights</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Move token shares between contracts
            </p>

            {/* Token Selection */}
            <div className="mb-4">
              <label className="text-muted-foreground mb-1.5 block text-xs">Select Token</label>
              <div className="max-h-40 space-y-1 overflow-y-auto">
                {tokensWithBalance.length === 0 ? (
                  <div className="text-muted-foreground py-4 text-center text-sm">
                    No tokens with balance
                  </div>
                ) : (
                  tokensWithBalance.map((token) => (
                    <button
                      key={`${token.issuer}-${token.assetName}`}
                      onClick={() => {
                        setSelectedToken(token);
                        setSourceContract(null);
                        setAmount("");
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg p-2 text-left transition-colors ${
                        selectedToken?.assetName === token.assetName
                          ? "bg-primary/20 border-primary border"
                          : "bg-muted/30 hover:bg-muted/50"
                      }`}
                    >
                      <img
                        src={getTokenLogo(token)}
                        alt={token.assetName}
                        className="h-6 w-6 rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/assets/default-coin.svg";
                        }}
                      />
                      <span className="flex-1 text-sm font-medium">{token.assetName}</span>
                      <span className="text-primary text-sm font-bold">
                        {token.totalBalance.toLocaleString()}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {selectedToken && (
              <>
                {/* Source Contract Selection */}
                <div className="mb-4">
                  <label className="text-muted-foreground mb-1.5 block text-xs">From Contract</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {tokenContractBalances.map((bal) => (
                      <button
                        key={bal.contractIndex}
                        onClick={() => {
                          setSourceContract(bal.contractIndex);
                          setAmount("");
                          // Auto-select a different target
                          if (targetContract === bal.contractIndex) {
                            const newTarget = bal.contractIndex === 13 ? 1 : 13;
                            setTargetContract(newTarget);
                          }
                        }}
                        className={`rounded-lg p-2 text-center text-sm transition-all ${
                          sourceContract === bal.contractIndex
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 hover:bg-muted"
                        }`}
                      >
                        <div className="font-medium">{bal.name}</div>
                        <div className="text-xs opacity-70">{bal.amount.toLocaleString()}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {sourceContract !== null && (
                  <>
                    {/* Target Contract Selection */}
                    <div className="mb-4">
                      <label className="text-muted-foreground mb-1.5 block text-xs">To Contract</label>
                      <select
                        value={targetContract}
                        onChange={(e) => setTargetContract(parseInt(e.target.value))}
                        className="bg-muted/50 border-border w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary"
                      >
                        {availableTargets.map((t) => (
                          <option key={t.contractIndex} value={t.contractIndex}>
                            {t.name} (Contract {t.contractIndex})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Amount */}
                    <div className="mb-4">
                      <div className="mb-1.5 flex items-center justify-between">
                        <label className="text-muted-foreground text-xs">Amount</label>
                        <span className="text-muted-foreground text-xs">
                          Available: {sourceBalance.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0"
                          max={sourceBalance}
                          className="bg-muted/50 border-border w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary"
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setAmount(sourceBalance.toString())}
                        >
                          Max
                        </Button>
                      </div>
                    </div>

                    {/* Transfer Summary */}
                    <div className="bg-muted/30 mb-4 flex items-center justify-center gap-2 rounded-lg p-3 text-sm">
                      <span className="font-medium">
                        {tokenContractBalances.find((b) => b.contractIndex === sourceContract)?.name}
                      </span>
                      <ArrowRight className="text-primary h-4 w-4" />
                      <span className="font-medium">{getContractName(targetContract)}</span>
                    </div>

                    {/* Submit */}
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleTransfer}
                      disabled={
                        !amount ||
                        parseInt(amount) <= 0 ||
                        parseInt(amount) > sourceBalance ||
                        isTransferring
                      }
                      fullWidth
                      loading={isTransferring}
                    >
                      Transfer {selectedToken.assetName}
                    </Button>
                  </>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransferRightsModal;
