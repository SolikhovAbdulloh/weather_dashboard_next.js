"use client"
import { ThemeProvider } from "@/components/theme-context"
import WeatherWidget from "@/components/weather-widget"

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-[white]">
      <ThemeProvider>
        <WeatherWidget />
      </ThemeProvider>
    </main>
  )
}
