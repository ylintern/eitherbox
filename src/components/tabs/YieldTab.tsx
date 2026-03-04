import { useState } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PositionCardProps {
  pool: string;
  positionId: string;
  value: string;
  inRange: boolean;
  fee: string;
  currentPrice: string;
  minPrice: string;
  maxPrice: string;
  priceUnit: string;
  yieldToken: string;
  poolShare: string;
  liquidity: string;
  pending: string;
}

const YIELD_TOKEN_OPTIONS = ['UNI', 'BTC', 'ETH', 'USDC'];

const PositionCard = ({ 
  pool, positionId, value, inRange, fee, currentPrice, minPrice, maxPrice, 
  priceUnit, yieldToken, poolShare, liquidity, pending 
}: PositionCardProps) => {
  const [closePercentage, setClosePercentage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYieldToken, setSelectedYieldToken] = useState(yieldToken);
  const [pendingYieldToken, setPendingYieldToken] = useState<string | null>(null);
  const [isYieldDropdownOpen, setIsYieldDropdownOpen] = useState(false);

  const handleYieldTokenSelect = (token: string) => {
    setPendingYieldToken(token);
    setIsYieldDropdownOpen(false);
  };

  const handleConfirmYieldSwitch = () => {
    if (pendingYieldToken) {
      // This would trigger a transaction for the user to sign
      console.log(`Switching yield from ${selectedYieldToken} to ${pendingYieldToken}`);
      console.log('Converting pending yield and starting new accounting...');
      setSelectedYieldToken(pendingYieldToken);
      setPendingYieldToken(null);
    }
  };

  const handleCancelYieldSwitch = () => {
    setPendingYieldToken(null);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="bubble overflow-hidden">
      <CollapsibleTrigger className="w-full p-6 flex justify-between items-center cursor-pointer hover:bg-muted/10 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="text-left">
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground/60 font-mono">{positionId}</span>
              <h3 className="text-xl font-bold">{pool}</h3>
            </div>
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
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xl font-bold text-primary">{value}</p>
            <p className="text-xs text-muted-foreground">Pending: {pending}</p>
          </div>
          <button 
            onClick={(e) => e.stopPropagation()}
            className="px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-medium hover:bg-primary/30 transition-all"
          >
            Claim
          </button>
          <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
        <div className="px-6 pb-6 pt-2 border-t border-bubble-border">
          {/* Yield Preference - Now at top */}
          <div className="bg-primary/10 rounded-[20px] p-4 mb-5 border border-primary/20">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-muted-foreground">Yield Preference</span>
              <span className="font-bold text-primary px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30">
                {selectedYieldToken}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <DropdownMenu open={isYieldDropdownOpen} onOpenChange={setIsYieldDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="flex-1 px-4 py-2.5 rounded-full bg-bubble border border-bubble-border text-sm font-medium hover:bg-bubble-hover hover:border-primary/30 transition-all duration-300 flex items-center justify-center gap-2">
                    Switch Yield
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isYieldDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-bubble border border-bubble-border rounded-[16px] p-2 z-50">
                  {YIELD_TOKEN_OPTIONS.map((token) => (
                    <DropdownMenuItem
                      key={token}
                      onClick={() => handleYieldTokenSelect(token)}
                      className={`rounded-full px-4 py-2.5 cursor-pointer transition-all duration-200 ${
                        token === selectedYieldToken 
                          ? 'bg-primary/20 text-primary' 
                          : 'hover:bg-muted/30'
                      }`}
                    >
                      <span className="flex items-center justify-between w-full">
                        {token}
                        {token === selectedYieldToken && <Check className="w-4 h-4" />}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Confirm/Cancel buttons when a new token is selected */}
            {pendingYieldToken && pendingYieldToken !== selectedYieldToken && (
              <div className="mt-4 p-3 rounded-[16px] bg-bubble border border-bubble-border">
                <p className="text-xs text-muted-foreground mb-3 text-center">
                  Switch yield from <span className="text-foreground font-medium">{selectedYieldToken}</span> to <span className="text-primary font-medium">{pendingYieldToken}</span>?
                </p>
                <p className="text-xs text-muted-foreground/70 mb-3 text-center">
                  Pending yield will be converted and new accounting will start.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelYieldSwitch}
                    className="flex-1 py-2.5 rounded-full bg-muted/20 border border-bubble-border text-muted-foreground text-sm font-medium hover:bg-muted/30 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmYieldSwitch}
                    className="flex-1 py-2.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-sm font-medium hover:bg-primary/30 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </div>

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
              <span className="text-xs text-muted-foreground">Price Range ({priceUnit})</span>
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
}

export const YieldTab = ({ walletConnected }: YieldTabProps) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Pending Fees */}
      <div className="flex gap-4">
        {/* Claim All Button - Circle Card */}
        <div className="bubble p-6 flex flex-col items-center justify-center min-w-[140px]">
          <button className="px-5 py-3 rounded-full bg-primary/20 border border-primary/40 text-primary text-sm font-semibold hover:bg-primary/30 hover:scale-105 transition-all duration-300 mb-3 shadow-[0_0_15px_rgba(168,85,247,0.25)]">
            Claim All
          </button>
          <span className="text-lg font-bold text-primary">$309.50</span>
        </div>
        
        {/* Pending Fees List */}
        <div className="bubble p-6 flex-1">
          <h2 className="text-lg font-bold mb-4">Pending Fees</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 px-4 rounded-full bg-muted/20 border border-bubble-border">
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground/60 font-mono">#48291</span>
                <span className="text-sm text-muted-foreground">UNI (from ETH-USDC)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">24.50</span>
                <button className="px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-medium hover:bg-primary/30 transition-all">
                  Claim
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center py-2 px-4 rounded-full bg-muted/20 border border-bubble-border">
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground/60 font-mono">#48156</span>
                <span className="text-sm text-muted-foreground">UNI (from BTC-ETH)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">12.80</span>
                <button className="px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-medium hover:bg-primary/30 transition-all">
                  Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Pools */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Active Pools</h2>
          <p className="text-sm text-muted-foreground">Pools where you currently have open positions</p>
        </div>
        <div className="space-y-6">
          <PositionCard
            pool="ETH-USDC"
            positionId="#48291"
            value="$2,481"
            inRange={true}
            fee="0.2%"
            currentPrice="3,200"
            minPrice="3,100"
            maxPrice="3,300"
            priceUnit="USDC per ETH"
            yieldToken="UNI"
            poolShare="0.12%"
            liquidity="1,240.50"
            pending="$45.30"
          />
          <PositionCard
            pool="BTC-ETH"
            positionId="#48156"
            value="$4,820"
            inRange={false}
            fee="0.2%"
            currentPrice="28.27"
            minPrice="27.50"
            maxPrice="28.00"
            priceUnit="ETH per BTC"
            yieldToken="UNI"
            poolShare="0.03%"
            liquidity="0.234"
            pending="$12.80"
          />
        </div>
      </div>
    </div>
  );
};
