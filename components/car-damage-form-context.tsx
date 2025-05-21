"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useSearchParams } from "next/navigation"

interface CarDamageFormContextType {
  isOpen: boolean
  openForm: () => void
  closeForm: () => void
  referralCode: string | null
  clearReferralCode: () => void
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
      console.log(`Code de référence trouvé dans l'URL: ${ref}`)
      setReferralCode(ref)
      // Stocker le code de référence dans le localStorage pour le conserver
      // uniquement pendant la session en cours
      sessionStorage.setItem('referralCode', ref)
    } else {
      // Vérifier si un code de référence est stocké dans la session en cours
      const storedRef = sessionStorage.getItem('referralCode')
      if (storedRef) {
        console.log(`Code de référence trouvé dans la session: ${storedRef}`)
        setReferralCode(storedRef)
      } else {
        // Si aucun code de référence n'est trouvé, s'assurer que referralCode est null
        console.log('Aucun code de référence trouvé')
        setReferralCode(null)
        // Supprimer tout code de référence qui pourrait être stocké dans le localStorage
        localStorage.removeItem('referralCode')
      }
    }
  }, [searchParams])

  const openForm = () => setIsOpen(true)

  const closeForm = () => {
    setIsOpen(false)
    // Ne pas effacer le code de référence à la fermeture du formulaire
    // pour permettre à l'utilisateur de soumettre plusieurs formulaires avec le même code
  }

  // Fonction pour effacer le code de référence (non utilisée pour l'instant)
  const clearReferralCode = () => {
    setReferralCode(null)
    sessionStorage.removeItem('referralCode')
    localStorage.removeItem('referralCode')
    console.log('Code de référence effacé')
  }

  return (
    <CarDamageFormContext.Provider value={{ isOpen, openForm, closeForm, referralCode, clearReferralCode }}>
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
