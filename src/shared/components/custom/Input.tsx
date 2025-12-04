import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: "default" | "filled" | "outline";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      success,
      hint,
      leftIcon,
      rightIcon,
      fullWidth = false,
      variant = "default",
      type = "text",
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const hasError = !!error;
    const hasSuccess = !!success;

    const variants = {
      default: `
        bg-muted/30 backdrop-blur-sm border-2 border-muted
        focus:border-primary-40 focus:bg-muted/50
        hover:border-muted-foreground/30
      `,
      filled: `
        bg-gradient-to-br from-muted/50 to-muted/30 border-2 border-transparent
        focus:border-primary-40 focus:from-muted/60 focus:to-muted/40
        hover:from-muted/60 hover:to-muted/40
      `,
      outline: `
        bg-transparent border-2 border-border
        focus:border-primary-40 focus:bg-muted/10
        hover:border-primary-40/50
      `,
    };

    const inputClasses = `
      w-full px-4 py-3 rounded-xl
      text-foreground placeholder:text-muted-foreground/50
      transition-all duration-300
      disabled:opacity-50 disabled:cursor-not-allowed
      outline-none
      ${variants[variant]}
      ${hasError ? "!border-error-40 focus:!border-error-40" : ""}
      ${hasSuccess ? "!border-success-40 focus:!border-success-40" : ""}
      ${leftIcon ? "pl-12" : ""}
      ${rightIcon || isPassword ? "pr-12" : ""}
    `;

    return (
      <div className={`${fullWidth ? "w-full" : ""}`}>
        {/* Label */}
        {label && (
          <motion.label
            animate={{
              color: isFocused ? "var(--primary-40)" : hasError ? "var(--error-40)" : "var(--muted-foreground)",
            }}
            className="mb-2 block text-sm font-semibold transition-colors"
          >
            {label}
          </motion.label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && <div className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2">{leftIcon}</div>}

          {/* Input Field */}
          <motion.input
            ref={ref}
            type={isPassword && showPassword ? "text" : type}
            className={`${inputClasses} ${className}`}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            animate={{
              boxShadow: isFocused
                ? hasError
                  ? "0 0 0 3px rgba(249, 112, 102, 0.1)"
                  : hasSuccess
                    ? "0 0 0 3px rgba(71, 205, 137, 0.1)"
                    : "0 0 0 3px rgba(97, 240, 254, 0.1)"
                : "0 0 0 0px rgba(0, 0, 0, 0)",
            }}
            {...props}
          />

          {/* Right Icons */}
          <div className="absolute top-1/2 right-4 flex -translate-y-1/2 items-center gap-2">
            {/* Status Icons */}
            <AnimatePresence mode="wait">
              {hasError && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                >
                  <AlertCircle className="text-error-40 h-5 w-5" />
                </motion.div>
              )}
              {hasSuccess && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                >
                  <CheckCircle2 className="text-success-40 h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password Toggle */}
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            )}

            {/* Custom Right Icon */}
            {rightIcon && !isPassword && <div className="text-muted-foreground">{rightIcon}</div>}
          </div>

          {/* Focus Line Animation */}
          <motion.div
            className="from-primary-40 to-primary-60 absolute bottom-0 left-0 h-0.5 bg-gradient-to-r"
            initial={{ width: "0%" }}
            animate={{ width: isFocused ? "100%" : "0%" }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Messages */}
        <AnimatePresence mode="wait">
          {(error || success || hint) && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mt-2"
            >
              {error && (
                <p className="text-error-40 flex items-center gap-1 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </p>
              )}
              {success && !error && (
                <p className="text-success-40 flex items-center gap-1 text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  {success}
                </p>
              )}
              {hint && !error && !success && <p className="text-muted-foreground text-sm">{hint}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
