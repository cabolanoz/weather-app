import { mapOpenWeatherResponse } from '@/lib/weather';

describe('mapOpenWeatherResponse', () => {
  it('maps OpenWeather response to the app weather format', () => {
    const result = mapOpenWeatherResponse({
      name: 'Managua',
      main: {
        temp: 38,
        humidity: 72,
      },
      weather: [
        {
          description: 'nubes dispersas',
        },
      ],
    });

    expect(result).toEqual({
      city: 'Managua',
      temperature: 38,
      humidity: 72,
      description: 'nubes dispersas',
    });
  });

  it('uses a fallback description when weather description is missing', () => {
    const result = mapOpenWeatherResponse({
      name: 'León',
      main: {
        temp: 38,
        humidity: 60,
      },
      weather: [],
    });

    expect(result).toEqual({
      city: 'León',
      temperature: 38,
      humidity: 60,
      description: 'Sin descripción',
    });
  });
});
