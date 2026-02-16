import { env } from './env';

const TOKEN_TO_COINGECKO_ID: Record<string, string> = {
  BTC: 'bitcoin',
  WBTC: 'wrapped-bitcoin',
  ETH: 'ethereum',
  WETH: 'weth',
  UNI: 'uniswap',
  USDC: 'usd-coin',
  USDT: 'tether',
};

const resolveCoinId = (token: string) => TOKEN_TO_COINGECKO_ID[token.toUpperCase()] || '';

interface SwapRateResponse {
  from: string;
  to: string;
  rate: number;
  source: string;
  timestamp: string;
}

const getFallbackCoinGeckoRate = async (from: string, to: string) => {
  const fromId = resolveCoinId(from);
  const toId = resolveCoinId(to);

  if (!fromId || !toId) {
    throw new Error('Unsupported token pair');
  }

  const params = new URLSearchParams({
    ids: `${fromId},${toId}`,
    vs_currencies: 'usd',
  });

  if (env.coingeckoApiKey) {
    params.set('x_cg_demo_api_key', env.coingeckoApiKey);
  }

  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`CoinGecko fallback failed (${response.status})`);
  }

  const payload = (await response.json()) as Record<string, { usd?: number }>;
  const fromPrice = payload[fromId]?.usd;
  const toPrice = payload[toId]?.usd;

  if (!fromPrice || !toPrice) {
    throw new Error('Missing USD price in CoinGecko fallback response');
  }

  return {
    from: from.toUpperCase(),
    to: to.toUpperCase(),
    rate: fromPrice / toPrice,
    source: 'coingecko-direct',
    timestamp: new Date().toISOString(),
  } satisfies SwapRateResponse;
};

export const fetchSwapRate = async (
  fromToken: string,
  toToken: string
): Promise<SwapRateResponse> => {
  const from = fromToken.toUpperCase();
  const to = toToken.toUpperCase();

  try {
    const response = await fetch(
      `${env.apiBaseUrl}/api/swap-rate?from=${from}&to=${to}`
    );

    if (!response.ok) {
      throw new Error(`Backend rate request failed (${response.status})`);
    }

    const payload = (await response.json()) as SwapRateResponse;

    if (!payload?.rate || Number.isNaN(payload.rate)) {
      throw new Error('Invalid backend rate response');
    }

    return payload;
  } catch {
    return getFallbackCoinGeckoRate(from, to);
  }
};
