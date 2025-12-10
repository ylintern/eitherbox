import { Calendar, Send, Twitter, FileText } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

const socialLinks = [
  { icon: Calendar, label: 'Book a Call', href: 'https://cal.com/yield-lounge/30min' },
  { icon: Send, label: 'Telegram', href: 'https://t.me/+3sbFlFmj4Jg1ZWQ0' },
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
    <footer className="border-t border-border mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
              <Logo size={36} />
              <span className="text-xs text-muted-foreground">by Yield Lounge</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              Automated yield conversion protocol built on Uniswap v4. Convert your LP fees into your preferred yield tokens seamlessly.
            </p>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Connect</h3>
            <div className="space-y-3">
              {socialLinks.map((link) => (
                <a 
                  key={link.label}
                  href={link.href}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all text-sm group"
                >
                  <link.icon size={16} className="group-hover:scale-110 transition-transform" />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Resources</h3>
            <div className="space-y-3">
              {resourceLinks.map((link) => (
                <a 
                  key={link.label}
                  href={link.href} 
                  className="block text-muted-foreground hover:text-primary transition-all text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Either Box by Yield Lounge. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-all">Terms</a>
            <a href="#" className="hover:text-primary transition-all">Privacy</a>
            <a href="#" className="hover:text-primary transition-all">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
