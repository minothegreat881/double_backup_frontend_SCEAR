import Link from "next/link"
import Image from "next/image"
import BlurImage from "@/components/blur-image"
import { Users, ImageIcon, BookOpen, ChevronRight, Calendar, MapPin, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { format, parseISO, isSameDay } from "date-fns"
import { sk } from "date-fns/locale"
import { fetchEvents, fetchGalleryPhotos } from "@/lib/strapi-api"
import { fetchHistoryArticles } from "@/lib/history-articles-api"
import { eventsData } from "@/lib/events-data"
import { galleryImages } from "@/lib/gallery-data"
import { getStrapiImageUrl } from "@/lib/strapi-utils"

// Force dynamic rendering to always fetch fresh data from Strapi
export const dynamic = 'force-dynamic'

export default async function Home() {
  // Get latest 3 events, photos, and articles from Strapi with fallbacks
  let events, photos, articles
  try {
    const [eventsResult, photosResult, articlesResult] = await Promise.all([
      fetchEvents().catch(() => eventsData.map(e => ({...e, createdAt: new Date().toISOString(), publishedAt: new Date().toISOString()}))),
      fetchGalleryPhotos().catch(() => galleryImages),
      fetchHistoryArticles().catch(() => ({ data: [], meta: {} }))
    ])

    events = eventsResult
    photos = photosResult
    articles = articlesResult?.data || [] // Extract data from the result object
    console.log('Articles loaded:', articles?.length, 'articles') // Debug log
  } catch (error) {
    console.warn('Using fallback data due to API error:', error)
    events = eventsData.map(e => ({...e, createdAt: new Date().toISOString(), publishedAt: new Date().toISOString()}))
    photos = galleryImages
    articles = []
  }
  
  // Sort events by creation date and take latest 3 recently added
  const latestEvents = events
    .sort((a, b) => new Date(b.createdAt || b.publishedAt).getTime() - new Date(a.createdAt || a.publishedAt).getTime())
    .slice(0, 3)
    
  // Sort photos by creation date and take latest 3 recently added
  const latestPhotos = photos
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.publishedAt || 0).getTime()
      const dateB = new Date(b.createdAt || b.publishedAt || 0).getTime()
      return dateB - dateA
    })
    .slice(0, 3)
    
  // Sort articles by creation date and take latest 3 recently added
  const latestArticles = Array.isArray(articles) ? articles
    .sort((a, b) => new Date(b.createdAt || b.publishedAt).getTime() - new Date(a.createdAt || a.publishedAt).getTime())
    .slice(0, 3) : []

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Enhanced Hero Section */}
      <section className="relative w-full min-h-[80vh] sm:min-h-screen md:h-[90vh] md:min-h-[700px]">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50 z-10" />
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/auxilia-hero-TTdTMAbB1pxlA21WXmSj3Wvkp3nuOX.png"
          alt="Roman auxiliary forces in formation"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        
        {/* Decorative elements */}
        <div className="hidden lg:block absolute top-20 left-20 w-64 h-64 bg-red-800/20 rounded-full blur-3xl z-10"></div>
        <div className="hidden lg:block absolute bottom-20 right-20 w-48 h-48 bg-red-600/20 rounded-full blur-2xl z-10"></div>
        
        {/* Mobile version - absolute positioning at bottom */}
        <div className="absolute bottom-8 left-4 right-4 z-20 sm:hidden">
          <div className="max-w-lg">
            <h1 className="text-3xl font-bold text-white mb-3 leading-tight tracking-tight drop-shadow-2xl">
              S.C.E.A.R.
            </h1>
            <p className="text-lg text-white mb-4 leading-relaxed font-semibold drop-shadow-xl">
              Rímska armáda a pomocné zbory
            </p>
            <p className="text-base text-white/90 mb-6 leading-relaxed drop-shadow-lg">
              Zažite autentickú rekonštrukciu rímskych pomocných zborov prostredníctvom historického reenactmentu
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                asChild
                size="lg"
                className="bg-red-800 hover:bg-red-900 active:bg-red-950 text-white px-6 py-3 text-base font-semibold shadow-xl touch-manipulation min-h-[44px]"
              >
                <Link href="/join-us" className="flex items-center justify-center">
                  Pridať sa k nám
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/50 hover:bg-white/20 active:bg-white/30 px-6 py-3 text-base font-semibold shadow-xl touch-manipulation min-h-[44px]"
              >
                <Link href="/gallery" className="flex items-center justify-center">
                  Pozrieť galériu
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop version - centered */}
        <div className="hidden sm:flex relative z-20 container mx-auto px-4 h-full flex-col justify-center items-start">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight drop-shadow-2xl">
              S.C.E.A.R.
            </h1>
            <p className="text-lg sm:text-xl md:text-3xl lg:text-4xl text-white mb-6 sm:mb-8 leading-relaxed max-w-lg sm:max-w-2xl lg:max-w-3xl font-semibold drop-shadow-xl">
              Rímska armáda a pomocné zbory
            </p>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-12 leading-relaxed max-w-sm sm:max-w-lg md:max-w-2xl drop-shadow-lg">
              Zažite autentickú rekonštrukciu rímskych pomocných zborov prostredníctvom historického reenactmentu
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                asChild
                size="lg"
                className="bg-red-800 hover:bg-red-900 active:bg-red-950 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-xl touch-manipulation min-h-[44px]"
              >
                <Link href="/join-us" className="flex items-center justify-center">
                  <span className="sm:hidden">Pridať sa k nám</span>
                  <span className="hidden sm:inline">Pridajte sa k našej skupine</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/50 hover:bg-white/20 active:bg-white/30 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-xl touch-manipulation min-h-[44px]"
              >
                <Link href="/gallery" className="flex items-center justify-center">
                  <span className="sm:hidden">Galéria</span>
                  <span className="hidden sm:inline">Pozrieť galériu</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-red-800/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-red-600/10 rounded-full blur-2xl"></div>
        <div className="relative container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center">
            <div className="lg:w-1/2 flex flex-col justify-start">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white text-left break-words">S.C.E.A.R. – Rímska armáda a pomocné zbory</h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-3 sm:mb-4 text-justify leading-relaxed break-words">
                Názov S.C.E.A.R. je skratkou z latinského pomenovania Societas civilis exercitus auxiliorumque Romanorum, čo v preklade znamená Občianske združenie rímskeho vojska a pomocných zborov. Našou hlavnou víziou je poznávať, oživovať a predstavovať vojenskú históriu Ríma širokej verejnosti.
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-3 sm:mb-4 text-justify leading-relaxed break-words">
                Členovia združenia sa venujú výcviku s tradičnými rímskymi zbraňami – od slávneho gladia až po štíty a kopije. Bojové techniky využívame pri šermiarsko-divadelných vystúpeniach, improvizovaných dueloch „muž proti mužovi" aj v hromadných bitkách spolu s ďalšími skupinami rímskych reenactorov.
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-4 sm:mb-6 text-justify leading-relaxed break-words">
                Okrem bojových zručností rozvíjame aj odborné vedomosti o každodennom živote Rimanov a remeselné schopnosti. Vyrábame vlastné súčasti výstroja a výzbroje – od tuník a sandálov až po štíty či prilby – pričom dbáme na autenticitu a historickú presnosť.
              </p>
              <Button asChild className="bg-red-800 hover:bg-red-900">
                <Link href="/history">
                  Spoznajte našu históriu <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="lg:w-1/2 flex items-start justify-center mt-2 lg:mt-0">
              <div className="relative w-full max-w-lg h-auto lg:h-full rounded-lg overflow-hidden">
                <BlurImage
                  src="/images/scear-logo.png"
                  alt="S.C.E.A.R. Logo"
                  width={450}
                  height={700}
                  sizes="(max-width: 768px) 90vw, (max-width: 1024px) 48vw, 450px"
                  className="object-contain p-3 w-full h-auto lg:h-full lg:min-h-[550px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section - Using centralized data */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 pb-4 border-b-2 border-red-800/30 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-red-800 to-red-900 rounded-xl shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Nadchádzajúce podujatia</h2>
                <p className="text-gray-300 text-sm md:text-base">Najnovšie podujatia z našej komunity</p>
              </div>
            </div>
            <Button asChild className="bg-white/10 backdrop-blur-sm text-white border-2 border-red-800/50 hover:bg-white/20 hover:border-red-600 shadow-lg hover:shadow-xl transition-all duration-300 hidden md:inline-flex">
              <Link href="/events">Pozrieť všetky podujatia</Link>
            </Button>
            <Button asChild className="bg-white/10 backdrop-blur-sm text-white border-2 border-red-800/50 hover:bg-white/20 hover:border-red-600 shadow-lg hover:shadow-xl transition-all duration-300 md:hidden text-sm">
              <Link href="/events">Podujatia</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/5 backdrop-blur-sm border-2 border-red-800/30 hover:border-red-600/50 hover:-translate-y-1 rounded-lg hover:bg-white/10">
                <div className="relative h-48 cursor-pointer group">
                  <Link href={`/events?event=${event.id}`}>
                    <BlurImage 
                      src={event.image || "/placeholder.svg"} 
                      alt={event.title} 
                      fill 
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </Link>
                  <Badge
                    className={`absolute top-2 right-2 ${
                      event.category === "reenactment"
                        ? "bg-red-800"
                        : event.category === "training"
                          ? "bg-amber-700"
                          : event.category === "meeting"
                            ? "bg-blue-700"
                            : "bg-emerald-700"
                    }`}
                  >
                    {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                  </Badge>
                  {event.recurring && <Badge className="absolute top-2 left-2 bg-gray-800">Recurring</Badge>}
                </div>
                <CardHeader className="bg-transparent">
                  <CardTitle className="text-white">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="bg-transparent">
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center text-sm text-gray-300">
                      <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">{format(parseISO(event.startDate), "MMM d, yyyy", { locale: sk })}
                      {!isSameDay(parseISO(event.startDate), parseISO(event.endDate)) &&
                        ` - ${format(parseISO(event.endDate), "MMM d, yyyy", { locale: sk })}`}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <MapPin className="mr-1 h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">{event.location.name}</span>
                    </div>
                  </div>
                  <p className="text-gray-300 line-clamp-2">{event.description}</p>
                </CardContent>
                <CardFooter className="bg-transparent">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-red-800/50 text-red-400 hover:bg-red-800/20 bg-transparent hover:border-red-600"
                  >
                    <Link href={`/events?event=${event.id}`}>Zistiť viac</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Gallery Photos Section */}
      <section className="py-16 bg-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-red-800/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-red-600/10 rounded-full blur-2xl"></div>
        <div className="relative container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 pb-4 border-b-2 border-red-800/30 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-red-800 to-red-900 rounded-xl shadow-lg">
                <ImageIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Najnovšie fotografie</h2>
                <p className="text-gray-300 text-sm md:text-base">Aktuálne zábery z našich aktivít</p>
              </div>
            </div>
            <Button asChild className="bg-white/10 backdrop-blur-sm text-white border-2 border-red-800/50 hover:bg-white/20 hover:border-red-600 shadow-lg hover:shadow-xl transition-all duration-300 hidden md:inline-flex">
              <Link href="/gallery">Pozrieť celú galériu</Link>
            </Button>
            <Button asChild className="bg-white/10 backdrop-blur-sm text-white border-2 border-red-800/50 hover:bg-white/20 hover:border-red-600 shadow-lg hover:shadow-xl transition-all duration-300 md:hidden text-sm">
              <Link href="/gallery">Galéria</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestPhotos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group bg-white/5 backdrop-blur-sm border-2 border-red-800/30 hover:border-red-600/50 hover:-translate-y-1 rounded-lg hover:bg-white/10">
                <div className="relative h-64 cursor-pointer">
                  <Link href={`/gallery#photo-${photo.id}`}>
                    <BlurImage 
                      src={photo.src} 
                      alt={photo.alt} 
                      fill 
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-110" 
                    />
                  </Link>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Badge className="absolute top-2 right-2 bg-red-800/90 backdrop-blur-sm border border-white/20">
                    {photo.category}
                  </Badge>
                </div>
                <CardContent className="hidden sm:block p-4 bg-transparent">
                  <h3 className="font-bold text-lg mb-2 text-white">{photo.alt}</h3>
                  <div className="space-y-1 text-sm text-gray-300">
                    {photo.location && (
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">{photo.location}</span>
                      </div>
                    )}
                    {photo.activity && (
                      <div className="flex items-center">
                        <ImageIcon className="mr-1 h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">{photo.activity}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="hidden sm:block bg-transparent">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-red-800/50 text-red-400 hover:bg-red-800/20 bg-transparent hover:border-red-600"
                  >
                    <Link href={`/gallery#photo-${photo.id}`}>Zobraziť fotku</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest History Articles Section */}
      <section className="py-16 bg-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-red-800/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-red-600/10 rounded-full blur-2xl"></div>
        <div className="relative container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 pb-4 border-b-2 border-red-800/30 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-red-800 to-red-900 rounded-xl shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Najnovšie články z histórie</h2>
                <p className="text-gray-300 text-sm md:text-base">Najnovšie články z nášho výskumu</p>
              </div>
            </div>
            <Button asChild className="bg-white/10 backdrop-blur-sm text-white border-2 border-red-800/50 hover:bg-white/20 hover:border-red-600 shadow-lg hover:shadow-xl transition-all duration-300 hidden md:inline-flex">
              <Link href="/history">Pozrieť všetky články</Link>
            </Button>
            <Button asChild className="bg-white/10 backdrop-blur-sm text-white border-2 border-red-800/50 hover:bg-white/20 hover:border-red-600 shadow-lg hover:shadow-xl transition-all duration-300 md:hidden text-sm">
              <Link href="/history">Články</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestArticles.length > 0 ? (
              latestArticles.map((article) => {
                // Get the correct image URL
                const imageUrl = getStrapiImageUrl(article.heroImage?.url) ||
                                getStrapiImageUrl(article.heroImage?.data?.attributes?.url) ||
                                getStrapiImageUrl(article.mainImage?.url) ||
                                getStrapiImageUrl(article.mainImage?.data?.attributes?.url) ||
                                getStrapiImageUrl(article.seoImage?.url) ||
                                getStrapiImageUrl(article.seoImage?.data?.attributes?.url) ||
                                '/images/gallery/roman-standards.png'

                const publishedDate = article.publishedDate ? new Date(article.publishedDate) : new Date()
                const formattedDate = publishedDate.toLocaleDateString('sk-SK', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })

                return (
                  <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group bg-gray-800/50 backdrop-blur-sm border-2 border-red-800/30 hover:border-red-600/50 hover:-translate-y-1 rounded-lg hover:bg-gray-800/70">
                    <div className="relative h-64 cursor-pointer">
                      <Link href={`/history/${article.slug}`}>
                        <BlurImage
                          src={imageUrl}
                          alt={article.title} 
                      fill 
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-110" 
                    />
                  </Link>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {article.featured && (
                    <Badge className="absolute top-2 right-2 bg-red-800/90 backdrop-blur-sm border border-white/20">
                      Featured
                    </Badge>
                  )}
                  {article.category && (
                    <Badge className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm border border-white/20 text-gray-800">
                      {article.category}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4 bg-gray-800/70">
                  <h3 className="font-bold text-lg mb-2 text-white group-hover:text-red-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {article.subtitle || article.seoDescription || 'Preskúmajte fascinujúcu históriu rímskeho impéria.'}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4 text-red-500" />
                      <span>{formattedDate}</span>
                    </div>
                    {article.author && (
                      <div className="flex items-center">
                        <User className="mr-1 h-4 w-4 text-red-500" />
                        <span>{article.author}</span>
                      </div>
                    )}
                    {article.readingTime && (
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-red-500" />
                        <span>{article.readingTime} min</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="bg-transparent">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-red-800/50 text-red-400 hover:bg-red-800/20 bg-transparent hover:border-red-600"
                  >
                    <Link href={`/history/${article.slug}`}>Čítať článok</Link>
                  </Button>
                </CardFooter>
              </Card>
                )
              })
            ) : (
              // Fallback when no articles available
              <div className="col-span-3 text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-4">Zatiaľ nemáme žiadne historické články</p>
                <Button asChild className="bg-red-800 hover:bg-red-900 text-white">
                  <Link href="/history">Pozrieť históriu</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Navigation Sections */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-red-800/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-red-600/10 rounded-full blur-2xl"></div>
        <div className="relative container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-red-800/30 mb-6">
              <div className="p-2 bg-red-800 rounded-lg">
                <span className="text-white text-lg">🏛️</span>
              </div>
              <span className="font-bold text-white">Objavte S.C.E.A.R.</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Preskúmajte S.C.E.A.R.</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Objavte všetky aspekty našej komunity rímskeho reenactmentu
            </p>
          </div>
          {/* Navigation Cards in Horizontal Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Gallery Card */}
            <Link href="/gallery" className="group">
              <div className="bg-white/5 backdrop-blur-sm border border-red-800/30 rounded-2xl p-6 h-full hover:bg-white/10 transition-all duration-300 hover:border-red-700/50">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <ImageIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">
                  Galéria
                </h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  Prezrite si našu zbierku fotografií z podujatí, reenactmentov a tréningov.
                </p>
              </div>
            </Link>

            {/* Join Us Card */}
            <Link href="/join-us" className="group">
              <div className="bg-white/5 backdrop-blur-sm border border-red-800/30 rounded-2xl p-6 h-full hover:bg-white/10 transition-all duration-300 hover:border-red-700/50">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">
                  Pridajte sa k nám
                </h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  Staňte sa členom našej historickej reenactment skupiny a preneste sa späť v čase.
                </p>
              </div>
            </Link>

            {/* History Card */}
            <Link href="/history" className="group">
              <div className="bg-white/5 backdrop-blur-sm border border-red-800/30 rounded-2xl p-6 h-full hover:bg-white/10 transition-all duration-300 hover:border-red-700/50">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">
                  História
                </h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  Spoznajte rímske pomocné zbory prostredníctvom našich článkov a výskumov.
                </p>
              </div>
            </Link>

            {/* Events Card */}
            <Link href="/events" className="group">
              <div className="bg-white/5 backdrop-blur-sm border border-red-800/30 rounded-2xl p-6 h-full hover:bg-white/10 transition-all duration-300 hover:border-red-700/50">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">
                  Podujatia
                </h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  Zúčastnite sa našich nadchádzajúcich akcií, reenactmentov a tréningov.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
