import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { fetchWeatherData } from "@/lib/api";

export interface WeatherData {
  current: {
    dt: number;
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    wind_deg: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
  };
  forecast: Array<{
    dt: number;
    temp: {
      min: number;
      max: number;
      day: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    humidity: number;
    wind_speed: number;
  }>;
}

interface WeatherState {
  // State
  currentCity: string;
  weatherData: WeatherData | null;
  unit: "metric" | "imperial";
  refreshRate: number;
  isLoading: boolean;
  error: string | null;
  lastFetchTime: number;

  // Actions
  setCurrentCity: (city: string) => void;
  setWeatherData: (data: WeatherData | null) => void;
  toggleUnit: () => void;
  setRefreshRate: (rate: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  fetchWeather: (city?: string) => Promise<void>;
  reset: () => void;
}

// Throttle helper to prevent too many API calls
const throttleMap = new Map<string, number>();
const THROTTLE_DELAY = 5000; // 5 seconds

const shouldThrottle = (key: string): boolean => {
  const now = Date.now();
  const lastCall = throttleMap.get(key) || 0;

  if (now - lastCall < THROTTLE_DELAY) {
    return true;
  }

  throttleMap.set(key, now);
  return false;
};

export const useWeatherStore = create<WeatherState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentCity: "",
    weatherData: null,
    unit: "metric",
    refreshRate: 300, // 5 minutes
    isLoading: false,
    error: null,
    lastFetchTime: 0,

    // Actions
    setCurrentCity: (city: string) => {
      set({ currentCity: city });
      // Automatically fetch weather when city changes
      if (city) {
        get().fetchWeather(city);
      }
    },

    setWeatherData: (data: WeatherData | null) => {
      set({
        weatherData: data,
        lastFetchTime: Date.now(),
        error: null,
      });
    },

    toggleUnit: () => {
      const currentUnit = get().unit;
      const newUnit = currentUnit === "metric" ? "imperial" : "metric";
      set({ unit: newUnit });

      // Refetch data with new unit if we have a city
      const { currentCity } = get();
      if (currentCity) {
        get().fetchWeather(currentCity);
      }
    },

    setRefreshRate: (rate: number) => {
      set({ refreshRate: rate });
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    setError: (error: string | null) => {
      set({ error, isLoading: false });
    },

    clearError: () => {
      set({ error: null });
    },

    fetchWeather: async (city?: string) => {
      const state = get();
      const targetCity = city || state.currentCity;

      if (!targetCity) {
        state.setError("No city selected");
        return;
      }

      // Check throttling
      const throttleKey = `${targetCity}-${state.unit}`;
      if (shouldThrottle(throttleKey)) {
        console.log("API call throttled");
        return;
      }

      state.setLoading(true);
      state.clearError();

      try {
        const data = await fetchWeatherData(targetCity, state.unit);
        state.setWeatherData(data);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Failed to fetch weather data for ${targetCity}`;
        state.setError(errorMessage);
      } finally {
        state.setLoading(false);
      }
    },

    reset: () => {
      set({
        currentCity: "",
        weatherData: null,
        unit: "metric",
        refreshRate: 300,
        isLoading: false,
        error: null,
        lastFetchTime: 0,
      });
    },
  }))
);

// Auto-refresh functionality
let refreshInterval: NodeJS.Timeout | null = null;

// Subscribe to refresh rate changes and set up auto-refresh
useWeatherStore.subscribe(
  (state) => ({
    refreshRate: state.refreshRate,
    currentCity: state.currentCity,
  }),
  ({ refreshRate, currentCity }) => {
    // Clear existing interval
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }

    // Set up new interval if refresh rate > 0 and we have a city
    if (refreshRate > 0 && currentCity) {
      refreshInterval = setInterval(() => {
        const store = useWeatherStore.getState();
        store.fetchWeather();
      }, refreshRate * 1000);
    }
  }
);

// Cleanup interval on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
  });
}
