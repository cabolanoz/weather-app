type WeatherErrorProps = {
  message: string;
};

export function WeatherError({ message }: WeatherErrorProps) {
  return (
    <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
      {message}
    </div>
  );
}
