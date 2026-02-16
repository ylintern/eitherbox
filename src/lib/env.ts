const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const env = {
  walletConnectProjectId:
    import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'eitherbox-demo',
  apiBaseUrl: trimTrailingSlash(import.meta.env.VITE_API_BASE_URL || ''),
  coingeckoApiKey: import.meta.env.VITE_COINGECKO_API_KEY || '',
  graphApiKey: import.meta.env.VITE_GRAPH_API_KEY || '',
  alchemyApiKey: import.meta.env.VITE_ALCHEMY_API_KEY || '',
  alchemyUnichainUrl: import.meta.env.VITE_ALCHEMY_UNICHAIN_URL || '',
  goldskyRpcUrl: import.meta.env.VITE_GOLDSKY_RPC_URL || '',
  eboxProjectId: import.meta.env.VITE_EBOX_PROJECT_ID || '',
};

export const getCoinGeckoSimplePriceUrl = (
  ids: string[],
  vsCurrencies: string[] = ['usd']
) => {
  const params = new URLSearchParams({
    ids: ids.join(','),
    vs_currencies: vsCurrencies.join(','),
  });

  if (env.coingeckoApiKey) {
    params.set('x_cg_demo_api_key', env.coingeckoApiKey);
  }

  return `https://api.coingecko.com/api/v3/simple/price?${params.toString()}`;
};

export const getGraphGatewayUrl = (subgraphId: string) => {
  if (!env.graphApiKey) return '';
  return `https://gateway.thegraph.com/api/${env.graphApiKey}/subgraphs/id/${subgraphId}`;
};

export const normalizeRpcUrl = (url: string) => trimTrailingSlash(url);
