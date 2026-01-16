import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { History, Loader2, ExternalLink, ArrowUpRight, ArrowDownLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useQubicConnect } from "@/shared/lib/wallet-connect/QubicConnectContext";
import { fetchTxHistory, fetchTickInfo } from "@/shared/services/rpc.service";
import type { TxHistory } from "@/shared/types";

interface TransactionDisplay {
  txId: string;
  tickNumber: number;
  sourceId: string;
  destId: string;
  amount: string;
  timestamp: string;
  moneyFlew: boolean;
  isOutgoing: boolean;
}

const TransactionHistory: React.FC = () => {
  const { wallet, connected } = useQubicConnect();
  const [transactions, setTransactions] = useState<TransactionDisplay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 8;

  useEffect(() => {
    if (!connected || !wallet?.publicKey) {
      setTransactions([]);
      return;
    }

    const loadTransactions = async () => {
      setLoading(true);
      setError(null);

      try {
        const tickInfo = await fetchTickInfo();
        const endTick = tickInfo.tick;
        const startTick = Math.max(tickInfo.initialTick, endTick - 1000);

        const txHistory: TxHistory = await fetchTxHistory(wallet.publicKey, startTick, endTick);

        if (!txHistory?.transactions) {
          setTransactions([]);
          return;
        }

        const allTxs: TransactionDisplay[] = [];
        for (const tickGroup of txHistory.transactions) {
          for (const txWrapper of tickGroup.transactions) {
            const tx = txWrapper.transaction;
            allTxs.push({
              txId: tx.txId,
              tickNumber: tx.tickNumber,
              sourceId: tx.sourceId,
              destId: tx.destId,
              amount: tx.amount,
              timestamp: txWrapper.timestamp,
              moneyFlew: txWrapper.moneyFlew,
              isOutgoing: tx.sourceId === wallet.publicKey,
            });
          }
        }

        allTxs.sort((a, b) => b.tickNumber - a.tickNumber);
        setTransactions(allTxs);
      } catch (err) {
        console.error("Failed to load transactions:", err);
        setError((err as Error).message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [connected, wallet?.publicKey]);

  const shortAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const formatAmount = (amount: string) => {
    const num = parseInt(amount);
    return num.toLocaleString();
  };

  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return timestamp;
    }
  };

  const totalPages = Math.ceil(transactions.length / pageSize);
  const paginatedTxs = transactions.slice(page * pageSize, (page + 1) * pageSize);

  if (!connected || !wallet?.publicKey) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-effect rounded-2xl p-4"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">Transaction History</h2>
        {loading && <Loader2 className="text-primary h-4 w-4 animate-spin" />}
      </div>

      {error ? (
        <div className="py-6 text-center">
          <p className="text-error-40 text-sm">{error}</p>
        </div>
      ) : loading ? (
        <div className="py-8 text-center">
          <Loader2 className="text-primary mx-auto mb-2 h-6 w-6 animate-spin" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-8 text-center">
          <History className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
          <p className="text-muted-foreground text-sm">No transactions found</p>
        </div>
      ) : (
        <>
          {/* Table Header */}
          <div className="text-muted-foreground mb-2 grid grid-cols-12 gap-2 px-2 text-xs">
            <div className="col-span-1"></div>
            <div className="col-span-2">Tick</div>
            <div className="col-span-4">Address</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-1"></div>
          </div>

          <div className="space-y-1">
            {paginatedTxs.map((tx) => (
              <div
                key={tx.txId}
                className="bg-muted/30 hover:bg-muted/50 grid grid-cols-12 items-center gap-2 rounded-lg px-2 py-2 text-sm transition-all"
              >
                {/* Direction Icon */}
                <div className="col-span-1">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                      tx.isOutgoing ? "bg-error-40/20" : "bg-success-40/20"
                    }`}
                  >
                    {tx.isOutgoing ? (
                      <ArrowUpRight className="text-error-40 h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownLeft className="text-success-40 h-3.5 w-3.5" />
                    )}
                  </div>
                </div>

                {/* Tick */}
                <div className="col-span-2">
                  <span className="text-muted-foreground text-xs">#{tx.tickNumber.toLocaleString()}</span>
                  {tx.moneyFlew ? (
                    <span className="bg-success-40/20 text-success-40 ml-1 rounded px-1 py-0.5 text-[10px]">OK</span>
                  ) : (
                    <span className="bg-warning-40/20 text-warning-40 ml-1 rounded px-1 py-0.5 text-[10px]">...</span>
                  )}
                </div>

                {/* Address */}
                <div className="col-span-4 truncate font-mono text-xs">
                  <span className="text-muted-foreground">{tx.isOutgoing ? "To: " : "From: "}</span>
                  {shortAddress(tx.isOutgoing ? tx.destId : tx.sourceId)}
                </div>

                {/* Date */}
                <div className="text-muted-foreground col-span-2 text-xs">
                  {formatDate(tx.timestamp)}
                </div>

                {/* Amount */}
                <div className={`col-span-2 text-right font-bold ${tx.isOutgoing ? "text-error-40" : "text-success-40"}`}>
                  {tx.isOutgoing ? "-" : "+"}
                  {formatAmount(tx.amount)}
                </div>

                {/* Explorer Link */}
                <div className="col-span-1 text-right">
                  <a
                    href={`https://explorer.qubic.org/network/tx/${tx.txId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:bg-muted inline-block rounded p-1 transition-colors"
                    title="View on explorer"
                  >
                    <ExternalLink className="text-muted-foreground h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-3 flex items-center justify-between text-xs">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="hover:bg-muted flex items-center gap-1 rounded px-2 py-1 transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="h-3 w-3" />
                Prev
              </button>
              <span className="text-muted-foreground">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="hover:bg-muted flex items-center gap-1 rounded px-2 py-1 transition-colors disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default TransactionHistory;
