import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, TrendingUp } from "lucide-react";
import type { TokenDisplay } from "@/shared/constants/tokens";
import { fetchQubicPrice } from "@/shared/services/price.service";
import { isQubic } from "@/shared/constants/tokens";

interface TokenSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: TokenDisplay[];
  onSelectToken: (token: TokenDisplay) => void;
  selectedToken: TokenDisplay;
}

const TokenSelectorModal: React.FC<TokenSelectorModalProps> = ({
  isOpen,
  onClose,
  tokens,
  onSelectToken,
  selectedToken,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [qubicPrice, setQubicPrice] = useState<number>(0.15);

  useEffect(() => {
    const loadPrice = async () => {
      const price = await fetchQubicPrice();
      setQubicPrice(price);
    };
    loadPrice();
  }, []);

  const filteredTokens = tokens.filter(
    (token) =>
      token.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.issuer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
            className="fixed inset-0 z-[var(--z-modal)] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 z-[var(--z-modal)] w-full max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <div className="glass-effect m-4 overflow-hidden rounded-3xl shadow-2xl bg-background text-foreground">
              {/* Header */}
              <div className="border-border border-b p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Select a token</h2>
                  <button onClick={onClose} className="hover:bg-muted rounded-lg p-2 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name or paste address"
                    className="bg-muted/50 text-foreground focus:ring-primary-40 w-full rounded-xl py-3 pr-4 pl-10 transition-all outline-none focus:ring-2 placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Popular Tokens */}
              <div className="border-border border-b px-6 py-3">
                <div className="mb-2 flex items-center gap-2">
                  <TrendingUp className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground text-sm font-medium">Popular tokens</span>
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {tokens.slice(0, 4).map((token) => (
                    <button
                      key={token.assetName}
                      onClick={() => onSelectToken(token)}
                      className="bg-muted/50 hover:bg-muted flex items-center gap-2 rounded-full px-3 py-1.5 whitespace-nowrap transition-colors"
                    >
                      <img src={token.logo} alt={token.assetName} className="h-5 w-5 rounded-full" />
                      <span className="text-sm font-medium">{token.assetName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Token List */}
              <div className="max-h-[400px] overflow-y-auto">
                {filteredTokens.length === 0 ? (
                  <div className="text-muted-foreground p-8 text-center">No tokens found</div>
                ) : (
                  filteredTokens.map((token, index) => (
                    <motion.button
                      key={token.assetName}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => onSelectToken(token)}
                      className={`hover:bg-muted/50 flex w-full items-center justify-between p-4 transition-all text-foreground ${
                        selectedToken.assetName === token.assetName ? "bg-primary-40/10" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={token.logo} alt={token.assetName} className="h-10 w-10 rounded-full" />
                          {selectedToken.assetName === token.assetName && (
                            <div className="bg-primary-40 absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full">
                              <div className="h-2 w-2 rounded-full bg-white"></div>
                            </div>
                          )}
                        </div>
                        <div className="text-left">
                          <div className="font-bold">{token.assetName}</div>
                          <div className="text-muted-foreground text-sm">{token.issuer}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{token.balance}</div>
                        <div className="text-muted-foreground text-sm">
                          {isQubic(token) ? (
                            <>${(parseFloat(token.balance.replace(/,/g, "")) * qubicPrice).toFixed(2)}</>
                          ) : (
                            <>${(parseFloat(token.balance.replace(/,/g, "")) * qubicPrice).toFixed(2)}</>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TokenSelectorModal;
