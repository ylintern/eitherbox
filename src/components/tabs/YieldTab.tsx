import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const yieldHistory = [
  { fromToken: 'USDC', toToken: 'UNI', usdAmount: '$1,245', tokenAmount: '124.5', date: '2h ago' },
  { fromToken: 'ETH', toToken: 'WBTC', usdAmount: '$2,340', tokenAmount: '0.045', date: '1d ago' },
  { fromToken: 'USDT', toToken: 'UNI', usdAmount: '$892', tokenAmount: '89.2', date: '3d ago' }
];

interface YieldTabProps {
  walletConnected: boolean;
  onConnect: () => void;
}

export const YieldTab = ({ walletConnected, onConnect }: YieldTabProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Auto-Convert Info Card */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Info size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Auto-Convert</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Fees are automatically converted to your preferred yield token when activity and threshold is met collectively ($10 USD minimum).
            </p>
          </div>
        </div>
      </div>

      {/* Pending Fees */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-4">Pending Fees</h2>
        {walletConnected ? (
          <>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="glass-card p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">USDC</span>
                  <span className="font-bold">124.50</span>
                </div>
                <div className="text-xs text-muted-foreground">≈ $124.50</div>
              </div>
              <div className="glass-card p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">ETH</span>
                  <span className="font-bold">0.05</span>
                </div>
                <div className="text-xs text-muted-foreground">≈ $185.00</div>
              </div>
            </div>
            
            <div className="bg-primary/10 backdrop-blur-sm rounded-xl p-5 mb-4 border border-primary/30">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Claimable</span>
                <span className="text-3xl font-bold text-primary">$309.50</span>
              </div>
            </div>

            <Button className="w-full" size="lg">
              Claim All Fees
            </Button>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Connect wallet to view and claim pending fees</p>
            <Button onClick={onConnect}>
              Connect Wallet
            </Button>
          </div>
        )}
      </div>

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
              <div className="flex items-center justify-between pt-3 border-t border-border">
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
