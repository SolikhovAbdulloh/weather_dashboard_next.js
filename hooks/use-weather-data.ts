"use client"

import { useCallback } from "react"
import type { WeatherData, ForecastData } from "@/contexts/weather-context"
import { mockWeatherAPI } from "@/services/mock-weather-api"
import { throttle } from "@/utils/throttle"

export function useWeatherData() {
  // Throttled API call function (max 1 call per 5 seconds)
  const throttledFetch = useCallback(
    throttle(async (city: string) => {
      return await mockWeatherAPI.getWeatherData(city)
    }, 5000),
    [],
  )

  const fetchWeatherData = useCallback(
    async (city: string) => {
      try {
        const data = await throttledFetch(city)

        // Transform the data
        const currentWeather: WeatherData = {
          city: data.city,
          temperature: data.current.temperature,
          description: data.current.description,
          humidity: data.current.humidity,
          windSpeed: data.current.windSpeed,
          icon: data.current.icon,
          timestamp: Date.now(),
        }

        // Process forecast data
        const forecast: ForecastData[] = data.forecast.map((item) => ({
          date: item.date,
          temperature: item.temperature,
          minTemp: item.minTemp,
          maxTemp: item.maxTemp,
          description: item.description,
          icon: item.icon,
        }))

        return { current: currentWeather, forecast }
      } catch (error) {
        throw new Error(
          `Failed to fetch weather data for ${city}: ${error instanceof Error ? error.message : "Unknown error"}`,
        )
      }
    },
    [throttledFetch],
  )

  const convertTemperature = useCallback((temp: number, fromUnit: "celsius" | "fahrenheit" = "celsius"): number => {
    if (fromUnit === "celsius") {
      return (temp * 9) / 5 + 32 // Celsius to Fahrenheit
    } else {
      return ((temp - 32) * 5) / 9 // Fahrenheit to Celsius
    }
  }, [])

  const calculateDailyAverages = useCallback((hourlyData: any[]) => {
    const dailyGroups = hourlyData.reduce(
      (groups, item) => {
        const date = new Date(item.timestamp).toDateString()
        if (!groups[date]) {
          groups[date] = []
        }
        groups[date].push(item.temperature)
        return groups
      },
      {} as Record<string, number[]>,
    )

    return Object.entries(dailyGroups).map(([date, temps]) => ({
      date,
      average: temps.reduce((sum, temp) => sum + temp, 0) / temps.length,
      min: Math.min(...temps),
      max: Math.max(...temps),
    }))
  }, [])

  const getTemperatureStats = useCallback((forecast: ForecastData[]) => {
    if (forecast.length === 0) return { min: 0, max: 0, average: 0 }

    const temps = forecast.map((f) => f.temperature)
    const min = Math.min(...temps)
    const max = Math.max(...temps)
    const average = temps.reduce((sum, temp) => sum + temp, 0) / temps.length

    return { min, max, average }
  }, [])

  return {
    fetchWeatherData,
    convertTemperature,
    calculateDailyAverages,
    getTemperatureStats,
  }
}
