import { useState } from 'react';
import { Plus, ArrowLeft, ArrowLeftRight } from 'lucide-react';

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
  onNavigateToYield: () => void;
}

export const PoolTab = ({ walletConnected, onNavigateToYield }: PoolTabProps) => {
  const [poolSubTab, setPoolSubTab] = useState('available');
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [selectedYieldToken, setSelectedYieldToken] = useState('UNI');
  const [isTokenOrderReversed, setIsTokenOrderReversed] = useState(false);
  const [selectedRange, setSelectedRange] = useState<string | null>('50/50');
  const [timeRange, setTimeRange] = useState('7D');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  
  const currentPrice = 1.0002; // Mock current market price

  const handleRangeSelect = (range: string) => {
    setSelectedRange(range);
    const percentage = parseInt(range.split('/')[0]) / 100;
    const min = (currentPrice * (1 - percentage)).toFixed(4);
    const max = (currentPrice * (1 + percentage)).toFixed(4);
    setMinPrice(min);
    setMaxPrice(max);
  };

  const getTokenPair = () => {
    if (!selectedPool) return { tokenA: '', tokenB: '' };
    const [first, second] = selectedPool.name.split('-');
    return isTokenOrderReversed 
      ? { tokenA: second, tokenB: first }
      : { tokenA: first, tokenB: second };
  };

  const { tokenA, tokenB } = getTokenPair();

  if (selectedPool) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => setSelectedPool(null)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-bubble border border-bubble-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300"
        >
          <ArrowLeft size={16} />
          Back to Pools
        </button>

        {/* Pool Details */}
        <div className="bubble p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">{selectedPool.name}</h2>
              <span className="inline-block px-4 py-1.5 rounded-full bg-muted/50 text-sm text-muted-foreground">
                Fee Tier: {selectedPool.fee}
              </span>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-primary">{selectedPool.apr}</p>
              <p className="text-sm text-muted-foreground">APR</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bubble-sm p-5 text-center">
              <p className="text-muted-foreground text-sm mb-2">Total Liquidity</p>
              <p className="text-2xl font-bold">{selectedPool.tvl}</p>
            </div>
            <div className="bubble-sm p-5 text-center">
              <p className="text-muted-foreground text-sm mb-2">24h Volume</p>
              <p className="text-2xl font-bold">$1.2M</p>
            </div>
          </div>
        </div>

        {/* Manage Liquidity */}
        <div className="bubble p-8">
          <h2 className="text-2xl font-bold mb-8">Manage Liquidity</h2>
          
          {/* Yield Token Preference */}
          <div className="bubble-sm p-6 mb-6 border-primary/20">
            <label className="text-sm font-semibold block mb-2">Yield Token Preference</label>
            <p className="text-xs text-muted-foreground mb-5">Choose which token you want to receive from fee conversions</p>
            <div className="grid grid-cols-2 gap-3">
              {tokens.filter(t => ['UNI', 'WBTC', 'WETH', 'USDC'].includes(t)).map(token => (
                <label
                  key={token}
                  className={`flex items-center gap-3 p-4 rounded-full cursor-pointer transition-all duration-300 border ${
                    selectedYieldToken === token
                      ? 'bg-primary/15 border-primary'
                      : 'bg-muted/30 border-bubble-border hover:bg-bubble-hover hover:border-primary/30'
                  } ${!walletConnected && 'opacity-50 cursor-not-allowed'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedYieldToken === token ? 'border-primary' : 'border-muted-foreground'
                  }`}>
                    {selectedYieldToken === token && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="font-semibold">{token}</span>
                  <input
                    type="radio"
                    name="yieldToken"
                    value={token}
                    checked={selectedYieldToken === token}
                    onChange={(e) => setSelectedYieldToken(e.target.value)}
                    disabled={!walletConnected}
                    className="sr-only"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="bubble-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold">Set Price Range</label>
              <button
                onClick={() => setIsTokenOrderReversed(!isTokenOrderReversed)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/30 border border-bubble-border hover:border-primary/30 hover:bg-bubble-hover transition-all duration-300 text-xs"
              >
                <ArrowLeftRight size={14} />
                <span>{tokenA}/{tokenB}</span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Select the price range where your liquidity will be active</p>
            
            {/* Range Quick Buttons */}
            <div className="flex gap-2 mb-5">
              {['3/3', '25/25', '50/50', '80/20', '100/100'].map(range => (
                <button
                  key={range}
                  onClick={() => handleRangeSelect(range)}
                  disabled={!walletConnected}
                  className={`flex-1 py-2 px-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                    selectedRange === range
                      ? 'bg-primary/20 border-2 border-primary/50 text-primary'
                      : 'bg-muted/30 border border-bubble-border text-muted-foreground hover:border-primary/30 hover:bg-bubble-hover'
                  } ${!walletConnected && 'opacity-50 cursor-not-allowed'}`}
                >
                  ±{range.split('/')[0]}%
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="text-xs text-muted-foreground block mb-2">Min Price</label>
                <input
                  type="number"
                  placeholder="0.0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-muted/30 px-5 py-3.5 rounded-full outline-none border border-bubble-border focus:border-primary/50 transition-all duration-300 text-sm"
                  disabled={!walletConnected}
                />
                <p className="text-xs text-muted-foreground mt-2 ml-2">{tokenA} per {tokenB}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-2">Max Price</label>
                <input
                  type="number"
                  placeholder="0.0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-muted/30 px-5 py-3.5 rounded-full outline-none border border-bubble-border focus:border-primary/50 transition-all duration-300 text-sm"
                  disabled={!walletConnected}
                />
                <p className="text-xs text-muted-foreground mt-2 ml-2">{tokenA} per {tokenB}</p>
              </div>
            </div>

            <div className="bg-primary/10 backdrop-blur-sm rounded-full p-4 border border-primary/20">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Current Price</span>
                <span className="font-bold text-primary">{currentPrice} {tokenA}/{tokenB}</span>
              </div>
            </div>
          </div>

          {/* Liquidity Distribution */}
          <div className="bubble-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold">Liquidity Distribution</label>
              <div className="flex gap-1 p-1 rounded-full bg-muted/30 border border-bubble-border">
                {['1D', '7D', '30D', '1Y'].map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                      timeRange === range
                        ? 'bg-foreground/10 text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="relative h-48 bg-muted/20 rounded-[24px] p-4 overflow-hidden">
              {/* Active range gradient overlay */}
              <div 
                className="absolute top-4 bottom-4 bg-gradient-to-r from-transparent via-foreground/5 to-transparent pointer-events-none"
                style={{ left: '30%', right: '30%' }}
              />
              
              {/* Left range boundary */}
              <div 
                className="absolute top-4 bottom-4 w-px bg-foreground/60"
                style={{ left: '30%' }}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rounded-full" />
                <div className="absolute top-2 left-2 text-[10px] text-foreground/80 whitespace-nowrap font-medium">
                  Min
                </div>
              </div>
              
              {/* Right range boundary */}
              <div 
                className="absolute top-4 bottom-4 w-px bg-foreground/60"
                style={{ right: '30%' }}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rounded-full" />
                <div className="absolute top-2 -left-6 text-[10px] text-foreground/80 whitespace-nowrap font-medium">
                  Max
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 right-4 h-px bg-border" />
              
              {/* Bars - more compact */}
              <div className="flex items-end justify-center h-full gap-0.5 pb-2 px-2">
                {[15, 22, 30, 40, 52, 65, 78, 88, 95, 100, 98, 92, 85, 75, 62, 50, 38, 28, 20, 14, 10].map((height, i) => {
                  const totalBars = 21;
                  const rangeStart = Math.floor(totalBars * 0.3);
                  const rangeEnd = Math.floor(totalBars * 0.7);
                  const isInRange = i >= rangeStart && i <= rangeEnd;
                  const isCenter = i === Math.floor(totalBars / 2);
                  
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-sm transition-all duration-300 ${
                        isInRange 
                          ? 'bg-primary/70' 
                          : 'bg-secondary/25'
                      }`}
                      style={{ height: `${height}%`, maxWidth: '12px' }}
                    />
                  );
                })}
              </div>
              
              {/* Current price marker */}
              <div className="absolute left-1/2 bottom-4 w-0.5 h-[calc(100%-32px)] bg-primary -translate-x-1/2">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/50" />
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-primary whitespace-nowrap font-medium">
                  Current
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-5 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-secondary/25 rounded-sm" />
                <span className="text-muted-foreground">Total Liquidity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary/70 rounded-sm" />
                <span className="text-muted-foreground">Your Range</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-foreground/60" />
                <span className="text-muted-foreground">Boundaries</span>
              </div>
            </div>
          </div>
          
          {/* Token Inputs */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bubble-sm p-5">
              <label className="text-sm text-muted-foreground block mb-3">{tokenA}</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="0.0"
                  className="flex-1 bg-muted/30 px-5 py-3.5 rounded-full outline-none border border-bubble-border focus:border-primary/50 transition-all duration-300"
                  disabled={!walletConnected}
                />
                <div className="bg-bubble-hover px-5 py-3 rounded-full font-semibold border border-bubble-border flex items-center">
                  {tokenA}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 ml-2">Balance: 1,245.50</p>
            </div>
            
            <div className="bubble-sm p-5">
              <label className="text-sm text-muted-foreground block mb-3">{tokenB}</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="0.0"
                  className="flex-1 bg-muted/30 px-5 py-3.5 rounded-full outline-none border border-bubble-border focus:border-primary/50 transition-all duration-300"
                  disabled={!walletConnected}
                />
                <div className="bg-bubble-hover px-5 py-3 rounded-full font-semibold border border-bubble-border flex items-center">
                  {tokenB}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 ml-2">Balance: 89.23</p>
            </div>
          </div>

          <button
            disabled={!walletConnected}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-full font-bold transition-all duration-300 ${
              walletConnected
                ? 'bg-primary/20 border-2 border-primary/50 text-primary hover:bg-primary/30 shadow-lg shadow-primary/10'
                : 'bg-muted text-muted-foreground cursor-not-allowed border border-bubble-border'
            }`}
          >
            <Plus size={20} />
            Add Liquidity
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Pool Sub-tabs */}
      <div className="flex justify-center">
        <div className="inline-flex gap-2 p-1.5 rounded-full bg-bubble border border-bubble-border">
          <button 
            onClick={() => setPoolSubTab('available')}
            className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
              poolSubTab === 'available'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Available Pools
          </button>
          {walletConnected && (
            <button 
              onClick={() => setPoolSubTab('positions')}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                poolSubTab === 'positions'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Positions
            </button>
          )}
        </div>
      </div>

      {/* Available Pools */}
      {poolSubTab === 'available' && (
        <div className="bubble p-8">
          <h2 className="text-2xl font-bold mb-2">Available Pools</h2>
          <p className="text-muted-foreground text-sm mb-8">Select a pool to provide liquidity</p>
          <div className="grid md:grid-cols-2 gap-4">
            {pools.map((pool, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedPool(pool)}
                className="bubble-sm p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{pool.name}</h3>
                    <span className="inline-block px-3 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground">
                      Fee: {pool.fee}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{pool.apr}</p>
                    <p className="text-xs text-muted-foreground">APR</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-muted-foreground">Total Liquidity</span>
                  <span className="font-semibold text-foreground/80">{pool.tvl}</span>
                </div>
                <div className="flex justify-end">
                  <span className="inline-flex items-center gap-1 text-primary text-sm group-hover:gap-2 transition-all">
                    Manage Pool
                    <span className="text-lg">→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Positions */}
      {poolSubTab === 'positions' && walletConnected && (
        <div className="bubble p-8">
          <h2 className="text-2xl font-bold mb-2">Your Positions</h2>
          <p className="text-muted-foreground text-sm mb-8">Manage your active liquidity positions</p>
          <div className="space-y-4">
            {positions.map((pos, i) => (
              <div key={i} className="bubble-sm p-6 hover:border-primary/30 transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">{pos.pool}</h3>
                  <span className="text-xl font-bold text-primary">{pos.value}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm mb-5">
                  <div className="text-center p-3 rounded-full bg-muted/30">
                    <p className="text-muted-foreground text-xs mb-1">Liquidity</p>
                    <p className="font-semibold text-foreground/80">{pos.liquidity}</p>
                  </div>
                  <div className="text-center p-3 rounded-full bg-muted/30">
                    <p className="text-muted-foreground text-xs mb-1">Pool Share</p>
                    <p className="font-semibold text-foreground/80">{pos.share}</p>
                  </div>
                  <div className="text-center p-3 rounded-full bg-primary/10">
                    <p className="text-muted-foreground text-xs mb-1">Yield Token</p>
                    <p className="font-semibold text-primary">UNI</p>
                  </div>
                </div>
                <button
                  onClick={onNavigateToYield}
                  className="w-full py-3 px-4 rounded-full bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30 transition-all duration-300 text-sm font-semibold"
                >
                  Manage Position →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
