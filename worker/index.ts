interface Env {
  ASSETS: Fetcher;
  COINGECKO_API_KEY?: string;
  ALCHEMY_UNICHAIN_URL?: string;
  GOLDSKY_RPC_URL?: string;
}

interface QuotePayload {
  fromToken: string;
  toToken: string;
  rate: number;
  amountOut?: string;
  source: string;
  timestamp: string;
  routeStatus: 'skeleton';
}

const TRACKED_POOL_IDS = [
  '0x3258f413c7a88cda2fa8709a589d221a80f6574f63df5a5b6774485d8acc39d9',
  '0x51f9d63dda41107d6513047f7ed18133346ce4f3f4c4faf899151d8939b3496e',
  '0x53b06f1bb8b622cc4b7dbd9bc9f4a34788034bc48702cd2af4135b48444d5b24',
  '0xb2f3bbaf23e0197ec2e6f9ab730d00aaf26a9119ecd583bbb9ef3146b4afa248',
] as const;

const SUPPORTED_SYMBOLS = new Set(['UNI', 'WBTC', 'WETH', 'USDC', 'USDT']);

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

const getRpcUrl = (env: Env) => env.ALCHEMY_UNICHAIN_URL || env.GOLDSKY_RPC_URL || '';

const rpcCall = async <T>(env: Env, method: string, params: unknown[] = []) => {
  const rpcUrl = getRpcUrl(env);

  if (!rpcUrl) {
    throw new Error('Missing RPC URL: set ALCHEMY_UNICHAIN_URL or GOLDSKY_RPC_URL');
  }

  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method,
      params,
    }),
  });

  if (!response.ok) {
    throw new Error(`RPC HTTP failure (${response.status})`);
  }

  const payload = (await response.json()) as {
    result?: T;
    error?: { message?: string };
  };

  if (payload.error) {
    throw new Error(payload.error.message || `RPC ${method} failed`);
  }

  return payload.result as T;
};

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
    { headers: { accept: 'application/json' } }
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

const getQuotePayload = async (
  from: string,
  to: string,
  amountIn: string | null,
  apiKey?: string
): Promise<QuotePayload> => {
  const rate = await getSwapRate(from, to, apiKey);
  const parsedAmount = amountIn ? Number(amountIn) : NaN;
  const amountOut = Number.isFinite(parsedAmount)
    ? (parsedAmount * rate).toFixed(6)
    : undefined;

  return {
    fromToken: from.toUpperCase(),
    toToken: to.toUpperCase(),
    rate,
    amountOut,
    source: 'coingecko-backend',
    timestamp: new Date().toISOString(),
    routeStatus: 'skeleton',
  };
};

const getTrackedPoolsPayload = async (env: Env) => {
  const hexBlock = await rpcCall<string>(env, 'eth_blockNumber');
  const blockNumber = Number.parseInt(hexBlock, 16);

  return {
    chain: 'unichain',
    blockNumber,
    pools: TRACKED_POOL_IDS.map((poolId) => ({
      poolId,
      chain: 'unichain' as const,
      blockNumber,
      explorerUrl: `https://app.uniswap.org/explore/pools/unichain/${poolId}`,
    })),
  };
};

const normalizeAddress = (value: string) => value.trim().toLowerCase();

const hexToDecimalString = (value: string, decimals: number) => {
  const raw = BigInt(value);
  const unit = BigInt(10) ** BigInt(decimals);
  const whole = raw / unit;
  const fraction = raw % unit;
  if (fraction === BigInt(0)) return whole.toString();
  const fractionString = fraction.toString().padStart(decimals, '0').replace(/0+$/, '');
  return `${whole}.${fractionString}`;
};

const getWalletOverview = async (env: Env, address: string) => {
  const normalizedAddress = normalizeAddress(address);

  if (!/^0x[a-f0-9]{40}$/.test(normalizedAddress)) {
    throw new Error('Invalid wallet address');
  }

  const nativeBalanceHex = await rpcCall<string>(env, 'eth_getBalance', [normalizedAddress, 'latest']);
  const nativeBalanceEth = hexToDecimalString(nativeBalanceHex, 18);

  let tokenBalances: {
    symbol: string;
    balance: string;
    rawBalance: string;
    decimals: number;
  }[] = [];

  try {
    const tokenBalancesResult = await rpcCall<{ tokenBalances?: { contractAddress: string; tokenBalance: string }[] }>(
      env,
      'alchemy_getTokenBalances',
      [normalizedAddress]
    );

    const tokens = tokenBalancesResult.tokenBalances || [];

    const metaPromises = tokens.map(async (token) => {
      if (!token.tokenBalance || token.tokenBalance === '0x0') return null;
      const metadata = await rpcCall<{ symbol?: string; decimals?: number }>(
        env,
        'alchemy_getTokenMetadata',
        [token.contractAddress]
      );

      const symbol = (metadata.symbol || '').toUpperCase();
      const decimals = Number(metadata.decimals ?? 18);

      if (!SUPPORTED_SYMBOLS.has(symbol)) return null;

      return {
        symbol,
        decimals,
        rawBalance: token.tokenBalance,
        balance: hexToDecimalString(token.tokenBalance, decimals),
      };
    });

    tokenBalances = (await Promise.all(metaPromises)).filter(
      (item): item is { symbol: string; balance: string; rawBalance: string; decimals: number } =>
        Boolean(item)
    );
  } catch {
    tokenBalances = [];
  }

  return {
    address: normalizedAddress,
    nativeBalanceEth,
    tokenBalances,
    openPositions: [],
    source: 'rpc+alchemy',
  };
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/uniswap/quote' || url.pathname === '/api/swap-rate') {
      const from = url.searchParams.get('from') || '';
      const to = url.searchParams.get('to') || '';
      const amountIn = url.searchParams.get('amountIn');

      if (!from || !to) {
        return json(
          { error: 'Missing required query params: from, to' },
          { status: 400 }
        );
      }

      try {
        const payload = await getQuotePayload(from, to, amountIn, env.COINGECKO_API_KEY);
        return json(payload);
      } catch (error) {
        return json(
          {
            error: error instanceof Error ? error.message : 'Unknown backend error',
          },
          { status: 502 }
        );
      }
    }

    if (url.pathname === '/api/onchain/pools') {
      try {
        return json(await getTrackedPoolsPayload(env));
      } catch (error) {
        return json(
          { error: error instanceof Error ? error.message : 'Failed to fetch onchain pools' },
          { status: 502 }
        );
      }
    }

    if (url.pathname === '/api/wallet/overview') {
      const address = url.searchParams.get('address') || '';
      if (!address) {
        return json({ error: 'Missing required query param: address' }, { status: 400 });
      }

      try {
        return json(await getWalletOverview(env, address));
      } catch (error) {
        return json(
          { error: error instanceof Error ? error.message : 'Failed to fetch wallet overview' },
          { status: 502 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  },
};
