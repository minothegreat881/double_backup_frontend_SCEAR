"use client"

import { useState, useEffect } from "react"
import { ImageIcon, Settings, Globe, History, Users, Calendar, Camera, BookOpen } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import SimpleImageUploader from "./simple-image-uploader"

type HeroImagesConfig = {
  homePage?: string
  historyPage?: string
  eventsPage?: string
  galleryPage?: string
  servicesPage?: string
  joinUsPage?: string
}

const pageConfigs = [
  {
    key: 'homePage',
    title: 'Domovská stránka',
    description: 'Hlavný hero obrázok na domovskej stránke',
    icon: Globe,
    defaultImage: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/auxilia-hero-TTdTMAbB1pxlA21WXmSj3Wvkp3nuOX.png',
    cloudinaryUrl: 'https://res.cloudinary.com/dii0wl9ke/image/upload/v1759078800/scear-hero/auxilia-hero.png'
  },
  {
    key: 'historyPage',
    title: 'História',
    description: 'Hero obrázok pre stránku histórie - zobrazuje sa za nadpisom "História Rímskeho Dedičstva"',
    icon: History,
    defaultImage: '/images/gallery/roman-battle-formation.png',
    cloudinaryUrl: 'https://res.cloudinary.com/dii0wl9ke/image/upload/v1759078800/scear-hero/roman-battle-formation.png'
  },
  {
    key: 'eventsPage',
    title: 'Podujatia',
    description: 'Hero obrázok pre stránku podujatí',
    icon: Calendar,
    defaultImage: '/images/gallery/roman-festival.png',
    cloudinaryUrl: 'https://res.cloudinary.com/dii0wl9ke/image/upload/v1759078800/scear-hero/roman-festival.png'
  },
  {
    key: 'galleryPage',
    title: 'Galéria',
    description: 'Hero obrázok pre stránku galérie',
    icon: Camera,
    defaultImage: '/images/gallery/roman-standards.png',
    cloudinaryUrl: 'https://res.cloudinary.com/dii0wl9ke/image/upload/v1759078800/scear-hero/roman-standards.png'
  },
  {
    key: 'servicesPage',
    title: 'Služby',
    description: 'Hero obrázok pre stránku služieb',
    icon: BookOpen,
    defaultImage: '/images/gallery/roman-camp.png',
    cloudinaryUrl: 'https://res.cloudinary.com/dii0wl9ke/image/upload/v1759078800/scear-hero/roman-camp.png'
  },
  {
    key: 'joinUsPage',
    title: 'Pridajte sa k nám',
    description: 'Hero obrázok pre stránku prihlášky',
    icon: Users,
    defaultImage: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1_Th2A6Ou80r0RCJvpGrBK3A-NyBS6217woHAJ4mDxF6O8Dafu9a1fv.webp',
    cloudinaryUrl: 'https://res.cloudinary.com/dii0wl9ke/image/upload/v1759078800/scear-hero/join-us-hero.webp'
  }
]

