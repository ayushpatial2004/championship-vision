import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Zap, Target, Brain } from "lucide-react";

interface DriverCardProps {
  name: string;
  position: number;
  lapTime: string;
  avgSpeed: number;
  consistency: number;
  cognitiveLoad: number;
  team: string;
}

export const DriverCard = ({
  name,
  position,
  lapTime,
  avgSpeed,
  consistency,
  cognitiveLoad,
  team
}: DriverCardProps) => {
  const teamColors: Record<string, string> = {
    "Mercedes": "bg-f1-cyan",
    "Red Bull": "bg-f1-red",
    "Ferrari": "bg-destructive",
    "McLaren": "bg-f1-yellow"
  };

  const positionColor = position <= 3 ? "text-f1-yellow" : position <= 10 ? "text-f1-cyan" : "text-muted-foreground";
  const teamColor = teamColors[team] || "bg-primary";

  return (
    <Card className="relative overflow-hidden bg-gradient-carbon border-2 border-border hover:border-primary/50 transition-all duration-300 group">
      {/* Position Badge */}
      <div className={`absolute top-0 left-0 w-16 h-16 flex items-center justify-center ${positionColor}`}>
        <span className="text-3xl font-black tracking-tighter">{position}</span>
      </div>

      {/* Team Color Stripe */}
      <div className={`absolute top-0 right-0 w-2 h-full ${teamColor}`} />

      <div className="p-6 pl-20">
        {/* Driver Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-foreground tracking-tight mb-1">{name}</h3>
          <Badge variant="outline" className="font-mono text-xs">{team}</Badge>
        </div>

        {/* Lap Time - Hero Metric */}
        <div className="mb-4 bg-black/40 rounded-lg p-3 border border-border/30">
          <p className="text-xs text-muted-foreground font-mono mb-1">BEST LAP</p>
          <p className="text-3xl font-black text-f1-cyan tracking-tight">{lapTime}</p>
        </div>

        {/* Performance Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/20 rounded-lg p-3 border border-border/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-f1-yellow" />
              <p className="text-xs text-muted-foreground font-mono">SPEED</p>
            </div>
            <p className="text-lg font-bold text-foreground">{avgSpeed} km/h</p>
          </div>

          <div className="bg-muted/20 rounded-lg p-3 border border-border/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-f1-green" />
              <p className="text-xs text-muted-foreground font-mono">CONSISTENCY</p>
            </div>
            <p className="text-lg font-bold text-foreground">{consistency}/10</p>
          </div>
        </div>

        {/* Cognitive Load Bar */}
        <div className="mt-3">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-f1-purple" />
            <p className="text-xs text-muted-foreground font-mono">COGNITIVE LOAD</p>
            <span className="text-xs font-bold text-foreground ml-auto">{cognitiveLoad}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-speed transition-all duration-500"
              style={{ width: `${cognitiveLoad}%` }}
            />
          </div>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-racing opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
    </Card>
  );
};
