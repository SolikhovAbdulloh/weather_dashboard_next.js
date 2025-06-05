"use client"

import { useWeatherContext } from "@/contexts/weather-context"
import { Card, CardContent } from "@/components/ui/card"
import { WeatherIcon } from "@/components/weather-icon"

export function ForecastList() {
  const { state, convertTemperature } = useWeatherContext()

  if (state.loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (state.error) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardContent className="pt-6">
          <div className="text-center text-red-600 dark:text-red-400">
            <p className="font-semibold">Error loading forecast data</p>
            <p className="text-sm mt-1">{state.error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (state.forecast.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>No forecast data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">5-Day Forecast</h3>
      <div className="grid gap-3">
        {state.forecast.map((day, index) => {
          const temp = state.unit === "fahrenheit" ? convertTemperature(day.temperature) : day.temperature
          const minTemp = state.unit === "fahrenheit" ? convertTemperature(day.minTemp) : day.minTemp
          const maxTemp = state.unit === "fahrenheit" ? convertTemperature(day.maxTemp) : day.maxTemp

          return (
            <Card key={index} className="transition-all duration-200 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium w-20">
                      {index === 0 ? "Today" : new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <WeatherIcon icon={day.icon} size="small" />
                    <div className="text-sm text-gray-600 dark:text-gray-400 capitalize min-w-0 flex-1">
                      {day.description}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">{Math.round(maxTemp)}°</span>
                    <span className="text-gray-500 dark:text-gray-400">{Math.round(minTemp)}°</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
