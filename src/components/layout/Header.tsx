import { Wallet } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  walletConnected: boolean;
  walletAddress: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const Header = ({ 
  walletConnected, 
  walletAddress, 
  onConnect, 
  onDisconnect 
}: HeaderProps) => {
  return (
    <header className="border-b border-border backdrop-blur-xl bg-background/40 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Yield Lounge
              </h1>
              <p className="text-xs text-muted-foreground">Automated Yield Conversion</p>
            </div>
          </div>
          
          {walletConnected ? (
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-lg glass">
                <p className="text-sm font-mono text-muted-foreground">{walletAddress}</p>
              </div>
              <Button
                variant="outline"
                onClick={onDisconnect}
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button onClick={onConnect}>
              <Wallet size={18} />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
