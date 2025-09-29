"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Search, Filter, ChevronLeft, Eye, Edit2, Trash2, Save, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  fetchHistoryArticles,
  deleteHistoryArticle,
  type HistoryArticle
} from "@/lib/history-articles-api"
import ArticlesList from "./history-articles/articles-list"
import ArticleEditor from "./history-articles/article-editor"
import ArticlePreview from "./history-articles/article-preview"

type ViewMode = 'list' | 'editor' | 'preview'

export default function HistoryArticlesManager() {
  const [articles, setArticles] = useState<HistoryArticle[]>([])
  const [selectedArticle, setSelectedArticle] = useState<HistoryArticle | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState<HistoryArticle | null>(null)
  const { toast } = useToast()

  // Load articles
  const loadArticles = async () => {
    setIsLoading(true)
    try {
      const filters: any = {}

      if (filterCategory !== "all") {
        filters.category = { $eq: filterCategory }
      }

      if (filterStatus !== "all") {
        filters.status = { $eq: filterStatus }
      }

      if (searchQuery) {
        filters.title = { $containsi: searchQuery }
      }

      const result = await fetchHistoryArticles({ filters })
      setArticles(result.data)
    } catch (error) {
      console.error("Error loading articles:", error)
      toast({
        title: "Error",
        description: "Failed to load history articles",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadArticles()
  }, [filterCategory, filterStatus])

  // Handle article selection
  const handleSelectArticle = (article: HistoryArticle) => {
    setSelectedArticle(article)
    setViewMode('preview')
  }

  // Handle create new article
  const handleCreateNew = () => {
    const newArticle: Partial<HistoryArticle> = {
      title: "",
      slug: "",
      subtitle: "",
      category: "legion-history",
      publishedDate: new Date().toISOString(),
      featured: false,
      status: "draft",
      mainContent: [],
      sidebarComponents: [],
      sortOrder: 0,
    }

    setSelectedArticle(newArticle as HistoryArticle)
    setViewMode('editor')
  }

  // Handle edit article
  const handleEditArticle = (article: HistoryArticle) => {
    setSelectedArticle(article)
    setViewMode('editor')
  }

  // Handle delete article
  const handleDeleteClick = (article: HistoryArticle) => {
    setArticleToDelete(article)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return

    try {
      const success = await deleteHistoryArticle(articleToDelete.documentId || articleToDelete.id)

      if (success) {
        toast({
          title: "Success",
          description: "Article deleted successfully",
        })

        // Remove from local state
        setArticles(articles.filter(a => (a.documentId || a.id) !== (articleToDelete.documentId || articleToDelete.id)))

        // Clear selection if deleted article was selected
        if ((selectedArticle?.documentId || selectedArticle?.id) === (articleToDelete.documentId || articleToDelete.id)) {
          setSelectedArticle(null)
          setViewMode('list')
        }
      } else {
        throw new Error("Failed to delete article")
      }
    } catch (error) {
      console.error("Error deleting article:", error)
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setArticleToDelete(null)
    }
  }

  // Handle save from editor
  const handleSaveArticle = async (article: HistoryArticle) => {
    // Reload articles
    await loadArticles()

    // Show success message
    toast({
      title: "Success",
      description: "Article saved successfully",
    })

    // Switch to preview mode
    setSelectedArticle(article)
    setViewMode('preview')
  }

  // Handle cancel from editor
  const handleCancelEdit = () => {
    setViewMode(selectedArticle?.id ? 'preview' : 'list')
  }

  // Filtered articles for grid view
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = filterCategory === "all" || article.category === filterCategory
    const matchesStatus = filterStatus === "all" || article.status === filterStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">History Articles</h2>
          <p className="text-white/70">Manage historical content and articles</p>
        </div>
        <Button
          onClick={handleCreateNew}
          className="bg-red-800 text-white hover:bg-red-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Article
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-6">
        {/* Left Sidebar - Articles List */}
        <div className="w-80 flex-shrink-0">
          <Card className="h-full bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <div className="space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 gap-2">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="auxiliary-forces">Auxiliary Forces</SelectItem>
                      <SelectItem value="legion-history">Legion History</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="tactics">Tactics</SelectItem>
                      <SelectItem value="culture">Culture</SelectItem>
                      <SelectItem value="archaeology">Archaeology</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ArticlesList
                articles={filteredArticles}
                selectedArticle={selectedArticle}
                onSelect={handleSelectArticle}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {viewMode === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.map(article => (
                <Card
                  key={article.id}
                  className="bg-gray-800 border-gray-700 hover:border-red-800/50 transition-colors cursor-pointer group"
                  onClick={() => handleSelectArticle(article)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
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
                      {article.featured && (
                        <Badge className="bg-red-800/20 text-red-400 border-red-800">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-white group-hover:text-red-400 transition-colors line-clamp-2">
                      {article.title}
                    </CardTitle>
                    {article.subtitle && (
                      <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                        {article.subtitle}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{article.category?.replace('-', ' ') || 'Uncategorized'}</span>
                      {article.readingTime && (
                        <span>{article.readingTime} min read</span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditArticle(article)
                        }}
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-400 hover:text-red-300"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteClick(article)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {viewMode === 'editor' && selectedArticle && (
            <ArticleEditor
              article={selectedArticle}
              onSave={handleSaveArticle}
              onCancel={handleCancelEdit}
            />
          )}

          {viewMode === 'preview' && selectedArticle && (
            <ArticlePreview
              article={selectedArticle}
              onEdit={() => handleEditArticle(selectedArticle)}
              onDelete={() => handleDeleteClick(selectedArticle)}
              onClose={() => setViewMode('list')}
            />
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete "{articleToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}