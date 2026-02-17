interface Env {
  ASSETS: Fetcher;
  COINGECKO_API_KEY?: string;
  ALCHEMY_UNICHAIN_URL?: string;
  GOLDSKY_RPC_URL?: string;
  GRAPH_API_KEY?: string;
}

interface QuotePayload {
  fromToken: string;
  toToken: string;
  rate: number;
  amountOut?: string;
  source: string;
  timestamp: string;
  chain: 'unichain' | 'ethereum' | 'base';
  routeStatus: 'skeleton' | 'live';
  fallbackReason?: string;
}

const TRACKED_POOL_IDS = [
  '0x3258f413c7a88cda2fa8709a589d221a80f6574f63df5a5b6774485d8acc39d9',
  '0x51f9d63dda41107d6513047f7ed18133346ce4f3f4c4faf899151d8939b3496e',
  '0x53b06f1bb8b622cc4b7dbd9bc9f4a34788034bc48702cd2af4135b48444d5b24',
  '0xb2f3bbaf23e0197ec2e6f9ab730d00aaf26a9119ecd583bbb9ef3146b4afa248',
] as const;

const SUPPORTED_SYMBOLS = new Set(['UNI', 'WBTC', 'WETH', 'USDC', 'USDT']);
const SUPPORTED_CHAINS = new Set(['unichain', 'ethereum', 'base']);

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

const UNISWAP_V4_MAINNET_SUBGRAPH_ID =
  'DiYPVdygkfjDWhbxGSqAQxwBKmfKnkWQojqeM2rkLb3G';
const UNISWAP_V4_CHAIN_SUBGRAPH_ID =
  'aa3YpPCxatg4LaBbLFuv2iBC8Jvs9u3hwt5GTpS4Kit';
const UNISWAP_V3_MAINNET_SUBGRAPH_ID =
  '5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV';

const TOKEN_ADDRESS_BY_CHAIN: Record<'unichain' | 'ethereum' | 'base', Record<string, string>> = {
  unichain: {
    UNI: '0x8f187aa05619a017077f5308904739877ce9ea21',
    WBTC: '0x9274a4f6e2147a3095f4d2a866f1f8f6d5c7c11b',
    WETH: '0x4200000000000000000000000000000000000006',
    USDC: '0x31d0220469e10c4e71834a79b1f276d740d3768f',
    USDT: '0x70262e266e50603AcFc5D58997eF73e5a8775844',
  },
  ethereum: {
    UNI: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    USDC: '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  },
  base: {
    UNI: '0x6d0f9a5f53f0f3f0439f2eb95c355f8810e3f4d0',
    WBTC: '0x0555E30da8f98308EdB960aa94C0Db47230d2B9c',
    WETH: '0x4200000000000000000000000000000000000006',
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    USDT: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
  },
};

const PUBLIC_UNICHAIN_RPC_FALLBACKS = [
  'https://unichain-sepolia-rpc.publicnode.com',
  'https://rpc.ankr.com/unichain_testnet',
];

const resolveCoinId = (token: string) => TOKEN_TO_COINGECKO_ID[token.toUpperCase()] || '';

const getRpcUrls = (env: Env) => {
  const urls = [env.ALCHEMY_UNICHAIN_URL, env.GOLDSKY_RPC_URL, ...PUBLIC_UNICHAIN_RPC_FALLBACKS]
    .filter(Boolean)
    .map((url) => (url as string).trim())
    .filter((url, index, arr) => arr.indexOf(url) === index);

  return urls;
};

const rpcCall = async <T>(env: Env, method: string, params: unknown[] = []) => {
  const rpcUrls = getRpcUrls(env);

  if (rpcUrls.length === 0) {
    throw new Error('No RPC URLs configured');
  }

  const errors: string[] = [];

  for (const rpcUrl of rpcUrls) {
    try {
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
        errors.push(`${rpcUrl}: HTTP ${response.status}`);
        continue;
      }

      const payload = (await response.json()) as {
        result?: T;
        error?: { message?: string };
      };

      if (payload.error) {
        errors.push(`${rpcUrl}: ${payload.error.message || 'RPC error'}`);
        continue;
      }

      return payload.result as T;
    } catch (error) {
      errors.push(`${rpcUrl}: ${error instanceof Error ? error.message : 'network error'}`);
    }
  }

  throw new Error(`RPC ${method} failed on all providers: ${errors.join(' | ')}`);
};


