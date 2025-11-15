import { Card } from "@/components/ui/card";
import { Zap, Target, TrendingUp } from "lucide-react";

interface AttackZone {
  zone: string;
  turn: number;
  overtakeSuccess: number;
  drsAvailable: boolean;
  difficulty: "easy" | "medium" | "hard";
  notes: string;
}

export const AttackZones = () => {
  const attackZones: AttackZone[] = [
    { 
      zone: "DRS Zone 1 - Turn 1", 
      turn: 1, 
      overtakeSuccess: 78, 
      drsAvailable: true, 
      difficulty: "easy",
      notes: "Primary overtaking spot - heavy braking zone"
    },
    { 
      zone: "Turn 11 Entry", 
      turn: 11, 
      overtakeSuccess: 45, 
      drsAvailable: false, 
      difficulty: "hard",
      notes: "High risk - requires precision"
    },
    { 
      zone: "Turn 12 Exit", 
      turn: 12, 
      overtakeSuccess: 62, 
      drsAvailable: false, 
      difficulty: "medium",
      notes: "Good traction = better exit speed"
    },
    { 
      zone: "DRS Zone 2 - Backstraight", 
      turn: 15, 
      overtakeSuccess: 85, 
      drsAvailable: true, 
      difficulty: "easy",
      notes: "Best opportunity - long straight with DRS"
    },
    { 
      zone: "Turn 19 Exit", 
      turn: 19, 
      overtakeSuccess: 55, 
      drsAvailable: false, 
      difficulty: "medium",
      notes: "Final corner - position for finish line"
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "easy": return "text-green-400";
      case "medium": return "text-yellow-400";
      default: return "text-red-400";
    }
  };

  return (
    <Card className="bg-gradient-carbon border-2 border-border p-4">
      <h3 className="text-sm font-bold text-foreground tracking-wider mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-primary" />
        ATTACK ZONES - OVERTAKING OPPORTUNITIES
      </h3>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-black/40 rounded-lg p-2 border border-border/30">
          <p className="text-xs text-muted-foreground font-mono">ZONES</p>
          <p className="text-xl font-bold text-primary">{attackZones.length}</p>
        </div>
        <div className="bg-black/40 rounded-lg p-2 border border-border/30">
          <p className="text-xs text-muted-foreground font-mono">DRS</p>
          <p className="text-xl font-bold text-cyan-400">
            {attackZones.filter(z => z.drsAvailable).length}
          </p>
        </div>
        <div className="bg-black/40 rounded-lg p-2 border border-border/30">
          <p className="text-xs text-muted-foreground font-mono">AVG SUCCESS</p>
          <p className="text-xl font-bold text-green-400">
            {Math.round(attackZones.reduce((sum, z) => sum + z.overtakeSuccess, 0) / attackZones.length)}%
          </p>
        </div>
      </div>

      {/* Attack Zones List */}
      <div className="space-y-3 max-h-[350px] overflow-y-auto">
        {attackZones
          .sort((a, b) => b.overtakeSuccess - a.overtakeSuccess)
          .map((zone, idx) => (
            <div 
              key={zone.zone} 
              className="bg-black/40 rounded-lg p-3 border border-border/30 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{idx + 1}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{zone.zone}</span>
                      {zone.drsAvailable && (
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                          DRS
                        </span>
                      )}
                    </div>
                    <span className={`text-xs font-mono uppercase ${getDifficultyColor(zone.difficulty)}`}>
                      {zone.difficulty} DIFFICULTY
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground font-mono">SUCCESS</p>
                  <p className="text-lg font-bold text-green-400">{zone.overtakeSuccess}%</p>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-green-500"
                    style={{ width: `${zone.overtakeSuccess}%` }}
                  />
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground font-mono">
                {zone.notes}
              </p>
            </div>
          ))}
      </div>
    </Card>
  );
};
