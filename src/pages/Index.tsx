import { useState } from 'react';
import { useAccount } from 'wagmi';
import { AnimatedBackground } from '@/components/layout/AnimatedBackground';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TabNavigation } from '@/components/layout/TabNavigation';
import { SwapTab } from '@/components/tabs/SwapTab';
import { PoolTab } from '@/components/tabs/PoolTab';
import { YieldTab } from '@/components/tabs/YieldTab';

const Index = () => {
  const [activeTab, setActiveTab] = useState('pool');
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <AnimatedBackground />
      
      <Header />
      
      <TabNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {activeTab === 'swap' && (
          <SwapTab walletConnected={isConnected} />
        )}
        
        {activeTab === 'pool' && (
          <PoolTab 
            walletConnected={isConnected}
            onNavigateToYield={() => setActiveTab('yield')}
          />
        )}
        
        {activeTab === 'yield' && (
          <YieldTab 
            walletConnected={isConnected}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
