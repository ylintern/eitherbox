interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo = ({ size = 48, className = "" }: LogoProps) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 1024 1024" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M177.778 512L512 177.778V512H846.222V846.222H512V512L177.778 846.222V512Z" 
        fill="currentColor" 
        className="text-primary"
      />
    </svg>
  );
};
