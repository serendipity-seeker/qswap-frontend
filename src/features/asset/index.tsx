import React, { useState } from "react";
import { motion } from "framer-motion";
import { Coins, Plus, ArrowRightLeft, Info } from "lucide-react";
import { Button, SEO } from "@/shared/components/custom";
import { useIssueAsset, useCreatePool, useTransferManagementRights } from "@/core/hooks";
import { useQubicConnect } from "@/shared/lib/wallet-connect/QubicConnectContext";
import { valueOfAssetName } from "@/shared/utils/base.utils";

const AssetManagement: React.FC = () => {
  const { connected } = useQubicConnect();
  const { handleIssueAsset } = useIssueAsset();
  const { handleCreatePool } = useCreatePool();
  const { handleTransferManagementRights } = useTransferManagementRights();

  const [activeTab, setActiveTab] = useState<"issue" | "pool" | "transfer">("issue");

  // Issue Asset Form
  const [assetName, setAssetName] = useState("");
  const [numberOfShares, setNumberOfShares] = useState("");
  const [unitOfMeasurement, setUnitOfMeasurement] = useState("");
  const [numberOfDecimalPlaces, setNumberOfDecimalPlaces] = useState("0");

  // Create Pool Form
  const [poolAssetIssuer, setPoolAssetIssuer] = useState("");
  const [poolAssetName, setPoolAssetName] = useState("");

  // Transfer Management Rights Form
  const [transferAssetIssuer, setTransferAssetIssuer] = useState("");
  const [transferAssetName, setTransferAssetName] = useState("");
  const [transferShares, setTransferShares] = useState("");
  const [newContractIndex, setNewContractIndex] = useState("");

  const onIssueAsset = async () => {
    if (!assetName || !numberOfShares || !unitOfMeasurement) {
      return;
    }

    const assetNameValue = valueOfAssetName(assetName.toUpperCase());
    if (assetNameValue === 0n) {
      alert("Invalid asset name. Must be 1-7 uppercase letters.");
      return;
    }

    await handleIssueAsset({
      assetName: assetNameValue,
      numberOfShares: parseInt(numberOfShares),
      unitOfMeasurement: parseInt(unitOfMeasurement),
      numberOfDecimalPlaces: parseInt(numberOfDecimalPlaces),
    });
  };

  const onCreatePool = async () => {
    if (!poolAssetIssuer || !poolAssetName) {
      return;
    }

    const assetNameValue = valueOfAssetName(poolAssetName.toUpperCase());
    if (assetNameValue === 0n) {
      alert("Invalid asset name. Must be 1-7 uppercase letters.");
      return;
    }

    await handleCreatePool({
      assetIssuer: poolAssetIssuer,
      assetName: assetNameValue,
    });
  };

  const onTransferManagementRights = async () => {
    if (!transferAssetIssuer || !transferAssetName || !transferShares || !newContractIndex) {
      return;
    }

    const assetNameValue = valueOfAssetName(transferAssetName.toUpperCase());
    if (assetNameValue === 0n) {
      alert("Invalid asset name. Must be 1-7 uppercase letters.");
      return;
    }

    await handleTransferManagementRights({
      assetIssuer: transferAssetIssuer,
      assetName: assetNameValue,
      numberOfShares: parseInt(transferShares),
      newManagingContractIndex: parseInt(newContractIndex),
      fallback: async () => {
        // Reset form after successful transfer
        setTransferAssetIssuer("");
        setTransferAssetName("");
        setTransferShares("");
        setNewContractIndex("");
        console.log("Transfer completed successfully, form reset");
      },
    });
  };

  return (
    <>
      <SEO
        title="Asset Management"
        description="Issue assets, create pools, and manage asset rights on QSWAP"
        keywords="QSWAP, asset issuance, create pool, management rights, Qubic assets"
        canonical="https://qubicportal.org/asset"
      />
      <div className="min-h-screen px-3 pt-28 pb-12 sm:px-4 md:px-6 md:pt-32">
        {/* Background decorations */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="bg-primary-40/20 animate-float absolute top-1/4 -left-48 h-96 w-96 rounded-full blur-[120px]"></div>
          <div
            className="bg-primary-60/20 animate-float absolute -right-48 bottom-1/4 h-96 w-96 rounded-full blur-[120px]"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative z-10 mx-auto max-w-[800px]">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center md:mb-10"
          >
            <h1 className="text-primary mb-4 text-5xl font-black">Asset Management</h1>
            <p className="text-muted-foreground text-xl">Issue assets, create pools, and manage rights</p>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-2xl p-4 shadow-2xl sm:p-5 md:rounded-3xl md:p-6"
          >
            {/* Tab Selector */}
            <div className="mb-6 flex gap-2">
              <button
                onClick={() => setActiveTab("issue")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-bold transition-all ${
                  activeTab === "issue"
                    ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                    : "bg-muted/30 hover:bg-muted/50"
                }`}
              >
                <Coins className="h-5 w-5" />
                Issue Asset
              </button>
              <button
                onClick={() => setActiveTab("pool")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-bold transition-all ${
                  activeTab === "pool"
                    ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                    : "bg-muted/30 hover:bg-muted/50"
                }`}
              >
                <Plus className="h-5 w-5" />
                Create Pool
              </button>
              <button
                onClick={() => setActiveTab("transfer")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-bold transition-all ${
                  activeTab === "transfer"
                    ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                    : "bg-muted/30 hover:bg-muted/50"
                }`}
              >
                <ArrowRightLeft className="h-5 w-5" />
                Transfer Rights
              </button>
            </div>

            {/* Issue Asset Tab */}
            {activeTab === "issue" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-muted/30 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <Info className="text-primary-40 mt-0.5 h-5 w-5 shrink-0" />
                    <div className="text-sm">
                      <p className="text-muted-foreground">
                        Issue a new asset on the QSWAP contract. Asset names must be 1-7 uppercase letters (e.g., "CFB", "QCAP").
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-muted-foreground mb-2 block text-sm">Asset Name (1-7 uppercase letters)</label>
                  <input
                    type="text"
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value.toUpperCase())}
                    placeholder="e.g., CFB"
                    maxLength={7}
                    className="bg-muted/50 w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-40"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground mb-2 block text-sm">Number of Shares</label>
                  <input
                    type="number"
                    value={numberOfShares}
                    onChange={(e) => setNumberOfShares(e.target.value)}
                    placeholder="e.g., 1000000"
                    className="bg-muted/50 w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-40"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground mb-2 block text-sm">Unit of Measurement</label>
                  <input
                    type="number"
                    value={unitOfMeasurement}
                    onChange={(e) => setUnitOfMeasurement(e.target.value)}
                    placeholder="e.g., 1"
                    className="bg-muted/50 w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-40"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground mb-2 block text-sm">Number of Decimal Places</label>
                  <input
                    type="number"
                    value={numberOfDecimalPlaces}
                    onChange={(e) => setNumberOfDecimalPlaces(e.target.value)}
                    placeholder="0"
                    min="0"
                    max="18"
                    className="bg-muted/50 w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-40"
                  />
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={onIssueAsset}
                  disabled={!connected || !assetName || !numberOfShares || !unitOfMeasurement}
                  fullWidth
                >
                  {!connected ? "Connect Wallet" : "Issue Asset"}
                </Button>
              </motion.div>
            )}

            {/* Create Pool Tab */}
            {activeTab === "pool" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-muted/30 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <Info className="text-primary-40 mt-0.5 h-5 w-5 shrink-0" />
                    <div className="text-sm">
                      <p className="text-muted-foreground">
                        Create a new liquidity pool for an asset. The asset must already be issued. After creating the pool, you can add liquidity.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-muted-foreground mb-2 block text-sm">Asset Issuer ID</label>
                  <input
                    type="text"
                    value={poolAssetIssuer}
                    onChange={(e) => setPoolAssetIssuer(e.target.value.toUpperCase())}
                    placeholder="ISSUER_ID_60_CHARS"
                    className="bg-muted/50 w-full rounded-xl px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-primary-40"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground mb-2 block text-sm">Asset Name</label>
                  <input
                    type="text"
                    value={poolAssetName}
                    onChange={(e) => setPoolAssetName(e.target.value.toUpperCase())}
                    placeholder="e.g., CFB"
                    maxLength={7}
                    className="bg-muted/50 w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-40"
                  />
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={onCreatePool}
                  disabled={!connected || !poolAssetIssuer || !poolAssetName}
                  fullWidth
                >
                  {!connected ? "Connect Wallet" : "Create Pool"}
                </Button>
              </motion.div>
            )}

            {/* Transfer Management Rights Tab */}
            {activeTab === "transfer" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-muted/30 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <Info className="text-primary-40 mt-0.5 h-5 w-5 shrink-0" />
                    <div className="text-sm">
                      <p className="text-muted-foreground">
                        Transfer management rights of your asset shares to another smart contract. This allows the target contract to manage the specified number of shares.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-muted-foreground mb-2 block text-sm">Asset Issuer ID</label>
                  <input
                    type="text"
                    value={transferAssetIssuer}
                    onChange={(e) => setTransferAssetIssuer(e.target.value.toUpperCase())}
                    placeholder="ISSUER_ID_60_CHARS"
                    className="bg-muted/50 w-full rounded-xl px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-primary-40"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground mb-2 block text-sm">Asset Name</label>
                  <input
                    type="text"
                    value={transferAssetName}
                    onChange={(e) => setTransferAssetName(e.target.value.toUpperCase())}
                    placeholder="e.g., CFB"
                    maxLength={7}
                    className="bg-muted/50 w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-40"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground mb-2 block text-sm">Number of Shares</label>
                  <input
                    type="number"
                    value={transferShares}
                    onChange={(e) => setTransferShares(e.target.value)}
                    placeholder="e.g., 1000"
                    className="bg-muted/50 w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-40"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground mb-2 block text-sm">New Managing Contract Index</label>
                  <input
                    type="number"
                    value={newContractIndex}
                    onChange={(e) => setNewContractIndex(e.target.value)}
                    placeholder="e.g., 1"
                    className="bg-muted/50 w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-40"
                  />
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={onTransferManagementRights}
                  disabled={
                    !connected || !transferAssetIssuer || !transferAssetName || !transferShares || !newContractIndex
                  }
                  fullWidth
                >
                  {!connected ? "Connect Wallet" : "Transfer Management Rights"}
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect mt-6 rounded-2xl p-4 sm:p-5 md:rounded-3xl md:p-6"
          >
            <h3 className="mb-4 text-xl font-bold">Important Notes</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary-40 mt-1">•</span>
                <span>Asset issuance requires a fee paid to the QSWAP contract</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-40 mt-1">•</span>
                <span>Pool creation requires a fee and the asset must already exist</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-40 mt-1">•</span>
                <span>Management rights transfer requires a minimum fee of 100 QU</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-40 mt-1">•</span>
                <span>Asset names are case-sensitive and must be uppercase (1-7 letters)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-40 mt-1">•</span>
                <span>All transactions are monitored and you'll receive notifications on completion</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AssetManagement;

