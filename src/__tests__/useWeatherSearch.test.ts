import { act, renderHook, waitFor } from '@testing-library/react';
import { useWeatherSearch } from '@/hooks/useWeatherSearch';

const mockFetch = jest.fn();

global.fetch = mockFetch as unknown as typeof fetch;

describe('useWeatherSearch', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('does not search when the city is empty', async () => {
    const { result } = renderHook(() => useWeatherSearch());

    await act(async () => {
      await result.current.searchWeather();
    });

    expect(mockFetch).not.toHaveBeenCalled();
    expect(result.current.weather).toBeNull();
    expect(result.current.error).toBe('');
    expect(result.current.isLoading).toBe(false);
  });

  it('does not search when the city only contains spaces', async () => {
    const { result } = renderHook(() => useWeatherSearch());

    act(() => {
      result.current.setCity('   ');
    });

    await act(async () => {
      await result.current.searchWeather();
    });

    expect(mockFetch).not.toHaveBeenCalled();
    expect(result.current.canSearch).toBe(false);
    expect(result.current.weather).toBeNull();
  });

  it('uses the fallback error message when the API response has no message', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    const { result } = renderHook(() => useWeatherSearch());

    act(() => {
      result.current.setCity('Masaya');
    });

    await waitFor(() => {
      expect(result.current.canSearch).toBe(true);
    });

    await act(async () => {
      await result.current.searchWeather();
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/weather?city=Masaya');
    expect(result.current.weather).toBeNull();
    expect(result.current.error).toBe('No se pudo obtener el clima para esta ciudad');
    expect(result.current.isLoading).toBe(false);
  });
});
