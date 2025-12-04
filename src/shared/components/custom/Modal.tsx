import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  footer?: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  closeOnBackdrop = true,
  footer,
  className = "",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[95vw] h-[95vh]",
  };

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="fixed inset-0 z-[var(--z-modal)] bg-black/70 backdrop-blur-md"
            style={{ backdropFilter: "blur(8px) saturate(150%)" }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[calc(var(--z-modal)+1)] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                }}
                className={`relative w-full ${sizes[size]} from-card via-card to-muted border-primary-40/20 overflow-hidden rounded-3xl border-2 bg-gradient-to-br shadow-2xl ${className} `}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Animated Border Glow */}
                <div className="absolute inset-0 opacity-50">
                  <div className="from-primary-40 via-primary-60 to-primary-40 absolute -inset-1 animate-pulse rounded-3xl bg-gradient-to-r opacity-20 blur" />
                </div>

                {/* Content Container */}
                <div className="bg-card/80 relative z-10 rounded-3xl backdrop-blur-xl">
                  {/* Header */}
                  {(title || showCloseButton) && (
                    <div className="border-border/50 flex items-center justify-between border-b p-6">
                      {title && (
                        <motion.h2
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="from-primary-40 to-primary-60 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent"
                        >
                          {title}
                        </motion.h2>
                      )}
                      {showCloseButton && (
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={onClose}
                          className="hover:bg-muted group rounded-xl p-2 transition-colors"
                        >
                          <X className="text-muted-foreground group-hover:text-foreground h-6 w-6 transition-colors" />
                        </motion.button>
                      )}
                    </div>
                  )}

                  {/* Body */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="custom-scrollbar max-h-[70vh] overflow-y-auto p-6"
                  >
                    {children}
                  </motion.div>

                  {/* Footer */}
                  {footer && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="border-border/50 bg-muted/30 border-t p-6"
                    >
                      {footer}
                    </motion.div>
                  )}
                </div>

                {/* Decorative Elements */}
                <div className="bg-primary-40/10 absolute top-0 right-0 -z-10 h-64 w-64 rounded-full blur-3xl" />
                <div className="bg-primary-60/10 absolute bottom-0 left-0 -z-10 h-64 w-64 rounded-full blur-3xl" />
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
