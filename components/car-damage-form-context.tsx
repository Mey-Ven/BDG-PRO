"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useSearchParams } from "next/navigation"

interface CarDamageFormContextType {
  isOpen: boolean
  openForm: () => void
  closeForm: () => void
  referralCode: string | null
}

const CarDamageFormContext = createContext<CarDamageFormContextType | undefined>(undefined)

export function CarDamageFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const searchParams = useSearchParams()

  // Récupérer le code de référence depuis l'URL
  useEffect(() => {
    const ref = searchParams?.get('ref')
    if (ref) {
      setReferralCode(ref)
      // Stocker le code de référence dans le localStorage pour le conserver
      // même si l'utilisateur navigue sur le site
      localStorage.setItem('referralCode', ref)
    } else {
      // Vérifier si un code de référence est stocké dans le localStorage
      const storedRef = localStorage.getItem('referralCode')
      if (storedRef) {
        setReferralCode(storedRef)
      }
    }
  }, [searchParams])

  const openForm = () => setIsOpen(true)
  const closeForm = () => setIsOpen(false)

  return (
    <CarDamageFormContext.Provider value={{ isOpen, openForm, closeForm, referralCode }}>
      {children}
    </CarDamageFormContext.Provider>
  )
}

export function useCarDamageForm() {
  const context = useContext(CarDamageFormContext)
  if (context === undefined) {
    throw new Error("useCarDamageForm must be used within a CarDamageFormProvider")
  }
  return context
}
