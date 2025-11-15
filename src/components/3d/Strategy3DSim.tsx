import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Line, Text } from '@react-three/drei';
import { useMemo, useState } from 'react';
import { cotaCorners } from '@/utils/cornerMetadata';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as THREE from 'three';

interface StrategyOption {
  name: string;
  pitLap: number;
  tyreDelta: number; // seconds gained/lost
  fuelDelta: number; // seconds gained/lost
  color: number;
}

const strategies: StrategyOption[] = [
  {
    name: 'Early Pit (Lap 8)',
    pitLap: 8,
    tyreDelta: -2.5,
    fuelDelta: -1.2,
    color: 0x00ff00,
  },
  {
    name: 'Standard Pit (Lap 12)',
    pitLap: 12,
    tyreDelta: 0,
    fuelDelta: 0,
    color: 0xffaa00,
  },
  {
    name: 'Late Pit (Lap 16)',
    pitLap: 16,
    tyreDelta: 2.8,
    fuelDelta: 1.5,
    color: 0xff0000,
  },
  {
    name: 'Two-Stop Strategy',
    pitLap: 10,
    tyreDelta: -4.5,
    fuelDelta: -2.0,
    color: 0x0088ff,
  },
];

function TrackWithPitWindow({ selectedStrategy }: { selectedStrategy: StrategyOption | null }) {
  const trackPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    cotaCorners.forEach(corner => {
      points.push(new THREE.Vector3(...corner.position));
    });
    points.push(new THREE.Vector3(...cotaCorners[0].position));
    return points;
  }, []);

  // Calculate pit window position (around lap progress)
  const pitWindowPosition = useMemo(() => {
    if (!selectedStrategy) return null;
    const progress = selectedStrategy.pitLap / 20; // Assuming 20 lap race
    const index = Math.floor(progress * cotaCorners.length);
    const corner = cotaCorners[index % cotaCorners.length];
    return corner.position;
  }, [selectedStrategy]);

  return (
    <>
      {/* Track line */}
      <Line points={trackPoints} color="white" lineWidth={6} />

      {/* Pit window indicator */}
      {pitWindowPosition && selectedStrategy && (
        <group position={pitWindowPosition}>
          {/* Pit stop marker */}
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[1, 1, 4]} />
            <meshStandardMaterial
              color={selectedStrategy.color}
              transparent
              opacity={0.7}
              emissive={selectedStrategy.color}
              emissiveIntensity={0.5}
            />
          </mesh>

          {/* Time delta visualization */}
          <mesh position={[0, 5, 0]}>
            <sphereGeometry args={[Math.abs(selectedStrategy.tyreDelta + selectedStrategy.fuelDelta) / 2, 16, 16]} />
            <meshStandardMaterial
              color={selectedStrategy.tyreDelta + selectedStrategy.fuelDelta < 0 ? 0x00ff00 : 0xff0000}
              transparent
              opacity={0.5}
            />
          </mesh>

          {/* Label */}
          <Text
            position={[0, 7, 0]}
            fontSize={1}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            Pit Lap {selectedStrategy.pitLap}
          </Text>
        </group>
      )}

      {/* Ground and lighting */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, -35]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color={0x1a1a1a} />
      </mesh>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1} />
    </>
  );
}

export function Strategy3DSim() {
  const [selectedStrategyName, setSelectedStrategyName] = useState<string>('');
  
  const selectedStrategy = strategies.find(s => s.name === selectedStrategyName) || null;

  const totalDelta = selectedStrategy 
    ? selectedStrategy.tyreDelta + selectedStrategy.fuelDelta 
    : 0;

  return (
    <Card className="w-full h-full bg-background/95 backdrop-blur border-primary/20">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          3D Strategy Simulation
        </h2>
        
        <div className="mb-4">
          <label className="text-sm text-muted-foreground mb-2 block">Select Strategy</label>
          <Select value={selectedStrategyName} onValueChange={setSelectedStrategyName}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a pit strategy" />
            </SelectTrigger>
            <SelectContent>
              {strategies.map(strategy => (
                <SelectItem key={strategy.name} value={strategy.name}>
                  {strategy.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedStrategy && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-background/50 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">Pit Lap</p>
              <p className="text-xl font-bold text-foreground">{selectedStrategy.pitLap}</p>
            </div>
            <div className="p-3 bg-background/50 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">Tyre Delta</p>
              <p className={`text-xl font-bold ${selectedStrategy.tyreDelta < 0 ? 'text-green-400' : 'text-red-400'}`}>
                {selectedStrategy.tyreDelta > 0 ? '+' : ''}{selectedStrategy.tyreDelta.toFixed(1)}s
              </p>
            </div>
            <div className="p-3 bg-background/50 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">Total Impact</p>
              <p className={`text-xl font-bold ${totalDelta < 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalDelta > 0 ? '+' : ''}{totalDelta.toFixed(1)}s
              </p>
            </div>
          </div>
        )}

        {selectedStrategy && (
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 mb-4">
            <h3 className="font-semibold mb-2 text-foreground">Strategy Impact</h3>
            <p className="text-sm text-muted-foreground">
              {totalDelta < 0 
                ? `This strategy could gain approximately ${Math.abs(totalDelta).toFixed(1)} seconds over the race.`
                : totalDelta > 0
                ? `This strategy could cost approximately ${totalDelta.toFixed(1)} seconds compared to baseline.`
                : 'This is the baseline strategy with neutral time impact.'
              }
            </p>
          </div>
        )}
      </div>

      <div className="h-[500px] relative">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 60, 60]} fov={60} />
          <OrbitControls enablePan enableZoom enableRotate target={[20, 0, -35]} />
          <TrackWithPitWindow selectedStrategy={selectedStrategy} />
        </Canvas>

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur p-4 rounded-lg border border-primary/20">
          <h4 className="font-semibold mb-2 text-sm text-foreground">Visual Guide</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded"></div>
              <span className="text-muted-foreground">Time Gain</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded"></div>
              <span className="text-muted-foreground">Time Loss</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-white rounded"></div>
              <span className="text-muted-foreground">Pit Window</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
