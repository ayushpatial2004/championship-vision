import { useState, useEffect } from "react";
import { RaceHeader } from "@/components/RaceHeader";
import { TrackMap } from "@/components/TrackMap";
import { TelemetryChart } from "@/components/TelemetryChart";
import { DriverCard } from "@/components/DriverCard";
import { PerformanceRadar } from "@/components/PerformanceRadar";
import { LoadingScreen } from "@/components/LoadingScreen";
import { GoogleDriveUpload } from "@/components/GoogleDriveUpload";
import { WeatherWidget } from "@/components/WeatherWidget";
import { DriverComparison } from "@/components/DriverComparison";
import { Button } from "@/components/ui/button";
import { Play, Pause, BarChart3, Activity, Wifi } from "lucide-react";
import { toast } from "sonner";
import { useRacingData } from "@/hooks/useRacingData";
import { formatLapTimeSeconds } from "@/lib/dataParser";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [activeSector, setActiveSector] = useState<1 | 2 | 3>(1);
  const [drsActive, setDrsActive] = useState(false);
  const [dataStreamStatus, setDataStreamStatus] = useState<"connected" | "buffering" | "offline">("connected");
  const [currentWeatherIndex, setCurrentWeatherIndex] = useState(0);
  
  const { weather, lapTimes, driverStats, loading: dataLoading } = useRacingData(2);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Simulate real-time data updates (sector changes, DRS, streaming status)
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setActiveSector(prev => (prev === 3 ? 1 : (prev + 1) as 1 | 2 | 3));
      setDrsActive(Math.random() > 0.6);
      
      // Simulate occasional buffering for realism
      if (Math.random() > 0.95) {
        setDataStreamStatus("buffering");
        setTimeout(() => setDataStreamStatus("connected"), 1500);
      }
      
      // Cycle through weather data
      setCurrentWeatherIndex((prev) => (prev + 1) % (weather.length || 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive, weather.length]);

  // Generate driver cards from real data
  const drivers = driverStats.slice(0, 8).map((driver, index) => {
    const position = index + 1;
    const lapTimeVariation = driver.bestLaps.length > 1 
      ? Math.abs(driver.bestLaps[0].time - driver.bestLaps[driver.bestLaps.length - 1].time)
      : 0;
    const consistency = Math.max(85, 100 - (lapTimeVariation * 10));
    
    return {
      name: `Driver ${driver.number}`,
      position,
      lapTime: formatLapTimeSeconds(driver.bestLap),
      avgSpeed: Math.round(180 + Math.random() * 20),
      consistency: Math.round(consistency),
      cognitiveLoad: Math.round(60 + Math.random() * 30),
      team: driver.vehicle,
    };
  });

  const radarData = [
    { category: "SPEED", value: 92 },
    { category: "CONSISTENCY", value: 88 },
    { category: "RACE CRAFT", value: 85 },
    { category: "TYRE MGMT", value: 90 },
    { category: "COGNITIVE", value: 82 },
    { category: "OVERTAKING", value: 87 }
  ];

  if (isLoading || dataLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <RaceHeader />

        {/* Control Panel */}
        <div className="flex items-center justify-between mb-6 bg-card border-2 border-border rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => {
                setIsLive(!isLive);
                toast.success(isLive ? "Stream paused" : "Stream resumed", {
                  description: isLive ? "Real-time updates paused" : "Now streaming live telemetry data"
                });
              }}
              variant={isLive ? "default" : "outline"}
              className="font-bold"
            >
              {isLive ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  PAUSE STREAM
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  START STREAM
                </>
              )}
            </Button>
            
            <GoogleDriveUpload />
            
            <div className={`px-4 py-2 rounded-lg border-2 ${
              dataStreamStatus === 'connected' 
                ? 'bg-green-500/10 border-green-500/30' 
                : dataStreamStatus === 'buffering'
                ? 'bg-yellow-500/10 border-yellow-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  dataStreamStatus === 'connected' 
                    ? 'bg-green-500 animate-pulse' 
                    : dataStreamStatus === 'buffering'
                    ? 'bg-yellow-500 animate-pulse'
                    : 'bg-red-500'
                }`} />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  {dataStreamStatus}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg border border-primary/30">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-xs font-mono font-bold">
                {drivers.length} DRIVERS ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
              <Activity className="w-4 h-4 text-cyan-500 animate-pulse" />
              <span className="text-xs font-mono font-bold">
                REAL-TIME DATA
              </span>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TrackMap activeSector={activeSector} drsActive={drsActive} />
              <PerformanceRadar data={radarData} title="DRIVER ANALYSIS" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <WeatherWidget data={weather[currentWeatherIndex] || null} />
              <DriverComparison drivers={driverStats} />
            </div>
            
            {/* Telemetry Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TelemetryChart title="SPEED" dataKey="speed" color="#00ff88" unit="km/h" />
              <TelemetryChart title="THROTTLE" dataKey="throttle" color="#ff0088" unit="%" />
              <TelemetryChart title="BRAKE PRESSURE" dataKey="brake" color="#00aaff" unit="bar" />
              <TelemetryChart title="GEAR" dataKey="gear" color="#ffaa00" unit="" />
            </div>
          </div>

          {/* Driver Leaderboard */}
          <div className="space-y-4">
            <div className="bg-gradient-carbon border-2 border-border rounded-xl p-4">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <BarChart3 className="w-5 h-5 text-primary" />
                LIVE STANDINGS
              </h2>
              <div className="space-y-3">
                {drivers.map((driver) => (
                  <DriverCard key={driver.position} {...driver} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gradient-carbon border-t-2 border-border p-4 mt-6">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-primary" />
              <div>
                <span className="text-sm font-mono text-foreground font-bold">F1 TELEMETRY DASHBOARD v2.0</span>
                <p className="text-xs text-muted-foreground">
                  {driverStats.length} drivers • {lapTimes.length} lap records • {weather.length} weather samples
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground font-mono">REAL RACE DATA</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-cyan-500" />
                <span className="text-xs text-muted-foreground font-mono uppercase">
                  {dataStreamStatus === 'connected' && 'CONNECTED'}
                  {dataStreamStatus === 'buffering' && 'BUFFERING...'}
                  {dataStreamStatus === 'offline' && 'OFFLINE'}
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
