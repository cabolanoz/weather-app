'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Weather } from '@/types/weather';

export function useWeatherSearch() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<Weather | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const normalizedCity = useMemo(() => city.trim(), [city]);
  const canSearch = useMemo(() => normalizedCity.length > 0, [normalizedCity]);

  const searchWeather = useCallback(async () => {
    if (!normalizedCity) return;

    setIsLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(normalizedCity)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'No se pudo obtener el clima para esta ciudad');
      }

      setWeather(data);
    } catch(error) {
      setError(error instanceof Error ? error.message : 'Ocurrió un error al momento de obtener el clima de esta ciudad');
    } finally {
      setIsLoading(false);
    }
  }, [normalizedCity]);

  return {
    city,
    setCity,
    weather,
    error,
    isLoading,
    canSearch,
    searchWeather,
  };
}