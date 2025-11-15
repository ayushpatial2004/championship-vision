import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Line } from '@react-three/drei';
import { useState, useMemo, useRef, useEffect } from 'react';
import { cotaCorners, type CornerData } from '@/utils/cornerMetadata';
import { GhostReplayEngine, createReplayDataFromLapTime } from '@/utils/ghostReplayEngine';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw } from 'lucide-react';
import * as THREE from 'three';

interface Track3DViewProps {
  driverData?: {
    id: string;
    number: string;
    bestLap: number;
  };
  showSpeedHeatmap?: boolean;
}

function Track3DMesh({ showSpeedHeatmap }: { showSpeedHeatmap: boolean }) {
  // Generate track path from corners
  const trackPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    cotaCorners.forEach(corner => {
      points.push(new THREE.Vector3(...corner.position));
    });
    // Close the loop
    points.push(new THREE.Vector3(...cotaCorners[0].position));
    return points;
  }, []);

  // Generate speed-based colors for heatmap
  const trackColors = useMemo(() => {
    if (!showSpeedHeatmap) return undefined;
    
    const colors: THREE.Color[] = [];
    cotaCorners.forEach(corner => {
      let color: THREE.Color;
      switch (corner.type) {
        case 'slow':
          color = new THREE.Color(0x0066ff); // Blue
          break;
        case 'medium':
          color = new THREE.Color(0xffaa00); // Orange
          break;
        case 'fast':
          color = new THREE.Color(0xff0000); // Red
          break;
      }
      colors.push(color);
    });
    colors.push(colors[0]); // Close the loop
    return colors;
  }, [showSpeedHeatmap]);

  // Speed zone overlays
  const speedZones = useMemo(() => {
    return cotaCorners.map(corner => ({
      position: corner.position,
      color: corner.type === 'slow' ? 0xff0000 : corner.type === 'medium' ? 0xffaa00 : 0x00ff00,
      type: corner.type,
    }));
  }, []);

  return (
    <>
      {/* Main track line */}
      <Line
        points={trackPoints}
        color={showSpeedHeatmap ? undefined : "white"}
        lineWidth={8}
        vertexColors={showSpeedHeatmap ? trackColors : undefined}
      />

      {/* Speed zone indicators */}
      {showSpeedHeatmap && speedZones.map((zone, idx) => (
        <mesh key={idx} position={zone.position}>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshStandardMaterial
            color={zone.color}
            transparent
            opacity={0.6}
            emissive={zone.color}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Corner markers */}
      {cotaCorners.map((corner, idx) => (
        <group key={idx}>
          {/* Corner apex marker */}
          <mesh position={corner.position}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color={corner.overtakingZone ? 0x00ff00 : 0xffffff} />
          </mesh>
          
          {/* Braking zone marker */}
          <mesh position={corner.braking.position}>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial color={0xff0000} transparent opacity={0.5} />
          </mesh>
        </group>
      ))}

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, -35]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color={0x1a1a1a} />
      </mesh>

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
      <pointLight position={[0, 10, 0]} intensity={0.5} />
    </>
  );
}

function GhostCar({ engine, color = 0x00aaff }: { engine: GhostReplayEngine | null; color?: number }) {
  const carRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!engine) return;

    engine.setUpdateCallback((state) => {
      if (carRef.current) {
        carRef.current.position.set(...state.position);
        carRef.current.rotation.y = state.rotation;
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
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
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
    </group>
  );
}

export function Track3DView({ driverData, showSpeedHeatmap = true }: Track3DViewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [engine, setEngine] = useState<GhostReplayEngine | null>(null);
  const [focusedCorner, setFocusedCorner] = useState<CornerData | null>(null);

  useEffect(() => {
    if (driverData) {
      const replayData = createReplayDataFromLapTime(
        driverData.id,
        driverData.bestLap,
        driverData.number
      );
      const newEngine = new GhostReplayEngine(replayData);
      
      newEngine.setUpdateCallback((state) => {
        setProgress(state.progress * 100);
      });
      
      setEngine(newEngine);
      
      return () => {
        newEngine.destroy();
      };
    }
  }, [driverData]);

  const handlePlayPause = () => {
    if (!engine) return;
    
    if (isPlaying) {
      engine.pause();
    } else {
      engine.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    if (!engine) return;
    engine.restart();
    setIsPlaying(true);
  };

  const handleProgressChange = (values: number[]) => {
    if (!engine) return;
    const newProgress = values[0] / 100;
    engine.seekTo(newProgress * engine.getTotalTime());
    setProgress(values[0]);
  };

  return (
    <Card className="w-full h-full bg-background/95 backdrop-blur border-primary/20">
      <div className="h-[600px] relative">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 40, 40]} fov={60} />
          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            target={focusedCorner ? focusedCorner.position : [20, 0, -35]}
          />
          <Track3DMesh showSpeedHeatmap={showSpeedHeatmap} />
          {engine && <GhostCar engine={engine} />}
        </Canvas>

        {/* Controls overlay */}
        <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur p-4 rounded-lg border border-primary/20">
          <div className="flex items-center gap-4 mb-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePlayPause}
              disabled={!engine}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRestart}
              disabled={!engine}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <Slider
                value={[progress]}
                onValueChange={handleProgressChange}
                max={100}
                step={0.1}
                disabled={!engine}
                className="w-full"
              />
            </div>
            <span className="text-sm font-mono text-muted-foreground min-w-[60px]">
              {Math.round(progress)}%
            </span>
          </div>
          
          {driverData && (
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">#{driverData.number}</span> - Best Lap Replay
            </div>
          )}
        </div>

        {/* Corner info overlay */}
        {focusedCorner && (
          <div className="absolute top-4 right-4 bg-background/90 backdrop-blur p-4 rounded-lg border border-primary/20">
            <h3 className="font-bold text-foreground">{focusedCorner.name}</h3>
            <p className="text-sm text-muted-foreground">Type: {focusedCorner.type}</p>
            <p className="text-sm text-muted-foreground">Difficulty: {focusedCorner.difficulty}/10</p>
            {focusedCorner.overtakingZone && (
              <p className="text-sm text-green-400">⚡ Overtaking Zone</p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
