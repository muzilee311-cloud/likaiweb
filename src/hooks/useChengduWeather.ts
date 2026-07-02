import { useState, useEffect } from 'react';

const WEATHER_CODES: Record<number, string> = {
  0: 'CLEAR', 1: 'MOSTLY CLEAR', 2: 'PARTLY CLOUDY', 3: 'CLOUDY',
  45: 'FOGGY', 48: 'FOGGY', 51: 'DRIZZLE', 53: 'DRIZZLE', 55: 'DRIZZLE',
  61: 'RAIN', 63: 'RAIN', 65: 'RAIN', 71: 'SNOW', 73: 'SNOW', 75: 'SNOW',
  80: 'SHOWERS', 81: 'SHOWERS', 82: 'SHOWERS', 95: 'THUNDERSTORM',
};

export function useChengduWeather() {
  const [weather, setWeather] = useState('MOSTLY CLEAR, 30%');

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=30.67&longitude=104.07&current=relative_humidity_2m,weather_code')
      .then(r => r.json())
      .then(data => {
        const code = data.current?.weather_code ?? 1;
        const humidity = data.current?.relative_humidity_2m ?? 30;
        const condition = WEATHER_CODES[code] || 'MOSTLY CLEAR';
        setWeather(`${condition}, ${humidity}%`);
      })
      .catch(() => {});
  }, []);

  return weather;
}
