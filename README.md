# Weather App

Simple weather application built with Next.js, TypeScript, Tailwind CSS, Jest, and React Testing Library.

# Weather App

Simple weather application built with Next.js, TypeScript, Tailwind CSS, Jest, and React Testing Library.

## Live Demo

[View deployed app](https://weather-app-virid-delta-94.vercel.app/)

## Requirements

- Docker
- pnpm
- OpenWeather API key

## Environment variables

Create `.env.local`:

```env
OPENWEATHER_API_KEY=your_api_key_here
```

## Run locally with Docker

```bash
docker compose up --build
```

Open:

```txt
http://localhost:3000
```

## Run tests

```bash
docker compose run --rm web pnpm test
```

## Run coverage

```bash
docker compose run --rm web pnpm test:coverage
```

## Build

```bash
docker compose run --rm web pnpm build
```

## Run locally without Docker

```bash
pnpm install
pnpm dev
```
