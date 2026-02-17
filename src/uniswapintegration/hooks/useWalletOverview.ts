import { useEffect, useState } from 'react';
import { fetchWalletOverview } from '@/uniswapintegration/services/walletApi';
import type { WalletOverview } from '@/uniswapintegration/types/onchain';

export const useWalletOverview = (address?: string) => {
  const [overview, setOverview] = useState<WalletOverview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setOverview(null);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const next = await fetchWalletOverview(address);
        if (!cancelled) setOverview(next);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Wallet fetch failed');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [address]);

  return { overview, isLoading, error };
};
