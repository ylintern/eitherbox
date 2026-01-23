import { Logo } from '@/components/ui/Logo';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Header = () => {
  return (
    <header className="backdrop-blur-2xl bg-background/60 relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={72} />
            <span className="text-sm text-muted-foreground hidden sm:block font-medium">Yield Lounge</span>
          </div>
          
          <ConnectButton 
            chainStatus="icon"
            showBalance={false}
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
          />
        </div>
      </div>
    </header>
  );
};
