import { ArrowUpDown, Droplet, TrendingUp, LucideIcon } from 'lucide-react';

interface Tab {
  id: string;
  icon: LucideIcon;
  label: string;
}

const tabs: Tab[] = [
  { id: 'swap', icon: ArrowUpDown, label: 'Swap' },
  { id: 'pool', icon: Droplet, label: 'Pool' },
  { id: 'yield', icon: TrendingUp, label: 'Yield' },
];

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-6 relative z-10">
      <div className="flex gap-2 border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-lg transition-all ${
              activeTab === tab.id
                ? 'bg-glass border-b-2 border-primary text-foreground backdrop-blur-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-glass'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
