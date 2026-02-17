import { env } from '@/lib/env';
import type { SwapQuote, SwapQuoteRequest } from '@/uniswapintegration/types/swap';

const buildQuoteUrl = ({ fromToken, toToken, chain, amountIn }: SwapQuoteRequest) => {
  const params = new URLSearchParams({
    from: fromToken,
    to: toToken,
    chain,
  });

  if (amountIn) {
    params.set('amountIn', amountIn);
  }

  return `${env.apiBaseUrl}/api/uniswap/quote?${params.toString()}`;
};

export const fetchSwapQuote = async (
  request: SwapQuoteRequest
): Promise<SwapQuote> => {
  const response = await fetch(buildQuoteUrl(request));

  if (!response.ok) {
    throw new Error(`Quote request failed (${response.status})`);
  }

  const payload = (await response.json()) as SwapQuote;

  if (!payload.rate || Number.isNaN(payload.rate)) {
    throw new Error('Invalid quote response');
  }

  return payload;
};
