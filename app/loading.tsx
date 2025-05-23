"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function Loading() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [repairComplete, setRepairComplete] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Simulate repair completion after 3 seconds
    const timer = setTimeout(() => {
      setRepairComplete(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Ensure theme is available after hydration
  if (!mounted) {
    return null
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50 loading-page-enter">
      <div className="flex flex-col items-center justify-center gap-8 p-8 rounded-xl glass-effect">
        {/* Logo and Brand Name */}
        <motion.div
          className="flex items-center gap-4 mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="size-12 md:size-16 rounded-lg flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              alt="Bris De Glace Logo"
              width={64}
              height={64}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <span className="text-2xl md:text-3xl font-bold">BRIS DE GLACE</span>
        </motion.div>

        {/* Windshield Animation */}
        <motion.div
          className="windshield-container"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className={`windshield ${repairComplete ? 'repair-animation' : ''}`}>
            <div className="crack crack-1"></div>
            <div className="crack crack-2"></div>
            <div className="crack crack-3"></div>
          </div>

          {/* Circular loading spinner around the windshield */}
          <LoadingSpinner size="lg" className="absolute inset-0" />
        </motion.div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-2">
          <motion.p
            className="text-lg font-medium text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {repairComplete ? "Préparation terminée" : "Préparation en cours"}
          </motion.p>
          {!repairComplete && (
            <motion.div
              className="flex gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              />
            </motion.div>
          )}
        </div>

        {/* Tagline */}
        <motion.p
          className="text-sm text-muted-foreground text-center max-w-xs mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Remplacement ou réparation de pare-brise 100% gratuit, rapide et sans avance de frais
        </motion.p>
      </div>
    </div>
  )
}
