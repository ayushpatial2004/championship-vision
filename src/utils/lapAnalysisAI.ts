import { DriverLapStats } from '@/lib/dataParser';
import { cotaCorners, getCornersByDifficulty } from './cornerMetadata';

export interface LapInsight {
  type: 'positive' | 'negative' | 'neutral';
  category: 'braking' | 'acceleration' | 'cornering' | 'consistency' | 'strategy';
  message: string;
  severity: 'low' | 'medium' | 'high';
  corner?: number;
  sector?: number;
}

export interface DriverAnalysis {
  driverName: string;
  overallRating: number; // 0-100
  insights: LapInsight[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export class LapAnalysisAI {
  private driverStats: DriverLapStats;

  constructor(driverStats: DriverLapStats) {
    this.driverStats = driverStats;
  }

  generateAnalysis(): DriverAnalysis {
    const insights = this.generateInsights();
    const strengths = this.identifyStrengths();
    const weaknesses = this.identifyWeaknesses();
    const recommendations = this.generateRecommendations(weaknesses);
    const overallRating = this.calculateOverallRating();

    return {
      driverName: `#${this.driverStats.number} ${this.driverStats.vehicle}`,
      overallRating,
      insights,
      strengths,
      weaknesses,
      recommendations,
    };
  }

  private generateInsights(): LapInsight[] {
    const insights: LapInsight[] = [];

    // Consistency analysis
    const lapVariation = this.calculateLapVariation();
    if (lapVariation < 0.5) {
      insights.push({
        type: 'positive',
        category: 'consistency',
        message: 'Excellent lap consistency - minimal variation between laps',
        severity: 'low',
      });
    } else if (lapVariation > 2) {
      insights.push({
        type: 'negative',
        category: 'consistency',
        message: 'High lap time variation - inconsistent performance',
        severity: 'high',
      });
    }

    // Best lap analysis
    if (this.driverStats.bestLap > 0) {
      const percentageFromAverage = ((this.driverStats.averageLap - this.driverStats.bestLap) / this.driverStats.bestLap) * 100;
      
      if (percentageFromAverage < 1) {
        insights.push({
          type: 'positive',
          category: 'consistency',
          message: 'Best lap is very close to average - consistent pace throughout',
          severity: 'low',
        });
      } else if (percentageFromAverage > 3) {
        insights.push({
          type: 'negative',
          category: 'consistency',
          message: 'Significant gap between best and average lap - potential for improvement',
          severity: 'medium',
        });
      }
    }

    // Corner analysis based on lap times
    const difficultCorners = getCornersByDifficulty(8);
    if (this.driverStats.bestLaps.length > 5) {
      const improvementRate = this.calculateImprovementRate();
      if (improvementRate > 0.5) {
        insights.push({
          type: 'positive',
          category: 'strategy',
          message: 'Strong improvement trend - getting faster over the session',
          severity: 'low',
        });
      } else if (improvementRate < -0.5) {
        insights.push({
          type: 'negative',
          category: 'strategy',
          message: 'Performance degrading - possible tire wear or fatigue',
          severity: 'high',
        });
      }
    }

    // Braking analysis (inferred from lap time patterns)
    const brakingScore = this.analyzeBrakingPerformance();
    if (brakingScore > 0.8) {
      insights.push({
        type: 'positive',
        category: 'braking',
        message: 'Strong braking performance in heavy braking zones',
        severity: 'low',
      });
    } else if (brakingScore < 0.5) {
      insights.push({
        type: 'negative',
        category: 'braking',
        message: 'Potential time loss in heavy braking zones - late braking opportunities',
        severity: 'medium',
        corner: 1,
      });
    }

    // Acceleration analysis
    const accelScore = this.analyzeAccelerationPerformance();
    if (accelScore > 0.8) {
      insights.push({
        type: 'positive',
        category: 'acceleration',
        message: 'Excellent traction and acceleration out of slow corners',
        severity: 'low',
      });
    } else if (accelScore < 0.5) {
      insights.push({
        type: 'negative',
        category: 'acceleration',
        message: 'Losing time on corner exits - work on throttle application',
        severity: 'medium',
      });
    }

    return insights;
  }

  private identifyStrengths(): string[] {
    const strengths: string[] = [];

    if (this.driverStats.bestLaps.length > this.driverStats.totalLaps * 0.3) {
      strengths.push('Consistent fast lap performance');
    }

    if (this.calculateLapVariation() < 1) {
      strengths.push('Excellent consistency');
    }

    if (this.analyzeBrakingPerformance() > 0.7) {
      strengths.push('Strong braking zones');
    }

    if (this.analyzeAccelerationPerformance() > 0.7) {
      strengths.push('Good acceleration out of corners');
    }

    if (strengths.length === 0) {
      strengths.push('Solid overall performance');
    }

    return strengths;
  }

  private identifyWeaknesses(): string[] {
    const weaknesses: string[] = [];

    if (this.calculateLapVariation() > 2) {
      weaknesses.push('Inconsistent lap times');
    }

    const percentageFromAverage = ((this.driverStats.averageLap - this.driverStats.bestLap) / this.driverStats.bestLap) * 100;
    if (percentageFromAverage > 3) {
      weaknesses.push('Large gap between best and average pace');
    }

    if (this.analyzeBrakingPerformance() < 0.6) {
      weaknesses.push('Braking zone optimization needed');
    }

    if (this.analyzeAccelerationPerformance() < 0.6) {
      weaknesses.push('Corner exit speed improvements possible');
    }

    if (weaknesses.length === 0) {
      weaknesses.push('Minor improvements in high-speed corners');
    }

    return weaknesses;
  }

  private generateRecommendations(weaknesses: string[]): string[] {
    const recommendations: string[] = [];

    weaknesses.forEach(weakness => {
      if (weakness.includes('Inconsistent')) {
        recommendations.push('Focus on rhythm and maintaining consistent reference points');
      }
      if (weakness.includes('braking')) {
        recommendations.push('Experiment with later braking points at Turn 1, 11, and 15');
      }
      if (weakness.includes('Corner exit')) {
        recommendations.push('Work on throttle application timing and traction management');
      }
      if (weakness.includes('gap between best')) {
        recommendations.push('Analyze best lap telemetry and replicate across all laps');
      }
      if (weakness.includes('high-speed')) {
        recommendations.push('Increase commitment through Turns 3-4-5 complex');
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('Maintain current approach and focus on tire management');
      recommendations.push('Look for small gains in high-difficulty corners (Turn 1, 3-5, 15)');
    }

    return recommendations;
  }

  private calculateOverallRating(): number {
    let rating = 50; // Base rating

    // Consistency bonus
    const lapVariation = this.calculateLapVariation();
    if (lapVariation < 1) rating += 15;
    else if (lapVariation < 2) rating += 10;
    else rating += 5;

    // Best lap bonus
    const percentageFromAverage = ((this.driverStats.averageLap - this.driverStats.bestLap) / this.driverStats.bestLap) * 100;
    if (percentageFromAverage < 1.5) rating += 15;
    else if (percentageFromAverage < 3) rating += 10;
    else rating += 5;

    // Braking performance
    rating += this.analyzeBrakingPerformance() * 10;

    // Acceleration performance
    rating += this.analyzeAccelerationPerformance() * 10;

    return Math.min(100, Math.max(0, rating));
  }

  private calculateLapVariation(): number {
    if (this.driverStats.bestLaps.length < 2) return 0;
    
    const times = this.driverStats.bestLaps.map(lap => lap.time);
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const variance = times.reduce((sum, time) => sum + Math.pow(time - avg, 2), 0) / times.length;
    
    return Math.sqrt(variance);
  }

  private calculateImprovementRate(): number {
    if (this.driverStats.bestLaps.length < 3) return 0;
    
    const firstThird = this.driverStats.bestLaps.slice(0, Math.floor(this.driverStats.bestLaps.length / 3));
    const lastThird = this.driverStats.bestLaps.slice(-Math.floor(this.driverStats.bestLaps.length / 3));
    
    const firstAvg = firstThird.reduce((sum, lap) => sum + lap.time, 0) / firstThird.length;
    const lastAvg = lastThird.reduce((sum, lap) => sum + lap.time, 0) / lastThird.length;
    
    return ((firstAvg - lastAvg) / firstAvg) * 100;
  }

  private analyzeBrakingPerformance(): number {
    // Infer braking performance from consistency and best lap data
    const consistency = 1 - Math.min(1, this.calculateLapVariation() / 2);
    const bestLapRatio = this.driverStats.bestLap / this.driverStats.averageLap;
    
    return (consistency + bestLapRatio) / 2;
  }

  private analyzeAccelerationPerformance(): number {
    // Infer acceleration from lap progression
    const improvementRate = this.calculateImprovementRate();
    const normalized = Math.min(1, Math.max(0, (improvementRate + 1) / 2));
    
    return normalized;
  }
}

export const analyzeDriver = (driverStats: DriverLapStats): DriverAnalysis => {
  const analyzer = new LapAnalysisAI(driverStats);
  return analyzer.generateAnalysis();
};
