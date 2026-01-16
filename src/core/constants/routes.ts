// Application routes
export const ROUTES = {
  HOME: "/",
  SWAP: "/swap",
  LIQUIDITY: "/liquidity",
  PROFILE: "/profile",
  SHOWCASE: "/showcase",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
