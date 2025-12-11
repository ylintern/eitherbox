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
    <header className="backdrop-blur-2xl bg-background/60 relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size={56} />
            <span className="text-xs text-muted-foreground hidden sm:block font-medium">by Yield Lounge</span>
          </div>
          
          {walletConnected ? (
            <div className="flex items-center gap-3">
              <div className="px-5 py-2.5 rounded-full bg-bubble border border-bubble-border backdrop-blur-xl">
                <p className="text-sm font-mono text-muted-foreground">{walletAddress}</p>
              </div>
              <button
                onClick={onDisconnect}
                className="px-5 py-2.5 rounded-full bg-bubble border border-bubble-border text-muted-foreground hover:bg-bubble-hover hover:border-primary/30 transition-all duration-300 backdrop-blur-xl"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={onConnect}
              className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary hover:bg-primary/90 transition-all duration-300 font-semibold text-primary-foreground shadow-lg shadow-primary/20"
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
