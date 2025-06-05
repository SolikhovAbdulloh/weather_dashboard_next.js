// Mock API service to simulate OpenWeatherMap API calls
// In a real application, this would make actual API calls

import { transformWeatherData } from "./utils"

// Mock data for different cities
const mockWeatherData = {
  london: {
    current: {
      dt: Date.now() / 1000,
      temp: 12,
      feels_like: 10,
      humidity: 75,
      wind_speed: 5.2,
      wind_deg: 240,
      weather: [
        {
          id: 500,
          main: "Rain",
          description: "light rain",
          icon: "10d",
        },
      ],
    },
    forecast: [
      {
        dt: Date.now() / 1000 + 86400,
        temp: { day: 13, min: 8, max: 15 },
        humidity: 70,
        wind_speed: 4.8,
        weather: [{ id: 500, main: "Rain", description: "light rain", icon: "10d" }],
      },
      {
        dt: Date.now() / 1000 + 86400 * 2,
        temp: { day: 14, min: 9, max: 16 },
        humidity: 65,
        wind_speed: 3.5,
        weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02d" }],
      },
      {
        dt: Date.now() / 1000 + 86400 * 3,
        temp: { day: 15, min: 10, max: 18 },
        humidity: 60,
        wind_speed: 4.2,
        weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
      },
      {
        dt: Date.now() / 1000 + 86400 * 4,
        temp: { day: 14, min: 9, max: 17 },
        humidity: 68,
        wind_speed: 5.0,
        weather: [{ id: 802, main: "Clouds", description: "scattered clouds", icon: "03d" }],
      },
      {
        dt: Date.now() / 1000 + 86400 * 5,
        temp: { day: 12, min: 7, max: 14 },
        humidity: 75,
        wind_speed: 6.1,
        weather: [{ id: 500, main: "Rain", description: "light rain", icon: "10d" }],
      },
    ],
  },
  "new-york": {
    current: {
      dt: Date.now() / 1000,
      temp: 18,
      feels_like: 17,
      humidity: 62,
      wind_speed: 3.8,
      wind_deg: 180,
      weather: [
        {
          id: 800,
          main: "Clear",
          description: "clear sky",
          icon: "01d",
        },
      ],
    },
    forecast: [
      {
        dt: Date.now() / 1000 + 86400,
        temp: { day: 20, min: 15, max: 23 },
        humidity: 58,
        wind_speed: 4.2,
        weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
      },
      {
        dt: Date.now() / 1000 + 86400 * 2,
        temp: { day: 22, min: 16, max: 25 },
        humidity: 55,
        wind_speed: 3.9,
        weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
      },
      {
        dt: Date.now() / 1000 + 86400 * 3,
        temp: { day: 24, min: 18, max: 27 },
        humidity: 50,
        wind_speed: 3.5,
        weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02d" }],
      },
      {
        dt: Date.now() / 1000 + 86400 * 4,
        temp: { day: 23, min: 17, max: 26 },
        humidity: 52,
        wind_speed: 4.0,
        weather: [{ id: 802, main: "Clouds", description: "scattered clouds", icon: "03d" }],
      },
      {
        dt: Date.now() / 1000 + 86400 * 5,
        temp: { day: 21, min: 16, max: 24 },
        humidity: 60,
        wind_speed: 4.5,
        weather: [{ id: 500, main: "Rain", description: "light rain", icon: "10d" }],
      },
    ],
  },
  tokyo: {
    current: {
      dt: Date.now() / 1000,
      temp: 25,
      feels_like: 26,
      humidity: 70,
      wind_speed: 2.5,
      wind_deg: 120,
      weather: [
        {
          id: 802,
          main: "Clouds",
          description: "scattered clouds",
          icon: "03d",
        },
      ],
    },
    forecast: [
      {
        dt: Date.now() / 1000 + 86400,
        temp: { day: 26, min: 21, max: 28 },
        humidity: 68,
        wind_speed: 3.0,
        weather: [{ id: 802, main: "Clouds", description: "scattered clouds", icon: "03d" }],
      },
      {
        dt: Date.now() / 1000 + 86400 * 2,
        temp: { day: 27, min: 22, max: 29 },
        humidity: 65,
        wind_speed: 2.8,
        weather: [{ id: 500, main: "Rain", description: "light rain", icon: "10d" }],
      },
      {
        dt: Date.now() / 1000 + 86400 * 3,
        temp: { day: 26, min: 21, max: 28 },
        humidity: 72,
        wind_speed: 3.2,
        weather: [{ id: 501, main: "Rain", description: "moderate rain", icon: "10d" }],
      },
      {
        dt: Date.now() / 1000 + 86400 * 4,
        temp: { day: 25, min: 20, max: 27 },
        humidity: 75,
        wind_speed: 3.5,
        weather: [{ id: 500, main: "Rain", description: "light rain", icon: "10d" }],
      },
      {
        dt: Date.now() / 1000 + 86400 * 5,
        temp: { day: 24, min: 19, max: 26 },
        humidity: 70,
        wind_speed: 3.0,
        weather: [{ id: 802, main: "Clouds", description: "scattered clouds", icon: "03d" }],
      },
    ],
  },
  sydney: {
    current: {
      dt: Date.now() / 1000,
      temp: 22,
      feels_like: 23,
      humidity: 55,
      wind_speed: 4.5,
      wind_deg: 200,
      weather: [
        {
          id: 800,
          main: "Clear",
          description: "clear sky",
          icon: "01d",
        },
      ],
    },
    forecast: [
      {
        dt: Date.now() / 1000 + 86400,
        temp: { day: 23, min: 18, max: 25 },
        humidity: 50,
        wind_speed: 5.0,
        weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
      },
      {
        dt: Date.now() / 1000 + 86400 * 2,
        temp: { day: 24, min: 19, max: 26 },
        humidity: 48,
        wind_speed: 4.8,
        weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
      },
      {
        dt: Date.now() / 1000 + 86400 * 3,
        temp: { day: 25, min: 20, max: 27 },
        humidity: 45,
        wind_speed: 4.5,
        weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02d" }],
      },
      {
        dt: Date.now() / 1000 + 86400 * 4,
        temp: { day: 24, min: 19, max: 26 },
        humidity: 50,
        wind_speed: 5.2,
        weather: [{ id: 802, main: "Clouds", description: "scattered clouds", icon: "03d" }],
      },
      {
        dt: Date.now() / 1000 + 86400 * 5,
        temp: { day: 22, min: 17, max: 24 },
        humidity: 55,
        wind_speed: 5.5,
        weather: [{ id: 500, main: "Rain", description: "light rain", icon: "10d" }],
      },
    ],
  },
  cairo: {
    current: {
      dt: Date.now() / 1000,
      temp: 32,
      feels_like: 30,
      humidity: 25,
      wind_speed: 5.8,
      wind_deg: 90,
      weather: [
        {
          id: 800,
          main: "Clear",
          description: "clear sky",
          icon: "01d",
        },
      ],
    },
    forecast: [
      {
        dt: Date.now() / 1000 + 86400,
        temp: { day: 33, min: 24, max: 35 },
        humidity: 22,
        wind_speed: 6.0,
        weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
      },
      {
        dt: Date.now() / 1000 + 86400 * 2,
        temp: { day: 34, min: 25, max: 36 },
        humidity: 20,
        wind_speed: 5.5,
        weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
      },
      {
        dt: Date.now() / 1000 + 86400 * 3,
        temp: { day: 35, min: 26, max: 37 },
        humidity: 18,
        wind_speed: 5.0,
        weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
      },
      {
        dt: Date.now() / 1000 + 86400 * 4,
        temp: { day: 34, min: 25, max: 36 },
        humidity: 20,
        wind_speed: 5.5,
        weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02d" }],
      },
      {
        dt: Date.now() / 1000 + 86400 * 5,
        temp: { day: 33, min: 24, max: 35 },
        humidity: 22,
        wind_speed: 6.0,
        weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02d" }],
      },
    ],
  },
}

// Simulate API call with a delay
export async function fetchWeatherData(city: string, unit: "metric" | "imperial") {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const cityKey = city.toLowerCase()

      if (!mockWeatherData[cityKey as keyof typeof mockWeatherData]) {
        reject(new Error(`Weather data not available for ${city}`))
        return
      }

      // Get the raw data
      const rawData = mockWeatherData[cityKey as keyof typeof mockWeatherData]

      // Transform the data based on the unit
      const transformedData = transformWeatherData(rawData, unit)

      resolve(transformedData)
    }, 800) // Simulate network delay
  })
}
