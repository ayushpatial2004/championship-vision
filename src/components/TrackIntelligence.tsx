import { Card } from "@/components/ui/card";
import { Activity, TrendingUp, AlertTriangle } from "lucide-react";

interface TrackIntelligenceProps {
  cornerData?: Array<{
    corner: number;
    avgSpeed: number;
    minSpeed: number;
    maxSpeed: number;
    incidents: number;
  }>;
}

export const TrackIntelligence = ({ cornerData }: TrackIntelligenceProps) => {
  // Mock data if none provided
  const data = cornerData || [
    { corner: 1, avgSpeed: 185, minSpeed: 160, maxSpeed: 210, incidents: 2 },
    { corner: 2, avgSpeed: 145, minSpeed: 120, maxSpeed: 165, incidents: 5 },
    { corner: 3, avgSpeed: 220, minSpeed: 200, maxSpeed: 235, incidents: 1 },
    { corner: 4, avgSpeed: 95, minSpeed: 75, maxSpeed: 110, incidents: 8 },
    { corner: 5, avgSpeed: 175, minSpeed: 155, maxSpeed: 190, incidents: 3 },
    { corner: 6, avgSpeed: 125, minSpeed: 100, maxSpeed: 145, incidents: 6 },
  ];

  const maxIncidents = Math.max(...data.map(d => d.incidents));

  return (
    <Card className="bg-gradient-carbon border-2 border-border p-4">
      <h3 className="text-sm font-bold text-foreground tracking-wider mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary" />
        TRACK-WIDE PERFORMANCE INTELLIGENCE
      </h3>
      
      <div className="space-y-3">
        {data.map((corner) => {
          const speedRange = corner.maxSpeed - corner.minSpeed;
          const riskLevel = corner.incidents / maxIncidents;
          
          return (
            <div key={corner.corner} className="bg-black/40 rounded-lg p-3 border border-border/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">T{corner.corner}</span>
                  {riskLevel > 0.6 && (
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  {corner.incidents} INCIDENTS
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <p className="text-xs text-muted-foreground font-mono">AVG</p>
                  <p className="text-sm font-bold text-foreground">{corner.avgSpeed} km/h</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-mono">MIN</p>
                  <p className="text-sm font-bold text-cyan-400">{corner.minSpeed} km/h</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-mono">MAX</p>
                  <p className="text-sm font-bold text-green-400">{corner.maxSpeed} km/h</p>
                </div>
              </div>
              
              {/* Speed variance bar */}
              <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-primary to-green-500"
                  style={{ width: `${(speedRange / 160) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                VARIANCE: {speedRange} km/h
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
