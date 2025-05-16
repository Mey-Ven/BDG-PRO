"use client"

import { useState, useEffect } from "react"
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
  Zap,
  Shield,
  Users,
  BarChart,
  Layers,
} from "lucide-react"
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
      title: "Smart Automation",
      description: "Automate repetitive tasks and workflows to save time and reduce errors.",
      icon: <Zap className="size-5" />,
    },
    {
      title: "Advanced Analytics",
      description: "Gain valuable insights with real-time data visualization and reporting.",
      icon: <BarChart className="size-5" />,
    },
    {
      title: "Team Collaboration",
      description: "Work together seamlessly with integrated communication tools.",
      icon: <Users className="size-5" />,
    },
    {
      title: "Enterprise Security",
      description: "Keep your data safe with end-to-end encryption and compliance features.",
      icon: <Shield className="size-5" />,
    },
    {
      title: "Seamless Integration",
      description: "Connect with your favorite tools through our extensive API ecosystem.",
      icon: <Layers className="size-5" />,
    },
    {
      title: "24/7 Support",
      description: "Get help whenever you need it with our dedicated support team.",
      icon: <Star className="size-5" />,
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
              Services
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Services
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              FAQ
            </Link>
          </nav>
          <div className="hidden md:flex gap-4 items-center">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Devenir Partenaire
            </Link>
            <Button className="rounded-full">
              Get Started
              <ChevronRight className="ml-1 size-4" />
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
                Services
              </Link>
              <Link href="#testimonials" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Testimonials
              </Link>
              <Link href="#pricing" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </Link>
              <Link href="#faq" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                FAQ
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Link href="#" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Log in
                </Link>
                <Button className="rounded-full">
                  Get Started
                  <ChevronRight className="ml-1 size-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full min-h-screen flex items-center overflow-hidden relative pt-16 md:pt-0">
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
                <Button size="lg" className="rounded-full h-12 px-8 text-base shadow-md font-medium">
                  Start Free Trial
                  <ArrowRight className="ml-2 size-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full h-12 px-8 text-base bg-background/50 backdrop-blur-sm border-white/20 shadow-md hover:bg-background/70 text-foreground dark:text-foreground font-medium"
                >
                  Book a Demo
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm text-foreground/90 dark:text-foreground/90">
                <div className="flex items-center gap-1.5">
                  <div className="bg-primary/20 dark:bg-primary/30 rounded-full p-0.5">
                    <Check className="size-3.5 text-primary" />
                  </div>
                  <span className="font-medium">No credit card</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="bg-primary/20 dark:bg-primary/30 rounded-full p-0.5">
                    <Check className="size-3.5 text-primary" />
                  </div>
                  <span className="font-medium">14-day trial</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="bg-primary/20 dark:bg-primary/30 rounded-full p-0.5">
                    <Check className="size-3.5 text-primary" />
                  </div>
                  <span className="font-medium">Cancel anytime</span>
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

            <div className="grid md:grid-cols-4 gap-8 md:gap-12 relative">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0"></div>

              {[
                {
                  step: <Image src="/icons/money.png" alt="Tool icon" width={32} height={32} className="mx-auto invert" />,
                  title: "Create Account",
                  description: "Sign up in seconds with just your email. No credit card required to get started.",
                },
                {
                  step: <Image src="/icons/fast-delivery.png" alt="Tool icon" width={32} height={32} className="mx-auto invert" />,
                  title: "Configure Workspace",
                  description: "Customize your workspace to match your team's unique workflow and requirements.",
                },
                {
                  step: <Image src="/icons/gift-box.png" alt="Tool icon" width={32} height={32} className="mx-auto invert" />,
                  title: "Boost Productivity",
                  description: "Start using our powerful features to streamline processes and achieve your goals.",
                },
                {
                  step: <Image src="/icons/accreditation.png" alt="Tool icon" width={32} height={32} className="mx-auto invert" />,
                  title: "......",
                  description: ".................",
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative z-10 flex flex-col items-center text-center space-y-4"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xl font-bold shadow-lg">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
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
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything You Need to Succeed</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Our comprehensive platform provides all the tools you need to streamline your workflow, boost
                productivity, and achieve your goals.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {features.map((feature, i) => (
                <motion.div key={i} variants={item}>
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="size-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
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
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                Testimonials
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Avis de nos clients</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Don't just take our word for it. See what our customers have to say about their experience.
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
                    ],
                  ].map((group, groupIndex) => (
                    <CarouselItem key={groupIndex} className="md:basis-full">
                      <div className="grid gap-6 md:grid-cols-3">
                        {group.map((testimonial, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                          >
                            <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                              <CardContent className="p-6 flex flex-col h-full">
                                <div className="flex mb-4">
                                  {Array(testimonial.rating)
                                    .fill(0)
                                    .map((_, j) => (
                                      <Star key={j} className="size-4 text-yellow-500 fill-yellow-500" />
                                    ))}
                                </div>
                                <p className="text-lg mb-6 flex-grow">{testimonial.quote}</p>
                                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/40">
                                  <div className="size-10 rounded-full bg-muted flex items-center justify-center text-foreground font-medium">
                                    {testimonial.author.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-medium">{testimonial.author}</p>
                                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
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

        {/* Pricing Section */}
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
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                FAQ
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Find answers to common questions about our platform.
              </p>
            </motion.div>

            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: "How does the 14-day free trial work?",
                    answer:
                      "Our 14-day free trial gives you full access to all features of your selected plan. No credit card is required to sign up, and you can cancel at any time during the trial period with no obligation.",
                  },
                  {
                    question: "Can I change plans later?",
                    answer:
                      "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the new pricing will be prorated for the remainder of your billing cycle. If you downgrade, the new pricing will take effect at the start of your next billing cycle.",
                  },
                  {
                    question: "Is there a limit to how many users I can add?",
                    answer:
                      "The number of users depends on your plan. The Starter plan allows up to 5 team members, the Professional plan allows up to 20, and the Enterprise plan has no limit on team members.",
                  },
                  {
                    question: "Do you offer discounts for nonprofits or educational institutions?",
                    answer:
                      "Yes, we offer special pricing for nonprofits, educational institutions, and open-source projects. Please contact our sales team for more information.",
                  },
                  {
                    question: "How secure is my data?",
                    answer:
                      "We take security very seriously. All data is encrypted both in transit and at rest. We use industry-standard security practices and regularly undergo security audits. Our platform is compliant with GDPR, CCPA, and other relevant regulations.",
                  },
                  {
                    question: "What kind of support do you offer?",
                    answer:
                      "Support varies by plan. All plans include email support, with the Professional plan offering priority email support. The Enterprise plan includes 24/7 phone and email support. We also have an extensive knowledge base and community forum available to all users.",
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
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-6 text-center"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Ready to Transform Your Workflow?
              </h2>
              <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
                Join thousands of satisfied customers who have streamlined their processes and boosted productivity with
                our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button size="lg" variant="secondary" className="rounded-full h-12 px-8 text-base">
                  Start Free Trial
                  <ArrowRight className="ml-2 size-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full h-12 px-8 text-base bg-transparent border-white text-white hover:bg-white/10"
                >
                  Schedule a Demo
                </Button>
              </div>
              <p className="text-sm text-primary-foreground/80 mt-4">
                No credit card required. 14-day free trial. Cancel anytime.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background/95 backdrop-blur-sm">
        <div className="container flex flex-col gap-8 px-4 py-10 md:px-6 lg:py-16">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold">
                <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
                  S
                </div>
                <span>SaaSify</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Streamline your workflow with our all-in-one SaaS platform. Boost productivity and scale your business.
              </p>
              <div className="flex gap-4">
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
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row justify-between items-center border-t border-border/40 pt-8">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} SaaSify. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
