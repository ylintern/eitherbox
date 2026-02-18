import { useMemo, useState } from 'react';
import { Settings, ArrowUpDown, ChevronDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAccount } from 'wagmi';
import {
  CHAIN_LABELS,
  SUPPORTED_SWAP_CHAINS,
  SUPPORTED_SWAP_TOKENS,
  TOKEN_ADDRESS_BY_CHAIN,
  UNISWAP_APP_CHAIN_QUERY,
  useSwapQuote,
  useWalletOverview,
  type SupportedSwapChain,
  type SupportedTokenSymbol,
} from '@/uniswapintegration';

const tokens = SUPPORTED_SWAP_TOKENS;
const chains = SUPPORTED_SWAP_CHAINS;
const slippagePresets = ['0.3', '0.5', '1'];

interface SwapTabProps {
  walletConnected: boolean;
}

export const SwapTab = ({ walletConnected }: SwapTabProps) => {
  const [swapSubTab, setSwapSubTab] = useState('standard');
  const [swapAmount, setSwapAmount] = useState('');
  const [fromToken, setFromToken] = useState<SupportedTokenSymbol>('USDC');
  const [toToken, setToToken] = useState<SupportedTokenSymbol>('UNI');
  const [fromChain, setFromChain] = useState<SupportedSwapChain>('unichain');
  const [toChain, setToChain] = useState<SupportedSwapChain>('unichain');
  const [slippage, setSlippage] = useState('0.3');
  const [slippageMode, setSlippageMode] = useState<'auto' | 'manual'>('auto');
  const [customSlippage, setCustomSlippage] = useState('');


  const { address } = useAccount();
  const { overview } = useWalletOverview(address);

  const getTokenBalance = (symbol: SupportedTokenSymbol) => {
    const token = overview?.tokenBalances.find((item) => item.symbol === symbol);
    if (!token) return null;
    const numeric = Number(token.balance);
    if (!Number.isFinite(numeric)) return null;
    return numeric;
  };

  const fromTokenBalance = getTokenBalance(fromToken);
  const toTokenBalance = getTokenBalance(toToken);

  const isCrossChain = swapSubTab === 'crosschain';

  const fallbackRate = isCrossChain ? 0.96 : 0.98;
  const { displayedRate, quote, isLoading, error } = useSwapQuote({
    fromToken,
    toToken,
    chain: fromChain,
    amountIn: swapAmount,
    fallbackRate,
  });

  const openUniswapSwap = () => {
    const chainQuery = UNISWAP_APP_CHAIN_QUERY[fromChain];
    const inputCurrency = TOKEN_ADDRESS_BY_CHAIN[fromChain][fromToken] || fromToken;
    const outputCurrency = TOKEN_ADDRESS_BY_CHAIN[fromChain][toToken] || toToken;
    const query = new URLSearchParams({
      chain: chainQuery,
      inputCurrency,
      outputCurrency,
    });

    if (swapAmount && Number.isFinite(Number(swapAmount)) && Number(swapAmount) > 0) {
      query.set('exactAmount', swapAmount);
      query.set('exactField', 'input');
    }

    window.open(`https://app.uniswap.org/swap?${query.toString()}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bubble p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Swap Tokens</h2>
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-12 h-12 rounded-full bg-bubble-hover border border-bubble-border flex items-center justify-center hover:border-primary/30 transition-all duration-300">
                <Settings size={20} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4 bubble" align="end">
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Slippage Settings</h3>
                
                {/* Auto/Manual Toggle */}
                <div className="flex gap-2 p-1 rounded-full bg-muted/30 border border-bubble-border">
                  <button
                    onClick={() => {
                      setSlippageMode('auto');
                      setSlippage('0.3');
                      setCustomSlippage('');
                    }}
                    className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all duration-300 ${
                      slippageMode === 'auto'
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Auto
                  </button>
                  <button
                    onClick={() => setSlippageMode('manual')}
                    className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all duration-300 ${
                      slippageMode === 'manual'
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Manual
                  </button>
                </div>

                {/* Preset Buttons */}
                <div className="flex gap-2">
                  {slippagePresets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setSlippage(preset);
                        setSlippageMode('manual');
                        setCustomSlippage('');
                      }}
                      className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all duration-300 border ${
                        slippage === preset && slippageMode === 'manual' && !customSlippage
                          ? 'bg-primary/20 border-primary/50 text-primary'
                          : 'bg-bubble-hover border-bubble-border text-muted-foreground hover:text-foreground hover:border-primary/30'
                      }`}
                    >
                      {preset}%
                    </button>
                  ))}
                </div>

                {/* Custom Input */}
                {slippageMode === 'manual' && (
                  <div className="relative">
                    <input
                      type="number"
                      value={customSlippage}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCustomSlippage(value);
                        if (value && parseFloat(value) > 0) {
                          setSlippage(value);
                        }
                      }}
                      placeholder="Custom"
                      step="0.1"
                      min="0.1"
                      max="50"
                      className="w-full bg-bubble-hover px-4 py-2.5 pr-8 rounded-full text-sm outline-none border border-bubble-border focus:border-primary/50 transition-all duration-300"
                    />
                    <span className="absolute right-4 top-2.5 text-sm text-muted-foreground">%</span>
                  </div>
                )}

                {/* Current Selection Display */}
                <div className="text-xs text-muted-foreground text-center pt-2 border-t border-bubble-border">
                  Current: <span className="text-foreground font-semibold">{slippage}%</span> slippage
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Swap Sub-tabs */}
        <div className="flex gap-2 mb-8 p-1.5 rounded-full bg-muted/30 border border-bubble-border">
          <button
            onClick={() => setSwapSubTab('standard')}
            className={`flex-1 py-3 px-4 rounded-full font-semibold text-sm transition-all duration-300 ${
              swapSubTab === 'standard'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Standard Swap
          </button>
          <button
            onClick={() => setSwapSubTab('crosschain')}
            className={`flex-1 py-3 px-4 rounded-full font-semibold text-sm transition-all duration-300 ${
              swapSubTab === 'crosschain'
                ? 'bg-secondary text-secondary-foreground shadow-lg shadow-secondary/30'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Cross-Chain
          </button>
        </div>

        {/* From Token Section */}
        <div className="bubble-sm p-5">
          <div className="flex justify-between mb-3">
            <span className="text-sm text-muted-foreground">From</span>
            <span className="text-sm text-muted-foreground">Balance: {fromTokenBalance?.toLocaleString(undefined, { maximumFractionDigits: 6 }) ?? '—'}</span>
          </div>
          
          {/* Chain Selector for Cross-chain */}
          {isCrossChain && (
            <div className="mb-4">
              <label className="text-xs text-muted-foreground block mb-2">Network</label>
              <div className="relative">
                <select
                  value={fromChain}
                  onChange={(e) => setFromChain(e.target.value as SupportedSwapChain)}
                  className="w-full appearance-none bg-secondary/10 px-5 py-3 pr-12 rounded-full text-sm font-semibold cursor-pointer hover:bg-secondary/20 transition-all duration-300 border border-secondary/30 text-secondary"
                >
                  {chains.map((chain) => (
                    <option key={chain} value={chain}>{CHAIN_LABELS[chain]}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-3.5 pointer-events-none text-secondary" size={16} />
              </div>
            </div>
          )}

          <div className="flex gap-3 items-center">
            <input
              type="number"
              value={swapAmount}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || parseFloat(val) >= 0) setSwapAmount(val);
              }}
              min="0"
              placeholder="0.0"
              className="flex-1 bg-transparent text-3xl font-semibold outline-none min-w-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]"
            />
            <div className="relative shrink-0">
              <select
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value as SupportedTokenSymbol)}
                className="appearance-none bg-bubble-hover px-5 py-3 pr-10 rounded-full font-semibold cursor-pointer hover:bg-muted transition-all duration-300 border border-bubble-border"
              >
                {tokens.map(token => (
                  <option key={token} value={token}>{token}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Swap Arrow - Sphere button */}
        <div className="flex justify-center py-3">
          <button className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            isCrossChain 
              ? 'bg-secondary/20 hover:bg-secondary/30 shadow-secondary/20 border-2 border-secondary/30' 
              : 'bg-primary/20 hover:bg-primary/30 shadow-primary/20 border-2 border-primary/30'
          }`}>
            <ArrowUpDown size={18} className={isCrossChain ? 'text-secondary' : 'text-primary'} />
          </button>
        </div>

        {/* To Token Section */}
        <div className="bubble-sm p-5 mb-6">
          <div className="flex justify-between mb-3">
            <span className="text-sm text-muted-foreground">To</span>
            <span className="text-sm text-muted-foreground">Balance: {toTokenBalance?.toLocaleString(undefined, { maximumFractionDigits: 6 }) ?? '—'}</span>
          </div>
          
          {/* Chain Selector for Cross-chain */}
          {isCrossChain && (
            <div className="mb-4">
              <label className="text-xs text-muted-foreground block mb-2">Network</label>
              <div className="relative">
                <select
                  value={toChain}
                  onChange={(e) => setToChain(e.target.value as SupportedSwapChain)}
                  className="w-full appearance-none bg-secondary/10 px-5 py-3 pr-12 rounded-full text-sm font-semibold cursor-pointer hover:bg-secondary/20 transition-all duration-300 border border-secondary/30 text-secondary"
                >
                  {chains.map((chain) => (
                    <option key={chain} value={chain}>{CHAIN_LABELS[chain]}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-3.5 pointer-events-none text-secondary" size={16} />
              </div>
            </div>
          )}

          <div className="flex gap-3 items-center">
            <input
              type="number"
              placeholder="0.0"
              className="flex-1 bg-transparent text-3xl font-semibold outline-none min-w-0"
              value={swapAmount ? (parseFloat(swapAmount) * displayedRate).toFixed(2) : ''}
              disabled
            />
            <div className="relative shrink-0">
              <select
                value={toToken}
                onChange={(e) => setToToken(e.target.value as SupportedTokenSymbol)}
                className="appearance-none bg-bubble-hover px-5 py-3 pr-10 rounded-full font-semibold cursor-pointer hover:bg-muted transition-all duration-300 border border-bubble-border"
              >
                {tokens.map(token => (
                  <option key={token} value={token}>{token}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Bridge Info for Cross-chain */}
        {isCrossChain && swapAmount && fromChain !== toChain && (
          <div className="bg-secondary/10 backdrop-blur-sm rounded-[20px] p-4 mb-5 border border-secondary/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-xs font-semibold text-secondary">Cross-Chain Bridge</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Bridge execution is not wired yet. You can swap on {CHAIN_LABELS[fromChain]} now; destination chain support is next.
            </p>
          </div>
        )}

        {/* Swap Details */}
        {swapAmount && (
          <div className={`backdrop-blur-sm rounded-[20px] p-4 mb-6 space-y-3 border ${
            isCrossChain 
              ? 'bg-secondary/10 border-secondary/20' 
              : 'bg-primary/10 border-primary/20'
          }`}>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Rate</span>
              <span className="text-foreground/80">
                1 {fromToken} = {displayedRate.toFixed(6)} {toToken}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price Source</span>
              <span className="text-foreground/80">
                {error ? 'fallback-estimate' : quote?.source ?? (isLoading ? 'loading' : 'estimate')}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Route Status</span>
              <span className="text-foreground/80">{quote?.routeStatus ?? 'skeleton'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quote Chain</span>
              <span className="text-foreground/80">{CHAIN_LABELS[quote?.chain ?? fromChain]}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Slippage</span>
              <span className="text-foreground/80">{slippage}%</span>
            </div>
            {quote?.fallbackReason && (
              <p className="text-xs text-muted-foreground break-all">
                Graph fallback reason: {quote.fallbackReason}
              </p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={openUniswapSwap}
          disabled={!swapAmount}
          className={`w-full py-4 rounded-full font-bold transition-all duration-300 ${
            swapAmount
              ? isCrossChain
                ? 'bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg shadow-secondary/30'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30'
              : 'bg-muted text-muted-foreground cursor-not-allowed border border-bubble-border'
          }`}
        >
          {!swapAmount 
            ? 'Enter Amount' 
            : isCrossChain
            ? 'Open Source-Chain Swap on Uniswap'
            : 'Open Swap on Uniswap'}
        </button>
      </div>
    </div>
  );
};
