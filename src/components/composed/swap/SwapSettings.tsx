import React from "react";
import { motion } from "framer-motion";

interface SwapSettingsProps {
  slippage: string;
  onSlippageChange: (value: string) => void;
}

const SwapSettings: React.FC<SwapSettingsProps> = ({
  slippage,
  onSlippageChange,
}) => {
  const presetSlippages = ["0.1", "0.5", "1.0"];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-4 p-4 bg-muted/30 rounded-xl"
    >
      <div className="mb-3">
        <div className="text-sm font-medium mb-2">Slippage Tolerance</div>
        <div className="flex gap-2">
          {presetSlippages.map((preset) => (
            <button
              key={preset}
              onClick={() => onSlippageChange(preset)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                slippage === preset
                  ? "bg-primary-40 text-white"
                  : "bg-background hover:bg-muted"
              }`}
            >
              {preset}%
            </button>
          ))}
          <div className="flex-1 relative">
            <input
              type="text"
              value={slippage}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^\d*\.?\d*$/.test(value)) {
                  onSlippageChange(value);
                }
              }}
              className="w-full py-2 px-3 bg-background rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-40"
              placeholder="Custom"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Your transaction will revert if the price changes unfavorably by more than this percentage.
      </div>
    </motion.div>
  );
};

export default SwapSettings;

