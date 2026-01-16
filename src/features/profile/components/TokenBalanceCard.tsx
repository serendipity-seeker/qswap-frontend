import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { AggregatedAssetBalance } from "@/shared/types";

interface TokenBalanceCardProps {
  asset: AggregatedAssetBalance;
  logo: string;
}

// Known contract names
const CONTRACT_NAMES: Record<number, string> = {
  1: "QX",
  12: "QBAY",
  13: "QSWAP",
  14: "NOST",
  17: "QBOND",
  18: "QIP",
  19: "QRAFFLE",
};
const getContractName = (index: number): string => {
  return CONTRACT_NAMES[index] || `Contract ${index}`;
};

const TokenBalanceCard: React.FC<TokenBalanceCardProps> = ({ asset, logo }) => {
  const [expanded, setExpanded] = useState(false);

  const shortIssuer = (issuer: string) => {
    if (issuer.length <= 20) return issuer;
    return `${issuer.slice(0, 8)}...${issuer.slice(-8)}`;
  };

  // Build all contract balances list
  const allBalances: { contractIndex: number; name: string; amount: number }[] = [];
  
  if (asset.qxBalance > 0) {
    allBalances.push({ contractIndex: 1, name: "QX", amount: asset.qxBalance });
  }
  if (asset.qswapBalance > 0) {
    allBalances.push({ contractIndex: 13, name: "QSWAP", amount: asset.qswapBalance });
  }
  for (const other of asset.otherBalances) {
    if (other.amount > 0) {
      allBalances.push({
        contractIndex: other.managingContractIndex,
        name: getContractName(other.managingContractIndex),
        amount: other.amount,
      });
    }
  }

  // Sort by contract index
  allBalances.sort((a, b) => a.contractIndex - b.contractIndex);

  return (
    <div className="bg-muted/20 hover:bg-muted/30 overflow-hidden rounded-lg transition-colors">
      {/* Main Row - Clickable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
      >
        {/* Icon */}
        <img
          src={logo}
          alt={asset.assetName}
          className="h-8 w-8 shrink-0 rounded-full"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/assets/default-coin.svg";
          }}
        />

        {/* Token Info */}
        <div className="min-w-0 flex-1">
          <div className="truncate text-base font-bold sm:text-lg">{asset.assetName}</div>
          <div className="text-muted-foreground truncate font-mono text-xs leading-tight">
            {shortIssuer(asset.issuer)}
          </div>
        </div>

        {/* Total Balance */}
        <div className="text-right">
          <div className="text-primary text-base font-bold tabular-nums sm:text-lg">
            {asset.totalBalance.toLocaleString()}
          </div>
          <div className="text-muted-foreground text-xs">
            {allBalances.length} contract{allBalances.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`text-muted-foreground h-4 w-4 shrink-0 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-border/50 space-y-1 border-t px-3 py-2">
              {allBalances.map((bal) => (
                <div
                  key={bal.contractIndex}
                  className="bg-muted/30 flex items-center justify-between rounded-lg px-3 py-2"
                >
                  <div>
                    <span className="text-base font-medium">{getContractName(bal.contractIndex)}</span>
                  </div>
                  <div className="text-base font-semibold tabular-nums">
                    {bal.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TokenBalanceCard;
