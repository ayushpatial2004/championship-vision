import { cotaCorners } from './cornerMetadata';

export interface GhostCarState {
  position: [number, number, number];
  rotation: number;
  speed: number;
  currentLap: number;
  progress: number; // 0-1
  sector: number;
}

export interface LapReplayData {
  driverId: string;
  lapTime: number;
  sectorTimes: number[];
  positions: Array<{ time: number; position: [number, number, number]; speed: number }>;
}

export class GhostReplayEngine {
  private isPlaying: boolean = false;
  private currentTime: number = 0;
  private totalTime: number = 0;
  private replayData: LapReplayData;
  private onUpdate?: (state: GhostCarState) => void;
  private animationFrame?: number;

  constructor(replayData: LapReplayData) {
    this.replayData = replayData;
    this.totalTime = replayData.lapTime;
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.animate();
  }

  pause() {
    this.isPlaying = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  restart() {
    this.currentTime = 0;
    this.play();
  }

  seekTo(timeInSeconds: number) {
    this.currentTime = Math.max(0, Math.min(timeInSeconds, this.totalTime));
    this.updateState();
  }

  setUpdateCallback(callback: (state: GhostCarState) => void) {
    this.onUpdate = callback;
  }

  private animate = () => {
    if (!this.isPlaying) return;

    const deltaTime = 0.016; // ~60fps
    this.currentTime += deltaTime;

    if (this.currentTime >= this.totalTime) {
      this.currentTime = 0; // Loop
    }

    this.updateState();
    this.animationFrame = requestAnimationFrame(this.animate);
  };

  private updateState() {
    const progress = this.currentTime / this.totalTime;
    const position = this.interpolatePosition(progress);
    const speed = this.interpolateSpeed(progress);
    const rotation = this.calculateRotation(progress);
    const sector = this.calculateSector(progress);

    const state: GhostCarState = {
      position,
      rotation,
      speed,
      currentLap: 1,
      progress,
      sector,
    };

    if (this.onUpdate) {
      this.onUpdate(state);
    }
  }

  private interpolatePosition(progress: number): [number, number, number] {
    // Generate smooth path through corners
    const totalCorners = cotaCorners.length;
    const cornerIndex = Math.floor(progress * totalCorners);
    const nextCornerIndex = (cornerIndex + 1) % totalCorners;
    
    const corner = cotaCorners[cornerIndex];
    const nextCorner = cotaCorners[nextCornerIndex];
    
    const localProgress = (progress * totalCorners) % 1;
    
    // Smooth interpolation between corners
    const t = this.smoothStep(localProgress);
    
    return [
      corner.position[0] + (nextCorner.position[0] - corner.position[0]) * t,
      corner.position[1] + (nextCorner.position[1] - corner.position[1]) * t,
      corner.position[2] + (nextCorner.position[2] - corner.position[2]) * t,
    ];
  }

  private interpolateSpeed(progress: number): number {
    // Speed varies by corner type
    const totalCorners = cotaCorners.length;
    const cornerIndex = Math.floor(progress * totalCorners);
    const corner = cotaCorners[cornerIndex];
    
    const baseSpeed = {
      slow: 80,
      medium: 150,
      fast: 280,
    };

    return baseSpeed[corner.type];
  }

  private calculateRotation(progress: number): number {
    const totalCorners = cotaCorners.length;
    const cornerIndex = Math.floor(progress * totalCorners);
    const nextCornerIndex = (cornerIndex + 1) % totalCorners;
    
    const corner = cotaCorners[cornerIndex];
    const nextCorner = cotaCorners[nextCornerIndex];
    
    // Calculate angle between corners
    const dx = nextCorner.position[0] - corner.position[0];
    const dz = nextCorner.position[2] - corner.position[2];
    
    return Math.atan2(dx, dz);
  }

  private calculateSector(progress: number): number {
    if (progress < 0.33) return 1;
    if (progress < 0.66) return 2;
    return 3;
  }

  private smoothStep(t: number): number {
    return t * t * (3 - 2 * t);
  }

  getCurrentTime(): number {
    return this.currentTime;
  }

  getTotalTime(): number {
    return this.totalTime;
  }

  getProgress(): number {
    return this.currentTime / this.totalTime;
  }

  destroy() {
    this.pause();
    this.onUpdate = undefined;
  }
}

// Factory function to create replay data from lap times
export const createReplayDataFromLapTime = (
  driverId: string,
  lapTime: number,
  vehicleNumber: string
): LapReplayData => {
  return {
    driverId,
    lapTime,
    sectorTimes: [lapTime * 0.33, lapTime * 0.33, lapTime * 0.34],
    positions: [], // Will be interpolated by the engine
  };
};
