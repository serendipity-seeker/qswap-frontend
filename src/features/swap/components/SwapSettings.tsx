import React from "react";
import { motion } from "framer-motion";

interface SwapSettingsProps {
  slippage: string;
  onSlippageChange: (value: string) => void;
}

const SwapSettings: React.FC<SwapSettingsProps> = ({ slippage, onSlippageChange }) => {
  const presetSlippages = ["0.1", "0.5", "1.0"];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-muted/30 mb-4 rounded-xl p-4"
    >
      <div className="mb-3">
        <div className="mb-2 text-sm font-medium">Slippage Tolerance</div>
        <div className="flex gap-2">
          {presetSlippages.map((preset) => (
            <button
              key={preset}
              onClick={() => onSlippageChange(preset)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                slippage === preset ? "bg-primary-40 text-white" : "bg-background hover:bg-muted"
              }`}
            >
              {preset}%
            </button>
          ))}
          <div className="relative flex-1">
            <input
              type="text"
              value={slippage}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^\d*\.?\d*$/.test(value)) {
                  onSlippageChange(value);
                }
              }}
              className="bg-background focus:ring-primary-40 w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-2"
              placeholder="Custom"
            />
            <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm">%</span>
          </div>
        </div>
      </div>

      <div className="text-muted-foreground text-xs">
        Your transaction will revert if the price changes unfavorably by more than this percentage.
      </div>
    </motion.div>
  );
};

export default SwapSettings;
