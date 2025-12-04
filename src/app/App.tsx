import { RouterProvider } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useAtom } from "jotai";
import { settingsAtom } from "@/store/settings";
import { MetaMaskContext } from "@/shared/lib/wallet-connect/MetamaskContext";
import { useQubicConnect } from "@/shared/lib/wallet-connect/QubicConnectContext";
import { router } from "./router";

function App() {
  const [settings] = useAtom(settingsAtom);
  const [state] = useContext(MetaMaskContext);
  const { connect, mmSnapConnect } = useQubicConnect();

  useEffect(() => {
    const storedWallet = localStorage.getItem("wallet");
    if (storedWallet) {
      connect(JSON.parse(storedWallet));
    } else if (state.installedSnap) {
      mmSnapConnect();
    }
  }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(settings.darkMode ? "dark" : "light");
  }, [settings.darkMode]);

  return (
    <div className={"bg-background text-foreground"}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
