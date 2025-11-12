import { Card } from "@/components/ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface PerformanceRadarProps {
  data: {
    category: string;
    value: number;
  }[];
  title: string;
}

export const PerformanceRadar = ({ data, title }: PerformanceRadarProps) => {
  return (
    <Card className="bg-gradient-carbon border-2 border-border p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-foreground tracking-tight">{title}</h3>
        <p className="text-xs text-muted-foreground font-mono">MULTI-DIMENSIONAL ANALYSIS</p>
      </div>

      <div className="h-80 bg-black/40 rounded-lg border border-border/30 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#333" />
            <PolarAngleAxis 
              dataKey="category" 
              tick={{ fill: '#999', fontSize: 12, fontFamily: 'monospace' }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]}
              tick={{ fill: '#666', fontSize: 10 }}
            />
            <Radar
              name="Performance"
              dataKey="value"
              stroke="hsl(var(--f1-cyan))"
              fill="hsl(var(--f1-cyan))"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        {data.slice(0, 4).map((item, idx) => (
          <div key={idx} className="bg-muted/20 rounded-lg p-2 border border-border/20">
            <p className="text-xs text-muted-foreground font-mono mb-1">{item.category}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-f1-cyan"
                  style={{ width: `${item.value}%` }}
                />
              </div>
              <span className="text-xs font-bold text-foreground">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
