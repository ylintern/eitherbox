import { useState } from 'react';
import { Settings, ArrowUpDown, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const tokens = ['UNI', 'WBTC', 'WETH', 'USDC', 'USDT'];

interface SwapTabProps {
  walletConnected: boolean;
  onConnect: () => void;
}

export const SwapTab = ({ walletConnected, onConnect }: SwapTabProps) => {
  const [swapAmount, setSwapAmount] = useState('');
  const [fromToken, setFromToken] = useState('USDC');
  const [toToken, setToToken] = useState('UNI');
  const [slippage] = useState('0.3');

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Swap Tokens</h2>
          <button className="p-2 rounded-lg hover:bg-glass-hover transition-all">
            <Settings size={20} />
          </button>
        </div>

        {/* From Token */}
        <div className="glass-card p-4 mb-2">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">From</span>
            <span className="text-sm text-muted-foreground">Balance: 1,245.50</span>
          </div>
          <div className="flex gap-3">
            <input
              type="number"
              value={swapAmount}
              onChange={(e) => setSwapAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 bg-transparent text-3xl font-semibold outline-none"
              disabled={!walletConnected}
            />
            <div className="relative">
              <select
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value)}
                className="appearance-none bg-glass-hover px-4 py-2 pr-10 rounded-lg font-semibold cursor-pointer hover:bg-muted transition-all border border-border"
                disabled={!walletConnected}
              >
                {tokens.map(token => (
                  <option key={token} value={token}>{token}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center -my-2 relative z-10">
          <button className="p-2 rounded-lg bg-primary/20 border-4 border-background hover:bg-primary/30 transition-all">
            <ArrowUpDown size={20} className="text-primary" />
          </button>
        </div>

        {/* To Token */}
        <div className="glass-card p-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">To</span>
            <span className="text-sm text-muted-foreground">Balance: 89.23</span>
          </div>
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="0.0"
              className="flex-1 bg-transparent text-3xl font-semibold outline-none"
              value={swapAmount ? (parseFloat(swapAmount) * 0.98).toFixed(2) : ''}
              disabled
            />
            <div className="relative">
              <select
                value={toToken}
                onChange={(e) => setToToken(e.target.value)}
                className="appearance-none bg-glass-hover px-4 py-2 pr-10 rounded-lg font-semibold cursor-pointer hover:bg-muted transition-all border border-border"
                disabled={!walletConnected}
              >
                {tokens.map(token => (
                  <option key={token} value={token}>{token}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Swap Details */}
        {swapAmount && (
          <div className="bg-primary/10 backdrop-blur-sm rounded-xl p-4 mb-4 space-y-2 border border-primary/20 animate-slide-up">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Rate</span>
              <span className="text-foreground/80">1 {fromToken} = 0.98 {toToken}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Slippage</span>
              <span className="text-foreground/80">{slippage}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fee</span>
              <span className="text-foreground/80">0.3%</span>
            </div>
          </div>
        )}

        <Button
          disabled={!walletConnected || !swapAmount}
          className="w-full"
          size="lg"
          onClick={walletConnected ? undefined : onConnect}
        >
          {!walletConnected ? 'Connect Wallet to Swap' : !swapAmount ? 'Enter Amount' : 'Swap Tokens'}
        </Button>
      </div>
    </div>
  );
};
