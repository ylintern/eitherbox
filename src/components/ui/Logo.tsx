interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo = ({ size = 40, className = "" }: LogoProps) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M69 89L130 30V89H180V150H130V89L69 150V89Z" 
        fill="currentColor" 
        className="text-primary"
      />
    </svg>
  );
};
