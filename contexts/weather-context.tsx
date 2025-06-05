"use client"

import type React from "react"

import { createContext, useContext, useReducer, type ReactNode } from "react"
import { useWeatherData } from "@/hooks/use-weather-data"

export type WeatherData = {
  city: string
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  icon: string
  timestamp: number
}

export type ForecastData = {
  date: string
  temperature: number
  minTemp: number
  maxTemp: number
  description: string
  icon: string
}

export type WeatherState = {
  currentWeather: WeatherData | null
  forecast: ForecastData[]
  selectedCity: string
  unit: "celsius" | "fahrenheit"
  loading: boolean
  error: string | null
  refreshRate: number
}

export type WeatherAction =
  | { type: "FETCH_WEATHER"; payload: { current: WeatherData; forecast: ForecastData[] } }
  | { type: "CHANGE_CITY"; payload: string }
  | { type: "TOGGLE_UNIT" }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_REFRESH_RATE"; payload: number }

const initialState: WeatherState = {
  currentWeather: null,
  forecast: [],
  selectedCity: "London",
  unit: "celsius",
  loading: false,
  error: null,
  refreshRate: 300000, // 5 minutes
}

function weatherReducer(state: WeatherState, action: WeatherAction): WeatherState {
  switch (action.type) {
    case "FETCH_WEATHER":
      return {
        ...state,
        currentWeather: action.payload.current,
        forecast: action.payload.forecast,
        loading: false,
        error: null,
      }
    case "CHANGE_CITY":
      return {
        ...state,
        selectedCity: action.payload,
        loading: true,
        error: null,
      }
    case "TOGGLE_UNIT":
      return {
        ...state,
        unit: state.unit === "celsius" ? "fahrenheit" : "celsius",
      }
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      }
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }
    case "SET_REFRESH_RATE":
      return {
        ...state,
        refreshRate: action.payload,
      }
    default:
      return state
  }
}

type WeatherContextType = {
  state: WeatherState
  dispatch: React.Dispatch<WeatherAction>
  fetchWeather: (city: string) => Promise<void>
  convertTemperature: (temp: number, fromUnit?: "celsius" | "fahrenheit") => number
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined)

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(weatherReducer, initialState)
  const { fetchWeatherData, convertTemperature } = useWeatherData()

  const fetchWeather = async (city: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "CLEAR_ERROR" })

      const data = await fetchWeatherData(city)
      dispatch({ type: "FETCH_WEATHER", payload: data })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to fetch weather data" })
    }
  }

  return (
    <WeatherContext.Provider value={{ state, dispatch, fetchWeather, convertTemperature }}>
      {children}
    </WeatherContext.Provider>
  )
}

export function useWeatherContext() {
  const context = useContext(WeatherContext)
  if (context === undefined) {
    throw new Error("useWeatherContext must be used within a WeatherProvider")
  }
  return context
}
