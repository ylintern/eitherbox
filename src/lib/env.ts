const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const env = {
  walletConnectProjectId:
    import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'eitherbox-demo',
  apiBaseUrl: trimTrailingSlash(import.meta.env.VITE_API_BASE_URL || ''),
  graphApiKey: import.meta.env.VITE_GRAPH_API_KEY || '',
  alchemyApiKey: import.meta.env.VITE_ALCHEMY_API_KEY || '',
  alchemyUnichainUrl: import.meta.env.VITE_ALCHEMY_UNICHAIN_URL || '',
  goldskyRpcUrl: import.meta.env.VITE_GOLDSKY_RPC_URL || '',
  eboxProjectId: import.meta.env.VITE_EBOX_PROJECT_ID || '',
};

export const getGraphGatewayUrl = (subgraphId: string) => {
  if (!env.graphApiKey) return '';
  return `https://gateway.thegraph.com/api/${env.graphApiKey}/subgraphs/id/${subgraphId}`;
};

export const normalizeRpcUrl = (url: string) => trimTrailingSlash(url);
