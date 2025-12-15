import React from "react";
import { motion } from "framer-motion";

interface AppLoaderProps {
  fullScreen?: boolean;
  text?: string;
  size?: "sm" | "md" | "lg";
}

const AppLoader: React.FC<AppLoaderProps> = ({ fullScreen = true, text = "Loading...", size = "md" }) => {
  const sizes = {
    sm: { container: "w-16 h-16", dot: "w-3 h-3" },
    md: { container: "w-24 h-24", dot: "w-4 h-4" },
    lg: { container: "w-32 h-32", dot: "w-5 h-5" },
  };

  const Container = fullScreen ? "div" : React.Fragment;
  const containerProps = fullScreen
    ? {
        className: "fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-lg",
      }
    : {};

  return (
    <Container {...containerProps}>
      <div className="flex flex-col items-center gap-8">
        {/* Animated Logo Loader */}
        <div className="relative">
          {/* Outer Ring */}
          <motion.div
            className={`${sizes[size].container} border-primary-40/20 rounded-full border-4`}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            {/* Spinning Gradient Arc */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `var(--primary)`,
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          {/* Inner Pulsing Circle */}
          <motion.div
            className={`absolute inset-0 m-auto ${sizes[size].dot === "h-3 w-3" ? "h-8 w-8" : sizes[size].dot === "h-4 w-4" ? "h-12 w-12" : "h-16 w-16"} bg-primary rounded-full`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Center Logo or Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.img
              src="/qswap.svg"
              alt="Loading"
              className={`${sizes[size].dot === "h-3 w-3" ? "h-6 w-6" : sizes[size].dot === "h-4 w-4" ? "h-10 w-10" : "h-14 w-14"}`}
              animate={{
                rotate: [0, 360],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Orbiting Dots */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`absolute ${sizes[size].dot} bg-primary shadow-primary/50 rounded-full shadow-lg`}
              style={{
                top: "50%",
                left: "50%",
                marginTop: `-${parseInt(sizes[size].dot.split(" ")[1].replace("h-", "")) / 2}px`,
                marginLeft: `-${parseInt(sizes[size].dot.split(" ")[0].replace("w-", "")) / 2}px`,
              }}
              animate={{
                x: [
                  Math.cos((i * 120 * Math.PI) / 180) * (size === "sm" ? 32 : size === "md" ? 48 : 64),
                  Math.cos(((i * 120 + 360) * Math.PI) / 180) * (size === "sm" ? 32 : size === "md" ? 48 : 64),
                ],
                y: [
                  Math.sin((i * 120 * Math.PI) / 180) * (size === "sm" ? 32 : size === "md" ? 48 : 64),
                  Math.sin(((i * 120 + 360) * Math.PI) / 180) * (size === "sm" ? 32 : size === "md" ? 48 : 64),
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-3">
          <motion.p
            className="text-primary text-lg font-semibold"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {text}
          </motion.p>

          {/* Animated Dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="bg-primary-40 h-2 w-2 rounded-full"
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress Bar (Optional) */}
        <div className="bg-muted h-1 w-64 overflow-hidden rounded-full">
          <motion.div
            className="bg-primary h-full rounded-full"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </Container>
  );
};

export default AppLoader;
