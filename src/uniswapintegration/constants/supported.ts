import type {
  SupportedSwapChain,
  SupportedTokenSymbol,
} from '@/uniswapintegration/types/swap';

export const SUPPORTED_SWAP_TOKENS: SupportedTokenSymbol[] = [
  'UNI',
  'WBTC',
  'WETH',
  'USDC',
  'USDT',
];

export const SUPPORTED_SWAP_CHAINS: SupportedSwapChain[] = [
  'unichain',
  'ethereum',
  'base',
];

export const CHAIN_LABELS: Record<SupportedSwapChain, string> = {
  unichain: 'Unichain',
  ethereum: 'Ethereum',
  base: 'Base',
};

export const UNISWAP_APP_CHAIN_QUERY: Record<SupportedSwapChain, string> = {
  unichain: 'unichain',
  ethereum: 'mainnet',
  base: 'base',
};

export const TOKEN_ADDRESS_BY_CHAIN: Record<
  SupportedSwapChain,
  Record<SupportedTokenSymbol, string>
> = {
  unichain: {
    UNI: '0x8f187aa05619a017077f5308904739877ce9ea21',
    WBTC: '0x9274a4f6e2147a3095f4d2a866f1f8f6d5c7c11b',
    WETH: '0x4200000000000000000000000000000000000006',
    USDC: '0x31d0220469e10c4e71834a79b1f276d740d3768f',
    USDT: '0x70262e266e50603AcFc5D58997eF73e5a8775844',
  },
  ethereum: {
    UNI: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    USDC: '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  },
  base: {
    UNI: '0x6d0f9a5f53f0f3f0439f2eb95c355f8810e3f4d0',
    WBTC: '0x0555E30da8f98308EdB960aa94C0Db47230d2B9c',
    WETH: '0x4200000000000000000000000000000000000006',
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    USDT: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
  },
};
