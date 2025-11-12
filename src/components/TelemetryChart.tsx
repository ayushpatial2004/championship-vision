import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface TelemetryChartProps {
  title: string;
  dataKey: string;
  color: string;
  unit: string;
}

export const TelemetryChart = ({ title, dataKey, color, unit }: TelemetryChartProps) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Generate realistic racing telemetry data
    const generateData = () => {
      const newData = [];
      const baseValues: Record<string, number> = {
        speed: 180,
        throttle: 75,
        brake: 20,
        gear: 5
      };
      
      for (let i = 0; i < 50; i++) {
        const variation = Math.sin(i / 5) * 30 + Math.random() * 15;
        newData.push({
          point: i,
          [dataKey]: Math.max(0, baseValues[dataKey] + variation)
        });
      }
      return newData;
    };

    setData(generateData());

    const interval = setInterval(() => {
      setData(prev => {
        const newPoint = {
          point: prev.length,
          [dataKey]: Math.max(0, prev[prev.length - 1][dataKey] + (Math.random() - 0.5) * 20)
        };
        return [...prev.slice(1), newPoint];
      });
    }, 100);

    return () => clearInterval(interval);
  }, [dataKey]);

  return (
    <Card className="bg-gradient-carbon border-2 border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-foreground tracking-wider">{title}</h3>
          <p className="text-xs text-muted-foreground font-mono">REAL-TIME DATA</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold" style={{ color }}>
            {data.length > 0 ? Math.round(data[data.length - 1][dataKey]) : 0}
          </p>
          <p className="text-xs text-muted-foreground font-mono">{unit}</p>
        </div>
      </div>
      
      <div className="h-32 bg-black/40 rounded-lg border border-border/30 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
            <XAxis dataKey="point" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#0a0a0a', 
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: any) => [`${Math.round(value)} ${unit}`, title]}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={2}
              fill={`url(#gradient-${dataKey})`}
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
