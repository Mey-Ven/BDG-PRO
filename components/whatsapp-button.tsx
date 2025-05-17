"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false)

  const phoneNumber = "+33685041049"
  const message = encodeURIComponent("Bonjour, je souhaite prendre rendez-vous pour remplacer mon pare-brise.")
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

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
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/whatsapp-874cYtxrQFXbmNBqyROdiJrYqN5KGu.png"
            alt="WhatsApp"
            fill
            className="invert" // Pour rendre l'icône blanche sur fond vert
          />
        </div>
      </motion.div>
    </motion.a>
  )
}
