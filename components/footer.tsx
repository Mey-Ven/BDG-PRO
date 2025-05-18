import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full border-t bg-[hsl(221,83%,53%)]/10 backdrop-blur-sm">
      <div className="container flex flex-col gap-4 px-4 py-6 md:px-6 md:py-8">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold">
              <div className="size-6 rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={34}
                  height={34}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[hsl(221,83%,53%)]">BRIS DE GLACE PRO</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Remplacement ou réparation de pare-brise 100% gratuit, rapide et sans avance de frais. Service client disponible 7j/7.
            </p>
            <div className="flex gap-4 pt-1">
              <Link href="https://www.facebook.com/" target="_blank" className="text-[hsl(221,83%,53%)] hover:text-[hsl(221,83%,40%)] transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.replace(/\+/g, '') || "33000000000"}?text=${encodeURIComponent("Bonjour, je souhaite remplacer mon pare-brise")}`} target="_blank" className="text-[hsl(221,83%,53%)] hover:text-[hsl(221,83%,40%)] transition-colors">
                <Image
                  src="/icons/whatsapp.png"
                  alt="WhatsApp"
                  width={20}
                  height={20}
                  className="size-4 invert"
                />
                <span className="sr-only">WhatsApp</span>
              </Link>
              <Link href="https://www.linkedin.com/" target="_blank" className="text-[hsl(221,83%,53%)] hover:text-[hsl(221,83%,40%)] transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[hsl(221,83%,53%)]">Nos Services</h4>
            <ul className="space-y-1 text-xs">
              <li>
                <Link href="#features" className="text-muted-foreground hover:text-[hsl(221,83%,53%)] transition-colors">
                  Remplacement de pare-brise
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-muted-foreground hover:text-[hsl(221,83%,53%)] transition-colors">
                  Réparation d'impact
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-muted-foreground hover:text-[hsl(221,83%,53%)] transition-colors">
                  Véhicule de courtoisie
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-muted-foreground hover:text-[hsl(221,83%,53%)] transition-colors">
                  Démarches assurance
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[hsl(221,83%,53%)]">Informations</h4>
            <ul className="space-y-1 text-xs">
              <li>
                <Link href="#faq" className="text-muted-foreground hover:text-[hsl(221,83%,53%)] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-[hsl(221,83%,53%)] transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-[hsl(221,83%,53%)] transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-[hsl(221,83%,53%)] transition-colors">
                  CGV
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[hsl(221,83%,53%)]">Contact</h4>
            <ul className="space-y-1 text-xs">
              <li>
                <Link href={`tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE || "+33123456789"}`} className="text-muted-foreground hover:text-[hsl(221,83%,53%)] transition-colors">
                  Téléphone: {process.env.NEXT_PUBLIC_CONTACT_PHONE?.replace("+33", "0") || "01 23 45 67 89"}
                </Link>
              </li>
              <li>
                <Link href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@brisdeglacepro.fr"}`} className="text-muted-foreground hover:text-[hsl(221,83%,53%)] transition-colors">
                  Email: {process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@brisdeglacepro.fr"}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-[hsl(221,83%,53%)] transition-colors">
                  Devenir Partenaire
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-[hsl(221,83%,53%)] transition-colors">
                  Recrutement
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row justify-between items-center border-t border-[hsl(221,83%,53%)]/20 pt-4">
          <p className="text-[10px] text-muted-foreground">
            &copy; {new Date().getFullYear()} BRIS DE GLACE PRO. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
