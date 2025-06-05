"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    })

    // Log error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Card className="w-full max-w-[800px]">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle />
              <CardTitle>Something went wrong</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>An error occurred while rendering the weather widget. Please try again later.</p>
              {this.state.error && (
                <div className="p-4 bg-muted rounded-md overflow-auto">
                  <p className="font-mono text-sm">{this.state.error.toString()}</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
          </CardFooter>
        </Card>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
