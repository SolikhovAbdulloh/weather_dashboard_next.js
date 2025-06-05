"use client"

import { useState } from "react"
import { useWeatherContext } from "@/contexts/weather-context"
import { useTheme } from "@/contexts/theme-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Settings, Sun, Moon, Thermometer, RefreshCw } from "lucide-react"

export function SettingsPanel() {
  const { state, dispatch } = useWeatherContext()
  const { theme, toggleTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const handleUnitToggle = () => {
    dispatch({ type: "TOGGLE_UNIT" })
  }

  const handleRefreshRateChange = (value: string) => {
    const rate = Number.parseInt(value) * 1000 // Convert to milliseconds
    dispatch({ type: "SET_REFRESH_RATE", payload: rate })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {theme === "light" ? (
                  <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Moon className="h-4 w-4 text-blue-500" />
                )}
                <Label htmlFor="theme-toggle">Dark Mode</Label>
              </div>
              <Switch id="theme-toggle" checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>

            {/* Temperature Unit Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-red-500" />
                <Label htmlFor="unit-toggle">Fahrenheit</Label>
              </div>
              <Switch id="unit-toggle" checked={state.unit === "fahrenheit"} onCheckedChange={handleUnitToggle} />
            </div>

            {/* Refresh Rate */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-green-500" />
                <Label>Auto Refresh Rate</Label>
              </div>
              <Select value={(state.refreshRate / 1000).toString()} onValueChange={handleRefreshRateChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="300">5 minutes</SelectItem>
                  <SelectItem value="600">10 minutes</SelectItem>
                  <SelectItem value="1800">30 minutes</SelectItem>
                  <SelectItem value="3600">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Current Settings Display */}
            <div className="pt-3 border-t space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Theme:</span>
                <span className="capitalize">{theme}</span>
              </div>
              <div className="flex justify-between">
                <span>Temperature Unit:</span>
                <span>{state.unit === "celsius" ? "Celsius (°C)" : "Fahrenheit (°F)"}</span>
              </div>
              <div className="flex justify-between">
                <span>Refresh Rate:</span>
                <span>{state.refreshRate / 1000 / 60} minutes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
