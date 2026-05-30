import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WeatherSearch } from '@/components/WeatherSearch';

const mockFetch = jest.fn();

global.fetch = mockFetch;

describe('WeatherSearch', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('shows weather information after a successfully search', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        city: 'Managua',
        temperature: 38, // SO FUCKING HOOOT!!!
        humidity: 90, // WE'RE GONNA DIE!!!
        description: 'siempre soleado',
      }),
    });

    render(<WeatherSearch />);

    await userEvent.type(screen.getByLabelText(/ciudad/i), 'Managua');
    await userEvent.click(screen.getByRole('button', { name: /buscar/i}));

    expect(await screen.findByText(/managua/i)).toBeInTheDocument();
    expect(screen.getByText(/38°C/i)).toBeInTheDocument();
    expect(screen.getByText(/90%/i)).toBeInTheDocument();
    expect(screen.getByText(/siempre soleado/i)).toBeInTheDocument();

    expect(mockFetch).toHaveBeenCalledWith('/api/weather?city=Managua');
  });

  it('shows an error message when the city is invalid', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: 'No se encontró valores del clima para esta ciudad',
      }),
    });

    render(<WeatherSearch />);

    await userEvent.type(screen.getByLabelText(/ciudad/i), 'InvalidCity');
    await userEvent.click(screen.getByRole('button', { name: /buscar/i }));

    expect(
      await screen.findByText(/no se encontró valores del clima para esta ciudad/i),
    ).toBeInTheDocument();
  });

  it('updates input value and disables the button when the input is empty', async () => {
    render(<WeatherSearch />);

    const input = screen.getByLabelText(/ciudad/i);
    const button = screen.getByRole('button', { name: /buscar/i });

    expect(button).toBeDisabled();

    await userEvent.type(input, 'León');

    expect(input).toHaveValue('León');
    expect(button).toBeEnabled();
  });

  it('shows loading state while searching', async () => {
    mockFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: async () => ({
                city: 'Granada',
                temperature: 30,
                humidity: 65,
                description: 'soleado',
              }),
            });
          }, 100);
        }),
    );

    render(<WeatherSearch />);

    await userEvent.type(screen.getByLabelText(/ciudad/i), 'Granada');
    await userEvent.click(screen.getByRole('button', { name: /buscar/i }));

    expect(screen.getByRole('button', { name: /buscando/i })).toBeDisabled();
    expect(await screen.findByText(/granada/i)).toBeInTheDocument();
  });

  it('shows a generic error message when the request fails unexpectedly', async () => {
    mockFetch.mockRejectedValueOnce('Network error');

    render(<WeatherSearch />);

    await userEvent.type(screen.getByLabelText(/ciudad/i), 'Masaya');
    await userEvent.click(screen.getByRole('button', { name: /buscar/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /Ocurrió un error al momento de obtener el clima de esta ciudad/i,
    );
  });
})