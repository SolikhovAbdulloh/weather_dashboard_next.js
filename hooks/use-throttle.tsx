"use client"

import { useRef, useCallback } from "react"

export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const lastCall = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      const timeSinceLastCall = now - lastCall.current

      if (timeSinceLastCall >= delay) {
        // If enough time has passed, execute the function immediately
        lastCall.current = now
        func(...args)
      } else {
        // Otherwise, schedule it to run after the remaining time
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
          lastCall.current = Date.now()
          func(...args)
        }, delay - timeSinceLastCall)
      }
    },
    [func, delay],
  )
}
