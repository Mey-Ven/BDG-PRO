"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false)

  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "+33000000000"

  // Utilisation d'une méthode alternative pour les emojis
  // Au lieu d'utiliser des emojis Unicode directement, nous utilisons leur représentation textuelle
  const messageText = "C'est Bris de Glace Pro (wave)\n\nBonne nouvelle ! Votre remplacement de pare-brise est 100% gratuit si vous êtes assuré bris de glace.\nNous nous occupons de toutes les démarches avec votre assurance, sans avance de frais (money)\n(gift) Et en plus, un cadeau vous est offert après l'intervention !\n\n(phone) Pour bloquer votre rendez-vous, merci de nous envoyer rapidement une photo de votre carte grise et de votre attestation d'assurance ici sur WhatsApp.\nDès réception, on vous propose une date d'intervention selon vos disponibilités.\n\nÀ très vite ! (car)"

  // Remplacer les représentations textuelles par des emojis
  const messageWithEmojis = messageText
    .replace(/\(wave\)/g, "👋")
    .replace(/\(money\)/g, "💸")
    .replace(/\(gift\)/g, "🎁")
    .replace(/\(phone\)/g, "📲")
    .replace(/\(car\)/g, "🚘")

  // Encodage spécial pour WhatsApp
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageWithEmojis)}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 15,
      }}
    >
      <motion.div
        animate={isHovered ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center"
      >
        <div className="relative w-8 h-8">
          <Image
            src="/icons/whatsapp.png"
            alt="WhatsApp"
            fill
            className="invert" // Pour rendre l'icône blanche sur fond vert
          />
        </div>
      </motion.div>
    </motion.a>
  )
}
