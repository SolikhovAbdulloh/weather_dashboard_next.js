"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useWeatherContext } from "@/contexts/weather-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import { debounce } from "@/utils/debounce";

const AVAILABLE_CITIES = ["London", "New York", "Tokyo", "Sydney", "Cairo"];

export function CitySelector() {
  const { state, dispatch, fetchWeather } = useWeatherContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState(AVAILABLE_CITIES);
  const [searchError, setSearchError] = useState("");

  const debouncedSearch = debounce((term: string) => {
    if (term.trim() === "") {
      setFilteredCities(AVAILABLE_CITIES);
      setSearchError("");
      return;
    }

    const filtered = AVAILABLE_CITIES.filter((city) =>
      city.toLowerCase().includes(term.toLowerCase())
    );

    if (filtered.length === 0) {
      setSearchError(
        `No cities found matching "${term}". Available cities: ${AVAILABLE_CITIES.join(
          ", "
        )}`
      );
    } else {
      setSearchError("");
    }

    setFilteredCities(filtered);
  }, 300);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Fetch weather data for initial city on mount
  useEffect(() => {
    fetchWeather(state.selectedCity);
  }, []);

  const handleCityChange = async (city: string) => {
    if (city !== state.selectedCity) {
      dispatch({ type: "CHANGE_CITY", payload: city });
      await fetchWeather(city);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredCities.length === 1) {
      handleCityChange(filteredCities[0]);
      setSearchTerm("");
    } else if (filteredCities.length === 0) {
      setSearchError("Please select a valid city from the available options");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <Select value={state.selectedCity} onValueChange={handleCityChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_CITIES.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[200px] pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <Button type="submit" variant="outline" size="sm">
          Search
        </Button>
      </form>

      {searchError && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
          {searchError}
        </p>
      )}

      {state.loading && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}
