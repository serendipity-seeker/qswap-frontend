import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Wallet, ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/shared/components/custom";
import { useQubicConnect } from "@/shared/lib/wallet-connect/QubicConnectContext";
import { fetchBalance } from "@/shared/services/rpc.service";
import { fetchQubicPrice } from "@/shared/services/price.service";

const WalletHeader: React.FC = () => {
  const { wallet, connected, disconnect } = useQubicConnect();
  const [balance, setBalance] = useState<number>(0);
  const [usdValue, setUsdValue] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!connected || !wallet?.publicKey) {
      setBalance(0);
      setUsdValue(0);
      return;
    }

    const loadBalanceAndPrice = async () => {
      setLoading(true);
      try {
        const [balanceData, price] = await Promise.all([
          fetchBalance(wallet.publicKey),
          fetchQubicPrice(),
        ]);
        const bal = Number(balanceData.balance || 0);
        setBalance(bal);
        setUsdValue(bal * price);
      } catch (error) {
        console.error("Failed to load balance:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBalanceAndPrice();
  }, [connected, wallet?.publicKey]);

  const copyAddress = async () => {
    if (!wallet?.publicKey) return;
    await navigator.clipboard.writeText(wallet.publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortAddress = (address: string) => {
    if (address.length <= 20) return address;
    return `${address.slice(0, 10)}...${address.slice(-10)}`;
  };

  if (!connected || !wallet?.publicKey) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-6 text-center"
      >
        <Wallet className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
        <h2 className="text-xl font-bold">Connect Your Wallet</h2>
        <p className="text-muted-foreground mt-2">
          Connect your wallet to view your profile and balances
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Wallet Address */}
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
            <Wallet className="text-primary h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-medium">
                {shortAddress(wallet.publicKey)}
              </span>
              <button
                onClick={copyAddress}
                className="hover:bg-muted rounded p-1 transition-colors"
                title="Copy address"
              >
                {copied ? (
                  <Check className="text-success-40 h-3.5 w-3.5" />
                ) : (
                  <Copy className="text-muted-foreground h-3.5 w-3.5" />
                )}
              </button>
              <a
                href={`https://explorer.qubic.org/network/address/${wallet.publicKey}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-muted rounded p-1 transition-colors"
                title="View on explorer"
              >
                <ExternalLink className="text-muted-foreground h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* QUBIC Balance */}
        <div className="flex items-center gap-6">
          {loading ? (
            <div className="bg-muted h-6 w-24 animate-pulse rounded" />
          ) : (
            <div className="text-right">
              <div className="text-primary text-xl font-bold sm:text-2xl">
                {balance.toLocaleString()} <span className="text-muted-foreground text-base font-normal">QUBIC</span>
              </div>
              <div className="text-muted-foreground text-sm">
                ${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </div>
            </div>
          )}

          {/* Disconnect Button */}
          <Button
            variant="ghost"
            size="sm"
            icon={<LogOut className="h-4 w-4" />}
            onClick={disconnect}
          >
            Disconnect
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default WalletHeader;
