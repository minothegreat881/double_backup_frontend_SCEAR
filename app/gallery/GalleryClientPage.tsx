"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import ModernGallery from "@/components/modern-gallery"
import { Camera } from "lucide-react"
import { useHeroImage } from "@/hooks/use-hero-images"

export default function GalleryClientPage() {
  const { heroImage } = useHeroImage('galleryPage')

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Enhanced Hero Section */}
      <section className="relative w-full min-h-[80vh] sm:min-h-screen md:h-[90vh] md:min-h-[700px]">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50 z-10" />
        <Image
          src={heroImage}
          alt="Roman auxiliary forces gallery"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        
        {/* Decorative elements - hidden on mobile */}
        <div className="hidden lg:block absolute top-20 left-20 w-64 h-64 bg-red-800/20 rounded-full blur-3xl z-10"></div>
        <div className="hidden lg:block absolute bottom-20 right-20 w-48 h-48 bg-red-600/20 rounded-full blur-2xl z-10"></div>
        
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center sm:justify-center md:justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mt-20 sm:mt-0"
          >
            <div className="flex items-center gap-4 mb-4 sm:mb-6">
              <div className="bg-red-800/80 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-2xl">
                <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h2 className="text-lg sm:text-2xl text-red-200 font-semibold drop-shadow-lg">Fotogaléria</h2>
            </div>

            {/* Enhanced Title */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-4 sm:mb-6 lg:mb-8 leading-tight drop-shadow-2xl tracking-tight">
              Naša galéria
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-3xl leading-relaxed drop-shadow-lg mb-6 sm:mb-8">
              Preskúmajte našu zbierku fotografií zobrazujúcich rekonštrukcie rímskych pomocných zborov, tréningové jednotky a historické podujatia po celej Európe.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-16 bg-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-red-800/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-red-600/10 rounded-full blur-2xl"></div>
        <div className="relative container mx-auto px-4">
          <ModernGallery />
        </div>
      </section>
    </div>
  )
}