"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"

const cities = [
  { value: "london", label: "London" },
  { value: "new-york", label: "New York" },
  { value: "tokyo", label: "Tokyo" },
  { value: "sydney", label: "Sydney" },
  { value: "cairo", label: "Cairo" },
]

interface CitySelectorProps {
  currentCity: string
  onCityChange: (city: string) => void
}

export default function CitySelector({ currentCity, onCityChange }: CitySelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const debouncedSearchValue = useDebounce(searchValue, 300)
  const [filteredCities, setFilteredCities] = useState(cities)
  const [validationError, setValidationError] = useState<string | null>(null)

  // Filter cities based on search input
  useEffect(() => {
    if (!debouncedSearchValue) {
      setFilteredCities(cities)
      setValidationError(null)
      return
    }

    const filtered = cities.filter((city) => city.label.toLowerCase().includes(debouncedSearchValue.toLowerCase()))

    setFilteredCities(filtered)

    if (filtered.length === 0) {
      setValidationError("No cities match your search")
    } else {
      setValidationError(null)
    }
  }, [debouncedSearchValue])

  const handleSelect = (city: string) => {
    onCityChange(city)
    setOpen(false)
  }

  return (
    <div className="w-full md:w-[250px]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {currentCity ? cities.find((city) => city.value === currentCity)?.label || "Select city" : "Select city"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <CommandInput
                placeholder="Search cities..."
                className="pl-8"
                value={searchValue}
                onValueChange={setSearchValue}
              />
            </div>
            {validationError && <p className="px-2 py-1 text-sm text-destructive">{validationError}</p>}
            <CommandList>
              <CommandEmpty>No cities found.</CommandEmpty>
              <CommandGroup>
                {filteredCities.map((city) => (
                  <CommandItem key={city.value} value={city.value} onSelect={() => handleSelect(city.value)}>
                    <Check className={cn("mr-2 h-4 w-4", currentCity === city.value ? "opacity-100" : "opacity-0")} />
                    {city.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
