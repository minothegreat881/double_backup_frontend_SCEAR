"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Loader2, Clock, User, Calendar } from "lucide-react"
import RomanSectionHeader from "@/components/roman-section-header"
import { fetchHistoryArticles, type HistoryArticle } from "@/lib/history-articles-api"
import { getStrapiImageUrl } from "@/lib/strapi-utils"
import { useHeroImage } from "@/hooks/use-hero-images"

type StaticArticle = {
  title: string
  description: string
  href: string
  imageUrl: string
}

export default function HistoryPage() {
  const { heroImage } = useHeroImage('historyPage')
  const [articles, setArticles] = useState<HistoryArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load articles from API
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      const result = await fetchHistoryArticles({
        sort: 'sortOrder:asc,publishedDate:desc'
      })
      // Show all articles for now, filter can be added later
      console.log('Loaded articles:', result.data)
      setArticles(result.data)
    } catch (error) {
      console.error('Error loading articles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const staticArticles: StaticArticle[] = [
    {
      title: "Rímska armáda a pomocné zbory",
      description: "Komplexný pohľad na štruktúru a význam pomocných zborov v rímskej armáde.",
      href: "/history/auxiliary-forces",
      imageUrl: "/images/gallery/roman-battle-formation.png",
    },
    {
      title: "XV. légia Apollinaris",
      description: "História XV. légie Apollinaris a jej pôsobenie v Rímskej ríši.",
      href: "/history/xv-legia-apollinaris",
      imageUrl: "/images/gallery/roman-formation.png",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      <main>
        {/* Enhanced Hero Section - Matching main page style */}
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt="Roman History Background"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              {/* Roman Eagle Badge */}
              <div className="inline-flex items-center gap-3 bg-red-800/90 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-red-600/30">
                <span className="text-2xl">🦅</span>
                <span className="font-bold text-white uppercase tracking-wider">SPQR</span>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
                História <span className="text-red-500">Rímskeho</span> Dedičstva
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                Preskúmajte bohatú históriu légií a pomocných zborov, ktoré formovali antický svet
              </p>
            </div>
          </div>
        </section>

        {/* Articles Section */}
        <section className="py-16 md:py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Historické <span className="text-red-500">Články</span>
              </h2>
              <div className="w-24 h-1 bg-red-600 mx-auto mb-4" />
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Ponorte sa do fascinujúcej histórie rímskych légií a pomocných zborov
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 text-red-500 animate-spin" />
              </div>
            )}

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Show API articles if available */}
              {articles.length > 0 ? (
                articles.map((article) => {
                  const imageUrl = getStrapiImageUrl(article.heroImage?.url) ||
                                  getStrapiImageUrl(article.heroImage?.data?.attributes?.url) ||
                                  getStrapiImageUrl(article.mainImage?.url) ||
                                  getStrapiImageUrl(article.mainImage?.data?.attributes?.url) ||
                                  getStrapiImageUrl(article.seoImage?.url) ||
                                  getStrapiImageUrl(article.seoImage?.data?.attributes?.url) ||
                                  '/images/gallery/roman-battle-formation.png'

                  const publishedDate = article.publishedDate ? new Date(article.publishedDate) : new Date()
                  const formattedDate = publishedDate.toLocaleDateString('sk-SK', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })

                  const categoryName = article.category?.replace('-', ' ').split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ') || 'História'

                  return (
                    <Card
                      key={article.id}
                      className="overflow-hidden bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 group border border-gray-700"
                    >
                      {/* Image Container */}
                      <div className="relative h-64 overflow-hidden bg-gray-700">
                        <Image
                          src={imageUrl}
                          alt={article.title || 'History article'}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider rounded-full">
                            {categoryName}
                          </span>
                        </div>

                        {/* Status Badge if draft */}
                        {article.status === 'draft' && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 bg-yellow-600/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider rounded-full">
                              Koncept
                            </span>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-6 bg-gray-800">
                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-red-500" />
                            <span>{formattedDate}</span>
                          </div>
                          {article.author && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4 text-red-500" />
                              <span>{article.author}</span>
                            </div>
                          )}
                          {article.readingTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-red-500" />
                              <span>{article.readingTime} min</span>
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-red-500 transition-colors">
                          {article.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-300 mb-6 line-clamp-3">
                          {article.subtitle || article.seoDescription || 'Preskúmajte fascinujúcu históriu rímskeho impéria.'}
                        </p>

                        {/* Tags if available */}
                        {article.tags && article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {article.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Read More Button */}
                        <Link href={`/history/${article.slug}`}>
                          <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all font-semibold">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Čítať článok
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )
                })
              ) : !isLoading ? (
                // Show static articles as fallback when no API articles
                staticArticles.map((article, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 group border border-gray-700"
                  >
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden bg-gray-700">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider rounded-full">
                          História
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-6 bg-gray-800">
                      {/* Title */}
                      <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-red-500 transition-colors">
                        {article.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-300 mb-6 line-clamp-3">
                        {article.description}
                      </p>

                      {/* Read More Button */}
                      <Link href={article.href}>
                        <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all font-semibold">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Čítať článok
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              ) : null}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}