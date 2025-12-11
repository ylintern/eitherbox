import logoImage from '@/assets/logo-concept-5.png';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo = ({ size = 48, className = "" }: LogoProps) => {
  return (
    <img 
      src={logoImage} 
      alt="Either Box" 
      width={size} 
      height={size}
      className={`object-contain ${className}`}
    />
  );
};

// Icon version uses the same image
export const LogoIcon = ({ size = 32, className = "" }: { size?: number; className?: string }) => {
  return (
    <img 
      src={logoImage} 
      alt="Either Box" 
      width={size} 
      height={size}
      className={`object-contain ${className}`}
    />
  );
};
