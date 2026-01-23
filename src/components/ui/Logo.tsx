// Use an optimized asset when possible, falling back to the PNG served from `/public`.
// Keep both `src/assets/logo-optimized.webp` (bundled, smaller) and `public/logo.png`
// (fallback legacy/png consumers). The <picture> element prefers WebP but falls back
// to the PNG for browsers that don't support WebP.
import logoOptimized from '@/assets/logo-optimized.webp';

interface LogoProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

export const Logo = ({ size = 48, className = "", glow = true }: LogoProps) => {
  return (
    <div className={`relative ${glow ? 'animate-logo-glow' : ''}`} style={{ width: size, height: size }}>
      <picture>
        <source srcSet={logoOptimized} type="image/webp" />
        <img
          src={`/logo.png`}
          alt="Yield Lounge"
          width={size}
          height={size}
          className={`object-contain relative z-10 ${className}`}
        />
      </picture>
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
      <picture>
        <source srcSet={logoOptimized} type="image/webp" />
        <img
          src={`/logo.png`}
          alt="Yield Lounge"
          width={size}
          height={size}
          className={`object-contain relative z-10 ${className}`}
        />
      </picture>
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
