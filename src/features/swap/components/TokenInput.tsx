import React from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance: string;
}

interface TokenInputProps {
  token: Token;
  amount: string;
  onAmountChange: (value: string) => void;
  onTokenClick: () => void;
  readOnly?: boolean;
}

const TokenInput: React.FC<TokenInputProps> = ({
  token,
  amount,
  onAmountChange,
  onTokenClick,
  readOnly = false,
}) => {
  const handleMaxClick = () => {
    onAmountChange(token.balance.replace(/,/g, ""));
  };

  return (
    <div className="bg-muted/30 hover:bg-muted/50 rounded-2xl p-4 transition-all duration-300">
      <div className="flex justify-between items-center">
        {/* Token Selector */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onTokenClick}
          className="flex items-center gap-2 px-3 py-2 bg-background hover:bg-muted rounded-xl transition-all duration-200 shadow-sm"
        >
          <img src={token.icon} alt={token.symbol} className="w-7 h-7 rounded-full" />
          <span className="font-bold text-lg">{token.symbol}</span>
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.button>

        {/* Amount Input */}
        <div className="flex-1 text-right">
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
            className="bg-transparent text-right text-3xl font-bold w-full outline-none placeholder:text-muted-foreground/30"
          />
        </div>
      </div>

      {/* Balance & USD Value */}
      <div className="flex justify-between items-center mt-2">
        <div className="text-sm text-muted-foreground">
          Balance: {token.balance}
          {!readOnly && (
            <button
              onClick={handleMaxClick}
              className="ml-2 px-2 py-0.5 bg-primary-40/20 hover:bg-primary-40/30 text-primary-40 rounded text-xs font-medium transition-colors"
            >
              MAX
            </button>
          )}
        </div>
        {amount && parseFloat(amount) > 0 && (
          <div className="text-sm text-muted-foreground">
            ≈ ${(parseFloat(amount) * 0.15).toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenInput;

