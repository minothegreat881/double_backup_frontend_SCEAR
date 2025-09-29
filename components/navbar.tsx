"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Lock, Instagram, Facebook, MessageCircle, Youtube, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Image from "next/image"

export default function Navbar({ hideHeader = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { name: "Domov", path: "/" },
    { name: "Galéria", path: "/gallery" },
    { name: "Podujatia", path: "/events" },
    { name: "Služby", path: "/services" },
    { name: "Pridajte sa k nám", path: "/join-us" },
    { name: "História", path: "/history" },
  ]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header
      className={`bg-gradient-to-r from-stone-900 via-gray-900 to-stone-900 text-white sticky top-0 z-50 transition-transform duration-300 shadow-2xl backdrop-blur-sm border-b border-red-800/20 ${
        hideHeader ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-red-900/10"></div>
      <div className="absolute top-0 left-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
      <div className="absolute top-0 right-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
      
      <div className="container mx-auto px-6 relative">
        <div className="flex justify-between items-center h-24">
          <Link href="/" className="flex items-center gap-3 group" aria-label="Home">
            <div className="relative h-12 w-32 sm:h-16 sm:w-48 group-hover:scale-105 transition-transform duration-300">
              <Image src="/images/scear-logo.png" alt="S.C.E.A.R. Logo" fill sizes="(max-width: 640px) 128px, 192px" className="object-contain drop-shadow-2xl" priority />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-6 py-3 text-lg font-bold transition-all duration-300 relative group rounded-full backdrop-blur-sm border hover:scale-110 shadow-lg hover:shadow-2xl whitespace-nowrap min-w-max ${
                  pathname === link.path 
                    ? "text-white bg-red-800/40 border-red-600 shadow-red-800/50" 
                    : "text-white bg-white/5 border-red-800/30 hover:bg-red-800/20 hover:border-red-600 hover:text-red-300"
                }`}
              >
                <span className="relative z-10 drop-shadow-lg">{link.name}</span>
                
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-800/20 via-red-600/30 to-red-800/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100"></div>
                
                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-full border-2 border-red-600/0 group-hover:border-red-400/50 transition-all duration-300"></div>
                
                {/* Bottom indicator line */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-300 group-hover:w-3/4"></div>
              </Link>
            ))}

            {/* Social Media Links */}
            <div className="flex items-center gap-3 ml-6 px-5 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-red-800/30 shadow-xl">
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
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-red-800/20 backdrop-blur-sm rounded-full border border-red-800/50 hover:bg-red-800/40 hover:border-red-600 transition-all duration-300 hover:scale-125 shadow-xl hover:shadow-2xl group"
                aria-label="TikTok"
              >
                <Music className="h-5 w-5 text-white group-hover:text-red-200" />
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
                href="https://www.facebook.com/rimska.kohorta/?locale=sk_SK"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-red-800/20 backdrop-blur-sm rounded-full border border-red-800/50 hover:bg-red-800/40 hover:border-red-600 transition-all duration-300 hover:scale-125 shadow-xl hover:shadow-2xl group"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-white group-hover:text-red-200" />
              </a>
            </div>

            <Button variant="ghost" className="text-white/60 hover:text-white p-4 bg-white/5 backdrop-blur-sm rounded-full border border-red-800/30 hover:bg-red-800/20 hover:border-red-600 transition-all duration-300 hover:scale-125 shadow-xl hover:shadow-2xl ml-4 group" asChild>
              <Link href="/admin" aria-label="Admin">
                <Lock className="h-6 w-6 group-hover:text-red-200" />
              </Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-white" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-stone-800 py-4 border-t border-red-800/30 relative z-50 shadow-2xl">
          <nav className="container mx-auto px-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-lg font-medium py-4 px-4 rounded-lg transition-all duration-300 hover:bg-red-800/20 hover:text-red-300 border border-transparent hover:border-red-800/50 block w-full text-left touch-manipulation ${
                  pathname === link.path ? "text-red-400 bg-red-800/30 border-red-600/50" : "text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* Social Media Links for Mobile */}
            <div className="grid grid-cols-2 gap-3 py-4 border-t border-red-800/30 mt-4 pt-4">
              <a
                href="https://youtube.com/@scear"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors flex items-center gap-2 py-3 px-2 rounded-lg hover:bg-red-800/20 touch-manipulation"
                onClick={() => setIsMenuOpen(false)}
              >
                <Youtube className="h-4 w-4" /> YouTube
              </a>
              <a
                href="https://tiktok.com/@scear"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors flex items-center gap-2 py-3 px-2 rounded-lg hover:bg-red-800/20 touch-manipulation"
                onClick={() => setIsMenuOpen(false)}
              >
                <Music className="h-4 w-4" /> TikTok
              </a>
              <a
                href="https://www.instagram.com/cohvlvc/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors flex items-center gap-2 py-3 px-2 rounded-lg hover:bg-red-800/20 touch-manipulation"
                onClick={() => setIsMenuOpen(false)}
              >
                <Instagram className="h-4 w-4" /> Instagram
              </a>
              <a
                href="https://www.facebook.com/rimska.kohorta/?locale=sk_SK"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors flex items-center gap-2 py-3 px-2 rounded-lg hover:bg-red-800/20 touch-manipulation"
                onClick={() => setIsMenuOpen(false)}
              >
                <Facebook className="h-4 w-4" /> Facebook
              </a>
            </div>

            <Link
              href="/admin"
              className="text-lg font-medium py-4 px-4 rounded-lg transition-all duration-300 hover:bg-red-800/20 hover:text-red-300 border border-transparent hover:border-red-800/50 block w-full text-left touch-manipulation text-white/60 flex items-center gap-2 mt-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Lock className="h-4 w-4" /> Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
