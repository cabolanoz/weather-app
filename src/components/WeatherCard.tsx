import type { Weather } from '@/types/weather';

type WeatherCardProps = {
  weather: Weather;
};

export function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <article className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
      <h2 className="text-xl font-semibold text-slate-900">{weather.city}</h2>

      <dl className="mt-4 grid gap-3 text-slate-700">
        <div className="flex justify-between">
          <dt>Temperatura</dt>
          <dd className="font-medium">{weather.temperature}°C</dd>
        </div>

        <div className="flex justify-between">
          <dt>Humedad</dt>
          <dd className="font-medium">{weather.humidity}%</dd>
        </div>

        <div className="flex justify-between">
          <dt>Descripción</dt>
          <dd className="font-medium capitalize">{weather.description}</dd>
        </div>
      </dl>
    </article>
  )
}
