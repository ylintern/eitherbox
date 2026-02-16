interface Env {
  ASSETS: Fetcher;
  COINGECKO_API_KEY?: string;
}

const json = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
    ...init,
  });

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

const getSwapRate = async (from: string, to: string, apiKey?: string) => {
  const fromId = resolveCoinId(from);
  const toId = resolveCoinId(to);

  if (!fromId || !toId) {
    throw new Error('Unsupported token pair');
  }

  const params = new URLSearchParams({
    ids: `${fromId},${toId}`,
    vs_currencies: 'usd',
  });

  if (apiKey) {
    params.set('x_cg_demo_api_key', apiKey);
  }

  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?${params.toString()}`,
    {
      headers: {
        accept: 'application/json',
      },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`CoinGecko request failed (${response.status}): ${text}`);
  }

  const payload = (await response.json()) as Record<string, { usd?: number }>;
  const fromPrice = payload[fromId]?.usd;
  const toPrice = payload[toId]?.usd;

  if (!fromPrice || !toPrice) {
    throw new Error('Missing USD price in CoinGecko response');
  }

  return fromPrice / toPrice;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/swap-rate') {
      const from = url.searchParams.get('from') || '';
      const to = url.searchParams.get('to') || '';

      if (!from || !to) {
        return json(
          { error: 'Missing required query params: from, to' },
          { status: 400 }
        );
      }

      try {
        const rate = await getSwapRate(from, to, env.COINGECKO_API_KEY);
        return json({
          from: from.toUpperCase(),
          to: to.toUpperCase(),
          rate,
          source: 'coingecko',
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        return json(
          {
            error: error instanceof Error ? error.message : 'Unknown backend error',
          },
          { status: 502 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  },
};
