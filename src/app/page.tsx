'use client';

import { WeatherSearch } from "@/components/WeatherSearch";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <WeatherSearch />
    </main>
  );
}
