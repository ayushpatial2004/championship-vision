import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DriverLapStats, formatLapTimeSeconds } from "@/lib/dataParser";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DriverComparisonProps {
  drivers: DriverLapStats[];
}

export const DriverComparison = ({ drivers }: DriverComparisonProps) => {
  const [driver1, setDriver1] = useState<string>(drivers[0]?.number || "");
  const [driver2, setDriver2] = useState<string>(drivers[1]?.number || "");

  const d1 = drivers.find(d => d.number === driver1);
  const d2 = drivers.find(d => d.number === driver2);

  const getDelta = () => {
    if (!d1 || !d2) return null;
    const delta = d1.bestLap - d2.bestLap;
    return {
      value: Math.abs(delta),
      faster: delta < 0 ? d1.number : d2.number,
    };
  };

  const delta = getDelta();

  return (
    <Card className="bg-gradient-carbon border-2 border-border p-4">
      <h3 className="text-sm font-bold text-foreground tracking-wider mb-4">DRIVER COMPARISON</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground font-mono mb-2">DRIVER 1</p>
          <Select value={driver1} onValueChange={setDriver1}>
            <SelectTrigger className="bg-black/40 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {drivers.map((d) => (
                <SelectItem key={d.number} value={d.number}>
                  #{d.number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <p className="text-xs text-muted-foreground font-mono mb-2">DRIVER 2</p>
          <Select value={driver2} onValueChange={setDriver2}>
            <SelectTrigger className="bg-black/40 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {drivers.map((d) => (
                <SelectItem key={d.number} value={d.number}>
                  #{d.number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {d1 && d2 && (
        <div className="space-y-4">
          {/* Delta Display */}
          {delta && (
            <div className="bg-black/40 rounded-lg p-3 border border-border/30">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">TIME DELTA</span>
                {delta.faster === d1.number ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div className="text-2xl font-bold text-primary mt-1">
                +{delta.value.toFixed(3)}s
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                #{delta.faster} is faster
              </p>
            </div>
          )}

          {/* Stats Comparison */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 items-center">
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">
                  {formatLapTimeSeconds(d1.bestLap)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground font-mono">BEST LAP</p>
              </div>
              <div className="text-left">
                <p className="text-lg font-bold text-foreground">
                  {formatLapTimeSeconds(d2.bestLap)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center border-t border-border/30 pt-3">
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">
                  {formatLapTimeSeconds(d1.averageLap)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground font-mono">AVG LAP</p>
              </div>
              <div className="text-left">
                <p className="text-lg font-bold text-foreground">
                  {formatLapTimeSeconds(d2.averageLap)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center border-t border-border/30 pt-3">
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">{d1.totalLaps}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground font-mono">TOTAL LAPS</p>
              </div>
              <div className="text-left">
                <p className="text-lg font-bold text-foreground">{d2.totalLaps}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
