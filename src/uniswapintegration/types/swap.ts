export type SupportedTokenSymbol =
  | 'UNI'
  | 'WBTC'
  | 'WETH'
  | 'USDC'
  | 'USDT';

export type SupportedSwapChain = 'unichain' | 'ethereum' | 'base';

export interface SwapQuoteRequest {
  fromToken: SupportedTokenSymbol;
  toToken: SupportedTokenSymbol;
  chain: SupportedSwapChain;
  amountIn?: string;
}

export interface SwapQuote {
  fromToken: SupportedTokenSymbol;
  toToken: SupportedTokenSymbol;
  chain: SupportedSwapChain;
  rate: number;
  amountOut?: string;
  source: string;
  timestamp: string;
  routeStatus: 'skeleton' | 'live';
  fallbackReason?: string;
  route?: string[];
}
