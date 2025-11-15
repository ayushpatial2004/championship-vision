import { Card } from "@/components/ui/card";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import trackMap from "@/assets/track-map.png";

interface RiskZone {
  zone: string;
  level: "low" | "medium" | "high" | "critical";
  incidents: number;
  description: string;
}

export const RiskMap = () => {
  const riskZones: RiskZone[] = [
    { zone: "Turn 1", level: "high", incidents: 12, description: "Heavy braking zone - lock-ups common" },
    { zone: "Turn 2-3", level: "critical", incidents: 18, description: "High-speed chicane - high crash risk" },
    { zone: "Turn 6-7", level: "high", incidents: 15, description: "Elevation change - traction loss" },
    { zone: "Turn 11", level: "medium", incidents: 8, description: "Off-camber corner - understeer" },
    { zone: "Turn 12", level: "medium", incidents: 7, description: "Fast sweeper - track limits" },
    { zone: "Turn 15", level: "high", incidents: 14, description: "Hairpin - rear instability" },
    { zone: "Turn 19", level: "low", incidents: 3, description: "Final corner - clean exit" },
  ];

  const getLevelIcon = (level: string) => {
    switch(level) {
      case "critical": return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "high": return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case "medium": return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <Info className="w-4 h-4 text-green-500" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch(level) {
      case "critical": return "border-red-500/50 bg-red-500/10";
      case "high": return "border-orange-500/50 bg-orange-500/10";
      case "medium": return "border-yellow-500/50 bg-yellow-500/10";
      default: return "border-green-500/50 bg-green-500/10";
    }
  };

  return (
    <Card className="bg-gradient-carbon border-2 border-border p-4">
      <h3 className="text-sm font-bold text-foreground tracking-wider mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        RISK MAPPING - INCIDENT ANALYSIS
      </h3>
      
      {/* Track Map with Overlays */}
      <div className="relative mb-4 rounded-lg overflow-hidden border-2 border-border">
        <img 
          src={trackMap} 
          alt="COTA Track Map" 
          className="w-full h-48 object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute top-2 right-2 flex gap-2">
          <div className="bg-red-500/20 border border-red-500/50 px-2 py-1 rounded text-xs font-mono text-red-400">
            CRITICAL
          </div>
          <div className="bg-orange-500/20 border border-orange-500/50 px-2 py-1 rounded text-xs font-mono text-orange-400">
            HIGH
          </div>
          <div className="bg-yellow-500/20 border border-yellow-500/50 px-2 py-1 rounded text-xs font-mono text-yellow-400">
            MEDIUM
          </div>
        </div>
      </div>

      {/* Risk Zones List */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {riskZones
          .sort((a, b) => b.incidents - a.incidents)
          .map((zone) => (
            <div 
              key={zone.zone} 
              className={`rounded-lg p-3 border-2 ${getLevelColor(zone.level)}`}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  {getLevelIcon(zone.level)}
                  <span className="text-sm font-bold text-foreground">{zone.zone}</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {zone.incidents} INCIDENTS
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono ml-6">
                {zone.description}
              </p>
            </div>
          ))}
      </div>
    </Card>
  );
};
