interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const Logo = ({ size = 48, className = "", showText = false }: LogoProps) => {
  const scale = size / 48;
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        width={size * 2.5} 
        height={size} 
        viewBox="0 0 120 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Border */}
        <rect 
          x="1" 
          y="1" 
          width="118" 
          height="46" 
          rx="4" 
          stroke="currentColor" 
          strokeWidth="2" 
          className="text-primary"
          fill="none"
        />
        
        {/* EITHER text */}
        <text 
          x="60" 
          y="20" 
          textAnchor="middle" 
          className="fill-current text-foreground"
          style={{ 
            fontSize: '12px', 
            fontWeight: 800, 
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '2px'
          }}
        >
          EITHER
        </text>
        
        {/* B text */}
        <text 
          x="24" 
          y="38" 
          textAnchor="middle" 
          className="fill-current text-foreground"
          style={{ 
            fontSize: '14px', 
            fontWeight: 800, 
            fontFamily: 'system-ui, sans-serif'
          }}
        >
          B
        </text>
        
        {/* Box icon (replacing O) */}
        <g transform="translate(38, 26)">
          {/* Box body */}
          <rect 
            x="0" 
            y="4" 
            width="16" 
            height="12" 
            rx="2" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            className="text-foreground"
            fill="none"
          />
          {/* Box lid */}
          <path 
            d="M-1 4 L8 0 L17 4" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            className="text-foreground"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Box handle */}
          <rect 
            x="5" 
            y="8" 
            width="6" 
            height="4" 
            rx="1" 
            stroke="currentColor" 
            strokeWidth="1" 
            className="text-foreground"
            fill="none"
          />
        </g>
        
        {/* X text */}
        <text 
          x="72" 
          y="38" 
          textAnchor="middle" 
          className="fill-current text-foreground"
          style={{ 
            fontSize: '14px', 
            fontWeight: 800, 
            fontFamily: 'system-ui, sans-serif'
          }}
        >
          X
        </text>
      </svg>
    </div>
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
        x="1" 
        y="1" 
        width="30" 
        height="30" 
        rx="4" 
        stroke="currentColor" 
        strokeWidth="2" 
        className="text-primary"
        fill="none"
      />
      
      {/* Box icon */}
      <g transform="translate(7, 8)">
        {/* Box body */}
        <rect 
          x="0" 
          y="6" 
          width="18" 
          height="12" 
          rx="2" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          className="text-foreground"
          fill="none"
        />
        {/* Box lid */}
        <path 
          d="M-1 6 L9 1 L19 6" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          className="text-foreground"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Box handle */}
        <rect 
          x="6" 
          y="10" 
          width="6" 
          height="4" 
          rx="1" 
          stroke="currentColor" 
          strokeWidth="1" 
          className="text-foreground"
          fill="none"
        />
      </g>
    </svg>
  );
};
