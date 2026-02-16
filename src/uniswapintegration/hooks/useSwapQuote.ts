import { useEffect, useMemo, useState } from 'react';
import { fetchSwapQuote } from '@/uniswapintegration/services/quoteApi';
import type {
  SupportedTokenSymbol,
  SwapQuote,
} from '@/uniswapintegration/types/swap';

interface UseSwapQuoteParams {
  fromToken: SupportedTokenSymbol;
  toToken: SupportedTokenSymbol;
  amountIn?: string;
  fallbackRate: number;
}

export const useSwapQuote = ({
  fromToken,
  toToken,
  amountIn,
  fallbackRate,
}: UseSwapQuoteParams) => {
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadQuote = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextQuote = await fetchSwapQuote({ fromToken, toToken, amountIn });

        if (!cancelled) {
          setQuote(nextQuote);
        }
      } catch (err) {
        if (!cancelled) {
          setQuote(null);
          setError(err instanceof Error ? err.message : 'Unknown quote error');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadQuote();

    return () => {
      cancelled = true;
    };
  }, [amountIn, fromToken, toToken]);

  const displayedRate = useMemo(() => quote?.rate ?? fallbackRate, [fallbackRate, quote?.rate]);

  return {
    quote,
    displayedRate,
    error,
    isLoading,
  };
};
