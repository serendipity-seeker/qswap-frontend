import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Droplets,
  Layers,
  Shield,
  LockKeyhole,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button, SEO, StructuredData } from "@/shared/components/custom";

const Home: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Execute swaps in milliseconds with our optimized smart contracts",
    },
    {
      icon: Shield,
      title: "Secure & Audited",
      description: "Your funds are protected by industry-leading security practices",
    },
    {
      icon: TrendingUp,
      title: "Best Rates",
      description: "Get the most competitive rates across multiple liquidity pools",
    },
    {
      icon: Droplets,
      title: "Deep Liquidity",
      description: "Access deep liquidity pools for seamless trading",
    },
  ];

  const stats = [
    { label: "Total Value Locked", value: "$45.2M", icon: Layers },
    { label: "24h Trading Volume", value: "$1.2M", icon: BarChart3 },
    { label: "Total Users", value: "12,345", icon: Users },
    { label: "Transactions", value: "234K+", icon: Sparkles },
  ];

  const steps = [
    { title: "Connect your wallet", description: "Use your preferred wallet to connect securely.", icon: Wallet },
    { title: "Choose a pair", description: "Select tokens and input an amount to quote.", icon: Layers },
    { title: "Review the details", description: "Check price impact, fees, and slippage settings.", icon: BarChart3 },
    { title: "Confirm and swap", description: "Approve the transaction and receive your tokens.", icon: CheckCircle2 },
  ];

  const trustPoints = [
    {
      title: "Non-custodial by design",
      description: "You keep control of your funds. Trades happen through your wallet approvals.",
      icon: LockKeyhole,
    },
    {
      title: "Transparent execution",
      description: "Review trade inputs and settings before confirming every transaction.",
      icon: CheckCircle2,
    },
    {
      title: "Built for speed on Qubic",
      description: "Responsive UI and optimized flows for a smooth trading experience.",
      icon: Zap,
    },
  ];

  const faqs = [
    {
      q: "What is Qubic Portal?",
      a: "Qubic Portal is a decentralized exchange (DEX) built on the Qubic blockchain. It allows users to swap tokens directly from their wallets without the need for a centralized intermediary. Qubic Portal uses an automated market maker (AMM) model to facilitate trades.",
    },
    {
      q: "How do I connect my wallet?",
      a: "Click the 'Connect Wallet' button in the header. Qubic Portal supports WalletConnect and other Qubic-compatible wallets. Follow the prompts to authorize the connection. Your funds remain in your wallet at all times.",
    },
    {
      q: "What is liquidity providing?",
      a: "Liquidity providing involves depositing pairs of tokens into a liquidity pool. In return, you receive LP (Liquidity Provider) tokens representing your share of the pool. As trades occur, you earn a portion of the trading fees proportional to your share.",
    },
    {
      q: "What are the trading fees?",
      a: "Qubic Portal charges a 0.3% fee on each swap. This fee is distributed to liquidity providers as an incentive for providing liquidity to the pools. The fee is automatically deducted from the trade amount.",
    },
    {
      q: "What is slippage tolerance?",
      a: "Slippage tolerance is the maximum price difference you're willing to accept between when you submit a trade and when it executes. Higher slippage tolerance means your trade is more likely to succeed but may execute at a less favorable price.",
    },
    {
      q: "How is the exchange rate determined?",
      a: "Qubic Portal uses an automated market maker (AMM) with a constant product formula (x * y = k). The exchange rate is determined by the ratio of tokens in the liquidity pool. Larger trades relative to pool size will experience more price impact.",
    },
    {
      q: "Is Qubic Portal safe?",
      a: "Qubic Portal's smart contracts have been designed with security in mind. However, as with any DeFi protocol, there are inherent risks including smart contract bugs, impermanent loss for liquidity providers, and market volatility. Always DYOR.",
    },
    {
      q: "What is impermanent loss?",
      a: "Impermanent loss occurs when the price ratio of your deposited tokens changes compared to when you deposited them. The larger the change, the more impermanent loss you may experience. It's called 'impermanent' because it only becomes permanent when you withdraw.",
    },
  ];

  return (
    <>
      <SEO
        title="Qubic Portal - Decentralized Exchange on Qubic Network"
        description="Experience the future of decentralized trading on Qubic. Fast, secure, and with the best rates in DeFi. Join thousands of users trading on Qubic Portal."
        keywords="Qubic, DEX, decentralized exchange, crypto trading, token swap, DeFi, Qubic network, liquidity pools, cryptocurrency, blockchain"
        canonical="https://qubicportal.org/"
      />
      <StructuredData type="WebSite" />
      <StructuredData type="Organization" />
      <div className="min-h-screen">
      <div>
        {/* Hero Section */}
        <section className="px-4 pt-20 pb-10 md:pt-28 md:pb-14">
          <div className="mx-auto max-w-6xl text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="mb-8 text-4xl leading-tight font-black md:text-5xl lg:text-6xl uppercase">
                <span className="text-primary">
                  Swap Tokens
                </span>
                <br />
                <span className="text-foreground">Like Never Before</span>
              </h1>
              <p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-base md:text-lg">
                Experience the future of decentralized trading on Qubic. Fast, secure, and with the best rates in DeFi.
              </p>

              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to="/swap">
                  <Button variant="primary" size="lg" icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
                    Start Trading
                  </Button>
                </Link>
                <Link to="/liquidity">
                  <Button variant="outline" size="lg">
                    Add Liquidity
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:mt-12"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="glass-effect hover:bg-muted/50 rounded-xl p-3 transition-all"
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <div className="bg-primary/10 text-primary flex h-7 w-7 items-center justify-center rounded-lg">
                      <stat.icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-primary mb-0.5 text-xl font-bold md:text-2xl">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-xs">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-7">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-8 text-center"
            >
              <h2 className="mb-2 text-2xl font-bold md:text-3xl">
                Why Choose{" "}
                <span className="text-primary">
                  Qubic Portal
                </span>
                ?
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-xs">
                Built on cutting-edge technology to provide the best trading experience
              </p>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="glass-effect hover:bg-muted/50 group rounded-xl p-4 transition-all"
                  >
                    <div
                      className="bg-primary/10 h-9 w-9 rounded-lg mb-2 flex items-center justify-center transition-transform group-hover:scale-110"
                    >
                      <Icon className="text-primary h-5 w-5" />
                    </div>
                    <h3 className="mb-1 text-lg font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-4 py-7 md:py-10">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-6 text-center"
            >
              <h2 className="mb-2 text-2xl font-bold md:text-3xl">How it works</h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-xs">
                A simple flow designed to keep you in control at every step.
              </p>
            </motion.div>

            <div className="grid gap-3 md:grid-cols-2">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    className="glass-effect hover:bg-muted/50 rounded-xl p-3 transition-all"
                  >
                    <div className="flex items-start gap-2">
                      <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-xl">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-muted-foreground text-[10px] font-semibold tracking-wide uppercase">
                          Step {idx + 1}
                        </div>
                        <h3 className="mt-1 text-base font-bold">{step.title}</h3>
                        <p className="text-muted-foreground mt-1 text-xs">{step.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Security / Trust */}
        <section className="px-4 py-9 md:py-11">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-start gap-4 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold md:text-3xl">Built for trust</h2>
                <p className="text-muted-foreground mt-2 text-base">
                  Clear confirmations, transparent settings, and a UX designed to reduce surprises.
                </p>
                <div className="text-muted-foreground mt-3 text-xs">
                  Tip: Always verify token addresses and transaction details in your wallet before confirming.
                </div>
              </motion.div>

              <div className="space-y-2">
                {trustPoints.map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <motion.div
                      key={p.title}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      viewport={{ once: true }}
                      className="glass-effect hover:bg-muted/50 rounded-xl p-3 transition-all"
                    >
                      <div className="flex items-start gap-2">
                        <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-xl">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold">{p.title}</h3>
                          <p className="text-muted-foreground mt-1 text-xs">{p.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 py-7 md:py-10">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-5 text-center"
            >
              <h2 className="text-3xl font-bold md:text-4xl">FAQ</h2>
              <p className="text-muted-foreground mx-auto mt-1 max-w-2xl text-xs">Quick answers to common questions.</p>
            </motion.div>

            <div className="space-y-2">
              {faqs.map((item) => (
                <details
                  key={item.q}
                  className="glass-effect hover:bg-muted/50 group rounded-xl p-3 transition-all"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2">
                    <span className="text-sm font-bold">{item.q}</span>
                    <span className="bg-primary/10 text-primary flex h-7 w-7 items-center justify-center rounded-lg transition-transform group-open:rotate-45">
                      <PlusIcon />
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-9">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-effect relative mx-auto max-w-4xl overflow-hidden rounded-2xl p-5 md:p-7 text-center"
          >
            <div className="bg-primary/5 absolute inset-0"></div>
            <div className="relative z-10">
              <h2 className="mb-2 text-2xl font-bold md:text-3xl">Ready to Start Trading?</h2>
              <p className="text-muted-foreground mb-4 text-sm">Join thousands of users already trading on Qubic Portal</p>
              <Link to="/swap">
                <Button variant="primary" size="lg" icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
                  Launch App
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
    </>
  );
};

export default Home;

const PlusIcon: React.FC = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3.25V12.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3.25 8H12.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};
