import { Outlet } from "react-router-dom";
import { Header, Footer } from "@/shared/components/custom";

const Layout: React.FC = () => {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 justify-center">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;

