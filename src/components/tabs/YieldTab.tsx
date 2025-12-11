import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="bubble overflow-hidden">
      <CollapsibleTrigger className="w-full p-6 flex justify-between items-center cursor-pointer hover:bg-muted/10 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="text-left">
            <h3 className="text-xl font-bold">{pool}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-3 py-1 rounded-full border ${
                inRange 
                  ? 'bg-primary/15 text-primary border-primary/30' 
                  : 'bg-secondary/15 text-secondary border-secondary/30'
              }`}>
                {inRange ? '● In Range' : '○ Out of Range'}
              </span>
              <span className="text-xs text-muted-foreground">{fee}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xl font-bold text-primary">{value}</p>
            <p className="text-xs text-muted-foreground">Pending: {pending}</p>
          </div>
          <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
        <div className="px-6 pb-6 pt-2 border-t border-bubble-border">
          {/* Stats row - spheres */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="text-center p-4 rounded-[20px] bg-muted/20 border border-bubble-border">
              <p className="text-xs text-muted-foreground mb-1">Pool Share</p>
              <p className="font-semibold">{poolShare}</p>
            </div>
            <div className="text-center p-4 rounded-[20px] bg-muted/20 border border-bubble-border">
              <p className="text-xs text-muted-foreground mb-1">Liquidity</p>
              <p className="font-semibold">{liquidity}</p>
            </div>
            <div className="text-center p-4 rounded-[20px] bg-primary/10 border border-primary/20">
              <p className="text-xs text-muted-foreground mb-1">Pending</p>
              <p className="font-semibold text-primary">{pending}</p>
            </div>
          </div>

          {/* Price Range */}
          <div className="bg-muted/20 rounded-[20px] p-5 mb-5 border border-bubble-border">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-muted-foreground">Price Range</span>
              <span className={`text-xs ${inRange ? 'text-muted-foreground' : 'text-secondary'}`}>
                Current: {currentPrice}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="px-4 py-2 rounded-full bg-bubble border border-bubble-border text-muted-foreground">
                Min: {minPrice}
              </span>
              <span className="px-4 py-2 rounded-full bg-bubble border border-bubble-border text-muted-foreground">
                Max: {maxPrice}
              </span>
            </div>
          </div>

          {/* Yield Preference */}
          <div className="bg-primary/10 rounded-[20px] p-4 mb-5 border border-primary/20">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Yield Preference</span>
              <span className="font-bold text-primary px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30">
                {yieldToken}
              </span>
            </div>
          </div>

          {/* Close Position Section */}
          <div className="bg-muted/20 rounded-[24px] p-6 mb-5 border border-bubble-border">
            <label className="text-sm font-semibold block mb-4">Close Position</label>
            
            <div className="mb-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-muted-foreground">Amount to Remove</span>
                <span className="text-lg font-bold text-foreground px-4 py-1 rounded-full bg-foreground/10 border border-foreground/30">
                  {closePercentage}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={closePercentage}
                onChange={(e) => setClosePercentage(Number(e.target.value))}
                className="w-full h-3"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <input
                type="number"
                min="0"
                max="100"
                value={closePercentage}
                onChange={(e) => setClosePercentage(Math.min(100, Math.max(0, Number(e.target.value))))}
                placeholder="0"
                className="flex-1 bg-bubble px-5 py-3 rounded-full outline-none border border-bubble-border focus:border-foreground/50 transition-all duration-300 text-sm"
              />
              <div className="bg-bubble-hover px-5 py-3 rounded-full font-semibold border border-bubble-border flex items-center">
                %
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[25, 50, 75, 100].map(percent => (
                <button
                  key={percent}
                  onClick={() => setClosePercentage(percent)}
                  className={`py-3 px-3 rounded-full text-xs font-semibold transition-all duration-300 ${
                    closePercentage === percent
                      ? 'bg-foreground/20 border-2 border-foreground/50 text-foreground'
                      : 'bg-bubble border border-bubble-border text-muted-foreground hover:bg-bubble-hover hover:border-foreground/30'
                  }`}
                >
                  {percent}%
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="py-4 rounded-full bg-primary/20 border-2 border-primary/50 text-primary hover:bg-primary/30 transition-all duration-300 font-semibold">
              Claim Fees
            </button>
            <button 
              disabled={closePercentage === 0}
              className={`py-4 rounded-full font-semibold transition-all duration-300 ${
                closePercentage > 0
                  ? 'bg-secondary/20 border-2 border-secondary/50 text-secondary hover:bg-secondary/30'
                  : 'bg-muted border border-bubble-border text-muted-foreground cursor-not-allowed'
              }`}
            >
              Close {closePercentage}%
            </button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

interface YieldTabProps {
  walletConnected: boolean;
  onConnect: () => void;
}

export const YieldTab = ({ walletConnected, onConnect }: YieldTabProps) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Pending Fees */}
      {walletConnected ? (
        <div className="bubble p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Pending Fees</h2>
            <span className="text-3xl font-bold text-primary">$309.50</span>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center py-4 px-5 rounded-full bg-muted/20 border border-bubble-border">
              <span className="text-sm text-muted-foreground">UNI (from ETH-USDC)</span>
              <span className="font-semibold">24.50</span>
            </div>
            <div className="flex justify-between items-center py-4 px-5 rounded-full bg-muted/20 border border-bubble-border">
              <span className="text-sm text-muted-foreground">UNI (from BTC-ETH)</span>
              <span className="font-semibold">12.80</span>
            </div>
          </div>

          <button className="w-full py-4 rounded-full font-bold bg-primary hover:bg-primary/90 transition-all duration-300 text-primary-foreground shadow-lg shadow-primary/30">
            Claim All Fees
          </button>
        </div>
      ) : (
        <div className="bubble p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 mx-auto mb-6 flex items-center justify-center">
            <span className="text-3xl">💰</span>
          </div>
          <h2 className="text-xl font-bold mb-3">Pending Fees</h2>
          <p className="text-muted-foreground mb-6">Connect wallet to view and claim pending fees</p>
          <button
            onClick={onConnect}
            className="px-8 py-4 rounded-full bg-primary hover:bg-primary/90 transition-all duration-300 font-semibold text-primary-foreground shadow-lg shadow-primary/30"
          >
            Connect Wallet
          </button>
        </div>
      )}

      {/* Active Pools */}
      {walletConnected && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Active Pools</h2>
            <p className="text-sm text-muted-foreground">Pools where you currently have open positions</p>
          </div>
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
              yieldToken="UNI"
              poolShare="0.03%"
              liquidity="0.234"
              pending="$12.80"
            />
          </div>
        </div>
      )}
    </div>
  );
};
