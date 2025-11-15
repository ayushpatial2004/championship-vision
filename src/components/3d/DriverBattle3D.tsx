import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Line } from '@react-three/drei';
import { useState, useMemo, useRef, useEffect } from 'react';
import { cotaCorners } from '@/utils/cornerMetadata';
import { GhostReplayEngine, createReplayDataFromLapTime, type GhostCarState } from '@/utils/ghostReplayEngine';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { DriverLapStats, formatLapTimeSeconds } from '@/lib/dataParser';
import * as THREE from 'three';

interface DriverBattle3DProps {
  drivers: DriverLapStats[];
}

function TrackLine() {
  const trackPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    cotaCorners.forEach(corner => {
      points.push(new THREE.Vector3(...corner.position));
    });
    points.push(new THREE.Vector3(...cotaCorners[0].position));
    return points;
  }, []);

  return (
    <>
      <Line points={trackPoints} color="white" lineWidth={6} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, -35]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color={0x1a1a1a} />
      </mesh>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
    </>
  );
}

function BattleCar({ 
  engine, 
  color, 
  label 
}: { 
  engine: GhostReplayEngine | null; 
  color: number;
  label: string;
}) {
  const carRef = useRef<THREE.Group>(null);
  const [state, setState] = useState<GhostCarState | null>(null);

  useEffect(() => {
    if (!engine) return;

    engine.setUpdateCallback((newState) => {
      setState(newState);
      if (carRef.current) {
        carRef.current.position.set(...newState.position);
        carRef.current.rotation.y = newState.rotation;
      }
    });

    return () => {
      engine.destroy();
    };
  }, [engine]);

  return (
    <group ref={carRef}>
      {/* Car body */}
      <mesh castShadow>
        <boxGeometry args={[1, 0.5, 2]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.8} 
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Front wing */}
      <mesh position={[0, 0, 1.2]} castShadow>
        <boxGeometry args={[1.5, 0.1, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Rear wing */}
      <mesh position={[0, 0.5, -1]} castShadow>
        <boxGeometry args={[1.2, 0.3, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Trail effect */}
      {state && (
        <mesh position={[0, 0, -2]}>
          <cylinderGeometry args={[0.1, 0.1, 3]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}

export function DriverBattle3D({ drivers }: DriverBattle3DProps) {
  const [driver1Id, setDriver1Id] = useState<string>('');
  const [driver2Id, setDriver2Id] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [engine1, setEngine1] = useState<GhostReplayEngine | null>(null);
  const [engine2, setEngine2] = useState<GhostReplayEngine | null>(null);

  const driver1 = drivers.find(d => d.number === driver1Id);
  const driver2 = drivers.find(d => d.number === driver2Id);

  useEffect(() => {
    if (driver1) {
      const replayData = createReplayDataFromLapTime(
        driver1.number,
        driver1.bestLap,
        driver1.number
      );
      const newEngine = new GhostReplayEngine(replayData);
      setEngine1(newEngine);
      
      return () => {
        newEngine.destroy();
      };
    }
  }, [driver1]);

  useEffect(() => {
    if (driver2) {
      const replayData = createReplayDataFromLapTime(
        driver2.number,
        driver2.bestLap,
        driver2.number
      );
      const newEngine = new GhostReplayEngine(replayData);
      setEngine2(newEngine);
      
      return () => {
        newEngine.destroy();
      };
    }
  }, [driver2]);

  const handlePlayPause = () => {
    if (isPlaying) {
      engine1?.pause();
      engine2?.pause();
    } else {
      engine1?.play();
      engine2?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    engine1?.restart();
    engine2?.restart();
    setIsPlaying(true);
  };

  const handleProgressChange = (values: number[]) => {
    const newProgress = values[0] / 100;
    if (engine1) {
      engine1.seekTo(newProgress * engine1.getTotalTime());
    }
    if (engine2) {
      engine2.seekTo(newProgress * engine2.getTotalTime());
    }
    setProgress(values[0]);
  };

  useEffect(() => {
    if (!engine1) return;
    
    const interval = setInterval(() => {
      if (isPlaying) {
        setProgress(engine1.getProgress() * 100);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [engine1, isPlaying]);

  const timeDelta = driver1 && driver2 ? driver1.bestLap - driver2.bestLap : 0;

  return (
    <Card className="w-full h-full bg-background/95 backdrop-blur border-primary/20">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Driver Battle Mode
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Driver 1</label>
            <Select value={driver1Id} onValueChange={setDriver1Id}>
              <SelectTrigger>
                <SelectValue placeholder="Select driver" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map(driver => (
                  <SelectItem key={driver.number} value={driver.number}>
                    #{driver.number} - {driver.vehicle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {driver1 && (
              <p className="text-sm text-muted-foreground mt-1">
                Best: {formatLapTimeSeconds(driver1.bestLap)}
              </p>
            )}
          </div>
          
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Driver 2</label>
            <Select value={driver2Id} onValueChange={setDriver2Id}>
              <SelectTrigger>
                <SelectValue placeholder="Select driver" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map(driver => (
                  <SelectItem key={driver.number} value={driver.number}>
                    #{driver.number} - {driver.vehicle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {driver2 && (
              <p className="text-sm text-muted-foreground mt-1">
                Best: {formatLapTimeSeconds(driver2.bestLap)}
              </p>
            )}
          </div>
        </div>

        {driver1 && driver2 && (
          <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm font-mono">
              Time Delta: {timeDelta > 0 ? '+' : ''}{timeDelta.toFixed(3)}s
              {timeDelta !== 0 && (
                <span className="ml-2 text-muted-foreground">
                  ({Math.abs(timeDelta) > 0 ? (timeDelta > 0 ? 'Driver 2 faster' : 'Driver 1 faster') : 'Equal'})
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      <div className="h-[500px] relative">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 50, 50]} fov={60} />
          <OrbitControls enablePan enableZoom enableRotate />
          <TrackLine />
          {engine1 && <BattleCar engine={engine1} color={0x00aaff} label="Driver 1" />}
          {engine2 && <BattleCar engine={engine2} color={0xff0066} label="Driver 2" />}
        </Canvas>

        {/* Controls */}
        <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur p-4 rounded-lg border border-primary/20">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePlayPause}
              disabled={!engine1 || !engine2}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRestart}
              disabled={!engine1 || !engine2}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <Slider
                value={[progress]}
                onValueChange={handleProgressChange}
                max={100}
                step={0.1}
                disabled={!engine1 || !engine2}
              />
            </div>
            <span className="text-sm font-mono text-muted-foreground min-w-[60px]">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur p-3 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-[#00aaff] rounded"></div>
            <span className="text-sm">{driver1 ? `#${driver1.number}` : 'Driver 1'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#ff0066] rounded"></div>
            <span className="text-sm">{driver2 ? `#${driver2.number}` : 'Driver 2'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
