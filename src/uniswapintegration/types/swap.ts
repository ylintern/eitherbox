export type SupportedTokenSymbol =
  | 'UNI'
  | 'WBTC'
  | 'WETH'
  | 'USDC'
  | 'USDT';

export interface SwapQuoteRequest {
  fromToken: SupportedTokenSymbol;
  toToken: SupportedTokenSymbol;
  amountIn?: string;
}

export interface SwapQuote {
  fromToken: SupportedTokenSymbol;
  toToken: SupportedTokenSymbol;
  rate: number;
  amountOut?: string;
  source: string;
  timestamp: string;
  routeStatus: 'skeleton';
}
