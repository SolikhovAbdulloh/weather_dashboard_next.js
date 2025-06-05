import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date from timestamp
export function formatDate(timestamp: number, shortFormat = false): string {
  const date = new Date(timestamp * 1000)

  if (shortFormat) {
    // Return day name only (e.g., "Mon")
    return date.toLocaleDateString("en-US", { weekday: "short" })
  }

  // Return full date (e.g., "Monday, Jun 4")
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  })
}

// Convert temperature between Celsius and Fahrenheit
export function convertTemperature(temp: number, toUnit: "metric" | "imperial"): number {
  if (toUnit === "metric") {
    // Convert from Fahrenheit to Celsius
    return ((temp - 32) * 5) / 9
  } else {
    // Convert from Celsius to Fahrenheit
    return (temp * 9) / 5 + 32
  }
}

// Calculate daily averages from hourly forecasts
export function calculateDailyAverages(hourlyData: any[]): any[] {
  // Group hourly data by day
  const groupedByDay: Record<string, any[]> = {}

  hourlyData.forEach((hour) => {
    const date = new Date(hour.dt * 1000)
    const dayKey = date.toISOString().split("T")[0]

    if (!groupedByDay[dayKey]) {
      groupedByDay[dayKey] = []
    }

    groupedByDay[dayKey].push(hour)
  })

  // Calculate averages for each day
  return Object.entries(groupedByDay).map(([dayKey, hours]) => {
    const temps = hours.map((h) => h.temp)
    const minTemp = Math.min(...temps)
    const maxTemp = Math.max(...temps)
    const avgTemp = temps.reduce((sum, t) => sum + t, 0) / temps.length

    // Use the weather from noon or the middle of the day
    const middleIndex = Math.floor(hours.length / 2)
    const weather = hours[middleIndex].weather

    return {
      dt: new Date(dayKey).getTime() / 1000,
      temp: {
        day: avgTemp,
        min: minTemp,
        max: maxTemp,
      },
      weather,
      humidity: hours.reduce((sum, h) => sum + h.humidity, 0) / hours.length,
      wind_speed: hours.reduce((sum, h) => sum + h.wind_speed, 0) / hours.length,
    }
  })
}

// Transform weather data based on unit
export function transformWeatherData(data: any, unit: "metric" | "imperial"): any {
  // Deep clone the data to avoid modifying the original
  const transformedData = JSON.parse(JSON.stringify(data))

  // If the data is already in the requested unit, return it as is
  const dataUnit = "metric" // Our mock data is in metric by default

  if (dataUnit === unit) {
    return transformedData
  }

  // Convert current weather
  if (transformedData.current) {
    transformedData.current.temp = convertTemperature(transformedData.current.temp, unit)
    transformedData.current.feels_like = convertTemperature(transformedData.current.feels_like, unit)

    // Convert wind speed from m/s to mph for imperial
    if (unit === "imperial") {
      transformedData.current.wind_speed = transformedData.current.wind_speed * 2.237
    }
  }

  // Convert forecast data
  if (transformedData.forecast) {
    transformedData.forecast = transformedData.forecast.map((day: any) => ({
      ...day,
      temp: {
        day: convertTemperature(day.temp.day, unit),
        min: convertTemperature(day.temp.min, unit),
        max: convertTemperature(day.temp.max, unit),
      },
      wind_speed: unit === "imperial" ? day.wind_speed * 2.237 : day.wind_speed,
    }))
  }

  return transformedData
}

// Find temperature min/max/average for forecast period
export function calculateTemperatureStats(forecast: any[]) {
  const allTemps = forecast.flatMap((day) => [day.temp.min, day.temp.max, day.temp.day])

  return {
    min: Math.min(...allTemps),
    max: Math.max(...allTemps),
    average: allTemps.reduce((sum, temp) => sum + temp, 0) / allTemps.length,
  }
}

// Custom sorting of weather data by date and time
export function sortWeatherData(data: any[], sortBy: "date" | "temperature" = "date", order: "asc" | "desc" = "asc") {
  return [...data].sort((a, b) => {
    let comparison = 0

    if (sortBy === "date") {
      comparison = a.dt - b.dt
    } else if (sortBy === "temperature") {
      const tempA = a.temp?.day || a.temp || 0
      const tempB = b.temp?.day || b.temp || 0
      comparison = tempA - tempB
    }

    return order === "asc" ? comparison : -comparison
  })
}
