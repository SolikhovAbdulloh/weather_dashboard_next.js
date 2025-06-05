"use client"

import { WeatherWidget } from "@/components/weather-widget"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">Weather Dashboard</h1>
        <WeatherWidget />
      </div>
    </div>
  )
}
