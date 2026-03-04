import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Either Box',
  projectId: 'eitherbox-demo', // For production, get a real projectId from https://cloud.walletconnect.com
  chains: [base, baseSepolia],
  ssr: false,
});
