"use client"

import { useWeatherContext } from "@/contexts/weather-context"
import { useWeatherData } from "@/hooks/use-weather-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react"

export function DataVisualization() {
  const { state, convertTemperature } = useWeatherContext()
  const { getTemperatureStats } = useWeatherData()

  if (state.loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (state.error || state.forecast.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>No data available for visualization</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const stats = getTemperatureStats(state.forecast)
  const displayStats = {
    min: state.unit === "fahrenheit" ? convertTemperature(stats.min) : stats.min,
    max: state.unit === "fahrenheit" ? convertTemperature(stats.max) : stats.max,
    average: state.unit === "fahrenheit" ? convertTemperature(stats.average) : stats.average,
  }

  // Prepare data for SVG chart
  const chartData = state.forecast.map((day, index) => {
    const temp = state.unit === "fahrenheit" ? convertTemperature(day.temperature) : day.temperature
    return {
      x: index * 120 + 60, // Spacing between points
      y: 150 - ((temp - displayStats.min) / (displayStats.max - displayStats.min)) * 100, // Scale to chart height
      temp,
      day: new Date(day.date).toLocaleDateString("en-US", { weekday: "short" }),
    }
  })

  // Create SVG path for temperature line
  const pathData = chartData.reduce((path, point, index) => {
    const command = index === 0 ? "M" : "L"
    return `${path} ${command} ${point.x} ${point.y}`
  }, "")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Temperature Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <svg width="600" height="200" className="w-full h-auto">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="60" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Temperature line */}
              <path
                d={pathData}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {chartData.map((point, index) => (
                <g key={index}>
                  <circle cx={point.x} cy={point.y} r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
                  <text x={point.x} y={point.y - 15} textAnchor="middle" className="text-xs fill-current">
                    {Math.round(point.temp)}°
                  </text>
                  <text x={point.x} y={190} textAnchor="middle" className="text-xs fill-current opacity-70">
                    {point.day}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <TrendingDown className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Minimum</div>
                <div className="text-xl font-bold">
                  {Math.round(displayStats.min)}°{state.unit === "celsius" ? "C" : "F"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average</div>
                <div className="text-xl font-bold">
                  {Math.round(displayStats.average)}°{state.unit === "celsius" ? "C" : "F"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <TrendingUp className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Maximum</div>
                <div className="text-xl font-bold">
                  {Math.round(displayStats.max)}°{state.unit === "celsius" ? "C" : "F"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
