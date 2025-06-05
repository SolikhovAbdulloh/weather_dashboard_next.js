"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SettingsPanelProps {
  unit: "metric" | "imperial";
  onUnitToggle: () => void;
  onRefreshRateChange: (rate: number) => void;
}

export default function SettingsPanel({
  unit,
  onUnitToggle,
  onRefreshRateChange,
}: SettingsPanelProps) {
  const [open, setOpen] = useState(false);
  const [refreshRate, setRefreshRate] = useState("300");

  const handleRefreshRateChange = (value: string) => {
    setRefreshRate(value);
    onRefreshRateChange(Number.parseInt(value));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Display Settings</h4>
            <p className="text-sm text-black">
              Configure how weather data is displayed
            </p>
          </div>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Label htmlFor="unit-toggle">Temperature Unit</Label>
                <span className="text-xs text-[black]">
                  {unit === "metric" ? "Celsius (°C)" : "Fahrenheit (°F)"}
                </span>
              </div>
              <Switch
                id="unit-toggle"
                checked={unit === "imperial"}
                onCheckedChange={onUnitToggle}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="refresh-rate">Auto Refresh Rate</Label>
              <Select
                value={refreshRate}
                onValueChange={handleRefreshRateChange}
              >
                <SelectTrigger id="refresh-rate">
                  <SelectValue placeholder="Select refresh rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Off</SelectItem>
                  <SelectItem value="60">Every minute</SelectItem>
                  <SelectItem value="300">Every 5 minutes</SelectItem>
                  <SelectItem value="600">Every 10 minutes</SelectItem>
                  <SelectItem value="1800">Every 30 minutes</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs text-[black]">
                How often to automatically refresh weather data
              </span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
