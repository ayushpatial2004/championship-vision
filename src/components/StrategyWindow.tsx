import { Card } from "@/components/ui/card";
import { Clock, Flag, Fuel, AlertCircle } from "lucide-react";

interface StrategyOption {
  name: string;
  lapWindow: string;
  tyreCompound: string;
  fuelLoad: number;
  risk: "low" | "medium" | "high";
  advantage: string;
}

export const StrategyWindow = () => {
  const strategies: StrategyOption[] = [
    {
      name: "Aggressive 1-Stop",
      lapWindow: "Lap 18-22",
      tyreCompound: "SOFT → MEDIUM",
      fuelLoad: 85,
      risk: "high",
      advantage: "Early track position, faster lap times"
    },
    {
      name: "Conservative 1-Stop",
      lapWindow: "Lap 25-30",
      tyreCompound: "MEDIUM → MEDIUM",
      fuelLoad: 90,
      risk: "low",
      advantage: "Consistent pace, lower tyre deg"
    },
    {
      name: "Two-Stop Sprint",
      lapWindow: "Lap 15 & 35",
      tyreCompound: "SOFT → MEDIUM → SOFT",
      fuelLoad: 75,
      risk: "medium",
      advantage: "Always on fresh tyres, overtaking speed"
    },
    {
      name: "Undercut Window",
      lapWindow: "Lap 20-23",
      tyreCompound: "MEDIUM → HARD",
      fuelLoad: 88,
      risk: "medium",
      advantage: "Jump competitors, long final stint"
    },
  ];

  const currentLap = 16;
  const weatherThreat = "30% rain probability lap 25-35";

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case "low": return "text-green-400 border-green-500/30 bg-green-500/10";
      case "medium": return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
      default: return "text-red-400 border-red-500/30 bg-red-500/10";
    }
  };

  return (
    <Card className="bg-gradient-carbon border-2 border-border p-4">
      <h3 className="text-sm font-bold text-foreground tracking-wider mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        STRATEGY WINDOWS - PIT OPTIMIZATION
      </h3>
      
      {/* Current Status */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-black/40 rounded-lg p-3 border border-border/30">
          <div className="flex items-center gap-2 mb-1">
            <Flag className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground font-mono">CURRENT LAP</p>
          </div>
          <p className="text-2xl font-bold text-primary">{currentLap}</p>
        </div>
        
        <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/30">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-orange-400" />
            <p className="text-xs text-orange-400 font-mono">WEATHER</p>
          </div>
          <p className="text-xs text-orange-400 font-mono">{weatherThreat}</p>
        </div>
      </div>

      {/* Strategy Options */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {strategies.map((strategy, idx) => (
          <div 
            key={strategy.name} 
            className="bg-black/40 rounded-lg p-4 border border-border/30 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-xs font-bold text-primary">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-foreground">{strategy.name}</h4>
                </div>
                <p className="text-xs text-primary font-mono ml-8">{strategy.lapWindow}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold border ${getRiskColor(strategy.risk)}`}>
                {strategy.risk.toUpperCase()} RISK
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-muted/10 rounded p-2">
                <p className="text-xs text-muted-foreground font-mono mb-1">TYRE STRATEGY</p>
                <p className="text-xs font-bold text-foreground">{strategy.tyreCompound}</p>
              </div>
              <div className="bg-muted/10 rounded p-2">
                <div className="flex items-center gap-2 mb-1">
                  <Fuel className="w-3 h-3 text-cyan-400" />
                  <p className="text-xs text-muted-foreground font-mono">FUEL LOAD</p>
                </div>
                <p className="text-xs font-bold text-cyan-400">{strategy.fuelLoad}%</p>
              </div>
            </div>
            
            <div className="border-t border-border/30 pt-2">
              <p className="text-xs text-muted-foreground font-mono mb-1">ADVANTAGE:</p>
              <p className="text-xs text-green-400 font-mono">{strategy.advantage}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
