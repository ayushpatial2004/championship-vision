import Papa from 'papaparse';

export interface WeatherData {
  timestamp: number;
  timeStr: string;
  airTemp: number;
  trackTemp: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  rain: number;
}

export interface LapData {
  vehicleId: string;
  lap: number;
  lapTime: number;
  timestamp: string;
}

export interface DriverLapStats {
  number: string;
  vehicle: string;
  class: string;
  totalLaps: number;
  bestLap: number;
  averageLap: number;
  bestLaps: Array<{ time: number; lapNum: number }>;
}

export interface LapStartEndData {
  vehicleId: string;
  lap: number;
  timestamp: string;
  value: string; // ISO timestamp of lap start/end
}

// Parse weather CSV data
export const parseWeatherData = async (csvText: string): Promise<WeatherData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data.map((row: any) => ({
          timestamp: parseInt(row.TIME_UTC_SECONDS),
          timeStr: row.TIME_UTC_STR,
          airTemp: parseFloat(row.AIR_TEMP),
          trackTemp: parseFloat(row.TRACK_TEMP),
          humidity: parseFloat(row.HUMIDITY),
          pressure: parseFloat(row.PRESSURE),
          windSpeed: parseFloat(row.WIND_SPEED),
          windDirection: parseFloat(row.WIND_DIRECTION),
          rain: parseFloat(row.RAIN),
        }));
        resolve(data);
      },
      error: reject,
    });
  });
};

// Parse lap times CSV data
export const parseLapTimes = async (csvText: string): Promise<LapData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data
          .map((row: any) => ({
            vehicleId: row.vehicle_id,
            lap: parseInt(row.lap),
            lapTime: parseInt(row.value),
            timestamp: row.timestamp,
          }))
          .filter((item) => item.lapTime > 0 && item.lap < 1000);
        resolve(data);
      },
      error: reject,
    });
  });
};

// Parse best laps data
export const parseBestLaps = async (csvText: string): Promise<DriverLapStats[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data.map((row: any) => {
          const bestLaps = [];
          for (let i = 1; i <= 10; i++) {
            const time = row[`BESTLAP_${i}`];
            const lapNum = row[`BESTLAP_${i}_LAPNUM`];
            if (time && lapNum) {
              const [minutes, seconds] = time.split(':');
              const totalSeconds = parseInt(minutes) * 60 + parseFloat(seconds);
              bestLaps.push({
                time: totalSeconds,
                lapNum: parseInt(lapNum),
              });
            }
          }

          const bestLap = bestLaps.length > 0 ? Math.min(...bestLaps.map((l) => l.time)) : 0;
          const avgTime = row.AVERAGE;
          let averageLap = 0;
          if (avgTime) {
            const [minutes, seconds] = avgTime.split(':');
            averageLap = parseInt(minutes) * 60 + parseFloat(seconds);
          }

          return {
            number: row.NUMBER,
            vehicle: row.VEHICLE,
            class: row.CLASS,
            totalLaps: parseInt(row.TOTAL_DRIVER_LAPS),
            bestLap,
            averageLap,
            bestLaps: bestLaps.sort((a, b) => a.time - b.time),
          };
        });
        resolve(data.filter((d) => d.totalLaps > 0));
      },
      error: reject,
    });
  });
};

// Parse lap start/end times CSV data
export const parseLapStartEnd = async (csvText: string): Promise<LapStartEndData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data
          .map((row: any) => ({
            vehicleId: row.vehicle_id,
            lap: parseInt(row.lap),
            timestamp: row.timestamp,
            value: row.value,
          }))
          .filter((item) => item.lap < 32768 && item.value); // Filter out invalid laps
        resolve(data);
      },
      error: reject,
    });
  });
};

// Generate mock telemetry based on lap time patterns
export const generateTelemetryFromLaps = (lapData: LapData[], dataKey: string) => {
  const baseValues: Record<string, number> = {
    speed: 180,
    throttle: 75,
    brake: 20,
    gear: 5,
  };

  return Array.from({ length: 50 }, (_, i) => {
    const variation = Math.sin(i / 5) * 30 + Math.random() * 15;
    return {
      point: i,
      [dataKey]: Math.max(0, baseValues[dataKey] + variation),
    };
  });
};

// Format lap time from milliseconds to MM:SS.mmm
export const formatLapTime = (milliseconds: number): string => {
  if (!milliseconds || milliseconds <= 0) return '--:--.---';
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const ms = milliseconds % 1000;
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
};

// Format lap time from seconds to MM:SS.mmm
export const formatLapTimeSeconds = (seconds: number): string => {
  if (!seconds || seconds <= 0) return '--:--.---';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);
  return `${minutes}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
};
