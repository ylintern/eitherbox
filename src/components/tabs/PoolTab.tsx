import { useState } from 'react';
import { Plus, ArrowLeft, ArrowLeftRight } from 'lucide-react';

const tokens = ['UNI', 'WBTC', 'WETH', 'USDC', 'USDT'];

const pools = [
  { name: 'USDC-USDT', tvl: '$2.4M', fee: '0.01%', apr: '12.4%', price: 1.0002 },
  { name: 'BTC-ETH', tvl: '$8.1M', fee: '0.3%', apr: '24.8%', price: 28.27 },
  { name: 'ETH-USDC', tvl: '$5.2M', fee: '0.05%', apr: '18.2%', price: 3200 },
  { name: 'BTC-USDC', tvl: '$3.7M', fee: '0.3%', apr: '21.5%', price: 90000 }
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
  price: number;
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
  
  const basePrice = selectedPool?.price ?? 1;
  const currentPrice = isTokenOrderReversed ? 1 / basePrice : basePrice;

  const formatPrice = (price: number) => {
    if (!price || !isFinite(price)) return '0';
    if (price >= 10000) return price.toFixed(0);
    if (price >= 1000) return price.toFixed(2);
    if (price >= 1) return price.toFixed(4);
    if (price >= 0.001) return price.toFixed(6);
    return price.toFixed(8);
  };

  const handleRangeSelect = (range: string) => {
    setSelectedRange(range);
    const percentage = parseFloat(range.split('/')[0]) / 100;
    const min = currentPrice * (1 - percentage);
    const max = currentPrice * (1 + percentage);
    setMinPrice(formatPrice(min));
    setMaxPrice(formatPrice(max));
  };

  const handleTokenOrderSwitch = () => {
    setIsTokenOrderReversed(!isTokenOrderReversed);
    setMinPrice('');
    setMaxPrice('');
    setSelectedRange(null);
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
                onClick={handleTokenOrderSwitch}
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
                  className={`flex-1 py-2 px-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                    selectedRange === range
                      ? 'bg-primary/20 border-2 border-primary/50 text-primary'
                      : 'bg-muted/30 border border-bubble-border text-muted-foreground hover:border-primary/30 hover:bg-bubble-hover'
                  }`}
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
                <span className="font-bold text-primary">{formatPrice(currentPrice)} {tokenA}/{tokenB}</span>
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
            
            {/* Chart container with price scale */}
            <div className="relative">
              {/* Main chart area - smaller and centered */}
              <div className="mx-8 relative h-32 bg-muted/20 rounded-[16px] overflow-hidden">
                {/* Active range gradient overlay */}
                {(() => {
                  const chartMin = currentPrice * 0.5;
                  const chartMax = currentPrice * 1.5;
                  const chartRange = chartMax - chartMin;
                  const minVal = parseFloat(minPrice) || currentPrice * 0.97;
                  const maxVal = parseFloat(maxPrice) || currentPrice * 1.03;
                  const leftPos = ((minVal - chartMin) / chartRange) * 100;
                  const rightPos = 100 - ((maxVal - chartMin) / chartRange) * 100;
                  
                  return (
                    <>
                      <div 
                        className="absolute top-0 bottom-0 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 pointer-events-none"
                        style={{ left: `${Math.max(0, leftPos)}%`, right: `${Math.max(0, rightPos)}%` }}
                      />
                      
                      {/* Min boundary - draggable */}
                      <div 
                        className="absolute top-0 bottom-0 w-1 bg-foreground/80 cursor-ew-resize hover:bg-foreground transition-colors z-10 group"
                        style={{ left: `${Math.max(2, Math.min(98, leftPos))}%` }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          const startX = e.clientX;
                          const startLeft = leftPos;
                          const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                          
                          const handleMouseMove = (moveEvent: MouseEvent) => {
                            if (!rect) return;
                            const deltaX = moveEvent.clientX - startX;
                            const deltaPercent = (deltaX / rect.width) * 100;
                            const newLeft = Math.max(2, Math.min(48, startLeft + deltaPercent));
                            const newMinPrice = chartMin + (newLeft / 100) * chartRange;
                            setMinPrice(formatPrice(newMinPrice));
                            setSelectedRange(null);
                          };
                          
                          const handleMouseUp = () => {
                            document.removeEventListener('mousemove', handleMouseMove);
                            document.removeEventListener('mouseup', handleMouseUp);
                          };
                          
                          document.addEventListener('mousemove', handleMouseMove);
                          document.addEventListener('mouseup', handleMouseUp);
                        }}
                      >
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-foreground rounded-full shadow-lg group-hover:scale-110 transition-transform" />
                      </div>
                      
                      {/* Max boundary - draggable */}
                      <div 
                        className="absolute top-0 bottom-0 w-1 bg-foreground/80 cursor-ew-resize hover:bg-foreground transition-colors z-10 group"
                        style={{ left: `${Math.max(2, Math.min(98, 100 - rightPos))}%` }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          const startX = e.clientX;
                          const startRight = rightPos;
                          const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                          
                          const handleMouseMove = (moveEvent: MouseEvent) => {
                            if (!rect) return;
                            const deltaX = moveEvent.clientX - startX;
                            const deltaPercent = (deltaX / rect.width) * 100;
                            const newRight = Math.max(2, Math.min(48, startRight - deltaPercent));
                            const newMaxPrice = chartMax - (newRight / 100) * chartRange;
                            setMaxPrice(formatPrice(newMaxPrice));
                            setSelectedRange(null);
                          };
                          
                          const handleMouseUp = () => {
                            document.removeEventListener('mousemove', handleMouseMove);
                            document.removeEventListener('mouseup', handleMouseUp);
                          };
                          
                          document.addEventListener('mousemove', handleMouseMove);
                          document.addEventListener('mouseup', handleMouseUp);
                        }}
                      >
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-foreground rounded-full shadow-lg group-hover:scale-110 transition-transform" />
                      </div>
                    </>
                  );
                })()}
                
                {/* Bars - full width, 200 bars */}
                <div className="flex items-end h-full gap-px px-0 py-2" style={{ backgroundColor: 'black' }}>
                  {Array.from({ length: 200 }, (_, i) => {
                    // Generate bell curve distribution
                    const center = 100;
                    const spread = 40;
                    const height = Math.max(5, 100 * Math.exp(-Math.pow(i - center, 2) / (2 * spread * spread)) + Math.random() * 15);
                    
                    const chartMin = currentPrice * 0.5;
                    const chartMax = currentPrice * 1.5;
                    const chartRange = chartMax - chartMin;
                    const minVal = parseFloat(minPrice) || currentPrice * 0.97;
                    const maxVal = parseFloat(maxPrice) || currentPrice * 1.03;
                    const totalBars = 200;
                    const barPrice = chartMin + ((i + 0.5) / totalBars) * chartRange;
                    const isInRange = barPrice >= minVal && barPrice <= maxVal;
                    
                    return (
                      <div
                        key={i}
                        className={`flex-1 transition-all duration-150 ${
                          isInRange ? 'bg-primary/70' : 'bg-secondary/40'
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    );
                  })}
                </div>
                
                {/* Current price marker */}
                <div className="absolute left-1/2 bottom-0 w-0.5 h-full bg-primary -translate-x-1/2">
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-primary rounded-full shadow-lg shadow-primary/50" />
                </div>
              </div>
              
              {/* Price scale axis */}
              <div className="mx-8 flex justify-between items-center mt-2 text-[10px] text-muted-foreground">
                <span>{formatPrice(currentPrice * 0.5)}</span>
                <span>{formatPrice(currentPrice * 0.75)}</span>
                <div className="flex flex-col items-center">
                  <span className="text-primary font-semibold">{formatPrice(currentPrice)}</span>
                  <span className="text-[8px]">Current</span>
                </div>
                <span>{formatPrice(currentPrice * 1.25)}</span>
                <span>{formatPrice(currentPrice * 1.5)}</span>
              </div>
              
              {/* Range values display */}
              <div className="flex justify-between items-center mt-3 px-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 bg-foreground rounded-full" />
                  <span className="text-muted-foreground">Min:</span>
                  <span className="font-semibold">{minPrice || formatPrice(currentPrice * 0.97)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Max:</span>
                  <span className="font-semibold">{maxPrice || formatPrice(currentPrice * 1.03)}</span>
                  <div className="w-2 h-2 bg-foreground rounded-full" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-secondary/30 rounded-sm" />
                <span className="text-muted-foreground">Total Liquidity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary/70 rounded-sm" />
                <span className="text-muted-foreground">Your Range</span>
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
