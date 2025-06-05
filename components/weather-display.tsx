"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Droplets, Wind, Compass, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { WeatherIcon } from "@/components/weather-icon";

interface WeatherDisplayProps {
  currentWeather: {
    dt: number;
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    wind_deg: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
  };
  unit: "metric" | "imperial";
}

export default function WeatherDisplay({
  currentWeather,
  unit,
}: WeatherDisplayProps) {
  const tempUnit = unit === "metric" ? "°C" : "°F";
  const windUnit = unit === "metric" ? "m/s" : "mph";

  const getWindDirection = (degrees: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  return (
    <div className="animate-fadeInf ">
      <Card>
        <CardHeader className="pb-2 ">
          <div className="flex justify-between items-center">
            <CardTitle>Current Weather</CardTitle>
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(currentWeather.dt)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center">
                <WeatherIcon
                  iconCode={currentWeather.weather[0].icon}
                  description={currentWeather.weather[0].description}
                  size={64}
                />
                <div className="ml-4">
                  <div className="text-4xl font-bold">
                    {Math.round(currentWeather.temp)}
                    {tempUnit}
                  </div>
                  <div className="text-muted-foreground">
                    Feels like {Math.round(currentWeather.feels_like)}
                    {tempUnit}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="text-lg capitalize font-medium">
                  {currentWeather.weather[0].description}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Thermometer className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Temperature
                  </div>
                  <div className="font-medium">
                    {Math.round(currentWeather.temp)}
                    {tempUnit}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-blue-500/10 p-2 rounded-full">
                  <Droplets className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Humidity</div>
                  <div className="font-medium">{currentWeather.humidity}%</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-black p-2 rounded-full">
                  <Wind className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Wind Speed
                  </div>
                  <div className="font-medium">
                    {currentWeather.wind_speed} {windUnit}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-green-500/10 p-2 rounded-full">
                  <Compass className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Wind Direction
                  </div>
                  <div className="font-medium">
                    {getWindDirection(currentWeather.wind_deg)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
