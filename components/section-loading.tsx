"use client"

import { motion } from "framer-motion"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { cn } from "@/lib/utils"

interface SectionLoadingProps {
  className?: string
  text?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "default" | "minimal" | "overlay"
}

export function SectionLoading({
  className,
  text = "Chargement en cours",
  showText = true,
  size = "md",
  variant = "default"
}: SectionLoadingProps) {
  if (variant === "overlay") {
    return (
      <div className={cn(
        "absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10",
        className
      )}>
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size={size} showText={showText} text={text} />
        </div>
      </div>
    )
  }

  if (variant === "minimal") {
    return (
      <div className={cn(
        "flex items-center justify-center py-4",
        className
      )}>
        <LoadingSpinner size={size} showText={showText} text={text} />
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn(
      "w-full flex flex-col items-center justify-center py-12",
      className
    )}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6 p-6 rounded-lg glass-effect"
      >
        <LoadingSpinner size={size} showText={showText} text={text} />
        
        {/* Windshield repair animation (simplified) */}
        <div className="windshield-container scale-75 opacity-70">
          <div className="windshield repair-animation">
            <div className="crack crack-1"></div>
            <div className="crack crack-2"></div>
            <div className="crack crack-3"></div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
