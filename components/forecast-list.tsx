"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { WeatherIcon } from "@/components/weather-icon";

interface ForecastDay {
  dt: number;
  temp: {
    min: number;
    max: number;
    day: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  humidity: number;
  wind_speed: number;
}

interface ForecastListProps {
  forecast: ForecastDay[];
  unit: "metric" | "imperial";
}

export default function ForecastList({ forecast, unit }: ForecastListProps) {
  const tempUnit = unit === "metric" ? "°C" : "°F";

  return (
    <div className="animate-fadeIn">
      <Card>
        <CardHeader>
          <CardTitle>5-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5  gap-4">
            {forecast.map((day) => (
              <Card key={day.dt} className="overflow-hidden">
                <CardHeader className="p-3 ">
                  <CardTitle className="text-sm font-medium">
                    {formatDate(day.dt, true)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 text-center">
                  <WeatherIcon
                    iconCode={day.weather[0].icon}
                    description={day.weather[0].description}
                    size={48}
                    
                  />
                  <div className="mt-2 capitalize text-black ">
                    {day.weather[0].description}
                  </div>
                  <div className="mt-2 flex justify-center gap-2">
                    <span className="font-medium">
                      {Math.round(day.temp.max)}
                      {tempUnit}
                    </span>
                    <span className="text-black">
                      {Math.round(day.temp.min)}
                      {tempUnit}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-black">
                    Humidity: {day.humidity}%
                  </div>
                  <div className="text-xs text-black">
                    Wind: {day.wind_speed} {unit === "metric" ? "m/s" : "mph"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
