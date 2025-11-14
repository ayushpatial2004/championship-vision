import { Card } from "@/components/ui/card";
import { Cloud, Wind, Thermometer, Droplets } from "lucide-react";
import { WeatherData } from "@/lib/dataParser";

interface WeatherWidgetProps {
  data: WeatherData | null;
}

export const WeatherWidget = ({ data }: WeatherWidgetProps) => {
  if (!data) {
    return (
      <Card className="bg-gradient-carbon border-2 border-border p-4">
        <h3 className="text-sm font-bold text-foreground tracking-wider mb-3">WEATHER CONDITIONS</h3>
        <p className="text-xs text-muted-foreground">Loading weather data...</p>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-carbon border-2 border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-foreground tracking-wider">WEATHER CONDITIONS</h3>
        <Cloud className="w-5 h-5 text-primary" />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-red-500" />
            <div>
              <p className="text-xs text-muted-foreground font-mono">AIR TEMP</p>
              <p className="text-lg font-bold text-foreground">{data.airTemp.toFixed(1)}°C</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-orange-500" />
            <div>
              <p className="text-xs text-muted-foreground font-mono">TRACK TEMP</p>
              <p className="text-lg font-bold text-foreground">{data.trackTemp.toFixed(1)}°C</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-500" />
            <div>
              <p className="text-xs text-muted-foreground font-mono">HUMIDITY</p>
              <p className="text-lg font-bold text-foreground">{data.humidity.toFixed(1)}%</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground font-mono">WIND</p>
              <p className="text-lg font-bold text-foreground">{data.windSpeed.toFixed(1)} km/h</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-border/30">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-mono">PRESSURE</span>
          <span className="text-foreground font-bold">{data.pressure.toFixed(1)} hPa</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-muted-foreground font-mono">WIND DIR</span>
          <span className="text-foreground font-bold">{data.windDirection.toFixed(0)}°</span>
        </div>
      </div>
    </Card>
  );
};