const normalizeSymbol = (token: string) => token.trim().toUpperCase();

const ensureSupportedSymbol = (token: string) => {
  const normalized = normalizeSymbol(token);
  if (!SUPPORTED_SYMBOLS.has(normalized)) {
    throw new Error(`Unsupported token symbol: ${token}`);
  }

  return normalized;
};

const getCoinGeckoSwapRate = async (from: string, to: string, apiKey?: string) => {
  const fromSymbol = ensureSupportedSymbol(from);
  const toSymbol = ensureSupportedSymbol(to);
  const fromId = resolveCoinId(fromSymbol);
  const toId = resolveCoinId(toSymbol);

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

const fetchUniswapGraphRateBySubgraph = async (
  from: string,
  to: string,
  chain: 'unichain' | 'ethereum' | 'base',
  graphApiKey: string,
  subgraphId: string,
  sourceLabel: 'uniswap-v4-subgraph' | 'uniswap-v3-subgraph'
) => {
  const fromAddress = TOKEN_ADDRESS_BY_CHAIN[chain][ensureSupportedSymbol(from)];
  const toAddress = TOKEN_ADDRESS_BY_CHAIN[chain][ensureSupportedSymbol(to)];

  if (!fromAddress || !toAddress) {
    throw new Error('Unsupported token for Uniswap mainnet subgraph quote source');
  }

  const endpoint = `https://gateway.thegraph.com/api/${graphApiKey}/subgraphs/id/${subgraphId}`;
  const query = `
    query QuotePrice($from: ID!, $to: ID!) {
      fromToken: token(id: $from) {
        derivedETH
      }
      toToken: token(id: $to) {
        derivedETH
      }
    }
  `;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        from: fromAddress.toLowerCase(),
        to: toAddress.toLowerCase(),
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${sourceLabel} request failed (${response.status}): ${text}`);
  }

  const payload = (await response.json()) as {
    data?: {
      fromToken?: { derivedETH?: string };
      toToken?: { derivedETH?: string };
    };
    errors?: { message?: string }[];
  };

  if (payload.errors?.length) {
    throw new Error(payload.errors[0]?.message || `${sourceLabel} returned an unknown error`);
  }

  const fromDerivedEth = Number(payload.data?.fromToken?.derivedETH);
  const toDerivedEth = Number(payload.data?.toToken?.derivedETH);

  if (!Number.isFinite(fromDerivedEth) || !Number.isFinite(toDerivedEth) || toDerivedEth <= 0) {
    throw new Error(`${sourceLabel} returned invalid derivedETH values`);
  }

  return {
    rate: fromDerivedEth / toDerivedEth,
    source: sourceLabel,
  };
};

const getUniswapGraphSwapRate = async (
  from: string,
  to: string,
  chain: 'unichain' | 'ethereum' | 'base',
  graphApiKey?: string
): Promise<{ rate: number; source: 'uniswap-v4-subgraph' | 'uniswap-v3-subgraph' }> => {
  if (!graphApiKey) {
    throw new Error('GRAPH_API_KEY is not configured');
  }

  const subgraphCandidates: { id: string; source: 'uniswap-v4-subgraph' | 'uniswap-v3-subgraph' }[] =
    chain === 'ethereum'
      ? [
          { id: UNISWAP_V4_MAINNET_SUBGRAPH_ID, source: 'uniswap-v4-subgraph' },
          { id: UNISWAP_V3_MAINNET_SUBGRAPH_ID, source: 'uniswap-v3-subgraph' },
        ]
      : [{ id: UNISWAP_V4_CHAIN_SUBGRAPH_ID, source: 'uniswap-v4-subgraph' }];

  const failures: string[] = [];

  for (const candidate of subgraphCandidates) {
    try {
      return await fetchUniswapGraphRateBySubgraph(
        from,
        to,
        chain,
        graphApiKey,
        candidate.id,
        candidate.source
      );
    } catch (error) {
      failures.push(error instanceof Error ? error.message : `unknown ${candidate.source} error`);
    }
  }

  throw new Error(`All Uniswap subgraph quote sources failed: ${failures.join(' | ')}`);
};

const getQuotePayload = async (
  from: string,
  to: string,
  chain: 'unichain' | 'ethereum' | 'base',
  amountIn: string | null,
  coingeckoApiKey?: string,
  graphApiKey?: string
): Promise<QuotePayload> => {
  let rate = 0;
  let source = 'coingecko-backend';
  let routeStatus: QuotePayload['routeStatus'] = 'skeleton';
  let fallbackReason: string | undefined;

  try {
    const graphQuote = await getUniswapGraphSwapRate(from, to, chain, graphApiKey);
    rate = graphQuote.rate;
    source = graphQuote.source;
    routeStatus = 'live';
  } catch (error) {
    fallbackReason = error instanceof Error ? error.message : 'Graph quote failed';
    rate = await getCoinGeckoSwapRate(from, to, coingeckoApiKey);
  }

  const parsedAmount = amountIn ? Number(amountIn) : NaN;
  const amountOut = Number.isFinite(parsedAmount)
    ? (parsedAmount * rate).toFixed(6)
    : undefined;

  return {
    fromToken: from.toUpperCase(),
    toToken: to.toUpperCase(),
    chain,
    rate,
    amountOut,
    source,
    timestamp: new Date().toISOString(),
    routeStatus,
    fallbackReason,
  };
};

const getTrackedPoolsPayload = async (env: Env) => {
  let blockNumber = 0;
  let source = 'static-pools';

  try {
    const hexBlock = await rpcCall<string>(env, 'eth_blockNumber');
    blockNumber = Number.parseInt(hexBlock, 16);
    source = 'rpc';
  } catch {
    blockNumber = 0;
    source = 'static-pools';
  }

  return {
    chain: 'unichain',
    blockNumber,
    source,
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

  let nativeBalanceEth = '0';
  try {
    const nativeBalanceHex = await rpcCall<string>(env, 'eth_getBalance', [normalizedAddress, 'latest']);
    nativeBalanceEth = hexToDecimalString(nativeBalanceHex, 18);
  } catch {
    nativeBalanceEth = '0';
  }

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
    source: 'rpc+alchemy-fallback-safe',
  };
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/uniswap/quote' || url.pathname === '/api/swap-rate') {
      const from = normalizeSymbol(url.searchParams.get('from') || '');
      const to = normalizeSymbol(url.searchParams.get('to') || '');
      const chainParam = (url.searchParams.get('chain') || 'unichain').toLowerCase();
      const amountIn = url.searchParams.get('amountIn');

      if (!from || !to) {
        return json(
          { error: 'Missing required query params: from, to' },
          { status: 400 }
        );
      }

      if (!SUPPORTED_CHAINS.has(chainParam)) {
        return json(
          { error: 'Invalid chain. Supported: unichain, ethereum, base' },
          { status: 400 }
        );
      }

      try {
        const payload = await getQuotePayload(
          from,
          to,
          chainParam as 'unichain' | 'ethereum' | 'base',
          amountIn,
          env.COINGECKO_API_KEY,
          env.GRAPH_API_KEY
        );
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
      return json(await getTrackedPoolsPayload(env));
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
