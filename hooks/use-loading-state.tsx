"use client"

import { useState, useEffect, useCallback } from "react"

interface UseLoadingStateProps {
  initialState?: boolean
  minLoadingTime?: number
  onLoadingComplete?: () => void
}

export function useLoadingState({
  initialState = true,
  minLoadingTime = 1000,
  onLoadingComplete
}: UseLoadingStateProps = {}) {
  const [isLoading, setIsLoading] = useState(initialState)
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null)

  useEffect(() => {
    if (initialState) {
      setLoadingStartTime(Date.now())
    }
  }, [initialState])

  const finishLoading = useCallback(() => {
    if (!loadingStartTime) {
      setIsLoading(false)
      onLoadingComplete?.()
      return
    }

    const elapsedTime = Date.now() - loadingStartTime
    
    if (elapsedTime >= minLoadingTime) {
      setIsLoading(false)
      onLoadingComplete?.()
    } else {
      const remainingTime = minLoadingTime - elapsedTime
      setTimeout(() => {
        setIsLoading(false)
        onLoadingComplete?.()
      }, remainingTime)
    }
  }, [loadingStartTime, minLoadingTime, onLoadingComplete])

  const startLoading = useCallback(() => {
    setIsLoading(true)
    setLoadingStartTime(Date.now())
  }, [])

  return {
    isLoading,
    startLoading,
    finishLoading
  }
}
