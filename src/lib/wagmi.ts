import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia, unichain, unichainSepolia } from 'wagmi/chains';
import { env } from './env';

export const config = getDefaultConfig({
  appName: 'Either Box',
  projectId: env.walletConnectProjectId,
  chains: [unichain, unichainSepolia, base, baseSepolia],
  ssr: false,
});
