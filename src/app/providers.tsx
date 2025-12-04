import { ReactNode } from "react";
import { Toaster } from "sonner";
import { QubicConnectProvider } from "@/shared/lib/wallet-connect/QubicConnectContext";
import { WalletConnectProvider } from "@/shared/lib/wallet-connect/WalletConnectContext";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <WalletConnectProvider>
      <QubicConnectProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: "!bg-card !text-card-foreground !border-border !border",
          }}
        />
      </QubicConnectProvider>
    </WalletConnectProvider>
  );
};

