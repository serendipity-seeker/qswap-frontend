export interface Token {
  issuer: string;
  assetName: string;
  logo: string;
}

export interface TokenDisplay extends Token {
  balance: string;
}

export const QUBIC_TOKEN = {
  issuer: "",
  assetName: "QUBIC",
  logo: "/public/assets/qubic-coin.png",
};

export const isAsset = (token: Token) => {
  return token.assetName !== "QUBIC" && token.issuer !== "";
};

export const isQubic = (token: Token) => {
  return token.assetName === "QUBIC" && token.issuer === "";
};
