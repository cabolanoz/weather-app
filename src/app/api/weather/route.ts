import { NextResponse } from 'next/server';
import { mapOpenWeatherResponse } from '@/lib/weather';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city')?.trim();

  if (!city) {
    return NextResponse.json(
      { message: 'El nombre de la ciudad es requerido' },
      { status: 400 },
    );
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { message: 'La API key de OpenWeather no está configurada' },
      { status: 400 },
    );
  }

  const url = new URL('https://api.openweathermap.org/data/2.5/weather');
  url.searchParams.set('q', city);
  url.searchParams.set('appid', apiKey);
  url.searchParams.set('units', 'metric');
  url.searchParams.set('lang', 'es');

  const response = await fetch(url);

  if (!response.ok) {
    return NextResponse.json(
      { message: 'No se encontró valores del clima para esta ciudad' },
      { status: response.status },
    );
  }

  const data = await response.json();

  return NextResponse.json(mapOpenWeatherResponse(data));
}