"use client"

import { useState } from "react"

import { useReducer, useEffect, useRef } from "react"
import { fetchWeatherData } from "@/lib/api"
import { useThrottle } from "@/hooks/use-throttle"

// Define the state type
interface WeatherState {
  currentCity: string
  weatherData: any | null
  unit: "metric" | "imperial"
  refreshRate: number
  error: string | null
}

// Define action types
type WeatherAction =
  | { type: "FETCH_WEATHER_START" }
  | { type: "FETCH_WEATHER_SUCCESS"; payload: any }
  | { type: "FETCH_WEATHER_ERROR"; payload: string }
  | { type: "CHANGE_CITY"; payload: string }
  | { type: "TOGGLE_UNIT" }
  | { type: "SET_REFRESH_RATE"; payload: number }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }

// Initial state
const initialState: WeatherState = {
  currentCity: "",
  weatherData: null,
  unit: "metric",
  refreshRate: 300, // 5 minutes in seconds
  error: null,
}

// Reducer function
function weatherReducer(state: WeatherState, action: WeatherAction): WeatherState {
  switch (action.type) {
    case "FETCH_WEATHER_START":
      return {
        ...state,
        error: null,
      }
    case "FETCH_WEATHER_SUCCESS":
      return {
        ...state,
        weatherData: action.payload,
        error: null,
      }
    case "FETCH_WEATHER_ERROR":
      return {
        ...state,
        error: action.payload,
      }
    case "CHANGE_CITY":
      return {
        ...state,
        currentCity: action.payload,
      }
    case "TOGGLE_UNIT":
      return {
        ...state,
        unit: state.unit === "metric" ? "imperial" : "metric",
      }
    case "SET_REFRESH_RATE":
      return {
        ...state,
        refreshRate: action.payload,
      }
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      }
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

export function useWeatherData() {
  const [state, dispatch] = useReducer(weatherReducer, initialState)
  const [isLoading, setIsLoading] = useState(false)
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Throttle the fetchWeather function to prevent too many API calls
  const throttledFetchWeather = useThrottle(async (city: string, unit: "metric" | "imperial") => {
    if (!city) return

    setIsLoading(true)
    dispatch({ type: "FETCH_WEATHER_START" })

    try {
      const data = await fetchWeatherData(city, unit)
      dispatch({ type: "FETCH_WEATHER_SUCCESS", payload: data })
    } catch (error) {
      dispatch({
        type: "FETCH_WEATHER_ERROR",
        payload: error instanceof Error ? error.message : "Failed to fetch weather data",
      })
    } finally {
      setIsLoading(false)
    }
  }, 5000) // Max 1 call per 5 seconds

  // Fetch weather data when city or unit changes
  useEffect(() => {
    if (state.currentCity) {
      throttledFetchWeather(state.currentCity, state.unit)
    }
  }, [state.currentCity, state.unit, throttledFetchWeather])

  // Set up auto-refresh timer
  useEffect(() => {
    // Clear existing timer
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current)
      refreshTimerRef.current = null
    }

    // Set new timer if refresh rate is greater than 0 and we have a city
    if (state.refreshRate > 0 && state.currentCity) {
      refreshTimerRef.current = setInterval(() => {
        throttledFetchWeather(state.currentCity, state.unit)
      }, state.refreshRate * 1000)
    }

    // Clean up on unmount
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current)
      }
    }
  }, [state.refreshRate, state.currentCity, state.unit, throttledFetchWeather])

  return {
    state,
    dispatch,
    isLoading,
    error: state.error,
  }
}
