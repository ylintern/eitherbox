import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const tokens = ['UNI', 'WBTC', 'WETH', 'USDC', 'USDT'];

const pools = [
  { name: 'USDC-USDT', tvl: '$2.4M', fee: '0.01%', apr: '12.4%' },
  { name: 'BTC-ETH', tvl: '$8.1M', fee: '0.3%', apr: '24.8%' },
  { name: 'ETH-USDC', tvl: '$5.2M', fee: '0.05%', apr: '18.2%' },
  { name: 'BTC-USDC', tvl: '$3.7M', fee: '0.3%', apr: '21.5%' }
];

const positions = [
  { pool: 'ETH-USDC', liquidity: '1,240.50', share: '0.12%', value: '$2,481' },
  { pool: 'BTC-ETH', liquidity: '0.234', share: '0.03%', value: '$4,820' }
];

interface Pool {
  name: string;
  tvl: string;
  fee: string;
  apr: string;
}

interface PoolTabProps {
  walletConnected: boolean;
}

export const PoolTab = ({ walletConnected }: PoolTabProps) => {
  const [poolSubTab, setPoolSubTab] = useState('available');
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [selectedYieldToken, setSelectedYieldToken] = useState('UNI');

  if (selectedPool) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Back Button */}
        <button
          onClick={() => setSelectedPool(null)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all"
        >
          ← Back to Pools
        </button>

        {/* Pool Details */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">{selectedPool.name}</h2>
              <p className="text-muted-foreground">Fee Tier: {selectedPool.fee}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{selectedPool.apr}</p>
              <p className="text-sm text-muted-foreground">APR</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4">
              <p className="text-muted-foreground text-sm mb-1">Total Liquidity</p>
              <p className="text-2xl font-bold">{selectedPool.tvl}</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-muted-foreground text-sm mb-1">24h Volume</p>
              <p className="text-2xl font-bold">$1.2M</p>
            </div>
          </div>
        </div>

        {/* Manage Liquidity Card */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-6">Manage Liquidity</h2>
          
          {/* Add/Remove Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
              variant="secondary"
              disabled={!walletConnected}
              className="py-6"
            >
              <Plus size={20} />
              Add Liquidity
            </Button>
            <Button
              variant="outline"
              disabled={!walletConnected}
              className="py-6"
            >
              <Minus size={20} />
              Remove Liquidity
            </Button>
          </div>

          {/* Price Range Selection */}
          <div className="glass-card p-4 mb-6">
            <label className="text-sm font-semibold block mb-3">Set Price Range</label>
            <p className="text-xs text-muted-foreground mb-4">Select the price range where your liquidity will be active</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-2">Min Price</label>
                <input
                  type="number"
                  placeholder="0.0"
                  className="w-full bg-glass px-4 py-3 rounded-lg outline-none border border-border focus:border-primary/50 transition-all text-sm"
                  disabled={!walletConnected}
                />
                <p className="text-xs text-muted-foreground mt-1">{selectedPool.name.split('-')[0]} per {selectedPool.name.split('-')[1]}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-2">Max Price</label>
                <input
                  type="number"
                  placeholder="0.0"
                  className="w-full bg-glass px-4 py-3 rounded-lg outline-none border border-border focus:border-primary/50 transition-all text-sm"
                  disabled={!walletConnected}
                />
                <p className="text-xs text-muted-foreground mt-1">{selectedPool.name.split('-')[0]} per {selectedPool.name.split('-')[1]}</p>
              </div>
            </div>

            {/* Current Price Indicator */}
            <div className="bg-primary/10 backdrop-blur-sm rounded-lg p-3 border border-primary/20">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Current Price</span>
                <span className="font-bold text-primary">1.0002</span>
              </div>
            </div>
          </div>

          {/* Liquidity Distribution Graph */}
          <div className="glass-card p-4 mb-6">
            <label className="text-sm font-semibold block mb-3">Liquidity Distribution</label>
            <div className="relative h-48 bg-background/30 rounded-lg p-4">
              <div className="absolute bottom-0 left-0 right-0 h-px bg-border"></div>
              
              <div className="flex items-end justify-center h-full gap-1">
                {[20, 35, 50, 70, 85, 95, 100, 95, 85, 70, 50, 35, 20].map((height, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-t transition-all ${
                      i >= 5 && i <= 7 
                        ? 'bg-primary/60' 
                        : 'bg-blue-500/20'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              
              <div className="absolute left-1/2 bottom-0 w-px h-full bg-primary/50 -translate-x-1/2">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full"></div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-primary whitespace-nowrap">
                  Current
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500/20 rounded"></div>
                <span className="text-muted-foreground">Total Liquidity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary/60 rounded"></div>
                <span className="text-muted-foreground">Your Range</span>
              </div>
            </div>
          </div>
          
          {/* Token Amount Inputs */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="glass-card p-4">
              <label className="text-sm text-muted-foreground block mb-2">Token A</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="0.0"
                  className="flex-1 bg-glass px-4 py-3 rounded-lg outline-none border border-border focus:border-primary/50 transition-all"
                  disabled={!walletConnected}
                />
                <div className="bg-glass-hover px-4 py-2 rounded-lg font-semibold border border-border">
                  {selectedPool.name.split('-')[0]}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Balance: 1,245.50</p>
            </div>
            
            <div className="glass-card p-4">
              <label className="text-sm text-muted-foreground block mb-2">Token B</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="0.0"
                  className="flex-1 bg-glass px-4 py-3 rounded-lg outline-none border border-border focus:border-primary/50 transition-all"
                  disabled={!walletConnected}
                />
                <div className="bg-glass-hover px-4 py-2 rounded-lg font-semibold border border-border">
                  {selectedPool.name.split('-')[1]}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Balance: 89.23</p>
            </div>
          </div>

          {/* Yield Token Preference */}
          <div className="glass-card p-4 border-primary/20">
            <label className="text-sm font-semibold block mb-3">Yield Token Preference</label>
            <p className="text-xs text-muted-foreground mb-4">Choose which token you want to receive from fee conversions</p>
            <div className="grid grid-cols-2 gap-3">
              {tokens.filter(t => ['UNI', 'WBTC', 'WETH', 'USDC'].includes(t)).map(token => (
                <label
                  key={token}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                    selectedYieldToken === token
                      ? 'bg-primary/10 border-primary'
                      : 'bg-glass border-border hover:bg-glass-hover'
                  } ${!walletConnected && 'opacity-50 cursor-not-allowed'}`}
                >
                  <input
                    type="radio"
                    name="yieldToken"
                    value={token}
                    checked={selectedYieldToken === token}
                    onChange={(e) => setSelectedYieldToken(e.target.value)}
                    disabled={!walletConnected}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="font-semibold">{token}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Pool Subtitle Navigation */}
      <div className="flex gap-4 border-b border-border">
        <button 
          onClick={() => setPoolSubTab('available')}
          className={`font-semibold pb-3 transition-all ${
            poolSubTab === 'available'
              ? 'text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Available Pools
        </button>
        {walletConnected && (
          <button 
            onClick={() => setPoolSubTab('positions')}
            className={`font-semibold pb-3 transition-all ${
              poolSubTab === 'positions'
                ? 'text-foreground border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Positions
          </button>
        )}
      </div>

      {/* Available Pools View */}
      {poolSubTab === 'available' && (
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-6">Available Pools</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {pools.map((pool, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedPool(pool)}
                className="glass-card p-6 hover:border-primary/50 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{pool.name}</h3>
                    <p className="text-sm text-muted-foreground">Fee Tier: {pool.fee}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{pool.apr}</p>
                    <p className="text-xs text-muted-foreground">APR</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Liquidity</span>
                  <span className="font-semibold text-foreground/80">{pool.tvl}</span>
                </div>
                <div className="mt-4 flex justify-end">
                  <span className="text-primary text-sm group-hover:text-primary/80">
                    Manage Pool →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Positions View */}
      {poolSubTab === 'positions' && walletConnected && (
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-6">Your Positions</h2>
          <div className="space-y-4">
            {positions.map((pos, i) => (
              <div 
                key={i} 
                className="glass-card p-4 hover:bg-glass-hover transition-all cursor-pointer"
                onClick={() => setSelectedPool(pools.find(p => p.name === pos.pool) || null)}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold">{pos.pool}</h3>
                  <span className="text-xl font-bold text-primary">{pos.value}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Liquidity</p>
                    <p className="font-semibold text-foreground/80">{pos.liquidity}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pool Share</p>
                    <p className="font-semibold text-foreground/80">{pos.share}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-primary hover:text-primary/80 transition-all">
                      Manage →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
