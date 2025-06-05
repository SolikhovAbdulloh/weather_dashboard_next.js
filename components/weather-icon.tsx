"use client"

import { Cloud, CloudRain, Sun, CloudSnow, Zap, Eye } from "lucide-react"

type WeatherIconProps = {
  icon: string
  size?: "small" | "medium" | "large"
  className?: string
}

const iconMap = {
  sunny: Sun,
  "partly-cloudy": Cloud,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
  thunderstorm: Zap,
  foggy: Eye,
}

const sizeMap = {
  small: "h-6 w-6",
  medium: "h-8 w-8",
  large: "h-12 w-12",
}

const colorMap = {
  sunny: "text-yellow-500",
  "partly-cloudy": "text-gray-500",
  cloudy: "text-gray-600",
  rainy: "text-blue-500",
  snowy: "text-blue-200",
  thunderstorm: "text-purple-500",
  foggy: "text-gray-400",
}

export function WeatherIcon({ icon, size = "medium", className = "" }: WeatherIconProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || Cloud
  const sizeClass = sizeMap[size]
  const colorClass = colorMap[icon as keyof typeof colorMap] || "text-gray-500"

  return <IconComponent className={`${sizeClass} ${colorClass} ${className}`} />
}
