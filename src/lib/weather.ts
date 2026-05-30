import type { Weather } from '@/types/weather';

type OpenWeatherResponse = {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string
  }>;
};

export function mapOpenWeatherResponse(data: OpenWeatherResponse): Weather {
  return {
    city: data.name,
    temperature: data.main.temp,
    humidity: data.main.humidity,
    description: data.weather[0]?.description ?? 'Sin descripción',
  };
}
