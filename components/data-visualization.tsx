"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { useState } from "react"

interface ForecastDay {
  dt: number
  temp: {
    min: number
    max: number
    day: number
  }
}

interface DataVisualizationProps {
  forecast: ForecastDay[]
  unit: "metric" | "imperial"
}

export default function DataVisualization({ forecast, unit }: DataVisualizationProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const tempUnit = unit === "metric" ? "°C" : "°F"

  // Find min and max temperatures for scaling
  const allTemps = forecast.flatMap((day) => [day.temp.min, day.temp.max])
  const minTemp = Math.min(...allTemps)
  const maxTemp = Math.max(...allTemps)
  const tempRange = maxTemp - minTemp

  // Add padding to the range
  const paddedMin = Math.floor(minTemp - tempRange * 0.1)
  const paddedMax = Math.ceil(maxTemp + tempRange * 0.1)
  const paddedRange = paddedMax - paddedMin

  // Chart dimensions
  const chartHeight = 200
  const chartWidth = 100 // percentage

  // Calculate position for a temperature value
  const getYPosition = (temp: number) => {
    return chartHeight - ((temp - paddedMin) / paddedRange) * chartHeight
  }

  return (
    <Card className="bg-[black]">
      <CardHeader>
        <CardTitle>Temperature Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[250px]">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-muted-foreground">
            <div>
              {paddedMax}
              {tempUnit}
            </div>
            <div>
              {Math.round((paddedMax + paddedMin) / 2)}
              {tempUnit}
            </div>
            <div>
              {paddedMin}
              {tempUnit}
            </div>
          </div>

          {/* Chart area */}
          <div className="absolute left-12 right-0 top-0 h-[200px]">
            {/* Horizontal grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              <div className="border-t border-muted h-0"></div>
              <div className="border-t border-dashed border-muted h-0"></div>
              <div className="border-t border-muted h-0"></div>
            </div>

            {/* SVG chart */}
            <svg width="100%" height={chartHeight} className="overflow-visible">
              {/* Max temperature line */}
              <path
                d={`
                  M ${0} ${getYPosition(forecast[0].temp.max)}
                  ${forecast
                    .map((day, i) => {
                      const x = (i / (forecast.length - 1)) * 100 + "%"
                      const y = getYPosition(day.temp.max)
                      return `L ${x} ${y}`
                    })
                    .join(" ")}
                `}
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Min temperature line */}
              <path
                d={`
                  M ${0} ${getYPosition(forecast[0].temp.min)}
                  ${forecast
                    .map((day, i) => {
                      const x = (i / (forecast.length - 1)) * 100 + "%"
                      const y = getYPosition(day.temp.min)
                      return `L ${x} ${y}`
                    })
                    .join(" ")}
                `}
                fill="none"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="4 4"
              />

              {/* Area between min and max */}
              <path
                d={`
                  M ${0} ${getYPosition(forecast[0].temp.max)}
                  ${forecast
                    .map((day, i) => {
                      const x = (i / (forecast.length - 1)) * 100 + "%"
                      const y = getYPosition(day.temp.max)
                      return `L ${x} ${y}`
                    })
                    .join(" ")}
                  L ${100}% ${getYPosition(forecast[forecast.length - 1].temp.min)}
                  ${forecast
                    .slice()
                    .reverse()
                    .map((day, i) => {
                      const reverseIndex = forecast.length - 1 - i
                      const x = (reverseIndex / (forecast.length - 1)) * 100 + "%"
                      const y = getYPosition(day.temp.min)
                      return `L ${x} ${y}`
                    })
                    .join(" ")}
                  Z
                `}
                fillOpacity="0.1"
              />

              {/* Data points with hover effect */}
              {forecast.map((day, i) => {
                const x = (i / (forecast.length - 1)) * 100 + "%"
                return (
                  <g key={day.dt}>
                    {/* Max temp point */}
                    <circle
                      cx={x}
                      cy={getYPosition(day.temp.max)}
                      r={hoveredIndex === i ? 5 : 3}
                      fill="hsl(var(--primary))"
                      stroke="hsl(var(--background))"
                      strokeWidth="2"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      style={{ transition: "r 0.2s ease" }}
                    />

                    {/* Min temp point */}
                    <circle
                      cx={x}
                      cy={getYPosition(day.temp.min)}
                      r={hoveredIndex === i ? 5 : 3}
                      fill="hsl(var(--muted-foreground))"
                      stroke="hsl(var(--background))"
                      strokeWidth="2"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      style={{ transition: "r 0.2s ease" }}
                    />

                    {/* Hover tooltip */}
                    {hoveredIndex === i && (
                      <g>
                        <rect
                          x={Number.parseFloat(x as string) - 40}
                          y={getYPosition(day.temp.max) - 40}
                          width="80"
                          height="30"
                          rx="4"
                          fill="hsl(var(--background))"
                          stroke="hsl(var(--border))"
                          strokeWidth="1"
                        />
                        <text
                          x={Number.parseFloat(x as string)}
                          y={getYPosition(day.temp.max) - 20}
                          textAnchor="middle"
                          fontSize="12"
                          fill="currentColor"
                        >
                          {Math.round(day.temp.max)}
                          {tempUnit} / {Math.round(day.temp.min)}
                          {tempUnit}
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}
            </svg>

            {/* X-axis labels */}
            <div className="absolute left-0 right-0 top-[200px] flex justify-between text-xs text-muted-foreground pt-2">
              {forecast.map((day, i) => (
                <div key={day.dt} style={{ width: `${100 / forecast.length}%`, textAlign: "center" }}>
                  {formatDate(day.dt, true).split(" ")[0]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
