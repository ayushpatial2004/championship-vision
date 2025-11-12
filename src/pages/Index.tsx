import { useState, useEffect } from "react";
import { RaceHeader } from "@/components/RaceHeader";
import { TrackMap } from "@/components/TrackMap";
import { TelemetryChart } from "@/components/TelemetryChart";
import { DriverCard } from "@/components/DriverCard";
import { PerformanceRadar } from "@/components/PerformanceRadar";
import { LoadingScreen } from "@/components/LoadingScreen";
import { GoogleDriveUpload } from "@/components/GoogleDriveUpload";
import { Button } from "@/components/ui/button";
import { Play, Pause, BarChart3, Activity, Wifi } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [activeSector, setActiveSector] = useState<1 | 2 | 3>(1);
  const [drsActive, setDrsActive] = useState(false);
  const [dataStreamStatus, setDataStreamStatus] = useState<"connected" | "buffering" | "offline">("connected");

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
    }, 3000); // Updates every 3 seconds for real-time feel

    return () => clearInterval(interval);
  }, [isLive]);

  // Mock driver data
  const drivers = [
    {
      name: "Max Verstappen",
      position: 1,
      lapTime: "1:18.750",
      avgSpeed: 312,
      consistency: 9.2,
      cognitiveLoad: 78,
      team: "Red Bull"
    },
    {
      name: "Lewis Hamilton",
      position: 2,
      lapTime: "1:18.892",
      avgSpeed: 310,
      consistency: 9.0,
      cognitiveLoad: 75,
      team: "Mercedes"
    },
    {
      name: "Charles Leclerc",
      position: 3,
      lapTime: "1:19.045",
      avgSpeed: 308,
      consistency: 8.8,
      cognitiveLoad: 80,
      team: "Ferrari"
    },
    {
      name: "Lando Norris",
      position: 4,
      lapTime: "1:19.234",
      avgSpeed: 305,
      consistency: 8.5,
      cognitiveLoad: 72,
      team: "McLaren"
    }
  ];

  const radarData = [
    { category: "SPEED", value: 92 },
    { category: "CONSISTENCY", value: 88 },
    { category: "RACE CRAFT", value: 85 },
    { category: "TYRE MGMT", value: 90 },
    { category: "COGNITIVE", value: 82 },
    { category: "OVERTAKING", value: 87 }
  ];

  if (isLoading) {
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
          </div>

          <div className="flex items-center gap-6">
            {/* Real-time Stream Status */}
            <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-1.5 border border-border/50">
              <Wifi className={`w-5 h-5 ${
                dataStreamStatus === "connected" ? "text-f1-green" : 
                dataStreamStatus === "buffering" ? "text-f1-yellow animate-pulse" : 
                "text-muted-foreground"
              }`} />
              <span className="text-sm font-mono text-muted-foreground">
                {dataStreamStatus === "connected" && isLive ? "LIVE • 60Hz" : 
                 dataStreamStatus === "buffering" ? "BUFFERING..." : 
                 "OFFLINE"}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Activity className={`w-5 h-5 ${isLive ? 'text-f1-green animate-pulse' : 'text-muted-foreground'}`} />
              <span className="text-sm font-mono text-muted-foreground">
                {isLive ? 'REAL-TIME DATA' : 'STREAM PAUSED'}
              </span>
            </div>
            
            <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-1.5">
              <BarChart3 className="w-4 h-4 text-f1-cyan" />
              <span className="text-sm font-mono font-bold text-foreground">
                {drivers.length} DRIVERS TRACKED
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Track Map - Spans 2 columns */}
          <div className="lg:col-span-2">
            <TrackMap activeSector={activeSector} drsActive={drsActive} />
          </div>

          {/* Performance Radar */}
          <div>
            <PerformanceRadar data={radarData} title="TEAM PERFORMANCE" />
          </div>
        </div>

        {/* Telemetry Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <TelemetryChart 
            title="SPEED" 
            dataKey="speed" 
            color="hsl(var(--f1-cyan))" 
            unit="km/h" 
          />
          <TelemetryChart 
            title="THROTTLE" 
            dataKey="throttle" 
            color="hsl(var(--f1-green))" 
            unit="%" 
          />
          <TelemetryChart 
            title="BRAKE" 
            dataKey="brake" 
            color="hsl(var(--f1-red))" 
            unit="%" 
          />
          <TelemetryChart 
            title="GEAR" 
            dataKey="gear" 
            color="hsl(var(--f1-yellow))" 
            unit="" 
          />
        </div>

        {/* Driver Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              DRIVER STANDINGS
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
              <div className="w-2 h-2 rounded-full bg-f1-green animate-pulse" />
              UPDATING LIVE
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {drivers.map((driver, idx) => (
              <DriverCard key={idx} {...driver} />
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-gradient-to-r from-muted/20 via-muted/10 to-muted/20 border border-border rounded-xl p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="grid-animation" />
          </div>
          <div className="relative z-10">
            <p className="text-sm text-muted-foreground font-mono mb-2">
              💡 <span className="text-f1-red font-bold">RACEMIND 3D</span> • Advanced F1 Telemetry & Cognitive Performance Analysis
            </p>
            <p className="text-xs text-muted-foreground font-mono mb-3">
              Real-time data streaming at 60Hz • Multi-dimensional driver analytics • AI-powered performance optimization
            </p>
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-f1-green" />
                Data Stream Active
              </span>
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-f1-cyan" />
                Cognitive Analysis Online
              </span>
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-f1-yellow" />
                Google Drive Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
