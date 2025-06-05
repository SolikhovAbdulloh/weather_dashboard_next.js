"use client"

import { useWeatherContext } from "@/contexts/weather-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Thermometer, Droplets, Wind, Clock } from "lucide-react"
import { WeatherIcon } from "@/components/weather-icon"

export function WeatherDisplay() {
  const { state, convertTemperature } = useWeatherContext()

  if (state.loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (state.error) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardContent className="pt-6">
          <div className="text-center text-red-600 dark:text-red-400">
            <p className="font-semibold">Error loading weather data</p>
            <p className="text-sm mt-1">{state.error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!state.currentWeather) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>No weather data available</p>
            <p className="text-sm mt-1">Please select a city to view weather information</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { currentWeather } = state
  const displayTemp =
    state.unit === "fahrenheit" ? convertTemperature(currentWeather.temperature) : currentWeather.temperature

  return (
    <div className="transition-opacity duration-300 ease-in-out">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{currentWeather.city}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {new Date(currentWeather.timestamp).toLocaleTimeString()}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Main weather display */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <WeatherIcon icon={currentWeather.icon} size="large" />
                <div>
                  <div className="text-4xl font-bold">
                    {Math.round(displayTemp)}°{state.unit === "celsius" ? "C" : "F"}
                  </div>
                  <div className="text-lg text-gray-600 dark:text-gray-400 capitalize">
                    {currentWeather.description}
                  </div>
                </div>
              </div>
            </div>

            {/* Weather details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Thermometer className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Feels like</div>
                  <div className="font-semibold">
                    {Math.round(displayTemp + 2)}°{state.unit === "celsius" ? "C" : "F"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Droplets className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Humidity</div>
                  <div className="font-semibold">{currentWeather.humidity}%</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Wind className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Wind Speed</div>
                  <div className="font-semibold">{currentWeather.windSpeed} km/h</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
