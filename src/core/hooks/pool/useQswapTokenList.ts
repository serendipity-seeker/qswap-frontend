import { QUBIC_TOKEN, type Token } from "@/shared/constants/tokens";
import { fetchAssetsOwnership } from "@/shared/services/rpc.service";
import { useEffect, useState } from "react";

const LOGO_BASE_URL = import.meta.env.VITE_LOGO_BASE_URL;

export const useQswapTokenList = () => {
  const [tokenList, setTokenList] = useState<Token[]>([QUBIC_TOKEN]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTokenList = async () => {
      setLoading(true);
      setError(null);
      const ownedAssets = await fetchAssetsOwnership("NAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAML");
      setTokenList([QUBIC_TOKEN, ...ownedAssets.map((asset) => ({
        issuer: asset.issuer,
        assetName: asset.assetName,
        logo: `${LOGO_BASE_URL}/asset_${asset.assetName}-${asset.issuer}_logo_dark.png`,
      }))]);
      setLoading(false);
    }
    fetchTokenList();
  }, []);

  return { tokenList, loading, error };
};