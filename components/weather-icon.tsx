"use client";

import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudFog,
  CloudLightning,
  CloudDrizzle,
  CloudSun,
} from "lucide-react";

interface WeatherIconProps {
  iconCode: string;
  description: string;
  size?: number;
}

export function WeatherIcon({
  iconCode,
  description,
  size = 24,
}: WeatherIconProps) {
  // Map OpenWeatherMap icon codes to Lucide icons
  const getIcon = () => {
    switch (iconCode) {
      case "01d":
      case "01n":
        return <Sun size={size} className="text-amber-900" />;
      case "02d":
      case "02n":
        return <CloudSun size={size} className="text-[red]" />;
      case "03d":
      case "03n":
      case "04d":
      case "04n":
        return <Cloud size={size} className="text-gray-800" />;
      case "09d":
      case "09n":
        return <CloudDrizzle size={size} className="text-blue-400" />;
      case "10d":
      case "10n":
        return <CloudRain size={size} className="text-blue-500" />;
      case "11d":
      case "11n":
        return <CloudLightning size={size} className="text-[green]" />;
      case "13d":
      case "13n":
        return <CloudSnow size={size} className="text-[red]" />;
      case "50d":
      case "50n":
        return <CloudFog size={size} className="text-[red]" />;
      default:
        return <Sun size={size} className="text-amber-600" />;
    }
  };

  return (
    <div className="flex items-center justify-center " title={description}>
      {getIcon()}
    </div>
  );
}