export default function HeroImagesManager() {
  const [heroImages, setHeroImages] = useState<HeroImagesConfig>({})
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load hero images from API/config file
    loadHeroImages()
  }, [])

  const loadHeroImages = async () => {
    try {
      const response = await fetch('/api/upload-hero-image')
      if (response.ok) {
        const config = await response.json()
        setHeroImages(config)
        // Also save to localStorage for backward compatibility
        localStorage.setItem("scear-hero-images", JSON.stringify(config))
      } else {
        // Fallback to localStorage if API fails
        const savedHeroImages = localStorage.getItem("scear-hero-images")
        if (savedHeroImages) {
          setHeroImages(JSON.parse(savedHeroImages))
        } else {
          // Initialize with default images
          const defaultImages = pageConfigs.reduce((acc, config) => ({
            ...acc,
            [config.key]: config.defaultImage
          }), {})
          setHeroImages(defaultImages)
        }
      }
    } catch (error) {
      console.error('Error loading hero images:', error)
      // Fallback to defaults
      const defaultImages = pageConfigs.reduce((acc, config) => ({
        ...acc,
        [config.key]: config.defaultImage
      }), {})
      setHeroImages(defaultImages)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpdate = async (pageKey: string, imageUrl: string) => {
    const updatedHeroImages = { ...heroImages, [pageKey]: imageUrl }
    setHeroImages(updatedHeroImages)

    // Save to config file via API
    try {
      const response = await fetch('/api/upload-hero-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageKey,
          imageUrl
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save image URL')
      }

      // Also update localStorage for immediate effect
      localStorage.setItem("scear-hero-images", JSON.stringify(updatedHeroImages))

      const pageName = pageConfigs.find(p => p.key === pageKey)?.title || 'Page'
      toast({
        title: "Hero obrázok aktualizovaný",
        description: `Hero obrázok pre ${pageName} bol úspešne aktualizovaný.`,
      })
    } catch (error) {
      console.error('Error saving image URL:', error)
      toast({
        title: "Chyba",
        description: "Nepodarilo sa uložiť URL obrázka.",
        variant: "destructive"
      })
    }
  }


  const resetToDefault = async (field: string) => {
    const config = pageConfigs.find(p => p.key === field)
    // Use Cloudinary URL if available, otherwise use default
    const defaultImage = config?.cloudinaryUrl || config?.defaultImage || ''
    const updatedHeroImages = { ...heroImages, [field]: defaultImage }
    setHeroImages(updatedHeroImages)

    // Save to both localStorage and server
    localStorage.setItem("scear-hero-images", JSON.stringify(updatedHeroImages))

    const pageName = config?.title || 'Page'
    toast({
      title: "Obnovené na predvolené",
      description: `Hero obrázok pre ${pageName} bol obnovený na predvolený.`,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-red-800 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Správa Hero Obrázkov</h2>
          <p className="text-white/70 mt-2">
            Spravujte pozadie hero sekcií pre všetky stránky webu
          </p>
        </div>
      </div>

      {/* Hero Images Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pageConfigs.map((config) => {
          const Icon = config.icon
          const currentImage = heroImages[config.key as keyof HeroImagesConfig] || config.defaultImage

          return (
            <Card key={config.key} className="bg-white/5 backdrop-blur-sm border border-red-800/20 overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-white">
                  <Icon className="h-5 w-5 text-red-500" />
                  {config.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Image Preview */}
                <div className="relative aspect-video w-full border border-red-800/30 rounded-lg overflow-hidden bg-gray-800">
                  <Image
                    src={currentImage}
                    alt={`${config.title} Hero`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                {/* Description */}
                <p className="text-sm text-white/60">
                  {config.description}
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <SimpleImageUploader
                    onUpload={(url) => handleImageUpdate(config.key, url)}
                    buttonText="Zmeniť obrázok"
                  />
                  <Button
                    onClick={() => resetToDefault(config.key)}
                    variant="ghost"
                    size="sm"
                    className="w-full text-white/60 hover:text-white hover:bg-white/10"
                  >
                    Obnoviť na predvolený
                  </Button>
                </div>

                {/* Current Image Path */}
                {currentImage !== config.defaultImage && (
                  <div className="pt-2 border-t border-red-800/20">
                    <p className="text-xs text-white/40 truncate" title={currentImage}>
                      Aktuálny: {currentImage.split('/').pop()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Instructions */}
      <Card className="bg-white/5 backdrop-blur-sm border border-red-800/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Settings className="h-5 w-5" />
            Inštrukcie
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-white/70">
          <p>• Kliknite na tlačidlo "Zmeniť" pri každej stránke pre výber nového hero obrázku</p>
          <p>• Odporúčané rozmery obrázkov: minimálne 1920x1080 pixelov</p>
          <p>• Podporované formáty: JPG, PNG, WebP</p>
          <p>• Obrázky sa ukladajú lokálne a budú dostupné okamžite</p>
          <p>• Použite tlačidlo "Obnoviť" pre návrat k predvolenému obrázku</p>
        </CardContent>
      </Card>

    </div>
  )
}