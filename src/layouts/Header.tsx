import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import ConnectLink from "@/components/composed/wallet-connect/ConnectLink";
import { useAtom } from "jotai";
import { settingsAtom } from "@/store/settings";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [settings, setSettings] = useAtom(settingsAtom);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Swap", href: "/swap" },
    { name: "Liquidity", href: "/liquidity" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const toggleTheme = () => {
    setSettings({ darkMode: !settings.darkMode });
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="glass-effect border-border sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="transition-opacity hover:opacity-80 flex items-center gap-3">
            <motion.img 
              whileHover={{ scale: 1.05, rotate: 5 }} 
              transition={{ duration: 0.2 }} 
              src={"/qswap.svg"} 
              alt="logo" 
              className="w-10 h-10"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-40 to-primary-60 bg-clip-text text-transparent hidden sm:block">
              QSwap
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden space-x-8 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-1 text-sm font-medium transition-colors ${isActive(item.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                style={{ borderRadius: 0, background: "none" }}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button onClick={toggleTheme}>
              {!settings.darkMode ? <MdDarkMode size={24} /> : <MdLightMode size={24} />}
            </Button>

            {/* Wallet Button */}
            <ConnectLink darkMode={true} />
          </div>


          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-2 md:hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-border bg-background border-t py-4 md:hidden">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${isActive(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                >
                  {item.name}
                </Link>
              ))}
              <ConnectLink darkMode={true} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
