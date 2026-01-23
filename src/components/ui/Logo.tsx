// Load logo from public folder at runtime. Place `logo.png` in `/public` and it will be
// served at the root: `/logo.png`. Importing images bundles them; using the public
// path avoids bundling and matches the project's expectations.
// NOTE: make sure `public/logo.png` exists.

interface LogoProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

export const Logo = ({ size = 48, className = "", glow = true }: LogoProps) => {
  return (
    <div className={`relative ${glow ? 'animate-logo-glow' : ''}`} style={{ width: size, height: size }}>
      <img
        src={`/logo.png`}
        alt="Yield Lounge"
        width={size} 
        height={size}
        className={`object-contain relative z-10 ${className}`}
      />
      {glow && (
        <div 
          className="absolute inset-0 blur-lg opacity-30 animate-logo-pulse"
          style={{
            background: 'hsl(270 60% 70%)',
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
    <div className={`relative ${glow ? 'animate-logo-glow' : ''}`} style={{ width: size, height: size }}>
      <img
        src={`/logo.png`}
        alt="Yield Lounge" 
        width={size} 
        height={size}
        className={`object-contain relative z-10 ${className}`}
      />
      {glow && (
        <div 
          className="absolute inset-0 blur-md opacity-25 animate-logo-pulse"
          style={{
            background: 'hsl(270 60% 70%)',
            borderRadius: '50%',
          }}
        />
      )}
    </div>
  );
};
