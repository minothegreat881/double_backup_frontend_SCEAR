"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Sword, Shield, Users } from "lucide-react"
import { useHeroImage } from "@/hooks/use-hero-images"

export default function ServicesClientPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    eventType: "",
    message: "",
  })
  const { heroImage } = useHeroImage('servicesPage')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    toast({
      title: "Správa odoslaná!",
      description: "Čoskoro sa vám ozveme.",
    })
    setFormData({
      name: "",
      email: "",
      eventType: "",
      message: "",
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Hero Section - Mobile Optimized */}
      <section className="relative w-full min-h-[85vh] sm:min-h-screen md:h-[90vh] lg:h-[85vh]">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 z-10" />
        <Image
          src={heroImage}
          alt="Roman legionaries in formation"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="relative z-20 container mx-auto px-4 sm:px-6 h-full flex flex-col justify-center items-center text-center">
          <div className="max-w-5xl">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Obohaťte svoje podujatie dávkou <span className="text-red-300">histórie!</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-4 sm:mb-6 leading-relaxed px-2 sm:px-0">
              Dni mesta či obce, kultúrne festivaly alebo historické slávnosti – radi prinesieme do vášho programu nezabudnuteľnú atmosféru antického Ríma.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-white/80 mb-8 sm:mb-10 max-w-2xl mx-auto px-2 sm:px-0">
              Naše vystúpenia spájajú zábavu, poznanie a autentické zážitky.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <Button asChild size="lg" className="w-full sm:w-auto bg-white/5 backdrop-blur-sm text-white hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg touch-manipulation">
                <a href="#services">Naše služby</a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-transparent text-white border-2 border-white hover:bg-white/5 backdrop-blur-sm hover:text-white shadow-xl transform hover:scale-105 transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg touch-manipulation"
              >
                <a href="#contact">Kontaktujte nás</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Mobile Optimized */}
      <section id="services" className="py-12 sm:py-16 lg:py-20 bg-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-32 sm:w-64 h-32 sm:h-64 bg-red-800/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-24 sm:w-48 h-24 sm:h-48 bg-red-600/10 rounded-full blur-2xl"></div>
        <div className="relative container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">Naše služby</h2>
            <div className="w-16 sm:w-24 h-1 bg-red-600 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto px-2 sm:px-0">
              Profesionálne historické služby pre vaše podujatie
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {/* Service Card 1 - Mobile Optimized */}
            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white/5 backdrop-blur-sm border border-red-800/20 shadow-lg hover:-translate-y-2 rounded-xl group relative touch-manipulation">
              <div className="absolute inset-0 bg-gradient-to-br from-red-800/10 to-red-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
              <div className="relative z-10">
                <div className="relative h-32 sm:h-40 lg:h-48 flex items-center justify-center bg-gradient-to-br from-red-600 to-red-700">
                  <div className="p-4 sm:p-6 lg:p-8 transform group-hover:scale-110 transition-transform duration-500">
                    <Sword className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 text-white" strokeWidth={1.5} />
                  </div>
                </div>
                <CardHeader className="bg-white/5 backdrop-blur-sm text-white pb-3 sm:pb-4 pt-4 sm:pt-6 px-4 sm:px-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="w-2 sm:w-3 h-2 sm:h-3 bg-red-600 rounded-full flex-shrink-0"></div>
                    <CardTitle className="text-lg sm:text-xl font-bold text-white leading-tight">Rímska armáda – bojové umenie a disciplína</CardTitle>
                  </div>
                  <CardDescription className="text-white/80 text-sm sm:text-base">Autentické bojové a taktické ukážky</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 bg-white/5 backdrop-blur-sm px-4 sm:px-6">
                  <p className="text-white/90 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                    Naša skupina vám predvedie jedinečné divadelno-šermiarske predstavenia a ukážky vojenských formácií, sprevádzané odborným komentárom. Objavte tajomstvá rímskej taktiky, zbrane a život v tábore legionárov.
                  </p>
                  <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                    Program prispôsobíme podľa vašich predstáv – od krátkych vstupov až po rozsiahle prezentácie.
                  </p>
                </CardContent>
                <CardFooter className="bg-white/5 backdrop-blur-sm pt-4 sm:pt-6 px-4 sm:px-6 pb-4 sm:pb-6">
                  <Button asChild className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white border border-red-800/20 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-300 py-3 text-sm sm:text-base touch-manipulation">
                    <a href="#contact">Požiadať o službu</a>
                  </Button>
                </CardFooter>
              </div>
            </Card>

            {/* Service Card 2 - Mobile Optimized */}
            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white/5 backdrop-blur-sm border border-red-800/20 shadow-lg hover:-translate-y-2 rounded-xl group relative touch-manipulation">
              <div className="absolute inset-0 bg-gradient-to-br from-red-800/10 to-red-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
              <div className="relative z-10">
                <div className="relative h-32 sm:h-40 lg:h-48 flex items-center justify-center bg-gradient-to-br from-red-800 to-red-900">
                  <div className="p-4 sm:p-6 lg:p-8 transform group-hover:scale-110 transition-transform duration-500">
                    <Shield className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 text-white" strokeWidth={1.5} />
                  </div>
                </div>
                <CardHeader className="bg-white/5 backdrop-blur-sm text-white pb-3 sm:pb-4 pt-4 sm:pt-6 px-4 sm:px-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="w-2 sm:w-3 h-2 sm:h-3 bg-gray-600 rounded-full flex-shrink-0"></div>
                    <CardTitle className="text-lg sm:text-xl font-bold text-white leading-tight">Čestná stráž a reprezentácia</CardTitle>
                  </div>
                  <CardDescription className="text-white/80 text-sm sm:text-base">Ceremoniálna prítomnosť na špeciálnych podujatiach</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 bg-white/5 backdrop-blur-sm px-4 sm:px-6">
                  <p className="text-white/90 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                    Rímske pomocné zbory (auxilia) slúžili nielen na bojisku, ale aj ako osobná stráž hodnostárov. Rovnakú možnosť ponúkame aj vám! Naši vojaci môžu byť čestnou strážou na kultúrnych či spoločenských podujatiach, súčasťou historických sprievodov alebo interaktívnych programov pre školy a tábory.
                  </p>
                  <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                    Cenovú ponuku vám radi pripravíme na mieru.
                  </p>
                </CardContent>
                <CardFooter className="bg-white/5 backdrop-blur-sm pt-4 sm:pt-6 px-4 sm:px-6 pb-4 sm:pb-6">
                  <Button asChild className="w-full bg-gradient-to-r from-red-800 to-red-900 text-white border border-red-800/20 hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 py-3 text-sm sm:text-base touch-manipulation">
                    <a href="#contact">Požiadať o službu</a>
                  </Button>
                </CardFooter>
              </div>
            </Card>

            {/* Service Card 3 - Mobile Optimized */}
            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white/5 backdrop-blur-sm border border-red-800/20 shadow-lg hover:-translate-y-2 rounded-xl group relative touch-manipulation">
              <div className="absolute inset-0 bg-gradient-to-br from-red-800/10 to-red-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
              <div className="relative z-10">
                <div className="relative h-32 sm:h-40 lg:h-48 flex items-center justify-center bg-gradient-to-br from-red-800 to-red-900">
                  <div className="p-4 sm:p-6 lg:p-8 transform group-hover:scale-110 transition-transform duration-500">
                    <Users className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 text-white" strokeWidth={1.5} />
                  </div>
                </div>
                <CardHeader className="bg-white/5 backdrop-blur-sm text-white pb-3 sm:pb-4 pt-4 sm:pt-6 px-4 sm:px-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="w-2 sm:w-3 h-2 sm:h-3 bg-amber-600 rounded-full flex-shrink-0"></div>
                    <CardTitle className="text-lg sm:text-xl font-bold text-white leading-tight">Workshopy a zážitkové aktivity</CardTitle>
                  </div>
                  <CardDescription className="text-white/80 text-sm sm:text-base">Interaktívne historické zážitky</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 bg-white/5 backdrop-blur-sm px-4 sm:px-6">
                  <p className="text-white/90 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                    Chcete si na vlastnej koži vyskúšať život rímskeho vojaka? Ponúkame:
                  </p>
                  <ul className="text-white/90 space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                    <li className="flex items-start">
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-amber-600 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></div>
                      <span className="leading-relaxed text-sm sm:text-base">Narábanie so zbraňami</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-amber-600 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></div>
                      <span className="leading-relaxed text-sm sm:text-base">Dobové hry a remeslá</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-amber-600 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></div>
                      <span className="leading-relaxed text-sm sm:text-base">Ukážku rímskej kuchyne a prípravu jedál na originálnej prenosnej piecke craticula</span>
                    </li>
                  </ul>
                  <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                    A mnohe ďalšie zážitky, ktoré prenesú účastníkov do čias staroveku!
                  </p>
                </CardContent>
                <CardFooter className="bg-white/5 backdrop-blur-sm pt-4 sm:pt-6 px-4 sm:px-6 pb-4 sm:pb-6">
                  <Button asChild className="w-full bg-gradient-to-r from-red-800 to-red-900 text-white border border-red-800/20 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 py-3 text-sm sm:text-base touch-manipulation">
                    <a href="#contact">Požiadať o službu</a>
                  </Button>
                </CardFooter>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section - Mobile Optimized */}
      <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-32 sm:w-64 h-32 sm:h-64 bg-red-800/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-24 sm:w-48 h-24 sm:h-48 bg-red-600/20 rounded-full blur-2xl"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Kontaktujte nás</h2>
            <div className="w-16 sm:w-24 h-1 bg-red-600 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-2 sm:px-0">
              Pripravíme vám ponuku na mieru
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">Máte záujem?</h3>
              <p className="mb-4 sm:mb-6 text-gray-300 text-sm sm:text-base leading-relaxed">
                Napíšte nám a pripravíme vám ponuku na mieru pre vaše podujatie. Náš tím s vami vytvorí nezabudnuteľný historický zážitok prispôsobený vašim potrebám a publiku.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center">
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
                    className="mr-2 sm:mr-3 text-white flex-shrink-0"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span className="text-sm sm:text-base break-all">info@scear-roman-army.com</span>
                </div>
                <div className="flex items-center">
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
                    className="mr-2 sm:mr-3 text-white flex-shrink-0"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span className="text-sm sm:text-base">+421 123 456 789</span>
                </div>
                <div className="flex items-center">
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
                    className="mr-2 sm:mr-3 text-white flex-shrink-0"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="text-sm sm:text-base">Bratislava, Slovakia</span>
                </div>
              </div>
              <div className="mt-6 sm:mt-8">
                <h4 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Sledujte nás</h4>
                <div className="flex space-x-4">
                  <a
                    href="https://www.instagram.com/cohvlvc/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition-colors p-2 -m-2 touch-manipulation"
                    aria-label="Instagram"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 sm:h-7 sm:w-7"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/rimska.kohorta/?locale=sk_SK"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition-colors p-2 -m-2 touch-manipulation"
                    aria-label="Facebook"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 sm:h-7 sm:w-7"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div>
              <form onSubmit={handleSubmit} className="bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl border border-red-800/40 shadow-2xl relative overflow-hidden">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">Pošlite nám správu</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1 text-white">
                      Vaše meno
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 h-12 text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1 text-white">
                      Email adresa
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 h-12 text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="eventType" className="block text-sm font-medium mb-1 text-white">
                      Typ podujatia
                    </label>
                    <Input
                      id="eventType"
                      name="eventType"
                      placeholder="Festival, školské podujatie, firemné podujatie, atď."
                      value={formData.eventType}
                      onChange={handleChange}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 h-12 text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1 text-white">
                      Vaša správa
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-base min-h-[120px]"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-red-800 text-white hover:bg-red-700 font-semibold transition-colors duration-300 h-12 text-base touch-manipulation">
                    Odoslať správu
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}