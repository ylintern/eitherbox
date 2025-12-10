import { useState } from 'react';

const yieldHistory = [
  { fromToken: 'USDC', toToken: 'UNI', usdAmount: '$1,245', tokenAmount: '124.5', date: '2h ago' },
  { fromToken: 'ETH', toToken: 'WBTC', usdAmount: '$2,340', tokenAmount: '0.045', date: '1d ago' },
  { fromToken: 'USDT', toToken: 'UNI', usdAmount: '$892', tokenAmount: '89.2', date: '3d ago' }
];

interface PositionCardProps {
  pool: string;
  value: string;
  inRange: boolean;
  fee: string;
  currentPrice: string;
  minPrice: string;
  maxPrice: string;
  yieldToken: string;
  poolShare: string;
  liquidity: string;
  pending: string;
}

const PositionCard = ({ 
  pool, value, inRange, fee, currentPrice, minPrice, maxPrice, 
  yieldToken, poolShare, liquidity, pending 
}: PositionCardProps) => {
  const [closePercentage, setClosePercentage] = useState(0);

  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold mb-1">{pool}</h3>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded border ${
              inRange 
                ? 'bg-primary/20 text-primary border-primary/30' 
                : 'bg-secondary/20 text-secondary border-secondary/30'
            }`}>
              {inRange ? '✓ In Range' : '⚠ Out of Range'}
            </span>
            <span className="text-xs text-muted-foreground">Fee: {fee}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-primary">{value}</p>
          <p className="text-xs text-muted-foreground">Position Value</p>
        </div>
      </div>

      <div className="bg-background/30 rounded-lg p-3 mb-3 border border-glass-border">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-muted-foreground">Price Range</span>
          <span className={`text-xs ${inRange ? 'text-muted-foreground' : 'text-secondary'}`}>
            Current: {currentPrice}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Min: {minPrice}</span>
          <span className="text-muted-foreground">Max: {maxPrice}</span>
        </div>
      </div>

      <div className="bg-primary/10 rounded-lg p-3 mb-4 border border-primary/20">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Yield Preference</span>
          <span className="text-sm font-bold text-primary">{yieldToken}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pb-4 mb-4 border-b border-glass-border">
        <div>
          <p className="text-xs text-muted-foreground">Pool Share</p>
          <p className="font-semibold text-sm">{poolShare}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Liquidity</p>
          <p className="font-semibold text-sm">{liquidity}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Pending</p>
          <p className="font-semibold text-sm text-primary">{pending}</p>
        </div>
      </div>

      {/* Close Position Section */}
      <div className="bg-background/30 rounded-lg p-4 mb-4 border border-glass-border">
        <label className="text-sm font-semibold block mb-3">Close Position</label>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground">Amount to Remove</span>
            <span className="text-sm font-bold text-yellow">{closePercentage}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={closePercentage}
            onChange={(e) => setClosePercentage(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <input
            type="number"
            min="0"
            max="100"
            value={closePercentage}
            onChange={(e) => setClosePercentage(Math.min(100, Math.max(0, Number(e.target.value))))}
            placeholder="0"
            className="flex-1 bg-glass px-4 py-2 rounded-lg outline-none border border-glass-border focus:border-yellow/50 transition-all text-sm"
          />
          <div className="bg-glass-hover px-4 py-2 rounded-lg font-semibold border border-glass-border flex items-center">
            %
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[25, 50, 75, 100].map(percent => (
            <button
              key={percent}
              onClick={() => setClosePercentage(percent)}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                closePercentage === percent
                  ? 'bg-yellow/20 border border-yellow/50 text-yellow'
                  : 'bg-glass border border-glass-border text-muted-foreground hover:bg-glass-hover'
              }`}
            >
              {percent}%
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="py-3 rounded-lg bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30 transition-all font-semibold text-sm">
          Claim Fees
        </button>
        <button 
          disabled={closePercentage === 0}
          className={`py-3 rounded-lg font-semibold text-sm transition-all ${
            closePercentage > 0
              ? 'bg-secondary/20 border border-secondary/50 text-secondary hover:bg-secondary/30'
              : 'bg-glass border border-glass-border text-muted-foreground cursor-not-allowed'
          }`}
        >
          Close {closePercentage}%
        </button>
      </div>
    </div>
  );
};

interface YieldTabProps {
  walletConnected: boolean;
  onConnect: () => void;
}

export const YieldTab = ({ walletConnected, onConnect }: YieldTabProps) => {
  return (
    <div className="space-y-6">
      {/* Pending Fees */}
      {walletConnected ? (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Pending Fees</h2>
            <span className="text-2xl font-bold text-primary">$309.50</span>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center py-2 border-b border-glass-border">
              <span className="text-sm text-muted-foreground">USDC</span>
              <span className="font-semibold">124.50</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-glass-border">
              <span className="text-sm text-muted-foreground">ETH</span>
              <span className="font-semibold">0.05</span>
            </div>
          </div>

          <button className="w-full py-3 rounded-lg font-bold bg-primary hover:bg-primary/90 transition-all text-primary-foreground shadow-lg shadow-primary/20">
            Claim All Fees
          </button>
        </div>
      ) : (
        <div className="glass-card p-8 text-center">
          <h2 className="text-xl font-bold mb-3">Pending Fees</h2>
          <p className="text-muted-foreground mb-4">Connect wallet to view and claim pending fees</p>
          <button
            onClick={onConnect}
            className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 transition-all font-semibold text-primary-foreground shadow-lg shadow-primary/20"
          >
            Connect Wallet
          </button>
        </div>
      )}

      {/* Active Pools */}
      {walletConnected && (
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-6">Active Pools</h2>
          <p className="text-sm text-muted-foreground mb-6">Pools where you currently have open positions</p>
          <div className="space-y-6">
            <PositionCard
              pool="ETH-USDC"
              value="$2,481"
              inRange={true}
              fee="0.05%"
              currentPrice="1.0002"
              minPrice="0.9980"
              maxPrice="1.0020"
              yieldToken="UNI"
              poolShare="0.12%"
              liquidity="1,240.50"
              pending="$45.30"
            />
            <PositionCard
              pool="BTC-ETH"
              value="$4,820"
              inRange={false}
              fee="0.3%"
              currentPrice="0.0548"
              minPrice="0.0520"
              maxPrice="0.0540"
              yieldToken="WBTC"
              poolShare="0.03%"
              liquidity="0.234"
              pending="$12.80"
            />
          </div>
        </div>
      )}

      {/* Conversion History */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-4">Conversion History</h2>
        <p className="text-muted-foreground text-sm mb-6">Your automated fee conversions from USD to yield tokens</p>
        <div className="space-y-3">
          {yieldHistory.map((item, i) => (
            <div key={i} className="glass-card p-4 hover:border-primary/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-muted-foreground text-sm">{item.fromToken}</span>
                    <span className="text-muted-foreground/50">→</span>
                    <span className="font-bold text-primary">{item.toToken}</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{item.usdAmount}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">{item.tokenAmount} {item.toToken}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-glass-border">
                <span className="text-xs text-muted-foreground">Converted automatically</span>
                <span className="text-xs text-primary">✓ Completed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
