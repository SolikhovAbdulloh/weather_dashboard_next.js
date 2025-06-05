// Mock API service to simulate OpenWeatherMap API calls

type MockWeatherResponse = {
  city: string
  current: {
    temperature: number
    description: string
    humidity: number
    windSpeed: number
    icon: string
  }
  forecast: Array<{
    date: string
    temperature: number
    minTemp: number
    maxTemp: number
    description: string
    icon: string
  }>
}

const MOCK_DATA: Record<string, MockWeatherResponse> = {
  London: {
    city: "London",
    current: {
      temperature: 15,
      description: "Partly cloudy",
      humidity: 65,
      windSpeed: 12,
      icon: "partly-cloudy",
    },
    forecast: [
      { date: "2024-01-01", temperature: 16, minTemp: 12, maxTemp: 18, description: "Cloudy", icon: "cloudy" },
      { date: "2024-01-02", temperature: 14, minTemp: 10, maxTemp: 17, description: "Rainy", icon: "rainy" },
      { date: "2024-01-03", temperature: 18, minTemp: 14, maxTemp: 22, description: "Sunny", icon: "sunny" },
      {
        date: "2024-01-04",
        temperature: 13,
        minTemp: 9,
        maxTemp: 16,
        description: "Partly cloudy",
        icon: "partly-cloudy",
      },
      { date: "2024-01-05", temperature: 17, minTemp: 13, maxTemp: 20, description: "Sunny", icon: "sunny" },
    ],
  },
  "New York": {
    city: "New York",
    current: {
      temperature: 22,
      description: "Sunny",
      humidity: 45,
      windSpeed: 8,
      icon: "sunny",
    },
    forecast: [
      { date: "2024-01-01", temperature: 24, minTemp: 18, maxTemp: 28, description: "Sunny", icon: "sunny" },
      {
        date: "2024-01-02",
        temperature: 20,
        minTemp: 16,
        maxTemp: 25,
        description: "Partly cloudy",
        icon: "partly-cloudy",
      },
      { date: "2024-01-03", temperature: 19, minTemp: 15, maxTemp: 23, description: "Cloudy", icon: "cloudy" },
      { date: "2024-01-04", temperature: 26, minTemp: 21, maxTemp: 30, description: "Sunny", icon: "sunny" },
      {
        date: "2024-01-05",
        temperature: 23,
        minTemp: 19,
        maxTemp: 27,
        description: "Partly cloudy",
        icon: "partly-cloudy",
      },
    ],
  },
  Tokyo: {
    city: "Tokyo",
    current: {
      temperature: 28,
      description: "Hot and humid",
      humidity: 78,
      windSpeed: 6,
      icon: "sunny",
    },
    forecast: [
      { date: "2024-01-01", temperature: 30, minTemp: 25, maxTemp: 34, description: "Hot", icon: "sunny" },
      { date: "2024-01-02", temperature: 27, minTemp: 23, maxTemp: 31, description: "Rainy", icon: "rainy" },
      {
        date: "2024-01-03",
        temperature: 29,
        minTemp: 24,
        maxTemp: 33,
        description: "Partly cloudy",
        icon: "partly-cloudy",
      },
      { date: "2024-01-04", temperature: 31, minTemp: 26, maxTemp: 35, description: "Sunny", icon: "sunny" },
      {
        date: "2024-01-05",
        temperature: 26,
        minTemp: 22,
        maxTemp: 30,
        description: "Thunderstorm",
        icon: "thunderstorm",
      },
    ],
  },
  Sydney: {
    city: "Sydney",
    current: {
      temperature: 25,
      description: "Clear skies",
      humidity: 55,
      windSpeed: 15,
      icon: "sunny",
    },
    forecast: [
      { date: "2024-01-01", temperature: 27, minTemp: 22, maxTemp: 31, description: "Sunny", icon: "sunny" },
      {
        date: "2024-01-02",
        temperature: 24,
        minTemp: 20,
        maxTemp: 28,
        description: "Partly cloudy",
        icon: "partly-cloudy",
      },
      { date: "2024-01-03", temperature: 26, minTemp: 21, maxTemp: 30, description: "Sunny", icon: "sunny" },
      { date: "2024-01-04", temperature: 23, minTemp: 19, maxTemp: 27, description: "Cloudy", icon: "cloudy" },
      { date: "2024-01-05", temperature: 28, minTemp: 23, maxTemp: 32, description: "Sunny", icon: "sunny" },
    ],
  },
  Cairo: {
    city: "Cairo",
    current: {
      temperature: 35,
      description: "Very hot and dry",
      humidity: 25,
      windSpeed: 10,
      icon: "sunny",
    },
    forecast: [
      { date: "2024-01-01", temperature: 37, minTemp: 30, maxTemp: 42, description: "Very hot", icon: "sunny" },
      { date: "2024-01-02", temperature: 34, minTemp: 28, maxTemp: 39, description: "Hot", icon: "sunny" },
      { date: "2024-01-03", temperature: 36, minTemp: 29, maxTemp: 41, description: "Very hot", icon: "sunny" },
      { date: "2024-01-04", temperature: 33, minTemp: 27, maxTemp: 38, description: "Hot", icon: "partly-cloudy" },
      { date: "2024-01-05", temperature: 38, minTemp: 31, maxTemp: 43, description: "Extremely hot", icon: "sunny" },
    ],
  },
}

export const mockWeatherAPI = {
  async getWeatherData(city: string): Promise<MockWeatherResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500))

    // Simulate occasional API failures
    if (Math.random() < 0.1) {
      throw new Error(`API Error: Unable to fetch weather data for ${city}`)
    }

    const data = MOCK_DATA[city]
    if (!data) {
      throw new Error(`City "${city}" not found. Available cities: ${Object.keys(MOCK_DATA).join(", ")}`)
    }

    // Add some randomness to make it feel more realistic
    const variation = (Math.random() - 0.5) * 4 // ±2 degrees variation
    return {
      ...data,
      current: {
        ...data.current,
        temperature: Math.round(data.current.temperature + variation),
      },
    }
  },
}
