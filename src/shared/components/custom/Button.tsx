import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "size"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      children,
      disabled,
      className = "",
      ...props
    },
    ref,
  ) => {
    const baseStyles = `
      relative overflow-hidden font-bold transition-all duration-300
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus:ring-2 focus:ring-offset-2
      ${fullWidth ? "w-full" : ""}
    `;

    const variants: Record<ButtonVariant, string> = {
      primary: `
        bg-gradient-to-br from-primary-40 via-primary-50 to-primary-60
        hover:from-primary-50 hover:via-primary-60 hover:to-primary-70
        text-white shadow-lg shadow-primary-40/30
        hover:shadow-xl hover:shadow-primary-50/50
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
        before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700
        focus:ring-primary-40
      `,
      secondary: `
        bg-gradient-to-br from-gray-70 via-gray-80 to-gray-90
        hover:from-gray-60 hover:via-gray-70 hover:to-gray-80
        text-white shadow-lg shadow-gray-90/50
        hover:shadow-xl hover:shadow-gray-80/50
        focus:ring-gray-70
      `,
      outline: `
        bg-transparent border-2 border-primary-40 text-primary-40
        hover:bg-primary-40/10 hover:border-primary-50
        shadow-none hover:shadow-lg hover:shadow-primary-40/20
        focus:ring-primary-40
      `,
      ghost: `
        bg-transparent hover:bg-muted text-foreground
        shadow-none hover:shadow-md
        focus:ring-muted
      `,
      danger: `
        bg-gradient-to-br from-error-40 via-red-500 to-red-600
        hover:from-red-500 hover:via-red-600 hover:to-red-700
        text-white shadow-lg shadow-error-40/30
        hover:shadow-xl hover:shadow-error-40/50
        focus:ring-error-40
      `,
      success: `
        bg-gradient-to-br from-success-40 via-green-500 to-green-600
        hover:from-green-500 hover:via-green-600 hover:to-green-700
        text-white shadow-lg shadow-success-40/30
        hover:shadow-xl hover:shadow-success-40/50
        focus:ring-success-40
      `,
    };

    const sizes: Record<ButtonSize, string> = {
      sm: "px-4 py-2 text-sm rounded-lg",
      md: "px-6 py-3 text-base rounded-xl",
      lg: "px-8 py-4 text-lg rounded-2xl",
      xl: "px-10 py-5 text-xl rounded-2xl",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.02, y: -2 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98, y: 0 }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              {icon && iconPosition === "left" && <span>{icon}</span>}
              <span>{children}</span>
              {icon && iconPosition === "right" && <span>{icon}</span>}
            </>
          )}
        </span>
      </motion.button>
    );
  },
);

Button.displayName = "Button";

export default Button;
