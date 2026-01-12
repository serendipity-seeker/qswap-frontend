import { assetNameConvert } from "@/shared/utils";

export type AssetToken = {
  kind: "asset" | "qubic";
  symbol: string;
  name: string;
  icon: string;
  issuer: string;
  assetName: bigint; // uint64 name encoded, per QX asset rules
};

export type Token = AssetToken;
export type TokenDisplay = Token & { balance: string };

export const QUBIC_TOKEN: AssetToken = {
  kind: "qubic",
  symbol: "QUBIC",
  name: "Qubic",
  icon: "/assets/qubic-coin.png",
  issuer: "",
  assetName: 0n,
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
    assetName: assetNameConvert("GARTH") as bigint,
  },
  {
    kind: "asset",
    symbol: "CFB",
    name: "CFB Token",
    icon:
      "/assets/asset_CFB-CFBMEMZOIDEXQAUXYYSZIURADQLAPWPMNJXQSNVQZAHYVOPYUKKJBJUCTVJL_logo_dark.png",
    issuer: "CFBMEMZOIDEXQAUXYYSZIURADQLAPWPMNJXQSNVQZAHYVOPYUKKJBJUCTVJL",
    assetName: assetNameConvert("CFB") as bigint,
  },
  {
    kind: "asset",
    symbol: "CODED",
    name: "CODED Token",
    icon:
      "/assets/asset_CODED-CODEDBUUDDYHECBVSUONSSWTOJRCLZSWHFHZIUWVFGNWVCKIWJCSDSWGQAAI_logo_dark.png",
    issuer: "CODEDBUUDDYHECBVSUONSSWTOJRCLZSWHFHZIUWVFGNWVCKIWJCSDSWGQAAI",
    assetName: assetNameConvert("CODED") as bigint,
  },
  {
    kind: "asset",
    symbol: "PORTAL",
    name: "PORTAL Token",
    icon:
      "/assets/asset_PORTAL-IQUGNVFDQSLTXFJSIOPPNPZINSCDQTJVJWGRPWRTFFXMXSJIAASXOBFFBERK_logo_dark.png",
    issuer: "IQUGNVFDQSLTXFJSIOPPNPZINSCDQTJVJWGRPWRTFFXMXSJIAASXOBFFBERK",
    assetName: assetNameConvert("PORTAL") as bigint,
  },
  {
    kind: "asset",
    symbol: "QXMR",
    name: "QXMR Token",
    icon:
      "/assets/asset_QXMR-QXMRTKAIIGLUREPIQPCMHCKWSIPDTUYFCFNYXQLTECSUJVYEMMDELBMDOEYB_logo_dark.png",
    issuer: "QXMRTKAIIGLUREPIQPCMHCKWSIPDTUYFCFNYXQLTECSUJVYEMMDELBMDOEYB",
    assetName: assetNameConvert("QXMR") as bigint,
  },
  {
    kind: "asset",
    symbol: "QXTRADE",
    name: "QXTRADE Token",
    icon:
      "/assets/asset_QXTRADE-QXTRMABNAJWNQBKYYNUNVYAJAQMDLIKOFXNGTRVYRDQMNZNNMZDGBDNGYMRM_logo_dark.png",
    issuer: "QXTRMABNAJWNQBKYYNUNVYAJAQMDLIKOFXNGTRVYRDQMNZNNMZDGBDNGYMRM",
    assetName: assetNameConvert("QXTRADE") as bigint,
  },
];

export const isQubic = (t: Token)=> t.kind === "qubic";
export const isAsset = (t: Token)=> t.kind === "asset";

