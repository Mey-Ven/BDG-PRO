"use client"

import { useState, useEffect } from "react"
import { testimonials } from "../testimonials-data"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Check,
  ChevronRight,
  Menu,
  X,
  Moon,
  Sun,
  ArrowRight,
  Star,
  Layers,
} from "lucide-react"
import { useCarDamageForm } from "@/components/car-damage-form-context"
import { usePartnerForm } from "@/components/partner-form-context"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useTheme } from "next-themes"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { openForm } = useCarDamageForm()
  const { openForm: openPartnerForm } = usePartnerForm()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const features = [
    {
      title: "Remplacement de pare-brise",
      description: "Nous remplaçons votre pare-brise endommagé dans les meilleurs délais, avec des pièces de qualité d’origine.",
      icon: <Image src="/icons/exchange.png" alt="Tool icon" width={32} height={32} className="icn-service w-full h-full" />,
    },
    {
      title: "Réparation d’impact",
      description: "Une intervention rapide pour éviter le remplacement complet. Une solution simple, rapide et durable.",
      icon: <Image src="/icons/tool.png" alt="Exchange icon" width={32} height={32} className="icn-service w-full h-full" />,
    },
    {
      title: "Démarches simplifiées",
      description: "Bris de Glace Pro s’occupe de tout avec votre assurance : aucune avance de frais et zéro paperasse.",
      icon: <Image src="/icons/no-money.png" alt="Fast delivery icon" width={32} height={32} className="icn-service w-full h-full"/>,
    },
    {
      title: "Véhicule de courtoisie",
      description: "Un véhicule peut vous être prêté pendant l’intervention (selon disponibilité).",
      icon: <Image src="/icons/rapid.png" alt="Accreditation icon" width={32} height={32} className="icn-service w-full h-full" />,
    },
  ]

  return (

    <div className="flex min-h-[100dvh] flex-col">
      <header
        className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${isScrolled ? "bg-background/80 shadow-sm" : "bg-transparent"}`}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <div className="size-8 rounded-lg flex items-center justify-center overflow-hidden">
              <Image
                src="/logo.png"
                alt="Logo"
                width={34}
                height={34}
                className="w-full h-full object-cover"
              />
            </div>
            <span>BRIS DE GLACE</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Nos Services
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Avis de nos clients
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Questions fréquentes
            </Link>
          </nav>
          <div className="hidden md:flex gap-4 items-center">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button
              variant="outline"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground border-gray-300 dark:border-gray-700 rounded-full"
              onClick={openPartnerForm}
            >
              Devenir Partenaire
            </Button>
            <Button size="lg" className="rounded-full h-12 px-8 text-base shadow-md font-medium" onClick={openForm}>
              Prendre Rendez-Vous
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4 md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 inset-x-0 bg-background/95 backdrop-blur-lg border-b"
          >
            <div className="container py-4 flex flex-col gap-4">
              <Link href="#features" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Nos Services
              </Link>
              <Link href="#testimonials" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Avis de nos clients
              </Link>
              <Link href="#faq" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Questions fréquentes
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Button className="rounded-full" onClick={() => {
                  setMobileMenuOpen(false);
                  openForm();
                }}>
                  Prendre Rendez-Vous
                  <ChevronRight className="ml-1 size-4" />
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-gray-300 dark:border-gray-700 text-muted-foreground"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openPartnerForm();
                  }}
                >
                  Devenir Partenaire
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section id="hero" className="w-full min-h-screen flex items-center overflow-hidden relative pt-16 md:pt-0">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 -z-20">
            <Image
              src="/Pbr.jpg"
              alt="Hero Background"
              fill
              priority
              sizes="100vw"
              quality={90}
              className="object-cover object-center"
            />
          </div>

          {/* Dark Overlay with Gradient */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/95 via-background/80 to-background/95 dark:from-background/95 dark:via-background/90 dark:to-background/95"></div>

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 dark:opacity-20"></div>

          <div className="container px-4 md:px-6 relative py-8">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto backdrop-blur-sm bg-background/30 dark:bg-background/40 p-6 sm:p-8 rounded-xl shadow-lg border border-white/10 dark:border-white/5 rectangle-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground drop-shadow-md">
                Remplacez votre pare-brise gratuitement, rapidement et sans stress !
              </h1>
              <p className="text-lg md:text-xl text-foreground/90 dark:text-foreground/90 mb-8 max-w-2xl mx-auto drop-shadow-sm sous-ttr">
                Nous prenons en charge toutes les démarches avec votre assurance. Intervention rapide, zéro avance de frais, et un service client disponible 7j/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="rounded-full h-12 px-8 text-base shadow-md font-medium" onClick={openForm}>
                  Prendre Rendez-Vous
                  <ArrowRight className="ml-2 size-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full h-12 px-8 text-base bg-background/50 backdrop-blur-sm border-white/20 shadow-md hover:bg-background/70 text-foreground dark:text-foreground font-medium"
                  onClick={openPartnerForm}
                >
                 Devenir Partenaire
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm text-foreground/90 dark:text-foreground/90">
                <div className="flex items-center gap-1.5">
                  <div className="bg-primary/20 dark:bg-primary/30 rounded-full p-0.5">
                    <Check className="size-3.5 text-primary" />
                  </div>
                  <span className="font-medium">Intervention dans toute la France</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="bg-primary/20 dark:bg-primary/30 rounded-full p-0.5">
                    <Check className="size-3.5 text-primary" />
                  </div>
                  <span className="font-medium">Rendez-vous rapide en ligne ou par téléphone</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="bg-primary/20 dark:bg-primary/30 rounded-full p-0.5">
                    <Check className="size-3.5 text-primary" />
                  </div>
                  <span className="font-medium"> Techniciens spécialisés et certifiés</span>
                </div>
              </div>
            </motion.div>

{/*            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto max-w-5xl"
            >
              <div className="rounded-xl overflow-hidden shadow-2xl border border-border/40 bg-gradient-to-b from-background to-muted/20">
                <Image
                  src="https://cdn.dribbble.com/userupload/12302729/file/original-fa372845e394ee85bebe0389b9d86871.png?resize=1504x1128&vertical=center"
                  width={1280}
                  height={720}
                  alt="SaaSify dashboard"
                  className="w-full h-auto"
                  priority
                />
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70"></div>
              <div className="absolute -top-6 -left-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-3xl opacity-70"></div>
            </motion.div> */}
          </div>
        </section>

        {/* Logos Section */}
        <section className="w-full py-12 border-y bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="auto-scroll-container w-full max-w-6xl mx-auto">
                <div className="auto-scroll-content">
                  {/* First set of logos */}
                  <div className="auto-scroll-item flex items-center gap-8 md:gap-12 lg:gap-16 px-4">
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/215qHZGc7EzIafdHB5MciT/bbef49e5967b249b2e01be80a828d684/allianz.png"
                      alt="Allianz"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/1ygxiGg6eWEOigywuMzXpD/16649cf7d620cd8dcae716b4f1c04c61/lesfurets-assurance.png"
                      alt="Les Furets Assurance"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/6ifTaYrff8B3vIObBRq3zi/20a17dd2546b2aecc7135b0e79512bdd/acommeassure.png"
                      alt="A Comme Assure"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/2706V8Z5TSwwfPVsdq0meq/d1a1b8e3e24e72fc52e0dd013e1574a1/active-assurances.png"
                      alt="Active Assurances"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/Y1Y90frEngKCco3XRmpuo/9a733abe05b4a440986582f881ba7944/aon.png"
                      alt="AON"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/9x5lRd2SdX94TZAOvGklA/7d4832ca678ca77713a3b9ac9e549d9f/areas.png"
                      alt="Areas"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/58rb7BnDz38ausmhKe0cfN/ad32fecd11ff725e2f3d999e621928da/assu2000.png"
                      alt="Assu 2000"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/4AHYXYIUKINriNLr5D9dY0/aa83d7a4b09824e1e8af37e6cb5a602e/assudika.png"
                      alt="Assudika"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/6QuuKP2WHMCTjORNAvpq7Y/24d98e10f0a98392e4b86964c14be44d/assureo.png"
                      alt="Assureo"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                  </div>

                  {/* Duplicate the logos to create a seamless loop */}
                  <div className="auto-scroll-item flex items-center gap-8 md:gap-12 lg:gap-16 px-4">
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/215qHZGc7EzIafdHB5MciT/bbef49e5967b249b2e01be80a828d684/allianz.png"
                      alt="Allianz"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/1ygxiGg6eWEOigywuMzXpD/16649cf7d620cd8dcae716b4f1c04c61/lesfurets-assurance.png"
                      alt="Les Furets Assurance"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />

                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/6ifTaYrff8B3vIObBRq3zi/20a17dd2546b2aecc7135b0e79512bdd/acommeassure.png"
                      alt="A Comme Assure"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/2706V8Z5TSwwfPVsdq0meq/d1a1b8e3e24e72fc52e0dd013e1574a1/active-assurances.png"
                      alt="Active Assurances"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/Y1Y90frEngKCco3XRmpuo/9a733abe05b4a440986582f881ba7944/aon.png"
                      alt="AON"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/9x5lRd2SdX94TZAOvGklA/7d4832ca678ca77713a3b9ac9e549d9f/areas.png"
                      alt="Areas"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/58rb7BnDz38ausmhKe0cfN/ad32fecd11ff725e2f3d999e621928da/assu2000.png"
                      alt="Assu 2000"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/4AHYXYIUKINriNLr5D9dY0/aa83d7a4b09824e1e8af37e6cb5a602e/assudika.png"
                      alt="Assudika"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/6QuuKP2WHMCTjORNAvpq7Y/24d98e10f0a98392e4b86964c14be44d/assureo.png"
                      alt="Assureo"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                  </div>
                </div>
              </div>

              {/* Second row with opposite direction */}
              <div className="auto-scroll-container w-full max-w-6xl mx-auto mt-8">
                <div className="auto-scroll-content" style={{ animationDirection: 'reverse' }}>
                  {/* First set of logos */}
                  <div className="auto-scroll-item flex items-center gap-8 md:gap-12 lg:gap-16 px-4">
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/6efKw86nImxJ1WsbxSJXhK/268fc2154b4f89594d364cb46b3152ef/assuronline.png"
                      alt="Assur Online"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/3l0tdCOYly0y9PoJLnjZ1O/6b3a886f03ec9fd125a5d923c3c3c0f1/assurpeople.png"
                      alt="Assur People"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/2sKIhBwMMcdGM1b56xS4m0/0cf3ee23ce8ec4a2a9ca33af5dd2c5f5/BestAssurances_logo2025.png"
                      alt="Best Assurances"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/4cWEYQNpzPEysV5k78MLbU/6b28e24a76609489c00f9f022ab1b08e/direct-assurance.png"
                      alt="Direct Assurance"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/72MMYU5fvtDrvkwPw7bpVO/74af51bab34a13260d0681c513ce204a/elsassur.png"
                      alt="Elsassur"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/5VOxKVWPmdgjMZhb07pMSH/84c0c069767862a5f9f19cc09c4f4cb0/euroassurance.png"
                      alt="Euro Assurance"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/2yfBNWhPl6CrFHa9BuXbPI/0877ce48cee243520a4f7d3bf6a2403a/Logo_Eurofil__1_.png"
                      alt="Eurofil"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/1Oewg2RLnMMc2MzLOwofjB/cc5848a9f9430044cea2608566a9fc87/flitter.png"
                      alt="Flitter"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/3VKRGPmO0FkfyoxnZMQgVB/f743c9bbca7fc43672fbfee1339af203/l-olivier-assurances.png"
                      alt="L'Olivier Assurances"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/37GdPLu6NCT1Rs56oYkfVz/cbc206cd2534835a42452de5115a8088/leocare.png"
                      alt="Leocare"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                  </div>

                  {/* Duplicate the logos to create a seamless loop */}
                  <div className="auto-scroll-item flex items-center gap-8 md:gap-12 lg:gap-16 px-4">
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/6efKw86nImxJ1WsbxSJXhK/268fc2154b4f89594d364cb46b3152ef/assuronline.png"
                      alt="Assur Online"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/3l0tdCOYly0y9PoJLnjZ1O/6b3a886f03ec9fd125a5d923c3c3c0f1/assurpeople.png"
                      alt="Assur People"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/2sKIhBwMMcdGM1b56xS4m0/0cf3ee23ce8ec4a2a9ca33af5dd2c5f5/BestAssurances_logo2025.png"
                      alt="Best Assurances"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/4cWEYQNpzPEysV5k78MLbU/6b28e24a76609489c00f9f022ab1b08e/direct-assurance.png"
                      alt="Direct Assurance"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/72MMYU5fvtDrvkwPw7bpVO/74af51bab34a13260d0681c513ce204a/elsassur.png"
                      alt="Elsassur"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/5VOxKVWPmdgjMZhb07pMSH/84c0c069767862a5f9f19cc09c4f4cb0/euroassurance.png"
                      alt="Euro Assurance"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/2yfBNWhPl6CrFHa9BuXbPI/0877ce48cee243520a4f7d3bf6a2403a/Logo_Eurofil__1_.png"
                      alt="Eurofil"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/1Oewg2RLnMMc2MzLOwofjB/cc5848a9f9430044cea2608566a9fc87/flitter.png"
                      alt="Flitter"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/3VKRGPmO0FkfyoxnZMQgVB/f743c9bbca7fc43672fbfee1339af203/l-olivier-assurances.png"
                      alt="L'Olivier Assurances"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/37GdPLu6NCT1Rs56oYkfVz/cbc206cd2534835a42452de5115a8088/leocare.png"
                      alt="Leocare"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                  </div>
                </div>
              </div>

              {/* Third row with normal direction */}
              <div className="auto-scroll-container w-full max-w-6xl mx-auto mt-8">
                <div className="auto-scroll-content" style={{ animationDuration: '50s' }}>
                  {/* First set of logos */}
                  <div className="auto-scroll-item flex items-center gap-8 md:gap-12 lg:gap-16 px-4">
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/7JG7KT8dkPoLegNm68RuYc/2c0a73ace73dee706fd8f0e1a798582e/lovys.png"
                      alt="Lovys"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/7HYNsAzHbgFhR9hZsSjmSM/0f1a582bf2234e4a8a49cf5e2fb285a4/LOGO_MeilleurTauxAssurances.png"
                      alt="Meilleur Taux Assurances"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/11YaYR2DG5JuakAahOhYJF/ae8a209863e1445f84fbfab12539c029/mieux-assure.png"
                      alt="Mieux Assure"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/6fojsjcfbPAHk6k5qX1ZNA/9f45d8c2b4f75c7b03adc199c67a5ed7/ornikar-assurances.png"
                      alt="Ornikar Assurances"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/yk2XMcPnQvKakJ3wPWSpe/160a0c77dadafbd2171a1917ecfdbe00/Selfassurance-nouveau_logo-vert_2_.png"
                      alt="Self Assurance"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/4VdliocC78HmQ48E2nhCrL/7f816beae4a37c266cde88e956d31053/sos-malus.png"
                      alt="SOS Malus"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/3QRuqQBYuTX7fad3ixXK81/9c3bba59aebf02cacbcc9ecb5f98ef26/teacerede.png"
                      alt="Teacerede"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/10pobPJbu9njyqWKPTbQav/f6c5feb494126ec32a5e6d9acf9dbe3a/wilov.png"
                      alt="Wilov"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/4KfURhIjRx8oS4I15rml4z/ef04dfaa6aff54c935b01b0ed6a3d72a/Logo-YouDrive-Direct-Assurance-new.jpg"
                      alt="YouDrive Direct Assurance"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/1jBzG6mDgsv4f49NGE3y0u/927e929174312378c80acd519cea74e4/logo-abeille-assurances.jpg"
                      alt="Abeille Assurances"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                  </div>

                  {/* Duplicate the logos to create a seamless loop */}
                  <div className="auto-scroll-item flex items-center gap-8 md:gap-12 lg:gap-16 px-4">
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/7JG7KT8dkPoLegNm68RuYc/2c0a73ace73dee706fd8f0e1a798582e/lovys.png"
                      alt="Lovys"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/7HYNsAzHbgFhR9hZsSjmSM/0f1a582bf2234e4a8a49cf5e2fb285a4/LOGO_MeilleurTauxAssurances.png"
                      alt="Meilleur Taux Assurances"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/11YaYR2DG5JuakAahOhYJF/ae8a209863e1445f84fbfab12539c029/mieux-assure.png"
                      alt="Mieux Assure"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/6fojsjcfbPAHk6k5qX1ZNA/9f45d8c2b4f75c7b03adc199c67a5ed7/ornikar-assurances.png"
                      alt="Ornikar Assurances"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/yk2XMcPnQvKakJ3wPWSpe/160a0c77dadafbd2171a1917ecfdbe00/Selfassurance-nouveau_logo-vert_2_.png"
                      alt="Self Assurance"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/4VdliocC78HmQ48E2nhCrL/7f816beae4a37c266cde88e956d31053/sos-malus.png"
                      alt="SOS Malus"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/3QRuqQBYuTX7fad3ixXK81/9c3bba59aebf02cacbcc9ecb5f98ef26/teacerede.png"
                      alt="Teacerede"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/10pobPJbu9njyqWKPTbQav/f6c5feb494126ec32a5e6d9acf9dbe3a/wilov.png"
                      alt="Wilov"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/4KfURhIjRx8oS4I15rml4z/ef04dfaa6aff54c935b01b0ed6a3d72a/Logo-YouDrive-Direct-Assurance-new.jpg"
                      alt="YouDrive Direct Assurance"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src="https://images.ctfassets.net/8tpbxzn2rg50/1jBzG6mDgsv4f49NGE3y0u/927e929174312378c80acd519cea74e4/logo-abeille-assurances.jpg"
                      alt="Abeille Assurances"
                      width={250}
                      height={190}
                      className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Images Section */}
        <section className="w-full py-16 bg-gradient-to-b from-background to-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Notre expertise à votre service
              </h2>
              <p className="text-muted-foreground text-lg max-w-[800px] mx-auto">
                Des professionnels qualifiés pour tous vos besoins de remplacement et réparation de pare-brise
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="group relative overflow-hidden rounded-xl shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/10 z-10"></div>
                <Image
                  src="/pbr2.jpg"
                  alt="Remplacement de pare-brise"
                  width={800}
                  height={500}
                  className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">Remplacement professionnel</h3>
                  <p className="text-white/90 mb-4">
                    Nos techniciens certifiés utilisent des équipements de pointe pour un remplacement rapide et sécurisé de votre pare-brise.
                  </p>
                  <Button
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                    onClick={openForm}
                  >
                    Prendre rendez-vous
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="group relative overflow-hidden rounded-xl shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/10 z-10"></div>
                <Image
                  src="/pbr3.jpg"
                  alt="Réparation d'impact"
                  width={800}
                  height={500}
                  className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">Réparation d'impact</h3>
                  <p className="text-white/90 mb-4">
                    Une intervention rapide sur un impact peut éviter le remplacement complet. Nos experts évaluent et réparent les dommages mineurs.
                  </p>
                  <Button
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                    onClick={() => {
                      const message = "Bonjour, je souhaite obtenir plus d'informations sur une réparation d'impact sur mon pare-brise.";
                      const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.replace(/\+/g, '') || "+33685041049";
                      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                  >
                    Demander plus d'informations
                    <Image src="/icons/whatsapp.png" alt="WhatsApp" width={16} height={16} className="ml-2 size-4 invert" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              {/*<h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simple Process, Powerful Results</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Get started in minutes and see the difference our platform can make for your business.
              </p>*/}
            </motion.div>

            <div className="grid grid-cols-4 md:grid-cols-4 gap-2 md:gap-12 relative">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0"></div>

              {[
                {
                  step: <Image src="/icons/money.png" alt="Tool icon" width={32} height={32} className="mx-auto invert" />,
                  title: "Rien à avancer",
                  description: "Quel aue soit votre assureur.",
                },
                {
                  step: <Image src="/icons/fast-delivery.png" alt="Tool icon" width={32} height={32} className="mx-auto invert" />,
                  title: "Déplacement gratuit",
                  description: "Partout en france.",
                },
                {
                  step: <Image src="/icons/accreditation.png" alt="Tool icon" width={32} height={32} className="mx-auto invert" />,
                  title: "Garantie à vie",
                  description: "Toute intervention vitrage.",
                },
                {
                  step: <Image src="/icons/gift-box.png" alt="Tool icon" width={32} height={32} className="mx-auto invert" />,
                  title: "Cadeaux",
                  description: "Jusqu’a 250€",
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative z-10 flex flex-col items-center text-center space-y-1 sm:space-y-2 md:space-y-4"
                >
                  <div className="flex h-8 w-8 sm:h-12 md:h-16 sm:w-12 md:w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xs sm:text-sm md:text-xl font-bold shadow-lg">
                    <div className="size-4 sm:size-6 md:size-8">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-[10px] sm:text-sm md:text-xl font-bold">{step.title}</h3>
                  <p className="text-[8px] sm:text-xs md:text-base text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Nos services</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Remplacement vitrage automobile ( pare-brise )
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-2 grid-cols-4 md:grid-cols-2 lg:grid-cols-4"
            >
              {features.map((feature, i) => (
                <motion.div key={i} variants={item}>
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                    <CardContent className="p-1 sm:p-3 md:p-6 flex flex-col h-full">
                      <div className="size-6 sm:size-8 md:size-10 rounded-full bg-[hsl(221,83%,53%)] flex items-center justify-center mb-1 sm:mb-2 md:mb-4 mx-auto">
                        <div className="size-3 sm:size-4 md:size-5 text-white">
                          {feature.icon}
                        </div>
                      </div>
                      <h3 className="text-[10px] sm:text-xs md:text-xl font-bold mb-0.5 sm:mb-1 md:mb-2 text-center">{feature.title}</h3>
                      <p className="text-[8px] sm:text-xs md:text-base text-muted-foreground text-center">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
              scale: {
                type: "spring",
                stiffness: 100,
                damping: 15
              }
            }}
            className="w-full max-w-[1400px] mx-auto overflow-hidden"
            style={{ marginTop: "50px" }}
            whileHover={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)"
            }}
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10 transform transition-all duration-300 hover:translate-y-[-5px]">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/20 to-transparent z-10"
              />
              <Image
                src="/pub.jpg"
                alt="Promotion Bris de Glace - Remplacement de pare-brise gratuit"
                width={1920}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
                className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20"
              >
                {/* <div className="bg-black/40 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20">
                  <h3 className="text-white font-bold text-lg md:text-2xl drop-shadow-md">
                    Promotion exceptionnelle
                  </h3>
                </div>*/}
              </motion.div>
            </div>
          </motion.div>
        </section>



        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Avis de nos clients</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Ils nous ont fait confiance, voici leur retour
              </p>
            </motion.div>

            <div className="relative">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {[
                    [
                      {
                        quote:
                          "Service ultra rapide ! J’ai rempli le formulaire en ligne et j’ai été rappelé dans la foulée. Mon pare-brise a été remplacé le lendemain à mon domicile. Je recommande à 200 %.",
                        author: "Nadia L.",
                        role: "Strasbourg",
                        rating: 5,
                      },
                      {
                        quote:
                          "Franchement bluffé ! Aucun frais à payer, ils ont tout pris en charge avec mon assurance. Technicien ponctuel, travail propre, et en plus très sympa.",
                        author: "Yassine M.",
                        role: "Montpellier",
                        rating: 5,
                      },
                      {
                        quote:
                          "Le service client est très réactif. Je devais partir en vacances, ils m’ont trouvé un créneau en urgence. Mon pare-brise a été changé en moins de 2h. Rien à dire.",
                        author: "Céline T.",
                        role: "Nantes",
                        rating: 5,
                      },
                      {
                        quote:
                          "Intervention rapide et professionnelle. Le technicien a pris le temps de m'expliquer toutes les étapes. Très satisfait du résultat !",
                        author: "Thomas B.",
                        role: "Bordeaux",
                        rating: 5,
                      },
                    ],
                    [
                      {
                        quote:
                          "Un service impeccable, rapide et sans prise de tête. Ils ont tout géré avec mon assurance. Merci Bris de Glace Pro !",
                        author: "Mehdi M.",
                        role: "Lyon",
                        rating: 5,
                      },
                      {
                        quote:
                          "J’ai été rappelé en moins de 10 minutes après ma demande en ligne. Intervention dès le lendemain. Top service.",
                        author: "Julie O.",
                        role: "Lille",
                        rating: 5,
                      },
                      {
                        quote:
                          "Je ne pensais pas que ce serait aussi simple. J’ai envoyé une photo de l’impact par WhatsApp, on m’a confirmé le remplacement gratuit et le technicien est venu le lendemain. Très pro.",
                        author: "David R.",
                        role: "Dijon",
                        rating: 5,
                      },
                      {
                        quote:
                          "Excellente expérience ! Prise en charge complète avec mon assurance et remplacement effectué en moins de 2 heures. Je recommande vivement.",
                        author: "Sophie M.",
                        role: "Toulouse",
                        rating: 5,
                      },
                    ],
                  ].map((group, groupIndex) => (
                    <CarouselItem key={groupIndex} className="md:basis-full">
                      <div className="grid gap-2 grid-cols-4 md:grid-cols-4">
                        {group.map((testimonial, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                          >
                            <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                              <CardContent className="p-1 sm:p-3 md:p-6 flex flex-col h-full">
                                <div className="flex mb-1 sm:mb-2 md:mb-4 justify-start">
                                  {Array(testimonial.rating)
                                    .fill(0)
                                    .map((_, j) => (
                                      <Star key={j} className="size-2 sm:size-3 md:size-4 text-yellow-500 fill-yellow-500" />
                                    ))}
                                </div>
                                <p className="text-[8px] sm:text-xs md:text-lg mb-1 sm:mb-3 md:mb-6 flex-grow text-left">{testimonial.quote}</p>
                                <div className="flex flex-row items-center gap-2 sm:gap-3 md:gap-4 mt-auto pt-1 sm:pt-2 md:pt-4 border-t border-border/40">
                                  <div className="size-4 sm:size-6 md:size-10 rounded-full bg-muted flex items-center justify-center text-foreground font-medium text-[8px] sm:text-xs md:text-base shrink-0">
                                    {testimonial.author.charAt(0)}
                                  </div>
                                  <div className="text-left">
                                    <p className="text-[8px] sm:text-xs md:text-base font-medium">{testimonial.author}</p>
                                    <p className="text-[6px] sm:text-[8px] md:text-sm text-muted-foreground">{testimonial.role}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-8">
                  <CarouselPrevious className="static translate-y-0 mr-2" />
                  <CarouselNext className="static translate-y-0 ml-2" />
                </div>
              </Carousel>
            </div>
          </div>
        </section>

        {/* Pricing Section
        <section id="pricing" className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                Pricing
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Choose the plan that's right for your business. All plans include a 14-day free trial.
              </p>
            </motion.div>

            <div className="mx-auto max-w-5xl">
              <Tabs defaultValue="monthly" className="w-full">
                <div className="flex justify-center mb-8">
                  <TabsList className="rounded-full p-1">
                    <TabsTrigger value="monthly" className="rounded-full px-6">
                      Monthly
                    </TabsTrigger>
                    <TabsTrigger value="annually" className="rounded-full px-6">
                      Annually (Save 20%)
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="monthly">
                  <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                    {[
                      {
                        name: "Starter",
                        price: "$29",
                        description: "Perfect for small teams and startups.",
                        features: ["Up to 5 team members", "Basic analytics", "5GB storage", "Email support"],
                        cta: "Start Free Trial",
                      },
                      {
                        name: "Professional",
                        price: "$79",
                        description: "Ideal for growing businesses.",
                        features: [
                          "Up to 20 team members",
                          "Advanced analytics",
                          "25GB storage",
                          "Priority email support",
                          "API access",
                        ],
                        cta: "Start Free Trial",
                        popular: true,
                      },
                      {
                        name: "Enterprise",
                        price: "$199",
                        description: "For large organizations with complex needs.",
                        features: [
                          "Unlimited team members",
                          "Custom analytics",
                          "Unlimited storage",
                          "24/7 phone & email support",
                          "Advanced API access",
                          "Custom integrations",
                        ],
                        cta: "Contact Sales",
                      },
                    ].map((plan, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                      >
                        <Card
                          className={`relative overflow-hidden h-full ${plan.popular ? "border-primary shadow-lg" : "border-border/40 shadow-md"} bg-gradient-to-b from-background to-muted/10 backdrop-blur`}
                        >
                          {plan.popular && (
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                              Most Popular
                            </div>
                          )}
                          <CardContent className="p-6 flex flex-col h-full">
                            <h3 className="text-2xl font-bold">{plan.name}</h3>
                            <div className="flex items-baseline mt-4">
                              <span className="text-4xl font-bold">{plan.price}</span>
                              <span className="text-muted-foreground ml-1">/month</span>
                            </div>
                            <p className="text-muted-foreground mt-2">{plan.description}</p>
                            <ul className="space-y-3 my-6 flex-grow">
                              {plan.features.map((feature, j) => (
                                <li key={j} className="flex items-center">
                                  <Check className="mr-2 size-4 text-primary" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                            <Button
                              className={`w-full mt-auto rounded-full ${plan.popular ? "bg-primary hover:bg-primary/90" : "bg-muted hover:bg-muted/80"}`}
                              variant={plan.popular ? "default" : "outline"}
                            >
                              {plan.cta}
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="annually">
                  <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                    {[
                      {
                        name: "Starter",
                        price: "$23",
                        description: "Perfect for small teams and startups.",
                        features: ["Up to 5 team members", "Basic analytics", "5GB storage", "Email support"],
                        cta: "Start Free Trial",
                      },
                      {
                        name: "Professional",
                        price: "$63",
                        description: "Ideal for growing businesses.",
                        features: [
                          "Up to 20 team members",
                          "Advanced analytics",
                          "25GB storage",
                          "Priority email support",
                          "API access",
                        ],
                        cta: "Start Free Trial",
                        popular: true,
                      },
                      {
                        name: "Enterprise",
                        price: "$159",
                        description: "For large organizations with complex needs.",
                        features: [
                          "Unlimited team members",
                          "Custom analytics",
                          "Unlimited storage",
                          "24/7 phone & email support",
                          "Advanced API access",
                          "Custom integrations",
                        ],
                        cta: "Contact Sales",
                      },
                    ].map((plan, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                      >
                        <Card
                          className={`relative overflow-hidden h-full ${plan.popular ? "border-primary shadow-lg" : "border-border/40 shadow-md"} bg-gradient-to-b from-background to-muted/10 backdrop-blur`}
                        >
                          {plan.popular && (
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                              Most Popular
                            </div>
                          )}
                          <CardContent className="p-6 flex flex-col h-full">
                            <h3 className="text-2xl font-bold">{plan.name}</h3>
                            <div className="flex items-baseline mt-4">
                              <span className="text-4xl font-bold">{plan.price}</span>
                              <span className="text-muted-foreground ml-1">/month</span>
                            </div>
                            <p className="text-muted-foreground mt-2">{plan.description}</p>
                            <ul className="space-y-3 my-6 flex-grow">
                              {plan.features.map((feature, j) => (
                                <li key={j} className="flex items-center">
                                  <Check className="mr-2 size-4 text-primary" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                            <Button
                              className={`w-full mt-auto rounded-full ${plan.popular ? "bg-primary hover:bg-primary/90" : "bg-muted hover:bg-muted/80"}`}
                              variant={plan.popular ? "default" : "outline"}
                            >
                              {plan.cta}
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>*/}

        {/* FAQ Section */}
        <section id="faq" className="w-full py-20 md:py-32 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 dark:opacity-20"></div>

          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Questions fréquentes</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Voici les réponses aux questions fréquentes de nos clients.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* FAQ Accordion */}
              <div className="order-2 lg:order-1">
                <Accordion type="single" collapsible className="w-full">
                  {[
                    {
                      question: "Le remplacement est-il vraiment gratuit ?",
                      answer:
                        "Oui, si vous êtes assuré bris de glace sans franchise. Sinon, nous vous proposons un devis clair et sans surprise.",
                    },
                    {
                      question: "Comment prendre rendez-vous ?",
                      answer:
                        "Remplissez notre formulaire en ligne ou appelez-nous. Un conseiller vous rappelle dans les 10 minutes.",
                    },
                    {
                      question: " Combien de temps dure l'intervention ?",
                      answer:
                        "Environ 1h30. Nous vous indiquons le temps exact selon votre véhicule.",
                    },
                    {
                      question: "Intervenez-vous dans toute la France ?",
                      answer:
                        "Oui, notre réseau de techniciens couvre l'ensemble du territoire français. Nous intervenons à domicile ou sur votre lieu de travail.",
                    },
                    {
                      question: "Quels types de vitres remplacez-vous ?",
                      answer:
                        "Nous remplaçons tous types de vitres : pare-brise, vitres latérales, lunette arrière et toit panoramique, pour tous les modèles de véhicules.",
                    },
                  ].map((faq, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <AccordionItem value={`item-${i}`} className="border-b border-border/40 py-2">
                        <AccordionTrigger className="text-left font-medium hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              </div>

              {/* France Map SVG */}
              <motion.div
                className="order-1 lg:order-2 flex justify-center"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative max-w-md w-full">
                  {/* SVG Map container without shadow */}
                  <div className="relative p-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      {/* SVG Map of France with exact geographical contour */}
                      <div className="w-full aspect-square relative">
                        <object
                          type="image/svg+xml"
                          data="/map.svg"
                          className="w-full h-full"
                          aria-label="Carte de France - Intervention dans toute la France"
                        >
                          <img
                            src="/images/Map.png"
                            alt="Carte de France - Intervention dans toute la France"
                            className="w-full h-auto object-contain"
                          />
                        </object>

                        {/* No overlay for a cleaner look */}

                        {/* Label */}
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                          <span className="bg-primary/90 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                            Intervention dans toute la France
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

      </main>
      <footer className="w-full border-t bg-[hsl(221,83%,53%)]/10 backdrop-blur-sm">
        <div className="container flex flex-col gap-4 px-4 py-6 md:px-6 md:py-8">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-4">
          <div className="flex items-center gap-2 font-bold">
            <div className="size-8 rounded-lg flex items-center justify-center overflow-hidden">
              <Image
                src="/logo.png"
                alt="Logo"
                width={34}
                height={34}
                className="w-full h-full object-cover"
              />
            </div>
            <span>BRIS DE GLACE</span>
          </div>
              <p className="text-sm text-muted-foreground">
                Avec Bris de Glace Pro, bénéficiez d’un remplacement ou d’une réparation de pare-brise 100% gratuit, rapide et sans avance de frais. Notre équipe s’occupe de tout, où que vous soyez en France, avec un service client disponible 7j/7.
              </p>
{/*              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div> */}
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#hero" className="text-muted-foreground hover:text-foreground transition-colors">
                    Acceuil
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                    Nos Services
                  </Link>
                </li>
                <li>
                  <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                    Avis de nos Clients
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                    Questions fréquentes
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row justify-between items-center border-t border-border/40 pt-8">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} BRIS DE GLACE. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
