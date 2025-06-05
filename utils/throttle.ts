export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: NodeJS.Timeout | null = null
  let lastExecTime = 0

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve, reject) => {
      const currentTime = Date.now()

      if (currentTime - lastExecTime > delay) {
        // Execute immediately if enough time has passed
        lastExecTime = currentTime
        try {
          const result = func(...args)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      } else {
        // Clear existing timeout and set a new one
        if (timeoutId) {
          clearTimeout(timeoutId)
        }

        const remainingTime = delay - (currentTime - lastExecTime)
        timeoutId = setTimeout(() => {
          lastExecTime = Date.now()
          try {
            const result = func(...args)
            resolve(result)
          } catch (error) {
            reject(error)
          }
        }, remainingTime)
      }
    })
  }
}
