"use client"

import { useState } from "react"
import { WeatherProvider } from "@/contexts/weather-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { CitySelector } from "@/components/city-selector"
import { WeatherDisplay } from "@/components/weather-display"
import { ForecastList } from "@/components/forecast-list"
import { DataVisualization } from "@/components/data-visualization"
import { SettingsPanel } from "@/components/settings-panel"
import { ErrorBoundary } from "@/components/error-boundary"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function WeatherWidget() {
  const [activeTab, setActiveTab] = useState("current")

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <WeatherProvider>
          <Card className="w-full max-w-[800px] mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg">
            <div className="space-y-6">
              {/* Header with City Selector and Settings */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CitySelector />
                <SettingsPanel />
              </div>

              {/* Tab Navigation */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="current">Current Weather</TabsTrigger>
                  <TabsTrigger value="forecast">Forecast</TabsTrigger>
                  <TabsTrigger value="statistics">Statistics</TabsTrigger>
                </TabsList>

                <TabsContent value="current" className="mt-6">
                  <WeatherDisplay />
                </TabsContent>

                <TabsContent value="forecast" className="mt-6">
                  <ForecastList />
                </TabsContent>

                <TabsContent value="statistics" className="mt-6">
                  <DataVisualization />
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </WeatherProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
