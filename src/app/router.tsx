import { createBrowserRouter } from "react-router-dom";
import Layout from "@/shared/layouts";
import Error404 from "./error404";
import { ROUTES } from "@/core/constants";
import Home from "@/features/home";
import Swap from "@/features/swap";
import Liquidity from "@/features/liquidity";
// import AssetManagement from "@/features/asset";
import Showcase from "@/features/showcase";

console.log({ ROUTES });

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Layout />,
    errorElement: <Error404 />,
    children: [
      {
        path: ROUTES.HOME,
        element: <Home />,
      },
      {
        path: ROUTES.SWAP,
        element: <Swap />,
      },
      {
        path: ROUTES.LIQUIDITY,
        element: <Liquidity />,
      },
      // {
      //   path: ROUTES.ASSET,
      //   element: <AssetManagement />,
      // },
      {
        path: ROUTES.SHOWCASE,
        element: <Showcase />,
      },
    ],
  },
]);
