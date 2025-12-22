import { assetNameConvert } from "@/shared/utils";

export type NativeToken = {
  kind: "qubic";
  symbol: "QUBIC";
  name: "Qubic";
  icon: string;
};

export type AssetToken = {
  kind: "asset";
  symbol: string;
  name: string;
  icon: string;
  issuer: string;
  assetName: number; // uint64 name encoded, per QX asset rules
};

export type Token = NativeToken | AssetToken;
export type TokenDisplay = Token & { balance: string };

export const QUBIC_TOKEN: NativeToken = {
  kind: "qubic",
  symbol: "QUBIC",
  name: "Qubic",
  icon: "/assets/qubic-coin.png",
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

export const isQubic = (t: Token): t is NativeToken => t.kind === "qubic";
export const isAsset = (t: Token): t is AssetToken => t.kind === "asset";

