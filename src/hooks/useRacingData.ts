import { useState, useEffect } from 'react';
import {
  parseWeatherData,
  parseLapTimes,
  parseBestLaps,
  parseLapStartEnd,
  WeatherData,
  LapData,
  DriverLapStats,
  LapStartEndData,
} from '@/lib/dataParser';

// Import CSV files
import weatherR2 from '@/data/weather_race_2.csv?raw';
import bestLapsR1 from '@/data/best_laps_race_1.csv?raw';
import bestLapsR2 from '@/data/best_laps_race_2.csv?raw';
import lapTimesR1 from '@/data/lap_times_r1.csv?raw';
import lapTimesR2 from '@/data/lap_times_r2.csv?raw';
import lapStartR1 from '@/data/lap_start_time_r1.csv?raw';
import lapStartR2 from '@/data/lap_start_time_r2.csv?raw';
import lapEndR1 from '@/data/lap_end_time_r1.csv?raw';
import lapEndR2 from '@/data/lap_end_time_r2.csv?raw';

export const useRacingData = (raceNumber: 1 | 2 = 2) => {
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [lapTimes, setLapTimes] = useState<LapData[]>([]);
  const [driverStats, setDriverStats] = useState<DriverLapStats[]>([]);
  const [lapStarts, setLapStarts] = useState<LapStartEndData[]>([]);
  const [lapEnds, setLapEnds] = useState<LapStartEndData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Parse all data files in parallel
        const [weatherData, lapData, bestLapData, lapStartData, lapEndData] = await Promise.all([
          parseWeatherData(weatherR2),
          parseLapTimes(raceNumber === 1 ? lapTimesR1 : lapTimesR2),
          parseBestLaps(raceNumber === 1 ? bestLapsR1 : bestLapsR2),
          parseLapStartEnd(raceNumber === 1 ? lapStartR1 : lapStartR2),
          parseLapStartEnd(raceNumber === 1 ? lapEndR1 : lapEndR2),
        ]);

        setWeather(weatherData);
        setLapTimes(lapData);
        setDriverStats(bestLapData);
        setLapStarts(lapStartData);
        setLapEnds(lapEndData);
        setError(null);
      } catch (err) {
        console.error('Error loading racing data:', err);
        setError('Failed to load racing data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [raceNumber]);

  return {
    weather,
    lapTimes,
    driverStats,
    lapStarts,
    lapEnds,
    loading,
    error,
  };
};
