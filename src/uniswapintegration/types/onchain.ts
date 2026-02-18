import type { SupportedTokenSymbol } from '@/uniswapintegration/types/swap';

export interface TrackedPool {
  poolId: string;
  chain: 'unichain';
  blockNumber: number;
  explorerUrl: string;
  token0Symbol?: string;
  token1Symbol?: string;
  feeTier?: string;
  tvlUsd?: string;
  volumeUsd?: string;
  source?: string;
}

export interface WalletTokenBalance {
  symbol: SupportedTokenSymbol;
  balance: string;
  rawBalance: string;
  decimals: number;
}

export interface WalletOverview {
  address: string;
  nativeBalanceEth: string;
  tokenBalances: WalletTokenBalance[];
  openPositions: {
    poolId: string;
    liquidity: string;
  }[];
  source: string;
}
