import { useState, useEffect } from 'react'

type HeroImagesConfig = {
  homePage?: string
  historyPage?: string
  eventsPage?: string
  galleryPage?: string
  servicesPage?: string
  joinUsPage?: string
}

// Default images - use existing Vercel Storage URLs for now
const DEFAULT_HERO_IMAGES: HeroImagesConfig = {
  homePage: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/auxilia-hero-TTdTMAbB1pxlA21WXmSj3Wvkp3nuOX.png',
  historyPage: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/roman-battle-uGqgXiNZxmKYqeGOeV9jBG36AKDaXZ.jpg',
  eventsPage: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/colosseum-rome-JOvKJA3xJRD6qoLF4WEP4mq8TgQu3Z.jpeg',
  galleryPage: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/roman-standards-AKbDxqGOeV9jBG36AKDaXZ.jpg',
  servicesPage: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250516_1200_Roman%20Honor%20Guard_simple_compose_01jvc8h7fef1wahr6t5q1sndqn-X8GapSfxFlYSooMsY4HM66YSuTONot.png',
  joinUsPage: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1_Th2A6Ou80r0RCJvpGrBK3A-NyBS6217woHAJ4mDxF6O8Dafu9a1fv.webp'
}

export function useHeroImage(pageKey: keyof HeroImagesConfig) {
  const [heroImage, setHeroImage] = useState(DEFAULT_HERO_IMAGES[pageKey] || '')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadHeroImage()
  }, [pageKey])

  const loadHeroImage = async () => {
    try {
      // First try to load from API/config file
      const response = await fetch('/hero-images-config.json')
      if (response.ok) {
        const config = await response.json()
        if (config[pageKey]) {
          setHeroImage(config[pageKey])
          // Also update localStorage for offline access
          localStorage.setItem("scear-hero-images", JSON.stringify(config))
        }
      } else {
        // Fallback to localStorage
        const savedHeroImages = localStorage.getItem("scear-hero-images")
        if (savedHeroImages) {
          const parsedHeroImages = JSON.parse(savedHeroImages)
          if (parsedHeroImages[pageKey]) {
            setHeroImage(parsedHeroImages[pageKey])
          }
        }
      }
    } catch (error) {
      console.error('Error loading hero image:', error)
      // Fallback to localStorage if fetch fails
      try {
        const savedHeroImages = localStorage.getItem("scear-hero-images")
        if (savedHeroImages) {
          const parsedHeroImages = JSON.parse(savedHeroImages)
          if (parsedHeroImages[pageKey]) {
            setHeroImage(parsedHeroImages[pageKey])
          }
        }
      } catch (localStorageError) {
        console.error('Error reading from localStorage:', localStorageError)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { heroImage, isLoading }
}

export function useHeroImages() {
  const [heroImages, setHeroImages] = useState<HeroImagesConfig>(DEFAULT_HERO_IMAGES)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadHeroImages()
  }, [])

  const loadHeroImages = async () => {
    try {
      // First try to load from API/config file
      const response = await fetch('/hero-images-config.json')
      if (response.ok) {
        const config = await response.json()
        setHeroImages(config)
        // Also update localStorage for offline access
        localStorage.setItem("scear-hero-images", JSON.stringify(config))
      } else {
        // Fallback to localStorage
        const savedHeroImages = localStorage.getItem("scear-hero-images")
        if (savedHeroImages) {
          setHeroImages(JSON.parse(savedHeroImages))
        }
      }
    } catch (error) {
      console.error('Error loading hero images:', error)
      // Fallback to localStorage if fetch fails
      try {
        const savedHeroImages = localStorage.getItem("scear-hero-images")
        if (savedHeroImages) {
          setHeroImages(JSON.parse(savedHeroImages))
        }
      } catch (localStorageError) {
        console.error('Error reading from localStorage:', localStorageError)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { heroImages, isLoading }
}