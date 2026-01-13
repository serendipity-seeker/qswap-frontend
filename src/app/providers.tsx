import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";
import { QubicConnectProvider } from "@/shared/lib/wallet-connect/QubicConnectContext";
import { WalletConnectProvider } from "@/shared/lib/wallet-connect/WalletConnectContext";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <HelmetProvider>
      <WalletConnectProvider>
        <QubicConnectProvider>
          {children}
          <Toaster position="top-right" richColors closeButton swipeDirections={["right", "left"]} theme="dark" />
        </QubicConnectProvider>
      </WalletConnectProvider>
    </HelmetProvider>
  );
};
