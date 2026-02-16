import { env } from '@/lib/env';
import type { WalletOverview } from '@/uniswapintegration/types/onchain';

export const fetchWalletOverview = async (address: string): Promise<WalletOverview> => {
  const response = await fetch(`${env.apiBaseUrl}/api/wallet/overview?address=${address}`);

  if (!response.ok) {
    throw new Error(`Wallet request failed (${response.status})`);
  }

  return (await response.json()) as WalletOverview;
};
