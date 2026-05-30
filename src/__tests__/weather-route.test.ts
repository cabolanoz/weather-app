/**
 * @jest-environment node
 */

import { GET } from '@/app/api/weather/route';

const mockFetch = jest.fn();

global.fetch = mockFetch as unknown as typeof fetch;

describe('GET /api/weather', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();

    process.env = {
      ...originalEnv,
      OPENWEATHER_API_KEY: 'test-api-key',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns 400 when city is missing', async () => {
    const response = await GET(new Request('http://localhost/api/weather'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      message: 'El nombre de la ciudad es requerido',
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns 500 when OpenWeather API key is not configured', async () => {
    delete process.env.OPENWEATHER_API_KEY;

    const response = await GET(
      new Request('http://localhost/api/weather?city=Managua'),
    );
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      message: 'La API key de OpenWeather no está configurada',
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns weather data when OpenWeather responds successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        name: 'Managua',
        main: {
          temp: 38,
          humidity: 74,
        },
        weather: [
          {
            description: 'nubes dispersas',
          },
        ],
      }),
    });

    const response = await GET(
      new Request('http://localhost/api/weather?city=Managua'),
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      city: 'Managua',
      temperature: 38,
      humidity: 74,
      description: 'nubes dispersas',
    });

    const requestedUrl = mockFetch.mock.calls[0][0] as URL;

    expect(requestedUrl.toString()).toContain(
      'https://api.openweathermap.org/data/2.5/weather',
    );
    expect(requestedUrl.searchParams.get('q')).toBe('Managua');
    expect(requestedUrl.searchParams.get('appid')).toBe('test-api-key');
    expect(requestedUrl.searchParams.get('units')).toBe('metric');
    expect(requestedUrl.searchParams.get('lang')).toBe('es');
  });

  it('returns an error when OpenWeather responds with an invalid city', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({
        message: 'city not found',
      }),
    });

    const response = await GET(
      new Request('http://localhost/api/weather?city=InvalidCity'),
    );
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({
      message: 'No se encontró valores del clima para esta ciudad',
    });
  });
});
