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
        bg-primary text-primary-foreground hover:bg-primary/90
        shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50
        focus:ring-primary
      `,
      secondary: `
        bg-secondary text-secondary-foreground hover:bg-secondary/90
        shadow-lg shadow-black/10 hover:shadow-xl
        focus:ring-secondary
      `,
      outline: `
        bg-transparent border-2 border-primary text-primary
        hover:bg-primary/10
        shadow-none hover:shadow-lg hover:shadow-primary/20
        focus:ring-primary
      `,
      ghost: `
        bg-transparent hover:bg-muted text-foreground
        shadow-none hover:shadow-md
        focus:ring-muted
      `,
      danger: `
        bg-destructive text-white hover:bg-destructive/90
        shadow-lg shadow-destructive/30 hover:shadow-xl hover:shadow-destructive/50
        focus:ring-destructive
      `,
      success: `
        bg-success-40 hover:bg-success-40/90
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
