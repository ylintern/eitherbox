import { useEffect, useState } from 'react';
import { fetchTrackedPools } from '@/uniswapintegration/services/poolsApi';
import type { TrackedPool } from '@/uniswapintegration/types/onchain';

export const useTrackedPools = () => {
  const [pools, setPools] = useState<TrackedPool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const next = await fetchTrackedPools();
        if (!cancelled) setPools(next);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Pool fetch failed');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { pools, isLoading, error };
};
