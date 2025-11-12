import { useEffect, useState } from "react";
import trackMapImage from "@/assets/track-map.png";
import { Card } from "@/components/ui/card";

interface TrackMapProps {
  activeSector?: 1 | 2 | 3;
  drsActive?: boolean;
}

export const TrackMap = ({ activeSector = 1, drsActive = false }: TrackMapProps) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="relative overflow-hidden bg-gradient-carbon border-2 border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">CIRCUIT MAP</h2>
          <p className="text-sm text-muted-foreground font-mono">LIVE TELEMETRY</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${activeSector === 1 ? 'bg-sector-1 shadow-glow-red' : 'bg-muted'}`} />
            <span className="text-xs font-mono text-muted-foreground">SECTOR 1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${activeSector === 2 ? 'bg-sector-2 shadow-glow-cyan' : 'bg-muted'}`} />
            <span className="text-xs font-mono text-muted-foreground">SECTOR 2</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${activeSector === 3 ? 'bg-sector-3' : 'bg-muted'}`} />
            <span className="text-xs font-mono text-muted-foreground">SECTOR 3</span>
          </div>
        </div>
      </div>

      {/* Track Map */}
      <div className="relative bg-black/40 rounded-lg p-8 border border-border/50">
        <img 
          src={trackMapImage} 
          alt="F1 Circuit Track Map" 
          className="w-full h-auto"
        />
        
        {/* Animated racing line indicator */}
        <div 
          className="absolute top-1/2 left-1/2 w-4 h-4 bg-f1-cyan rounded-full shadow-glow-cyan"
          style={{
            transform: `translate(-50%, -50%) rotate(${rotation}deg) translateX(150px)`,
            transition: 'none'
          }}
        >
          <div className="absolute inset-0 bg-f1-cyan rounded-full animate-ping opacity-75" />
        </div>

        {/* DRS Active Indicator */}
        {drsActive && (
          <div className="absolute top-4 right-4 bg-f1-green/20 border-2 border-f1-green rounded-lg px-4 py-2 animate-pulse">
            <span className="text-f1-green font-bold text-sm tracking-wider">DRS ACTIVE</span>
          </div>
        )}
      </div>

      {/* Track Stats */}
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
          <p className="text-xs text-muted-foreground font-mono mb-1">LAP RECORD</p>
          <p className="text-lg font-bold text-f1-cyan">1:18.750</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
          <p className="text-xs text-muted-foreground font-mono mb-1">TURNS</p>
          <p className="text-lg font-bold text-foreground">20</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
          <p className="text-xs text-muted-foreground font-mono mb-1">LENGTH</p>
          <p className="text-lg font-bold text-foreground">5.412 KM</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
          <p className="text-xs text-muted-foreground font-mono mb-1">DRS ZONES</p>
          <p className="text-lg font-bold text-f1-green">2</p>
        </div>
      </div>
    </Card>
  );
};
