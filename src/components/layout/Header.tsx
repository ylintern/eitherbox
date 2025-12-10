import { Wallet } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

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
    <header className="border-b border-border backdrop-blur-xl bg-background/40 relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Logo size={48} />
          </div>
          
          {walletConnected ? (
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-lg bg-glass border border-glass-border backdrop-blur-sm">
                <p className="text-sm font-mono text-muted-foreground">{walletAddress}</p>
              </div>
              <button
                onClick={onDisconnect}
                className="px-4 py-2 rounded-lg bg-glass border border-glass-border text-muted-foreground hover:bg-glass-hover transition-all backdrop-blur-sm"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={onConnect}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 transition-all font-semibold text-primary-foreground shadow-lg shadow-primary/20"
            >
              <Wallet size={18} />
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
