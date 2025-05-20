"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Check, ChevronDown } from "lucide-react"
import { insuranceCompanies, type InsuranceCompany } from "@/data/insurance-companies"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface InsuranceSelectorProps {
  value: string
  onChange: (value: string) => void
  onCustomInsuranceChange?: (value: string) => void
  customInsurance?: string
}

export function InsuranceSelector({
  value,
  onChange,
  onCustomInsuranceChange,
  customInsurance = ""
}: InsuranceSelectorProps) {
  const [open, setOpen] = useState(false)
  const [localCustomInsurance, setLocalCustomInsurance] = useState(customInsurance)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  // Mettre à jour l'état local lorsque la prop customInsurance change
  useEffect(() => {
    setLocalCustomInsurance(customInsurance)
  }, [customInsurance])

  const selectedInsurance = insuranceCompanies.find(
    (insurance) => insurance.id === value
  )

  const handleCustomInsuranceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalCustomInsurance(newValue)
    if (onCustomInsuranceChange) {
      onCustomInsuranceChange(newValue)
    }
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto py-2"
          >
            {selectedInsurance ? (
              <div className="flex items-center gap-3">
                {selectedInsurance.id === "autre" ? (
                  <span className="font-medium">{selectedInsurance.name}</span>
                ) : selectedInsurance.logoUrl && !imageErrors[selectedInsurance.id] ? (
                  <>
                    <Image
                      src={selectedInsurance.logoUrl}
                      alt={selectedInsurance.name}
                      width={80}
                      height={40}
                      className="h-8 w-auto object-contain"
                      onError={() => setImageErrors(prev => ({ ...prev, [selectedInsurance.id]: true }))}
                    />
                    <span className="font-medium">{selectedInsurance.name}</span>
                  </>
                ) : imageErrors[selectedInsurance.id] ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-8 w-8 bg-primary/10 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                      </svg>
                    </div>
                    <span className="font-medium">{selectedInsurance.name}</span>
                  </div>
                ) : (
                  <span>{selectedInsurance.name}</span>
                )}
              </div>
            ) : (
              "Sélectionnez votre assurance"
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 max-h-[300px] overflow-y-auto">
          <Command>
            <CommandInput placeholder="Rechercher une assurance..." />
            <CommandEmpty>Aucune assurance trouvée.</CommandEmpty>
            <CommandGroup>
              {insuranceCompanies.map((insurance) => (
                <CommandItem
                  key={insurance.id}
                  value={insurance.id}
                  onSelect={() => {
                    onChange(insurance.id)
                    setOpen(false)
                  }}
                  className="flex items-center gap-2 py-2"
                >
                  {insurance.id === "autre" ? (
                    <span className="flex-1 font-medium">{insurance.name}</span>
                  ) : insurance.logoUrl && !imageErrors[insurance.id] ? (
                    <div className="flex items-center gap-3 flex-1">
                      <Image
                        src={insurance.logoUrl}
                        alt={insurance.name}
                        width={80}
                        height={40}
                        className="h-8 w-auto object-contain"
                        onError={() => setImageErrors(prev => ({ ...prev, [insurance.id]: true }))}
                      />
                      <span className="font-medium">{insurance.name}</span>
                    </div>
                  ) : imageErrors[insurance.id] ? (
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center justify-center h-8 w-8 bg-primary/10 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                          <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                      </div>
                      <span className="font-medium">{insurance.name}</span>
                    </div>
                  ) : (
                    <span className="flex-1">{insurance.name}</span>
                  )}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === insurance.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Le champ de saisie pour "Autre assurance" est maintenant géré directement dans le formulaire principal */}
    </div>
  )
}
