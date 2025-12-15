import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
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
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: Shield,
      title: "Secure & Audited",
      description: "Your funds are protected by industry-leading security practices",
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: TrendingUp,
      title: "Best Rates",
      description: "Get the most competitive rates across multiple liquidity pools",
      color: "from-green-400 to-emerald-600",
    },
    {
      icon: Droplets,
      title: "Deep Liquidity",
      description: "Access deep liquidity pools for seamless trading",
      color: "from-cyan-400 to-blue-500",
    },
  ];

  const stats = [
    { label: "Total Value Locked", value: "$45.2M", icon: Layers },
    { label: "24h Trading Volume", value: "$1.2M", icon: BarChart3 },
    { label: "Total Users", value: "12,345", icon: Users },
    { label: "Transactions", value: "234K+", icon: Sparkles },
  ];

  const actions = [
    {
      title: "Swap tokens",
      description: "Trade instantly with competitive pricing and clear execution.",
      href: "/swap",
      icon: ArrowRight,
    },
    {
      title: "Provide liquidity",
      description: "Add liquidity to pools and earn fees from swaps.",
      href: "/liquidity",
      icon: Droplets,
    },
    {
      title: "Explore the app",
      description: "See UI components, charts, and patterns in our showcase.",
      href: "/showcase",
      icon: BookOpen,
    },
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
      q: "Do I need an account?",
      a: "No. Connect a supported wallet and you can start using the app immediately.",
    },
    {
      q: "What is slippage?",
      a: "Slippage is the allowed difference between the quoted and executed price. You can adjust it in settings.",
    },
    {
      q: "Where do swap rates come from?",
      a: "Rates are derived from available liquidity and pool pricing. The UI shows execution details before you confirm.",
    },
    {
      q: "How do I earn fees?",
      a: "By providing liquidity to pools, you can earn a portion of swap fees proportional to your share.",
    },
    {
      q: "Is this live or a demo?",
      a: "Some screens may use mock data depending on the feature area. Always verify details in your wallet before confirming.",
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
        {/* Background decorations */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-primary-40/20 animate-float absolute top-1/4 -left-48 h-96 w-96 rounded-full blur-[120px]"></div>
        <div
          className="bg-primary-60/20 animate-float absolute top-1/2 -right-48 h-96 w-96 rounded-full blur-[120px]"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="bg-primary-50/10 animate-float absolute bottom-1/4 left-1/3 h-96 w-96 rounded-full blur-[120px]"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="px-4 pt-32 pb-20">
          <div className="mx-auto max-w-6xl text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="mb-6 text-6xl leading-tight font-black md:text-7xl lg:text-8xl">
                <span className="from-primary-40 via-primary-50 to-primary-60 bg-gradient-to-r bg-clip-text text-transparent">
                  Swap Tokens
                </span>
                <br />
                <span className="text-foreground">Like Never Before</span>
              </h1>
              <p className="text-muted-foreground mx-auto mb-12 max-w-3xl text-xl md:text-2xl">
                Experience the future of decentralized trading on Qubic. Fast, secure, and with the best rates in DeFi.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/swap">
                  <Button variant="primary" size="xl" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right">
                    Start Trading
                  </Button>
                </Link>
                <Link to="/liquidity">
                  <Button variant="outline" size="xl">
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
              className="mt-24 grid grid-cols-2 gap-6 md:grid-cols-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="glass-effect hover:bg-muted/50 rounded-2xl p-6 transition-all"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="from-primary-40 to-primary-60 mb-2 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* What you can do */}
        <section className="px-4 pb-6 md:pb-10">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8 text-center"
            >
              <h2 className="text-3xl font-bold md:text-4xl">Everything you need to get started</h2>
              <p className="text-muted-foreground mx-auto mt-3 max-w-2xl">
                Swap, provide liquidity, and explore the ecosystem — all in one place.
              </p>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-3">
              {actions.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="glass-effect hover:bg-muted/50 rounded-2xl p-6 transition-all"
                >
                  <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-2xl">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground mb-5 text-sm">{item.description}</p>
                  <Link to={item.href} className="inline-flex">
                    <Button variant="outline" size="sm" icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
                      Open
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                Why Choose{" "}
                <span className="from-primary-40 to-primary-60 bg-gradient-to-r bg-clip-text text-transparent">
                  Qubic Portal
                </span>
                ?
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                Built on cutting-edge technology to provide the best trading experience
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
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
                    className="glass-effect hover:bg-muted/50 group rounded-2xl p-8 transition-all"
                  >
                    <div
                      className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.color} mb-4 flex items-center justify-center transition-transform group-hover:scale-110`}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="mb-3 text-2xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-4 py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">How it works</h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                A simple flow designed to keep you in control at every step.
              </p>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    className="glass-effect hover:bg-muted/50 rounded-2xl p-6 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 text-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                          Step {idx + 1}
                        </div>
                        <h3 className="mt-1 text-xl font-bold">{step.title}</h3>
                        <p className="text-muted-foreground mt-2 text-sm">{step.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Security / Trust */}
        <section className="px-4 py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-start gap-8 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold md:text-5xl">Built for trust</h2>
                <p className="text-muted-foreground mt-4 text-lg">
                  Clear confirmations, transparent settings, and a UX designed to reduce surprises.
                </p>
                <div className="text-muted-foreground mt-6 text-sm">
                  Tip: Always verify token addresses and transaction details in your wallet before confirming.
                </div>
              </motion.div>

              <div className="space-y-4">
                {trustPoints.map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <motion.div
                      key={p.title}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      viewport={{ once: true }}
                      className="glass-effect hover:bg-muted/50 rounded-2xl p-6 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 text-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{p.title}</h3>
                          <p className="text-muted-foreground mt-2 text-sm">{p.description}</p>
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
        <section className="px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-10 text-center"
            >
              <h2 className="text-4xl font-bold md:text-5xl">FAQ</h2>
              <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-lg">Quick answers to common questions.</p>
            </motion.div>

            <div className="space-y-3">
              {faqs.map((item) => (
                <details
                  key={item.q}
                  className="glass-effect hover:bg-muted/50 group rounded-2xl p-5 transition-all"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="text-lg font-bold">{item.q}</span>
                    <span className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-xl transition-transform group-open:rotate-45">
                      <PlusIcon />
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-effect relative mx-auto max-w-4xl overflow-hidden rounded-3xl p-12 text-center"
          >
            <div className="from-primary-40/10 to-primary-60/10 absolute inset-0 bg-gradient-to-r"></div>
            <div className="relative z-10">
              <h2 className="mb-6 text-4xl font-bold md:text-5xl">Ready to Start Trading?</h2>
              <p className="text-muted-foreground mb-8 text-xl">Join thousands of users already trading on Qubic Portal</p>
              <Link to="/swap">
                <Button variant="primary" size="xl" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right">
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
