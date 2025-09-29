"use client"

import { useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation"
import { fetchHistoryArticle, type HistoryArticle } from "@/lib/history-articles-api"
import HistoryDetailPage from "../HistoryDetailPage"
import { Loader2 } from "lucide-react"

export default function ArticlePage() {
  const params = useParams()
  const slug = params.slug as string
  const [article, setArticle] = useState<HistoryArticle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const loadArticle = async () => {
      // First check if it's a static article
      const staticArticles = ['auxiliary-forces', 'xv-legia-apollinaris']
      if (staticArticles.includes(slug)) {
        setIsLoading(false)
        return
      }

      // Try to fetch from API
      try {
        const fetchedArticle = await fetchHistoryArticle(slug)
        if (fetchedArticle) {
          setArticle(fetchedArticle)
        } else {
          setNotFound(true)
        }
      } catch (error) {
        console.error("Error fetching article:", error)
        setNotFound(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadArticle()
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-red-800 animate-spin" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Článok nenájdený</h1>
          <p className="mb-6">Požadovaný článok neexistuje.</p>
        </div>
      </div>
    )
  }

  // Use HistoryDetailPage component to display the article
  return <HistoryDetailPage slug={slug} article={article || undefined} />
}