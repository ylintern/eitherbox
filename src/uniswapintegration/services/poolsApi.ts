import { env } from '@/lib/env';
import type { TrackedPool } from '@/uniswapintegration/types/onchain';

export const fetchTrackedPools = async (): Promise<TrackedPool[]> => {
  const response = await fetch(`${env.apiBaseUrl}/api/onchain/pools`);

  if (!response.ok) {
    throw new Error(`Pools request failed (${response.status})`);
  }

  const payload = (await response.json()) as { pools: TrackedPool[] };
  return payload.pools || [];
};
