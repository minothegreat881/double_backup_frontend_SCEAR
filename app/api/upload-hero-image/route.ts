import { NextRequest, NextResponse } from 'next/server'

const CLOUDINARY_CLOUD_NAME = 'dii0wl9ke'
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
const CLOUDINARY_UPLOAD_PRESET = 'ml_default'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pageKey, imageUrl } = body

    if (!pageKey || !imageUrl) {
      return NextResponse.json(
        { error: 'pageKey and imageUrl are required' },
        { status: 400 }
      )
    }

    // Store the mapping in a JSON file
    const heroImagesConfig = await getHeroImagesConfig()
    heroImagesConfig[pageKey] = imageUrl
    await saveHeroImagesConfig(heroImagesConfig)

    return NextResponse.json({
      success: true,
      url: imageUrl
    })
  } catch (error) {
    console.error('Save error:', error)
    return NextResponse.json(
      { error: 'Failed to save image URL' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const config = await getHeroImagesConfig()
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching hero images config:', error)
    return NextResponse.json({})
  }
}

// Helper functions to manage hero images config
import { promises as fs } from 'fs'
import path from 'path'

async function getHeroImagesConfig() {
  try {
    const configPath = path.join(process.cwd(), 'public', 'hero-images-config.json')
    const data = await fs.readFile(configPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // Return default config if file doesn't exist
    return {
      homePage: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/auxilia-hero-TTdTMAbB1pxlA21WXmSj3Wvkp3nuOX.png',
      historyPage: 'https://res.cloudinary.com/dii0wl9ke/image/upload/v1759078800/scear-hero/roman-battle-formation.png',
      eventsPage: 'https://res.cloudinary.com/dii0wl9ke/image/upload/v1759078800/scear-hero/roman-festival.png',
      galleryPage: 'https://res.cloudinary.com/dii0wl9ke/image/upload/v1759078800/scear-hero/roman-standards.png',
      servicesPage: 'https://res.cloudinary.com/dii0wl9ke/image/upload/v1759078800/scear-hero/roman-camp.png',
      joinUsPage: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1_Th2A6Ou80r0RCJvpGrBK3A-NyBS6217woHAJ4mDxF6O8Dafu9a1fv.webp'
    }
  }
}

async function saveHeroImagesConfig(config: any) {
  const configPath = path.join(process.cwd(), 'public', 'hero-images-config.json')
  await fs.writeFile(configPath, JSON.stringify(config, null, 2))
}