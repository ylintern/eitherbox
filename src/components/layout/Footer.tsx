import { Calendar, Send, Twitter, FileText } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

const socialLinks = [
  { icon: Twitter, label: 'Twitter', href: 'https://x.com/yieldlounge' },
  { icon: FileText, label: 'Substack', href: 'https://substack.com/@yieldlounge' },
];

const resourceLinks = [
  { label: 'Documentation', href: '#' },
  { label: 'Whitepaper', href: '#' },
  { label: 'Github', href: '#' },
  { label: 'Audits', href: '#' },
];

export const Footer = () => {
  return (
    <footer className="mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bubble p-10">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Logo size={64} />
              <span className="text-sm text-muted-foreground">Yield Lounge</span>
            </div>
              <p className="text-sm text-muted-foreground max-w-md">
                Automated yield conversion protocol built on Uniswap v4. Convert your LP fees into your preferred yield tokens seamlessly.
              </p>
            </div>

            {/* Connect */}
            <div>
              <h3 className="font-semibold mb-5 text-sm uppercase tracking-wider text-muted-foreground">Connect</h3>
              <div className="space-y-3">
                {socialLinks.map((link) => (
                  <a 
                    key={link.label}
                    href={link.href}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-bubble-hover transition-all duration-300 text-sm"
                  >
                    <link.icon size={16} />
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-5 text-sm uppercase tracking-wider text-muted-foreground">Resources</h3>
              <div className="space-y-3">
                {resourceLinks.map((link) => (
                  <a 
                    key={link.label}
                    href={link.href} 
                    className="block px-4 py-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-bubble-hover transition-all duration-300 text-sm"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-bubble-border mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Yield Lounge. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              {['Terms', 'Privacy', 'Cookies'].map(item => (
                <a key={item} href="#" className="px-4 py-2 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-bubble-hover transition-all duration-300">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
