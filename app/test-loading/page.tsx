"use client"

import { useState, useEffect } from "react"
import { SectionLoading } from "@/components/section-loading"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TestLoadingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [showFullPage, setShowFullPage] = useState(false)

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [])

  // Function to simulate full page loading
  const simulateFullPageLoading = () => {
    setShowFullPage(true)
    
    // Reset after 5 seconds
    setTimeout(() => {
      setShowFullPage(false)
    }, 5000)
  }

  if (showFullPage) {
    // This simulates the app/loading.tsx behavior
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50 loading-page-enter">
        <div className="flex flex-col items-center justify-center gap-8 p-8 rounded-xl glass-effect">
          <div className="flex items-center gap-4 mb-4">
            <div className="size-12 md:size-16 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src="/logo.png"
                alt="Bris De Glace Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-2xl md:text-3xl font-bold">BRIS DE GLACE</span>
          </div>

          {/* Windshield Animation */}
          <div className="windshield-container">
            <div className="windshield repair-animation">
              <div className="crack crack-1"></div>
              <div className="crack crack-2"></div>
              <div className="crack crack-3"></div>
            </div>
            
            {/* Circular loading spinner around the windshield */}
            <LoadingSpinner size="lg" className="absolute inset-0" />
          </div>

          {/* Loading Text */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-medium text-foreground">
              Préparation en cours
            </p>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "200ms" }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "400ms" }} />
            </div>
          </div>

          {/* Tagline */}
          <p className="text-sm text-muted-foreground text-center max-w-xs mt-4">
            Remplacement ou réparation de pare-brise 100% gratuit, rapide et sans avance de frais
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Test Loading Page</h1>
        <Link href="/" className="text-primary hover:underline">
          Back to Home
        </Link>
      </div>

      {isLoading ? (
        <SectionLoading text="Chargement de la page..." />
      ) : (
        <div className="space-y-8">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">Loading Components Demo</h2>
            <p className="mb-4">
              This page demonstrates the various loading components created for the Bris De Glace website.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <Button onClick={() => simulateFullPageLoading()}>
                Show Full Page Loading
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  setIsLoading(true)
                  setTimeout(() => setIsLoading(false), 3000)
                }}
              >
                Show Section Loading
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg flex flex-col items-center">
              <h3 className="font-medium mb-4">Small Spinner</h3>
              <LoadingSpinner size="sm" showText />
            </div>
            
            <div className="p-6 border rounded-lg flex flex-col items-center">
              <h3 className="font-medium mb-4">Medium Spinner</h3>
              <LoadingSpinner showText />
            </div>
            
            <div className="p-6 border rounded-lg flex flex-col items-center">
              <h3 className="font-medium mb-4">Large Spinner</h3>
              <LoadingSpinner size="lg" showText />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
