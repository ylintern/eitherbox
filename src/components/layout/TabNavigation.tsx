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
    <div className="max-w-7xl mx-auto px-6 pt-8 relative z-10">
      <div className="flex justify-center">
        <div className="inline-flex gap-2 p-2 rounded-full bg-bubble border border-bubble-border backdrop-blur-xl">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 font-medium ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-bubble-hover'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
