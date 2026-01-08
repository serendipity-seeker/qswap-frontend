import { assetNameConvert } from "@/shared/utils";

export type AssetToken = {
  kind: "asset" | "qubic";
  symbol: string;
  name: string;
  icon: string;
  issuer: string;
  assetName: number; // uint64 name encoded, per QX asset rules
};

export type Token = AssetToken;
export type TokenDisplay = Token & { balance: string };

export const QUBIC_TOKEN: AssetToken = {
  kind: "qubic",
  symbol: "QUBIC",
  name: "Qubic",
  icon: "/assets/qubic-coin.png",
  issuer: "",
  assetName: 0,
};

// Curated default list (derived from `public/assets/asset_<SYMBOL>-<ISSUER>_logo_dark.png`)
export const DEFAULT_TOKENS: Token[] = [
  QUBIC_TOKEN,
  {
    kind: "asset",
    symbol: "GARTH",
    name: "Gart Token",
    icon:
      "/assets/asset_GARTH-GARTHFANXMPXMDPEZFQPWFPYMHOAWTKILINCTRMVLFFVATKVJRKEDYXGHJBF_logo_dark.png",
    issuer: "GARTHFANXMPXMDPEZFQPWFPYMHOAWTKILINCTRMVLFFVATKVJRKEDYXGHJBF",
    assetName: assetNameConvert("GARTH"),
  },
  {
    kind: "asset",
    symbol: "CFB",
    name: "CFB Token",
    icon:
      "/assets/asset_CFB-CFBMEMZOIDEXQAUXYYSZIURADQLAPWPMNJXQSNVQZAHYVOPYUKKJBJUCTVJL_logo_dark.png",
    issuer: "CFBMEMZOIDEXQAUXYYSZIURADQLAPWPMNJXQSNVQZAHYVOPYUKKJBJUCTVJL",
    assetName: assetNameConvert("CFB"),
  },
  {
    kind: "asset",
    symbol: "QCAP",
    name: "QCAP Token",
    icon:
      "/assets/asset_QCAP-QCAPWMYRSHLBJHSTTZQVCIBARVOASKDENASAKNOBRGPFWWKRCUVUAXYEZVOG_logo_dark.png",
    issuer: "QCAPWMYRSHLBJHSTTZQVCIBARVOASKDENASAKNOBRGPFWWKRCUVUAXYEZVOG",
    assetName: assetNameConvert("QCAP"),
  },
];

export const isQubic = (t: Token)=> t.kind === "qubic";
export const isAsset = (t: Token)=> t.kind === "asset";

