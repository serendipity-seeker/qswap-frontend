import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Twitter, Github, Send, ArrowUpRight, Zap, Shield, TrendingUp } from "lucide-react";

const Footer: React.FC = () => {
  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-blue-400" },
    { name: "Github", icon: Github, href: "#", color: "hover:text-gray-300" },
    { name: "Telegram", icon: Send, href: "#", color: "hover:text-blue-500" },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Swap", href: "/swap" },
    { name: "Liquidity", href: "/liquidity" },
  ];

  const features = [
    { icon: Zap, text: "Lightning Fast" },
    { icon: Shield, text: "Secure" },
    { icon: TrendingUp, text: "Best Rates" },
  ];

  return (
    <footer className="border-primary-40/10 relative mt-20 overflow-hidden border-t">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary-40/5 absolute -bottom-48 -left-48 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-primary-60/5 absolute -right-48 -bottom-48 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="group mb-6 flex w-fit items-center">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} className="relative">
                <img src="/logo-text.svg" alt="Qubic Portal" className="relative z-10 h-12 sm:h-14" />
              </motion.div>
            </Link>

            <p className="text-muted-foreground mb-6 max-w-md">
              The next generation decentralized exchange built on Qubic. Trade tokens with lightning speed and the best
              rates in DeFi.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="from-primary-40/10 to-primary-60/10 border-primary-40/20 flex items-center gap-2 rounded-xl border bg-gradient-to-r px-4 py-2"
                  >
                    <Icon className="text-primary-40 h-4 w-4" />
                    <span className="text-sm font-medium">{feature.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="from-primary-40 to-primary-60 mb-4 bg-gradient-to-r bg-clip-text text-lg font-bold text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary-40 group flex w-fit items-center gap-2 transition-colors"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="h-4 w-4 -translate-y-1 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="from-primary-40 to-primary-60 mb-4 bg-gradient-to-r bg-clip-text text-lg font-bold text-transparent">
              Community
            </h3>
            <div className="space-y-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                    className={`text-muted-foreground flex items-center gap-3 transition-colors ${social.color} group`}
                  >
                    <div className="bg-muted/50 group-hover:bg-muted rounded-lg p-2 transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{social.name}</span>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Divider with Gradient */}
        <div className="relative mb-8 h-px">
          <div className="via-primary-40/50 absolute inset-0 bg-gradient-to-r from-transparent to-transparent" />
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-center text-sm md:text-left"
          >
            © 2025 Qubic Portal. All rights reserved.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-muted-foreground flex items-center gap-6 text-sm"
          >
            <a href="#" className="hover:text-primary-40 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary-40 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary-40 transition-colors">
              Docs
            </a>
          </motion.div>
        </div>

        {/* Powered by Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 flex justify-center"
        >
          <div className="from-primary-40/10 to-primary-60/10 border-primary-40/20 rounded-full border bg-gradient-to-r px-6 py-3">
            <p className="text-center text-sm font-medium">
              <span className="text-muted-foreground">Powered by</span>{" "}
              <span className="from-primary-40 to-primary-60 bg-gradient-to-r bg-clip-text font-bold text-transparent">
                Qubic Network
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
