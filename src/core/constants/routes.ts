// Application routes
export const ROUTES = {
  HOME: "/",
  SWAP: "/swap",
  LIQUIDITY: "/liquidity",
  ASSET: "/asset",
  SHOWCASE: "/showcase",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
