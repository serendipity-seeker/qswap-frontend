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
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[var(--z-modal)]"
            style={{ backdropFilter: "blur(8px) saturate(150%)" }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[calc(var(--z-modal)+1)] overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                }}
                className={`
                  relative w-full ${sizes[size]} 
                  bg-gradient-to-br from-card via-card to-muted
                  border-2 border-primary-40/20
                  rounded-3xl shadow-2xl
                  overflow-hidden
                  ${className}
                `}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Animated Border Glow */}
                <div className="absolute inset-0 opacity-50">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-40 via-primary-60 to-primary-40 rounded-3xl blur opacity-20 animate-pulse" />
                </div>

                {/* Content Container */}
                <div className="relative z-10 bg-card/80 backdrop-blur-xl rounded-3xl">
                  {/* Header */}
                  {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-6 border-b border-border/50">
                      {title && (
                        <motion.h2
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-2xl font-bold bg-gradient-to-r from-primary-40 to-primary-60 bg-clip-text text-transparent"
                        >
                          {title}
                        </motion.h2>
                      )}
                      {showCloseButton && (
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={onClose}
                          className="p-2 hover:bg-muted rounded-xl transition-colors group"
                        >
                          <X className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </motion.button>
                      )}
                    </div>
                  )}

                  {/* Body */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar"
                  >
                    {children}
                  </motion.div>

                  {/* Footer */}
                  {footer && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="p-6 border-t border-border/50 bg-muted/30"
                    >
                      {footer}
                    </motion.div>
                  )}
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-40/10 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-60/10 rounded-full blur-3xl -z-10" />
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

