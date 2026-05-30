import { SyntheticEvent } from "react";
import { useWeatherSearch } from "@/hooks/useWeatherSearch";
import { WeatherCard } from "./WeatherCard";
import { WeatherError } from "./WeatherError";

export function WeatherSearch() {
  const {
    city,
    setCity,
    weather,
    error,
    isLoading,
    canSearch,
    searchWeather,
  } = useWeatherSearch();

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    await searchWeather();
  };

  return (
    <section className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Aplicación de Clima</h1>
        <p className="mt-2 text-sm text-slate-600">
          Ingresa una ciudad para consultar el clima actual.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="city" className="block text-sm font-medium text-slate-700">
          Ciudad
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="city"
            name="city"
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Ej: Managua"
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="submit"
            disabled={!canSearch || isLoading}
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>

      {error && <WeatherError message={error} />}
      {weather && <WeatherCard weather={weather} />}
    </section>
  );
}
