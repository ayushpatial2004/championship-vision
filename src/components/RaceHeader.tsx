import { useEffect, useState } from "react";
import f1CarMotion from "@/assets/f1-car-motion.png";
import cotaTrack from "@/assets/cota-track.jpg";
import { Activity, Clock, Flag, Radio } from "lucide-react";

export const RaceHeader = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-racing rounded-2xl shadow-racing mb-8">
      {/* Track Background with Overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${cotaTrack})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.4) contrast(1.2)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />
      </div>

      {/* F1 Car Overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20">
        <img 
          src={f1CarMotion} 
          alt="F1 Car" 
          className="h-full object-contain object-right"
          style={{ filter: 'brightness(1.2)' }}
        />
      </div>

      {/* Animated Lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" />
        <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Flag className="w-8 h-8 text-white" />
              <h1 className="text-5xl font-black text-white tracking-tighter">
                RACEMIND <span className="text-f1-cyan">3D</span>
              </h1>
            </div>
            <p className="text-white/80 text-lg font-mono tracking-wide">
              ADVANCED COGNITIVE TELEMETRY SYSTEM
            </p>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2 bg-black/40 rounded-lg px-3 py-1.5 border border-f1-green/30">
                <Radio className="w-4 h-4 text-f1-green animate-pulse" />
                <span className="text-sm font-mono text-white/90 font-bold">LIVE</span>
              </div>
              <div className="flex items-center gap-2 bg-black/40 rounded-lg px-3 py-1.5 border border-border/30">
                <Activity className="w-4 h-4 text-f1-cyan" />
                <span className="text-sm font-mono text-white/90">REAL-TIME TELEMETRY</span>
              </div>
              <div className="flex items-center gap-2 bg-black/40 rounded-lg px-3 py-1.5 border border-border/30">
                <Clock className="w-4 h-4 text-f1-yellow" />
                <span className="text-sm font-mono text-white/90">
                  {time.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          {/* Session Info */}
          <div className="text-right bg-black/40 rounded-xl p-4 border border-white/20 backdrop-blur-sm">
            <p className="text-xs text-white/60 font-mono mb-1">CURRENT SESSION</p>
            <p className="text-2xl font-bold text-white mb-2">RACE DAY</p>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-xs text-white/60 font-mono">LAP</p>
                <p className="text-lg font-bold text-f1-cyan">45/58</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-xs text-white/60 font-mono">TEMP</p>
                <p className="text-lg font-bold text-f1-yellow">32°C</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
