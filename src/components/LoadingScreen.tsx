import { useEffect, useState } from "react";
import f1Speedometer from "@/assets/f1-speedometer.gif";
import f1Wireframe from "@/assets/f1-wireframe.jpg";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("INITIALIZING SYSTEMS");

  useEffect(() => {
    const stages = [
      { text: "INITIALIZING SYSTEMS", duration: 800 },
      { text: "LOADING TELEMETRY DATA", duration: 1200 },
      { text: "SYNCING REAL-TIME FEED", duration: 1000 },
      { text: "CALIBRATING SENSORS", duration: 900 },
      { text: "ESTABLISHING CONNECTION", duration: 800 },
      { text: "READY FOR RACE", duration: 500 }
    ];

    let currentProgress = 0;
    let stageIndex = 0;

    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 8 + 2;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(progressInterval);
        setTimeout(() => onLoadingComplete(), 500);
      }

      setProgress(currentProgress);

      // Update loading text based on progress
      const newStageIndex = Math.floor((currentProgress / 100) * stages.length);
      if (newStageIndex !== stageIndex && newStageIndex < stages.length) {
        stageIndex = newStageIndex;
        setLoadingText(stages[stageIndex].text);
      }
    }, 100);

    return () => clearInterval(progressInterval);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Wireframe Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${f1Wireframe})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.5)'
        }}
      />

      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid-animation" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-7xl font-black text-white tracking-tighter mb-2">
            RACEMIND <span className="text-f1-red">3D</span>
          </h1>
          <p className="text-f1-cyan text-center font-mono text-sm tracking-widest">
            ADVANCED COGNITIVE TELEMETRY SYSTEM
          </p>
        </div>

        {/* F1 Speedometer Animation */}
        <div className="relative w-full max-w-2xl h-48 mb-12 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-f1-red/20 to-transparent animate-pulse" />
          <img 
            src={f1Speedometer} 
            alt="F1 Speedometer Loading" 
            className="h-48 object-contain relative z-10"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(255, 0, 0, 0.5))'
            }}
          />
        </div>

        {/* Loading Text */}
        <div className="mb-6 text-center">
          <p className="text-white text-xl font-mono font-bold tracking-wider animate-pulse">
            {loadingText}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-2xl px-8">
          <div className="relative h-4 bg-muted/30 rounded-full overflow-hidden border-2 border-border">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            
            {/* Progress fill */}
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-f1-red via-f1-yellow to-f1-green transition-all duration-300 ease-out"
              style={{ 
                width: `${progress}%`,
                boxShadow: '0 0 20px rgba(255, 0, 0, 0.8)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
          
          {/* Progress percentage */}
          <div className="mt-3 flex justify-between items-center">
            <span className="text-muted-foreground text-sm font-mono">LOADING...</span>
            <span className="text-f1-cyan text-lg font-mono font-bold">{Math.floor(progress)}%</span>
          </div>
        </div>

        {/* Bottom indicators */}
        <div className="absolute bottom-12 flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-f1-green animate-pulse" />
            <span className="text-xs text-muted-foreground font-mono">SYSTEM ONLINE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-f1-cyan animate-pulse" style={{ animationDelay: '0.3s' }} />
            <span className="text-xs text-muted-foreground font-mono">TELEMETRY ACTIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-f1-yellow animate-pulse" style={{ animationDelay: '0.6s' }} />
            <span className="text-xs text-muted-foreground font-mono">DATA STREAMING</span>
          </div>
        </div>
      </div>
    </div>
  );
};
