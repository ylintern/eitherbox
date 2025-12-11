export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Subtle gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      
      {/* Floating spheres - large */}
      <div 
        className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-primary/3 blur-[100px] float"
      />
      <div 
        className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] rounded-full bg-secondary/3 blur-[120px] float-delayed"
      />
      <div 
        className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full bg-yellow/2 blur-[80px] float-slow"
      />
      
      {/* Medium floating orbs */}
      <div 
        className="absolute top-[20%] right-[30%] w-48 h-48 rounded-full border border-primary/10 float"
        style={{ animationDelay: '0.5s' }}
      />
      <div 
        className="absolute bottom-[30%] left-[20%] w-32 h-32 rounded-full border border-secondary/10 float-delayed"
      />
      <div 
        className="absolute top-[60%] left-[10%] w-24 h-24 rounded-full bg-primary/5 float"
        style={{ animationDelay: '1s' }}
      />
      
      {/* Small accent spheres */}
      <div 
        className="absolute top-[15%] right-[15%] w-4 h-4 rounded-full bg-primary/30 float"
        style={{ animationDelay: '0.3s' }}
      />
      <div 
        className="absolute bottom-[25%] right-[40%] w-3 h-3 rounded-full bg-secondary/40 float-delayed"
      />
      <div 
        className="absolute top-[70%] right-[25%] w-2 h-2 rounded-full bg-yellow/50 float"
        style={{ animationDelay: '1.5s' }}
      />
      <div 
        className="absolute top-[45%] left-[5%] w-3 h-3 rounded-full bg-primary/40 float-slow"
      />
      
      {/* Orbital rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-glass-border/30 opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-glass-border/20 opacity-15" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-primary/10 opacity-20" />
    </div>
  );
};
