import React from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import type { TokenDisplay } from "@/shared/constants/tokens";

interface TokenInputProps {
  token: TokenDisplay;
  amount: string;
  onAmountChange: (value: string) => void;
  onTokenClick: () => void;
  readOnly?: boolean;
}

const TokenInput: React.FC<TokenInputProps> = ({ token, amount, onAmountChange, onTokenClick, readOnly = false }) => {
  const handleMaxClick = () => {
    onAmountChange(token.balance.replace(/,/g, ""));
  };

  return (
    <div className="bg-muted/30 hover:bg-muted/50 rounded-xl p-3 transition-all duration-300 sm:p-4 md:rounded-2xl">
      <div className="flex items-center justify-between gap-2">
        {/* Token Selector */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onTokenClick}
          className="bg-background hover:bg-muted flex flex-shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 shadow-sm transition-all duration-200 sm:gap-2 sm:rounded-xl sm:px-3 sm:py-2"
        >
          <img src={token.icon} alt={token.symbol} className="h-6 w-6 rounded-full sm:h-7 sm:w-7" />
          <span className="text-base font-bold sm:text-lg">{token.symbol}</span>
          <ChevronDown className="text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
        </motion.button>

        {/* Amount Input */}
        <div className="min-w-0 flex-1 text-right">
          <input
            type="text"
            value={amount}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^\d*\.?\d*$/.test(value)) {
                onAmountChange(value);
              }
            }}
            placeholder="0.00"
            readOnly={readOnly}
            className="placeholder:text-muted-foreground/30 w-full bg-transparent text-right text-2xl font-bold outline-none sm:text-3xl"
          />
        </div>
      </div>

      {/* Balance & USD Value */}
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="text-muted-foreground truncate text-xs sm:text-sm">
          Balance: {token.balance}
          {!readOnly && (
            <button
              onClick={handleMaxClick}
              className="bg-primary-40/20 hover:bg-primary-40/30 text-primary-40 ml-1 rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors sm:ml-2 sm:px-2 sm:text-xs"
            >
              MAX
            </button>
          )}
        </div>
        {amount && parseFloat(amount) > 0 && (
          <div className="text-muted-foreground text-xs whitespace-nowrap sm:text-sm">
            ≈ ${(parseFloat(amount) * 0.15).toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenInput;
