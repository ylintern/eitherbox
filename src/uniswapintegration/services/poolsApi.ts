import { env } from '@/lib/env';
import type { TrackedPool } from '@/uniswapintegration/types/onchain';

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null;

const asString = (value: unknown) => (typeof value === 'string' ? value : undefined);

const asNumber = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  return undefined;
};

const buildExplorerUrl = (poolId: string) =>
  `https://app.uniswap.org/explore/pools/unichain/${poolId}`;

const normalizeTrackedPool = (rawPool: unknown, fallbackBlockNumber = 0): TrackedPool | null => {
  if (!isRecord(rawPool)) return null;

  const poolId =
    asString(rawPool.poolId) ||
    asString(rawPool.id) ||
    asString(rawPool.address) ||
    asString(rawPool.poolAddress);

  if (!poolId) return null;

  const token0 = isRecord(rawPool.token0) ? rawPool.token0 : null;
  const token1 = isRecord(rawPool.token1) ? rawPool.token1 : null;

  return {
    poolId,
    chain: 'unichain',
    blockNumber: asNumber(rawPool.blockNumber) ?? fallbackBlockNumber,
    explorerUrl: asString(rawPool.explorerUrl) || buildExplorerUrl(poolId),
    token0Symbol: asString(rawPool.token0Symbol) || asString(token0?.symbol),
    token1Symbol: asString(rawPool.token1Symbol) || asString(token1?.symbol),
    feeTier: asString(rawPool.feeTier) || asString(rawPool.fee),
    tvlUsd:
      asString(rawPool.tvlUsd) ||
      asString(rawPool.totalValueLockedUSD) ||
      asString(rawPool.totalValueLockedUsd),
    volumeUsd: asString(rawPool.volumeUsd) || asString(rawPool.volumeUSD),
    source: asString(rawPool.source),
  };
};

export const fetchTrackedPools = async (): Promise<TrackedPool[]> => {
  const response = await fetch(`${env.apiBaseUrl}/api/onchain/pools`);

  if (!response.ok) {
    throw new Error(`Pools request failed (${response.status})`);
  }

  const payload = (await response.json()) as unknown;

  if (Array.isArray(payload)) {
    return payload
      .map((pool) => normalizeTrackedPool(pool))
      .filter((pool): pool is TrackedPool => Boolean(pool));
  }

  if (!isRecord(payload)) {
    return [];
  }

  const fallbackBlockNumber = asNumber(payload.blockNumber) ?? 0;
  const poolsSource = Array.isArray(payload.pools)
    ? payload.pools
    : Array.isArray(payload.data)
      ? payload.data
      : [];

  return poolsSource
    .map((pool) => normalizeTrackedPool(pool, fallbackBlockNumber))
    .filter((pool): pool is TrackedPool => Boolean(pool));
};
