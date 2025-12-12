import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Wallet, Sun, Moon } from "lucide-react";
import Button from "./Button";
import { useAtom } from "jotai";
import { settingsAtom } from "@/store/settings";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [settings, setSettings] = useAtom(settingsAtom);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Swap", href: "/swap" },
    { name: "Liquidity", href: "/liquidity" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const toggleTheme = () => {
    setSettings({ darkMode: !settings.darkMode });
    document.documentElement.classList.toggle("dark");
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/80 border-primary-40/20 shadow-primary-40/5 border-b shadow-lg backdrop-blur-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="group flex items-center">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} className="relative">
                <img src="/logo-text.svg" alt="Qubic Portal" className="relative z-10 h-10 drop-shadow-lg sm:h-12" />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-2 md:flex">
              {navigation.map((item, index) => (
                <Link key={item.name} to={item.href}>
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative px-6 py-2.5"
                  >
                    <span
                      className={`relative z-10 font-bold transition-colors ${
                        isActive(item.href) ? "text-primary-40" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item.name}
                    </span>

                    {/* Active Indicator */}
                    {isActive(item.href) && (
                      <motion.div
                        layoutId="activeNav"
                        className="from-primary-40/10 to-primary-60/10 border-primary-40/20 absolute inset-0 rounded-xl border bg-gradient-to-r"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    {/* Hover Effect */}
                    <div className="from-primary-40/5 to-primary-60/5 absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100" />
                  </motion.div>
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="hidden items-center gap-3 md:flex">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="bg-muted/50 hover:bg-muted group relative overflow-hidden rounded-xl p-3 transition-colors"
              >
                <div className="from-primary-40/0 to-primary-60/0 group-hover:from-primary-40/10 group-hover:to-primary-60/10 absolute inset-0 bg-gradient-to-r transition-all" />
                <AnimatePresence mode="wait">
                  {settings.darkMode ? (
                    <motion.div
                      key="moon"
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 180, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Moon className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 180, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sun className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Connect Wallet Button */}
              <Button variant="primary" size="md" icon={<Wallet className="h-5 w-5" />}>
                Connect Wallet
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-muted/50 hover:bg-muted rounded-xl p-2 transition-colors md:hidden"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="from-background via-background to-muted border-primary-40/20 absolute top-0 right-0 bottom-0 w-80 border-l bg-gradient-to-br shadow-2xl"
            >
              <div className="space-y-6 p-6">
                {/* Close Button */}
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-muted/50 hover:bg-muted rounded-xl p-2"
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2">
                  {navigation.map((item, index) => (
                    <Link key={item.name} to={item.href} onClick={() => setMobileMenuOpen(false)}>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`rounded-xl p-4 font-bold transition-all ${
                          isActive(item.href)
                            ? "from-primary-40/20 to-primary-60/20 text-primary-40 border-primary-40/30 border bg-gradient-to-r"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {item.name}
                      </motion.div>
                    </Link>
                  ))}
                </nav>

                {/* Theme Toggle */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={toggleTheme}
                  className="bg-muted/50 hover:bg-muted flex w-full items-center justify-between rounded-xl p-4 transition-colors"
                >
                  <span className="font-bold">Theme</span>
                  {settings.darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </motion.button>

                {/* Connect Wallet */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <Button variant="primary" size="lg" fullWidth icon={<Wallet className="h-5 w-5" />}>
                    Connect Wallet
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
