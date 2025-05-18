"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface PartnerFormContextType {
  isOpen: boolean
  openForm: () => void
  closeForm: () => void
}

const PartnerFormContext = createContext<PartnerFormContextType | undefined>(undefined)

export function PartnerFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openForm = () => setIsOpen(true)
  const closeForm = () => setIsOpen(false)

  return (
    <PartnerFormContext.Provider value={{ isOpen, openForm, closeForm }}>
      {children}
    </PartnerFormContext.Provider>
  )
}

export function usePartnerForm() {
  const context = useContext(PartnerFormContext)
  if (context === undefined) {
    throw new Error("usePartnerForm must be used within a PartnerFormProvider")
  }
  return context
}
