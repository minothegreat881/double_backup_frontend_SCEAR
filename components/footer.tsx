"use client"

import Link from "next/link"
import { Shield, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Music, Lock, Building, FileText } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

export default function Footer() {
  const router = useRouter()
  const pathname = usePathname()

  const handleEquipmentClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // If we're already on join-us page, just scroll directly
    if (pathname === '/join-us') {
      const element = document.getElementById('equipment')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Navigate to join-us with scroll parameter
      router.push('/join-us?scrollTo=equipment')
    }
  }

  const handleTrainingClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // If we're already on join-us page, just scroll directly
    if (pathname === '/join-us') {
      const element = document.getElementById('training')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Navigate to join-us with scroll parameter
      router.push('/join-us?scrollTo=training')
    }
  }

  const handleFaqClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // If we're already on join-us page, just scroll directly
    if (pathname === '/join-us') {
      const element = document.getElementById('faq')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Navigate to join-us with scroll parameter
      router.push('/join-us?scrollTo=faq')
    }
  }

  return (
    <footer className="bg-stone-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-red-500" />
              <span className="font-bold text-xl">S.C.E.A.R.</span>
            </div>
            <p className="text-stone-400 mb-6">
              Rímska armáda a pomocné zbory - Historicko-vojenská skupina venovaná autentickej rekonštrukcii rímskych pomocných zborov.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/rimska.kohorta/?locale=sk_SK"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-red-800/20 backdrop-blur-sm rounded-full border border-red-800/50 hover:bg-red-800/40 hover:border-red-600 transition-all duration-300 hover:scale-125 shadow-xl hover:shadow-2xl group"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-white group-hover:text-red-200" />
              </a>
              <a
                href="https://www.instagram.com/cohvlvc/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-red-800/20 backdrop-blur-sm rounded-full border border-red-800/50 hover:bg-red-800/40 hover:border-red-600 transition-all duration-300 hover:scale-125 shadow-xl hover:shadow-2xl group"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-white group-hover:text-red-200" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-red-800/20 backdrop-blur-sm rounded-full border border-red-800/50 hover:bg-red-800/40 hover:border-red-600 transition-all duration-300 hover:scale-125 shadow-xl hover:shadow-2xl group"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5 text-white group-hover:text-red-200" />
              </a>
              <a
                href="https://tiktok.com/@scear"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-red-800/20 backdrop-blur-sm rounded-full border border-red-800/50 hover:bg-red-800/40 hover:border-red-600 transition-all duration-300 hover:scale-125 shadow-xl hover:shadow-2xl group"
                aria-label="TikTok"
              >
                <Music className="h-5 w-5 text-white group-hover:text-red-200" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Rýchle odkazy</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-stone-400 hover:text-red-400">
                  Domov
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-stone-400 hover:text-red-400">
                  Galéria
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-stone-400 hover:text-red-400">
                  Podujatia
                </Link>
              </li>
              <li>
                <Link href="/join-us" className="text-stone-400 hover:text-red-400">
                  Pridajte sa k nám
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-stone-400 hover:text-red-400">
                  História
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Zdroje</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/join-us#equipment"
                  onClick={handleEquipmentClick}
                  className="text-stone-400 hover:text-red-400 cursor-pointer"
                >
                  Sprievodca výstrojou
                </a>
              </li>
              <li>
                <a
                  href="/join-us#training"
                  onClick={handleTrainingClick}
                  className="text-stone-400 hover:text-red-400 cursor-pointer"
                >
                  Tréningový rozvrh
                </a>
              </li>
              <li>
                <Link href="#" className="text-stone-400 hover:text-red-400">
                  Členské zdroje
                </Link>
              </li>
              <li>
                <a
                  href="/join-us#faq"
                  onClick={handleFaqClick}
                  className="text-stone-400 hover:text-red-400 cursor-pointer"
                >
                  Často kladené otázky
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Kontaktujte nás</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Building className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-stone-300 font-medium">Societas civilis exercitus auxiliorumque Romanorum</p>
                  <p className="text-stone-400">Historicko-vojenská skupina</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
                <span className="text-stone-400">Hutnícka 17, 841 10 Bratislava</span>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-stone-400">IČO: 42170907</p>
                  <p className="text-stone-400">DIČ: 2023738530</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-red-500 mt-0.5" />
                <span className="text-stone-400">info@scear-example.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-red-500 mt-0.5" />
                <span className="text-stone-400">+421 123 456 789</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-6 mt-6 text-center text-stone-500 text-sm">
          <p>&copy; {new Date().getFullYear()} S.C.E.A.R. - Rímska armáda a pomocné zbory. Všetky práva vyhradené.</p>
          <div className="mt-2">
            <Link
              href="/admin"
              className="inline-flex items-center text-stone-500 hover:text-red-400 transition-colors"
            >
              <Lock className="h-3 w-3 mr-1" /> Administrátorský prístup
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
