interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo = ({ size = 48, className = "" }: LogoProps) => {
  const width = size * 2.8;
  const height = size;
  
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 140 50" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Border */}
      <rect 
        x="2" 
        y="2" 
        width="136" 
        height="46" 
        rx="3" 
        stroke="currentColor" 
        strokeWidth="3" 
        className="text-primary"
        fill="none"
      />
      
      {/* EITHER text */}
      <text 
        x="70" 
        y="20" 
        textAnchor="middle" 
        fill="white"
        style={{ 
          fontSize: '14px', 
          fontWeight: 900, 
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '3px'
        }}
      >
        EITHER
      </text>
      
      {/* BOX text with square replacing O */}
      <g transform="translate(70, 36)">
        {/* B */}
        <text 
          x="-28" 
          y="0" 
          textAnchor="middle" 
          fill="white"
          style={{ 
            fontSize: '16px', 
            fontWeight: 900, 
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '2px'
          }}
        >
          B
        </text>
        
        {/* Square box replacing O */}
        <rect 
          x="-8" 
          y="-12" 
          width="14" 
          height="14" 
          rx="2" 
          stroke="white" 
          strokeWidth="2.5" 
          fill="none"
        />
        
        {/* X */}
        <text 
          x="22" 
          y="0" 
          textAnchor="middle" 
          fill="white"
          style={{ 
            fontSize: '16px', 
            fontWeight: 900, 
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '2px'
          }}
        >
          X
        </text>
      </g>
    </svg>
  );
};

// Simple icon-only version for smaller uses
export const LogoIcon = ({ size = 32, className = "" }: { size?: number; className?: string }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Border */}
      <rect 
        x="2" 
        y="2" 
        width="28" 
        height="28" 
        rx="3" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        className="text-primary"
        fill="none"
      />
      
      {/* Inner square (box) */}
      <rect 
        x="10" 
        y="10" 
        width="12" 
        height="12" 
        rx="2" 
        stroke="white" 
        strokeWidth="2" 
        fill="none"
      />
    </svg>
  );
};
