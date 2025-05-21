import type React from "react"
import "@/styles/globals.css"
import "@/styles/layout.css"
import "@/styles/auto-scroll.css"
import "@/styles/map.css"
import "@/styles/loading.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth/auth-context"
import WhatsAppButton from "@/components/whatsapp-button-new-fixed"
import CarDamageForm from "@/components/car-damage-form"
import { CarDamageFormProvider } from "@/components/car-damage-form-context"
import PartnerForm from "@/components/partner-form"
import { PartnerFormProvider } from "@/components/partner-form-context"
import { Toaster } from "@/components/ui/sonner"
import SmoothScroll from "@/components/smooth-scroll"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bris De Glace Pro",
  description: "Remplacement ou réparation de pare-brise 100% gratuit, rapide et sans avance de frais. Service client disponible 7j/7.",
  icons: {
    icon: '/Logo-ong.png',
    apple: '/Logo-ong.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CarDamageFormProvider>
              <PartnerFormProvider>
                {children}
                <WhatsAppButton />
                <CarDamageForm />
                <PartnerForm />
                <Toaster />
                <SmoothScroll />
              </PartnerFormProvider>
            </CarDamageFormProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
