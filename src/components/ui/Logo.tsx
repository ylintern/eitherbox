import logoImage from '@/assets/logo-transparent.png';

interface LogoProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

export const Logo = ({ size = 48, className = "", glow = true }: LogoProps) => {
  return (
    <div className={`relative ${glow ? 'animate-logo-glow' : ''}`}>
      <img 
        src={logoImage} 
        alt="Either Box" 
        width={size} 
        height={size}
        className={`object-contain relative z-10 ${className}`}
      />
      {glow && (
        <div 
          className="absolute inset-0 blur-lg opacity-50 animate-logo-pulse"
          style={{
            background: 'linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff)',
            borderRadius: '50%',
          }}
        />
      )}
    </div>
  );
};

// Icon version uses the same image
export const LogoIcon = ({ size = 32, className = "", glow = true }: { size?: number; className?: string; glow?: boolean }) => {
  return (
    <div className={`relative ${glow ? 'animate-logo-glow' : ''}`}>
      <img 
        src={logoImage} 
        alt="Either Box" 
        width={size} 
        height={size}
        className={`object-contain relative z-10 ${className}`}
      />
      {glow && (
        <div 
          className="absolute inset-0 blur-md opacity-40 animate-logo-pulse"
          style={{
            background: 'linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff)',
            borderRadius: '50%',
          }}
        />
      )}
    </div>
  );
};
