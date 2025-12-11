import { useState } from 'react';
import { Settings, ArrowUpDown, ChevronDown } from 'lucide-react';

const tokens = ['UNI', 'WBTC', 'WETH', 'USDC', 'USDT'];
const chains = ['Ethereum', 'Arbitrum', 'Optimism', 'Base', 'Polygon'];

interface SwapTabProps {
  walletConnected: boolean;
}

export const SwapTab = ({ walletConnected }: SwapTabProps) => {
  const [swapSubTab, setSwapSubTab] = useState('standard');
  const [swapAmount, setSwapAmount] = useState('');
  const [fromToken, setFromToken] = useState('USDC');
  const [toToken, setToToken] = useState('UNI');
  const [fromChain, setFromChain] = useState('Ethereum');
  const [toChain, setToChain] = useState('Ethereum');
  const [slippage] = useState('0.3');

  const isCrossChain = swapSubTab === 'crosschain';

  return (
    <div className="max-w-xl mx-auto">
      <div className="bubble p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Swap Tokens</h2>
          <button className="w-12 h-12 rounded-full bg-bubble-hover border border-bubble-border flex items-center justify-center hover:border-primary/30 transition-all duration-300">
            <Settings size={20} />
          </button>
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
        <div className="bubble-sm p-5 mb-3">
          <div className="flex justify-between mb-3">
            <span className="text-sm text-muted-foreground">From</span>
            <span className="text-sm text-muted-foreground">Balance: 1,245.50</span>
          </div>
          
          {/* Chain Selector for Cross-chain */}
          {isCrossChain && (
            <div className="mb-4">
              <label className="text-xs text-muted-foreground block mb-2">Network</label>
              <div className="relative">
                <select
                  value={fromChain}
                  onChange={(e) => setFromChain(e.target.value)}
                  className="w-full appearance-none bg-secondary/10 px-5 py-3 pr-12 rounded-full text-sm font-semibold cursor-pointer hover:bg-secondary/20 transition-all duration-300 border border-secondary/30 text-secondary"
                  disabled={!walletConnected}
                >
                  {chains.map(chain => (
                    <option key={chain} value={chain}>{chain}</option>
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
              onChange={(e) => setSwapAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 bg-transparent text-3xl font-semibold outline-none min-w-0"
              disabled={!walletConnected}
            />
            <div className="relative shrink-0">
              <select
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value)}
                className="appearance-none bg-bubble-hover px-5 py-3 pr-10 rounded-full font-semibold cursor-pointer hover:bg-muted transition-all duration-300 border border-bubble-border"
                disabled={!walletConnected}
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
        <div className="flex justify-center -my-3 relative z-10">
          <button className={`w-14 h-14 rounded-full border-4 border-background flex items-center justify-center transition-all duration-300 shadow-lg ${
            isCrossChain 
              ? 'bg-secondary/20 hover:bg-secondary/30 shadow-secondary/20' 
              : 'bg-primary/20 hover:bg-primary/30 shadow-primary/20'
          }`}>
            <ArrowUpDown size={22} className={isCrossChain ? 'text-secondary' : 'text-primary'} />
          </button>
        </div>

        {/* To Token Section */}
        <div className="bubble-sm p-5 mb-6">
          <div className="flex justify-between mb-3">
            <span className="text-sm text-muted-foreground">To</span>
            <span className="text-sm text-muted-foreground">Balance: 89.23</span>
          </div>
          
          {/* Chain Selector for Cross-chain */}
          {isCrossChain && (
            <div className="mb-4">
              <label className="text-xs text-muted-foreground block mb-2">Network</label>
              <div className="relative">
                <select
                  value={toChain}
                  onChange={(e) => setToChain(e.target.value)}
                  className="w-full appearance-none bg-secondary/10 px-5 py-3 pr-12 rounded-full text-sm font-semibold cursor-pointer hover:bg-secondary/20 transition-all duration-300 border border-secondary/30 text-secondary"
                  disabled={!walletConnected}
                >
                  {chains.map(chain => (
                    <option key={chain} value={chain}>{chain}</option>
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
              value={swapAmount ? (parseFloat(swapAmount) * (isCrossChain ? 0.96 : 0.98)).toFixed(2) : ''}
              disabled
            />
            <div className="relative shrink-0">
              <select
                value={toToken}
                onChange={(e) => setToToken(e.target.value)}
                className="appearance-none bg-bubble-hover px-5 py-3 pr-10 rounded-full font-semibold cursor-pointer hover:bg-muted transition-all duration-300 border border-bubble-border"
                disabled={!walletConnected}
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
              Bridging from {fromChain} to {toChain}. Estimated time: 3-5 minutes
            </p>
          </div>
        )}

        {/* Swap Details */}
        {swapAmount && (
          <div className={`backdrop-blur-sm rounded-[20px] p-5 mb-6 space-y-3 border ${
            isCrossChain 
              ? 'bg-secondary/10 border-secondary/20' 
              : 'bg-primary/10 border-primary/20'
          }`}>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Rate</span>
              <span className="text-foreground/80">
                1 {fromToken} = {isCrossChain ? '0.96' : '0.98'} {toToken}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Slippage</span>
              <span className="text-foreground/80">{slippage}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fee</span>
              <span className="text-foreground/80">{isCrossChain ? '0.5%' : '0.3%'}</span>
            </div>
            {isCrossChain && fromChain !== toChain && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bridge Fee</span>
                <span className="text-foreground/80">~$2.50</span>
              </div>
            )}
          </div>
        )}

        <button
          disabled={!walletConnected || !swapAmount}
          className={`w-full py-4 rounded-full font-bold transition-all duration-300 ${
            walletConnected && swapAmount
              ? isCrossChain
                ? 'bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg shadow-secondary/30'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30'
              : 'bg-muted text-muted-foreground cursor-not-allowed border border-bubble-border'
          }`}
        >
          {!walletConnected 
            ? 'Connect Wallet to Swap' 
            : !swapAmount 
            ? 'Enter Amount' 
            : isCrossChain
            ? 'Bridge & Swap'
            : 'Swap Tokens'}
        </button>
      </div>
    </div>
  );
};
