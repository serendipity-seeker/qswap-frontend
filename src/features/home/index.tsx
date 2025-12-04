import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, TrendingUp, Droplets } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/custom";

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
    { label: "Total Value Locked", value: "$45.2M" },
    { label: "24h Trading Volume", value: "$1.2M" },
    { label: "Total Users", value: "12,345" },
    { label: "Transactions", value: "234K+" },
  ];

  return (
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
                  <div className="from-primary-40 to-primary-60 mb-2 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
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
                  QSwap
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
              <p className="text-muted-foreground mb-8 text-xl">Join thousands of users already trading on QSwap</p>
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
  );
};

export default Home;
