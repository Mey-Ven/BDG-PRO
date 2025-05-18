"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface CarDamageFormContextType {
  isOpen: boolean
  openForm: () => void
  closeForm: () => void
}

const CarDamageFormContext = createContext<CarDamageFormContextType | undefined>(undefined)

export function CarDamageFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openForm = () => setIsOpen(true)
  const closeForm = () => setIsOpen(false)

  return (
    <CarDamageFormContext.Provider value={{ isOpen, openForm, closeForm }}>
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
