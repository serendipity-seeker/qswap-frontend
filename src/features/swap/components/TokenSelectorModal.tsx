import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, TrendingUp } from "lucide-react";

interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance: string;
}

interface TokenSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: Token[];
  onSelectToken: (token: Token) => void;
  selectedToken: Token;
}

const TokenSelectorModal: React.FC<TokenSelectorModalProps> = ({
  isOpen,
  onClose,
  tokens,
  onSelectToken,
  selectedToken,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[var(--z-modal)]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[var(--z-modal)]"
          >
            <div className="glass-effect rounded-3xl shadow-2xl overflow-hidden m-4">
              {/* Header */}
              <div className="p-6 border-b border-border">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Select a token</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name or paste address"
                    className="w-full pl-10 pr-4 py-3 bg-muted/50 rounded-xl outline-none focus:ring-2 focus:ring-primary-40 transition-all"
                  />
                </div>
              </div>

              {/* Popular Tokens */}
              <div className="px-6 py-3 border-b border-border">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-medium">Popular tokens</span>
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {tokens.slice(0, 4).map((token) => (
                    <button
                      key={token.symbol}
                      onClick={() => onSelectToken(token)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 hover:bg-muted rounded-full transition-colors whitespace-nowrap"
                    >
                      <img src={token.icon} alt={token.symbol} className="w-5 h-5 rounded-full" />
                      <span className="text-sm font-medium">{token.symbol}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Token List */}
              <div className="max-h-[400px] overflow-y-auto">
                {filteredTokens.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No tokens found
                  </div>
                ) : (
                  filteredTokens.map((token, index) => (
                    <motion.button
                      key={token.symbol}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => onSelectToken(token)}
                      className={`w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-all ${
                        selectedToken.symbol === token.symbol ? "bg-primary-40/10" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={token.icon}
                            alt={token.symbol}
                            className="w-10 h-10 rounded-full"
                          />
                          {selectedToken.symbol === token.symbol && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-40 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                        <div className="text-left">
                          <div className="font-bold">{token.symbol}</div>
                          <div className="text-sm text-muted-foreground">{token.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{token.balance}</div>
                        <div className="text-sm text-muted-foreground">
                          ${(parseFloat(token.balance.replace(/,/g, "")) * 0.15).toFixed(2)}
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

