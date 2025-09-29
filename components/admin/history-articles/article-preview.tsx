"use client"

import type React from "react"
import { ArrowLeft, Edit2, Trash2, Calendar, Clock, User } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import type { HistoryArticle } from "@/lib/history-articles-api"

interface ArticlePreviewProps {
  article: HistoryArticle
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}

export default function ArticlePreview({
  article,
  onEdit,
  onDelete,
  onClose
}: ArticlePreviewProps) {
  // Render block content for preview
  const renderBlockContent = (block: any) => {
    if (!block) return null

    switch (block.type) {
      case 'heading':
        const HeadingTag = `h${block.level || 2}` as keyof JSX.IntrinsicElements
        return (
          <HeadingTag className={`text-white font-bold mb-4 ${
            block.level === 2 ? 'text-2xl' : block.level === 3 ? 'text-xl' : 'text-lg'
          }`}>
            {block.content}
          </HeadingTag>
        )

      case 'paragraph':
        return (
          <p className="text-gray-300 mb-4 leading-relaxed">
            {block.content}
          </p>
        )

      case 'image':
        return block.content?.url ? (
          <div className="mb-6">
            <img
              src={block.content.url}
              alt={block.content.alt || ''}
              className="rounded-lg w-full max-h-96 object-cover"
            />
            {block.content.alt && (
              <p className="text-sm text-gray-400 mt-2 italic">{block.content.alt}</p>
            )}
          </div>
        ) : null

      case 'quote':
        return (
          <blockquote className="border-l-4 border-red-800 pl-4 my-6 italic">
            <p className="text-gray-300">{block.content?.text}</p>
            {block.content?.author && (
              <p className="text-gray-400 text-sm mt-2">— {block.content.author}</p>
            )}
          </blockquote>
        )

      case 'list':
        const ListTag = block.format === 'ordered' ? 'ol' : 'ul'
        return (
          <ListTag className={`mb-4 ${
            block.format === 'ordered' ? 'list-decimal' : 'list-disc'
          } list-inside text-gray-300`}>
            {Array.isArray(block.content) && block.content.map((item: string, i: number) => (
              <li key={i} className="mb-1">{item}</li>
            ))}
          </ListTag>
        )

      default:
        return null
    }
  }

  return (
    <Card className="h-full bg-gray-800 border-gray-700 overflow-hidden flex flex-col">
      {/* Header */}
      <CardHeader className="flex-shrink-0 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-xl font-semibold text-white">Article Preview</h3>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onEdit}
              className="hover:bg-gray-700"
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={onDelete}
              className="text-red-400 hover:text-red-300 hover:bg-red-950"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-8">
          {/* Article Metadata */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge
                variant={article.status === 'published' ? 'default' : 'secondary'}
                className={
                  article.status === 'published'
                    ? 'bg-green-800/20 text-green-400 border-green-800'
                    : article.status === 'draft'
                    ? 'bg-yellow-800/20 text-yellow-400 border-yellow-800'
                    : 'bg-gray-700 text-gray-400 border-gray-600'
                }
              >
                {article.status}
              </Badge>
              <Badge variant="outline" className="text-gray-400">
                {article.category?.replace('-', ' ') || 'Uncategorized'}
              </Badge>
              {article.featured && (
                <Badge className="bg-red-800/20 text-red-400 border-red-800">
                  Featured
                </Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold text-white mb-3">
              {article.title}
            </h1>

            {article.subtitle && (
              <p className="text-xl text-gray-400 mb-6">
                {article.subtitle}
              </p>
            )}

            <div className="flex items-center gap-6 text-sm text-gray-500">
              {article.author && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
              )}
              {article.publishedDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(article.publishedDate), 'MMMM d, yyyy')}</span>
                </div>
              )}
              {article.readingTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{article.readingTime} min read</span>
                </div>
              )}
            </div>
          </div>

          {/* Hero Section */}
          {(article.heroImage?.url || article.heroTitle || article.heroDescription) && (
            <div className="mb-8 p-6 bg-gray-700/30 rounded-lg">
              {article.heroImage?.url && (
                <img
                  src={article.heroImage.url}
                  alt="Hero"
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
              {article.heroTitle && (
                <h2 className="text-2xl font-bold text-white mb-2">{article.heroTitle}</h2>
              )}
              {article.heroDescription && (
                <p className="text-gray-300">{article.heroDescription}</p>
              )}
            </div>
          )}

          {/* Main Content */}
          <div className="prose prose-invert max-w-none">
            {Array.isArray(article.mainContent) && article.mainContent.length > 0 ? (
              article.mainContent.map((block: any, index: number) => (
                <div key={block.id || index}>
                  {renderBlockContent(block)}
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic">No content added yet.</p>
            )}
          </div>

          {/* Sidebar Components Preview */}
          {article.sidebarComponents && article.sidebarComponents.length > 0 && (
            <div className="mt-12 p-6 bg-gray-700/30 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Sidebar Components</h3>
              <div className="space-y-4">
                {article.sidebarComponents.map((component: any, index: number) => (
                  <div key={index} className="p-4 bg-gray-800 rounded">
                    <p className="text-sm text-gray-400">
                      Component: {component.__component || 'Unknown'}
                    </p>
                    <pre className="text-xs text-gray-500 mt-2 overflow-x-auto">
                      {JSON.stringify(component.data || component, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO Preview */}
          {(article.seoTitle || article.seoDescription) && (
            <div className="mt-8 p-6 bg-gray-700/30 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">SEO Preview</h3>
              {article.seoTitle && (
                <p className="text-blue-400 mb-1">{article.seoTitle}</p>
              )}
              {article.seoDescription && (
                <p className="text-gray-400 text-sm">{article.seoDescription}</p>
              )}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {article.tags.map((tag: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}