"use client";

import { useState } from "react";
import { useWeatherStore } from "@/store/weather-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CitySelector from "@/components/city-selector";
import WeatherDisplay from "@/components/weather-display";
import ForecastList from "@/components/forecast-list";
import DataVisualization from "@/components/data-visualization";
import SettingsPanel from "@/components/settings-panel";
import ErrorBoundary from "@/components/error-boundary";
import WeatherStatistics from "@/components/weather-statistics";
import { useTheme } from "@/components/theme-context";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WeatherWidget() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("current");

  // Zustand store selectors
  const {
    currentCity,
    weatherData,
    unit,
    isLoading,
    error,
    setCurrentCity,
    toggleUnit,
    setRefreshRate,
  } = useWeatherStore();

  const handleCityChange = (city: string) => {
    setCurrentCity(city);
  };

  const handleUnitToggle = () => {
    toggleUnit();
  };

  const handleRefreshRate = (rate: number) => {
    setRefreshRate(rate);
  };

  return (
    <ErrorBoundary>
      <div className="w-full max-w-[800px] bg-black  rounded-xl shadow-lg overflow-hidden transition-colors duration-300">
        <div className="p-4 bg-[#100202] flex justify-between items-center">
          <h1 className="text-2xl font-bold">Weather Dashboard</h1>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-start justify-between">
            <CitySelector
              currentCity={currentCity}
              onCityChange={handleCityChange}
            />
            <SettingsPanel
              unit={unit}
              onUnitToggle={handleUnitToggle}
              onRefreshRateChange={handleRefreshRate}
            />
          </div>

          {error ? (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : weatherData ? (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 bg-[black] mb-6">
                <TabsTrigger value="current">Current Weather</TabsTrigger>
                <TabsTrigger value="forecast">Forecast</TabsTrigger>
                <TabsTrigger value="statistics">Statistics</TabsTrigger>
              </TabsList>

              <TabsContent value="current" className="space-y-4 animate-fadeIn">
                <WeatherDisplay
                  currentWeather={weatherData.current}
                  unit={unit}
                />
              </TabsContent>

              <TabsContent
                value="forecast"
                className="space-y-4 animate-fadeIn"
              >
                <ForecastList forecast={weatherData.forecast} unit={unit} />
              </TabsContent>

              <TabsContent
                value="statistics"
                className="space-y-4 animate-fadeIn"
              >
                <WeatherStatistics weatherData={weatherData} unit={unit} />
                <DataVisualization
                  forecast={weatherData.forecast}
                  unit={unit}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center p-8">
              Select a city to view weather data
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
