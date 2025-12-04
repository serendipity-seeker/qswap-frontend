import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Twitter,
  Github,
  Send,
  Heart,
  ArrowUpRight,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react";

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
    <footer className="relative mt-20 border-t border-primary-40/10 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-primary-40/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-primary-60/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-6 group w-fit">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <img 
                  src="/logo-text.svg" 
                  alt="QSwap" 
                  className="h-12 sm:h-14 relative z-10" 
                />
              </motion.div>
            </Link>

            <p className="text-muted-foreground mb-6 max-w-md">
              The next generation decentralized exchange built on Qubic. Trade tokens with
              lightning speed and the best rates in DeFi.
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
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-40/10 to-primary-60/10 border border-primary-40/20"
                  >
                    <Icon className="w-4 h-4 text-primary-40" />
                    <span className="text-sm font-medium">{feature.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-primary-40 to-primary-60 bg-clip-text text-transparent">
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
                    className="text-muted-foreground hover:text-primary-40 transition-colors flex items-center gap-2 group w-fit"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-primary-40 to-primary-60 bg-clip-text text-transparent">
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
                    className={`flex items-center gap-3 text-muted-foreground transition-colors ${social.color} group`}
                  >
                    <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{social.name}</span>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Divider with Gradient */}
        <div className="relative h-px mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-40/50 to-transparent" />
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-muted-foreground text-center md:text-left"
          >
            © 2025 QSwap. All rights reserved. Built with{" "}
            <motion.span
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="inline-block"
            >
              <Heart className="w-4 h-4 inline text-error-40 fill-current" />
            </motion.span>{" "}
            by Qraffle Team
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-6 text-sm text-muted-foreground"
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
          <div className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-40/10 to-primary-60/10 border border-primary-40/20">
            <p className="text-sm font-medium text-center">
              <span className="text-muted-foreground">Powered by</span>{" "}
              <span className="bg-gradient-to-r from-primary-40 to-primary-60 bg-clip-text text-transparent font-bold">
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

