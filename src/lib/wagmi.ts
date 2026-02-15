import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';
import { env } from './env';

export const config = getDefaultConfig({
  appName: 'Either Box',
  projectId: env.walletConnectProjectId,
  chains: [base, baseSepolia],
  ssr: false,
});
