import type React from "react"
import "@/styles/globals.css"
import "@/styles/layout.css"
import "@/styles/auto-scroll.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import WhatsAppButton from "@/components/whatsapp-button-new-fixed"
import CarDamageForm from "@/components/car-damage-form"
import { CarDamageFormProvider } from "@/components/car-damage-form-context"
import PartnerForm from "@/components/partner-form"
import { PartnerFormProvider } from "@/components/partner-form-context"
import { Toaster } from "@/components/ui/sonner"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SaaSify - Streamline Your Workflow",
  description: "Boost productivity, reduce costs, and scale your business with our all-in-one SaaS platform.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CarDamageFormProvider>
            <PartnerFormProvider>
              {children}
              <WhatsAppButton />
              <CarDamageForm />
              <PartnerForm />
              <Toaster />
            </PartnerFormProvider>
          </CarDamageFormProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
