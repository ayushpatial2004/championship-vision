import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useState } from "react";
import { DriverLapStats } from "@/lib/dataParser";

interface DeltaAnalysisProps {
  drivers: DriverLapStats[];
}

export const DeltaAnalysis = ({ drivers }: DeltaAnalysisProps) => {
  const [driver1, setDriver1] = useState<string>(drivers[0]?.number || "");
  const [driver2, setDriver2] = useState<string>(drivers[1]?.number || "");

  const d1 = drivers.find(d => d.number === driver1);
  const d2 = drivers.find(d => d.number === driver2);

  // Generate sector deltas (mock data based on lap times)
  const sectors = [
    { sector: 1, delta: d1 && d2 ? ((d1.bestLap - d2.bestLap) / 3) : 0 },
    { sector: 2, delta: d1 && d2 ? ((d1.bestLap - d2.bestLap) / 3) * 1.2 : 0 },
    { sector: 3, delta: d1 && d2 ? ((d1.bestLap - d2.bestLap) / 3) * 0.8 : 0 },
  ];

  const totalDelta = d1 && d2 ? d1.bestLap - d2.bestLap : 0;

  return (
    <Card className="bg-gradient-carbon border-2 border-border p-4">
      <h3 className="text-sm font-bold text-foreground tracking-wider mb-4">
        DELTA ANALYSIS - TOP DRIVERS
      </h3>
      
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
                  #{d.number} - {d.vehicle}
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
                  #{d.number} - {d.vehicle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {d1 && d2 && (
        <div className="space-y-4">
          {/* Total Delta */}
          <div className="bg-black/40 rounded-lg p-4 border border-border/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-mono">TOTAL DELTA</span>
              {totalDelta < 0 ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : totalDelta > 0 ? (
                <TrendingDown className="w-5 h-5 text-red-500" />
              ) : (
                <Minus className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div className={`text-3xl font-bold ${totalDelta < 0 ? 'text-green-400' : totalDelta > 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
              {totalDelta < 0 ? '-' : '+'}{Math.abs(totalDelta).toFixed(3)}s
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalDelta < 0 ? `#${driver1} is faster` : totalDelta > 0 ? `#${driver2} is faster` : 'Equal pace'}
            </p>
          </div>

          {/* Sector Deltas */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-mono mb-2">SECTOR BREAKDOWN</p>
            {sectors.map((s) => (
              <div key={s.sector} className="bg-black/40 rounded-lg p-3 border border-border/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-primary">S{s.sector}</span>
                    <div className="flex-1">
                      <div className="h-2 bg-muted/30 rounded-full w-40 overflow-hidden">
                        <div 
                          className={`h-full ${s.delta < 0 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(Math.abs(s.delta) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <span className={`text-sm font-bold font-mono ${s.delta < 0 ? 'text-green-400' : s.delta > 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
                    {s.delta < 0 ? '-' : '+'}{Math.abs(s.delta).toFixed(3)}s
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
