"use client"

import type React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock, Star } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { HistoryArticle } from "@/lib/history-articles-api"

interface ArticlesListProps {
  articles: HistoryArticle[]
  selectedArticle: HistoryArticle | null
  onSelect: (article: HistoryArticle) => void
  isLoading?: boolean
}

export default function ArticlesList({
  articles,
  selectedArticle,
  onSelect,
  isLoading = false
}: ArticlesListProps) {
  if (isLoading) {
    return (
      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4 bg-gray-700" />
              <Skeleton className="h-3 w-full bg-gray-700" />
              <Skeleton className="h-3 w-1/2 bg-gray-700" />
            </div>
          ))}
        </div>
      </ScrollArea>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p>No articles found</p>
        <p className="text-sm mt-2">Try adjusting your filters or create a new article</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[calc(100vh-280px)]">
      <div className="p-2">
        {articles.map((article) => (
          <button
            key={article.id}
            onClick={() => onSelect(article)}
            className={cn(
              "w-full text-left p-3 rounded-lg mb-2 transition-all",
              "hover:bg-gray-700/50",
              selectedArticle?.id === article.id
                ? "bg-red-800/20 border border-red-800/50"
                : "bg-gray-700/20 border border-transparent"
            )}
          >
            <div className="flex items-start justify-between mb-1">
              <h4 className="font-medium text-white line-clamp-1 flex-1">
                {article.title}
              </h4>
              {article.featured && (
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 ml-1" />
              )}
            </div>

            {article.subtitle && (
              <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                {article.subtitle}
              </p>
            )}

            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs px-1.5 py-0",
                  article.status === 'published'
                    ? 'border-green-600 text-green-400'
                    : article.status === 'draft'
                    ? 'border-yellow-600 text-yellow-400'
                    : 'border-gray-600 text-gray-400'
                )}
              >
                {article.status}
              </Badge>
              <Badge
                variant="outline"
                className="text-xs px-1.5 py-0 border-gray-600 text-gray-400"
              >
                {article.category?.replace('-', ' ') || 'Uncategorized'}
              </Badge>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {article.publishedDate && format(new Date(article.publishedDate), 'MMM d, yyyy')}
              </div>
              {article.readingTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {article.readingTime} min
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}