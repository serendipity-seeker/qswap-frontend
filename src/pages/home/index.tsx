import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, TrendingUp, Droplets } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/custom";

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
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary-40/20 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute top-1/2 -right-48 w-96 h-96 bg-primary-60/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-primary-50/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-primary-40 via-primary-50 to-primary-60 bg-clip-text text-transparent">
                  Swap Tokens
                </span>
                <br />
                <span className="text-foreground">Like Never Before</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
                Experience the future of decentralized trading on Qubic. Fast, secure, and
                with the best rates in DeFi.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/swap">
                  <Button
                    variant="primary"
                    size="xl"
                    icon={<ArrowRight className="w-5 h-5" />}
                    iconPosition="right"
                  >
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
              className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="glass-effect rounded-2xl p-6 hover:bg-muted/50 transition-all"
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-40 to-primary-60 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Why Choose <span className="bg-gradient-to-r from-primary-40 to-primary-60 bg-clip-text text-transparent">QSwap</span>?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built on cutting-edge technology to provide the best trading experience
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
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
                    className="glass-effect rounded-2xl p-8 hover:bg-muted/50 transition-all group"
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto glass-effect rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-40/10 to-primary-60/10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Start Trading?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of users already trading on QSwap
              </p>
              <Link to="/swap">
                <Button
                  variant="primary"
                  size="xl"
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                >
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
