"use client"

import { useState } from "react"
import Image from "next/image"
import { Check, ChevronDown } from "lucide-react"
import { insuranceCompanies, type InsuranceCompany } from "@/data/insurance-companies"
import { Button } from "@/components/ui/button"
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
}

export function InsuranceSelector({ value, onChange }: InsuranceSelectorProps) {
  const [open, setOpen] = useState(false)

  const selectedInsurance = insuranceCompanies.find(
    (insurance) => insurance.id === value
  )

  return (
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
              {selectedInsurance.logoUrl ? (
                <>
                  <Image
                    src={selectedInsurance.logoUrl}
                    alt={selectedInsurance.name}
                    width={80}
                    height={40}
                    className="h-8 w-auto object-contain"
                  />
                  <span className="font-medium">{selectedInsurance.name}</span>
                </>
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
                {insurance.logoUrl ? (
                  <div className="flex items-center gap-3 flex-1">
                    <Image
                      src={insurance.logoUrl}
                      alt={insurance.name}
                      width={80}
                      height={40}
                      className="h-8 w-auto object-contain"
                    />
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
  )
}
