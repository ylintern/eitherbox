import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TabNavigation } from '@/components/layout/TabNavigation';
import { SwapTab } from '@/components/tabs/SwapTab';
import { PoolTab } from '@/components/tabs/PoolTab';
import { YieldTab } from '@/components/tabs/YieldTab';

const Index = () => {
  const [activeTab, setActiveTab] = useState('pool');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async () => {
    setWalletConnected(true);
    setWalletAddress('0x742d...4b3c');
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress('');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header 
        walletConnected={walletConnected}
        walletAddress={walletAddress}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
      />
      
      <TabNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'swap' && (
          <SwapTab 
            walletConnected={walletConnected}
            onConnect={connectWallet}
          />
        )}
        
        {activeTab === 'pool' && (
          <PoolTab walletConnected={walletConnected} />
        )}
        
        {activeTab === 'yield' && (
          <YieldTab 
            walletConnected={walletConnected}
            onConnect={connectWallet}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
