"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Thermometer } from "lucide-react";

interface WeatherData {
  current: {
    temp: number;
    feels_like: number;
  };
  forecast: Array<{
    temp: {
      min: number;
      max: number;
      day: number;
    };
  }>;
}

interface WeatherStatisticsProps {
  weatherData: WeatherData;
  unit: "metric" | "imperial";
}

export default function WeatherStatistics({
  weatherData,
  unit,
}: WeatherStatisticsProps) {
  const tempUnit = unit === "metric" ? "°C" : "°F";

  // Calculate statistics
  const allTemps = weatherData.forecast.flatMap((day) => [
    day.temp.min,
    day.temp.max,
    day.temp.day,
  ]);
  const minTemp = Math.min(...allTemps);
  const maxTemp = Math.max(...allTemps);
  const avgTemp =
    allTemps.reduce((sum, temp) => sum + temp, 0) / allTemps.length;

  // Calculate temperature difference from current to forecast
  const currentTemp = weatherData.current.temp;
  const forecastAvg =
    weatherData.forecast.reduce((sum, day) => sum + day.temp.day, 0) /
    weatherData.forecast.length;
  const tempDiff = forecastAvg - currentTemp;
  const tempTrend =
    tempDiff > 0 ? "rising" : tempDiff < 0 ? "falling" : "stable";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3  gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <ArrowDown className="h-4 w-4 text-blue-500" />
            Minimum Temperature
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round(minTemp)}
            {tempUnit}
          </div>
          <p className="text-xs text-muted-foreground">
            Lowest temperature in the forecast period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <ArrowUp className="h-4 w-4 text-red-500" />
            Maximum Temperature
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round(maxTemp)}
            {tempUnit}
          </div>
          <p className="text-xs text-muted-foreground">
            Highest temperature in the forecast period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-amber-500" />
            Average Temperature
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round(avgTemp)}
            {tempUnit}
          </div>
          <p className="text-xs text-muted-foreground">
            Temperature trend: {tempTrend}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
