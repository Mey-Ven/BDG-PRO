"use client"

import { useState, useEffect } from "react"
import { SectionLoading } from "@/components/section-loading"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useLoadingState } from "@/hooks/use-loading-state"
import { Button } from "@/components/ui/button"

export default function LoadingExample() {
  // Example 1: Using the useLoadingState hook
  const { isLoading, startLoading, finishLoading } = useLoadingState({
    initialState: false,
    minLoadingTime: 2000,
    onLoadingComplete: () => console.log("Loading complete!")
  })

  // Example 2: Simple loading state
  const [isLoadingSection, setIsLoadingSection] = useState(false)

  // Simulate loading completion after 3 seconds
  useEffect(() => {
    if (isLoadingSection) {
      const timer = setTimeout(() => {
        setIsLoadingSection(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isLoadingSection])

  return (
    <div className="container py-12 space-y-12">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Loading State Hook Example</h2>
        <div className="flex gap-4">
          <Button onClick={startLoading} disabled={isLoading}>
            Start Loading
          </Button>
          <Button onClick={finishLoading} variant="outline" disabled={!isLoading}>
            Finish Loading
          </Button>
        </div>
        
        {isLoading && (
          <div className="relative min-h-[200px] border rounded-lg p-4">
            <SectionLoading variant="overlay" text="Chargement des données..." />
            <div className="opacity-30">
              <p>This content is behind the loading overlay</p>
              <p>It will be visible when loading completes</p>
            </div>
          </div>
        )}
        
        {!isLoading && (
          <div className="border rounded-lg p-4">
            <p>Content is loaded!</p>
            <p>This appears after the loading state is complete</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Section Loading Examples</h2>
        <div className="flex gap-4">
          <Button onClick={() => setIsLoadingSection(true)} disabled={isLoadingSection}>
            Load Section
          </Button>
        </div>
        
        {isLoadingSection ? (
          <div className="border rounded-lg overflow-hidden">
            <SectionLoading text="Chargement de la section..." />
          </div>
        ) : (
          <div className="border rounded-lg p-4">
            <p>Section content is loaded!</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Loading Spinner Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 flex flex-col items-center gap-4">
            <h3 className="font-medium">Small</h3>
            <LoadingSpinner size="sm" showText />
          </div>
          <div className="border rounded-lg p-6 flex flex-col items-center gap-4">
            <h3 className="font-medium">Medium (Default)</h3>
            <LoadingSpinner showText />
          </div>
          <div className="border rounded-lg p-6 flex flex-col items-center gap-4">
            <h3 className="font-medium">Large</h3>
            <LoadingSpinner size="lg" showText />
          </div>
        </div>
      </div>
    </div>
  )
}
