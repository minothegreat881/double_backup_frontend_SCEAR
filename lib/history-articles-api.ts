// History Articles API
import qs from 'qs'

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || (
  process.env.NODE_ENV === 'production'
    ? 'https://api.autoweb.store'
    : 'http://localhost:1341'
)

// Types
export interface HistoryArticle {
  id: number
  documentId: string
  title: string
  slug: string
  subtitle?: string
  category: 'auxiliary-forces' | 'legion-history' | 'equipment' | 'tactics' | 'culture' | 'archaeology'
  publishedDate: string
  featured: boolean
  status: 'draft' | 'published' | 'archived'

  // Hero Section
  heroImage?: any
  heroTitle?: string
  heroDescription?: string

  // Main Content
  mainContent?: any

  // Sidebar Components
  sidebarComponents?: any[]

  // SEO
  seoTitle?: string
  seoDescription?: string
  seoImage?: any

  // Metadata
  author?: string
  tags?: string[]
  readingTime?: number
  sortOrder: number

  createdAt?: string
  updatedAt?: string
  publishedAt?: string
}

export interface BlockContent {
  id: string
  type: 'heading' | 'paragraph' | 'image' | 'quote' | 'list' | 'code' | 'table'
  content?: any
  level?: number // for heading
  format?: 'ordered' | 'unordered' // for list
}

function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('scear-admin-auth') ? 'authenticated' : null
  }
  return null
}

// Fetch all articles
export async function fetchHistoryArticles(params?: {
  page?: number
  pageSize?: number
  sort?: string
  filters?: any
}): Promise<{ data: HistoryArticle[], meta: any }> {
  try {
    const queryParams = params ? qs.stringify({
      pagination: {
        page: params.page || 1,
        pageSize: params.pageSize || 25
      },
      sort: params.sort || 'sortOrder:asc,publishedDate:desc',
      filters: params.filters || {},
      populate: '*'
    }) : qs.stringify({ populate: '*' })

    const response = await fetch(
      `${STRAPI_BASE_URL}/api/history-articles?${queryParams}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      console.warn(`History Articles API error: ${response.status}`)
      return { data: [], meta: {} }
    }

    const result = await response.json()

    // Transform Strapi response to our format
    // Handle both formats - with attributes and without
    const articles = result.data?.map((item: any) => {
      const hasAttributes = item.attributes !== undefined
      let articleData = {
        id: item.id,
        documentId: item.documentId || '',
        ...(hasAttributes ? item.attributes : item)
      }

      // Transform image data if needed
      if (articleData.heroImage?.data) {
        articleData.heroImage = articleData.heroImage.data.attributes || articleData.heroImage.data
      }
      if (articleData.seoImage?.data) {
        articleData.seoImage = articleData.seoImage.data.attributes || articleData.seoImage.data
      }
      if (articleData.mainImage?.data) {
        articleData.mainImage = articleData.mainImage.data.attributes || articleData.mainImage.data
      }

      return articleData
    }) || []

    return { data: articles, meta: result.meta }
  } catch (error) {
    console.error('Error fetching history articles:', error)
    return { data: [], meta: {} }
  }
}

// Fetch single article by ID or slug
export async function fetchHistoryArticle(idOrSlug: string): Promise<HistoryArticle | null> {
  console.log('Fetching article with idOrSlug:', idOrSlug)
  try {
    // First try to get by ID (if it's a number)
    if (!isNaN(Number(idOrSlug))) {
      const response = await fetch(
        `${STRAPI_BASE_URL}/api/history-articles/${idOrSlug}?populate=*`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      )

      if (response.ok) {
        const result = await response.json()
        if (result.data) {
          return {
            id: result.data.id,
            documentId: result.data.documentId || '',
            ...result.data.attributes
          }
        }
      }
    }

    // If not found by ID or idOrSlug is not a number, search by slug
    const url = `${STRAPI_BASE_URL}/api/history-articles?filters[slug][$eq]=${encodeURIComponent(idOrSlug)}&populate=*`
    console.log('Fetching from URL:', url)

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      console.warn(`History Article API error: ${response.status}`)
      return null
    }

    const result = await response.json()
    console.log('API Response:', result)

    if (!result.data || result.data.length === 0) {
      console.log('No article found with slug:', idOrSlug)
      return null
    }

    const article = result.data[0]
    // Handle both formats - article.attributes and direct properties
    const hasAttributes = article.attributes !== undefined
    let articleData = {
      id: article.id,
      documentId: article.documentId || '',
      ...(hasAttributes ? article.attributes : article)
    }

    // Transform image data if needed
    if (articleData.heroImage?.data) {
      articleData.heroImage = articleData.heroImage.data.attributes || articleData.heroImage.data
    }
    if (articleData.seoImage?.data) {
      articleData.seoImage = articleData.seoImage.data.attributes || articleData.seoImage.data
    }
    if (articleData.mainImage?.data) {
      articleData.mainImage = articleData.mainImage.data.attributes || articleData.mainImage.data
    }

    // Transform contentImages if needed
    if (articleData.contentImages && Array.isArray(articleData.contentImages)) {
      console.log('ContentImages before transform:', articleData.contentImages)
      articleData.contentImages = articleData.contentImages.map((item: any) => {
        if (item.image?.data) {
          return {
            ...item,
            image: item.image.data.attributes || item.image.data
          }
        }
        return item
      })
      console.log('ContentImages after transform:', articleData.contentImages)
    }

    console.log('Returning article:', articleData)
    console.log('SidebarComponents in response:', articleData.sidebarComponents)
    console.log('ContentImages in response:', articleData.contentImages)

    if (articleData.sidebarComponents) {
      articleData.sidebarComponents.forEach((comp: any, index: number) => {
        console.log(`Sidebar component ${index}:`, {
          __component: comp.__component,
          dataKeys: Object.keys(comp),
          fullComponent: comp
        })
      })
    }

    return articleData
  } catch (error) {
    console.error('Error fetching history article:', error)
    return null
  }
}

// Create article
export async function createHistoryArticle(data: Partial<HistoryArticle>): Promise<HistoryArticle | null> {
  try {
    const token = getAuthToken()
    if (!token) throw new Error('Not authenticated')

    // Clean data for Strapi
    const { id, documentId, createdAt, updatedAt, publishedAt, ...cleanData } = data

    // Transform mainContent to proper Strapi RichText format if needed
    const transformedMainContent = (() => {
      if (!cleanData.mainContent || (Array.isArray(cleanData.mainContent) && cleanData.mainContent.length === 0)) {
        // Return empty rich text format that Strapi expects
        return [{
          type: 'paragraph',
          children: [{ type: 'text', text: '' }]
        }]
      }

      // If mainContent is already in proper format, use it
      if (Array.isArray(cleanData.mainContent) && cleanData.mainContent[0]?.children) {
        return cleanData.mainContent
      }

      // Transform blocks to Strapi format
      if (Array.isArray(cleanData.mainContent)) {
        return cleanData.mainContent.map(block => {
          if (block.type === 'paragraph') {
            return {
              type: 'paragraph',
              children: [{ type: 'text', text: block.content || '' }]
            }
          }
          if (block.type === 'heading') {
            return {
              type: `heading`,
              level: block.level || 2,
              children: [{ type: 'text', text: block.content || '' }]
            }
          }
          if (block.type === 'list') {
            return {
              type: 'list',
              format: block.format || 'unordered',
              children: (block.items || block.content || []).map((item: string) => ({
                type: 'list-item',
                children: [{ type: 'text', text: item }]
              }))
            }
          }
          if (block.type === 'quote') {
            return {
              type: 'quote',
              children: [{ type: 'text', text: block.content || '' }]
            }
          }
          // Default paragraph format
          return {
            type: 'paragraph',
            children: [{ type: 'text', text: JSON.stringify(block) }]
          }
        })
      }

      // If mainContent is a string, convert to paragraph
      if (typeof cleanData.mainContent === 'string') {
        return [{
          type: 'paragraph',
          children: [{ type: 'text', text: cleanData.mainContent }]
        }]
      }

      // Default empty paragraph
      return [{
        type: 'paragraph',
        children: [{ type: 'text', text: '' }]
      }]
    })()

    // Clean sidebar components - remove id and flatten data
    const cleanSidebarComponents = (cleanData.sidebarComponents || [])
      .map((comp: any) => {
        const { id, data, ...cleanComp } = comp

        // Handle key-facts component
        if (comp.__component === 'sidebar.key-facts') {
          const facts = data?.facts || comp.facts
          if (facts && facts.length > 0) {
            return {
              __component: comp.__component,
              facts: facts
            }
          }
          return null // Skip if no facts
        }

        // Handle timeline component
        if (comp.__component === 'sidebar.timeline') {
          const events = data?.events || comp.events
          if (events && events.length > 0) {
            return {
              __component: comp.__component,
              events: events
            }
          }
          return null // Skip if no events
        }

        // For other components, merge data if exists
        if (data) {
          return {
            __component: comp.__component,
            ...data
          }
        }
        return cleanComp
      })
      .filter(Boolean) // Remove null components

    // Handle contentImages - clean up any invalid fields
    const cleanContentImages = cleanData.contentImages
      ? (Array.isArray(cleanData.contentImages) ? cleanData.contentImages : [])
        .map((img: any) => {
          // Only keep valid fields for content-image component
          const { blockIndex, ...validImageData } = img
          return {
            image: typeof img.image === 'number' ? img.image : img.image?.id,
            caption: img.caption || '',
            alt: img.alt || '',
            position: img.position || 'left',
            width: img.width || '50',
            showCaption: img.showCaption !== false,
            rounded: img.rounded !== false,
            shadow: img.shadow !== false,
            pairWithNext: img.pairWithNext === true
          }
        })
        .filter(img => img.image) // Only keep images with valid IDs
      : []

    // Ensure required fields have default values
    // Don't spread cleanData first to avoid including id and documentId
    const articleData = {
      title: cleanData.title || 'Untitled Article',
      slug: cleanData.slug || generateSlug(cleanData.title || 'Untitled Article'),
      category: cleanData.category || 'legion-history',
      status: cleanData.status || 'draft',
      featured: cleanData.featured ?? false,
      sortOrder: cleanData.sortOrder ?? 0,
      publishedDate: cleanData.publishedDate || new Date().toISOString(),
      mainContent: transformedMainContent,
      sidebarComponents: cleanSidebarComponents,
      contentImages: cleanContentImages.length > 0 ? cleanContentImages : undefined,
      subtitle: cleanData.subtitle || undefined,
      heroTitle: cleanData.heroTitle || undefined,
      heroDescription: cleanData.heroDescription || undefined,
      // Handle image upload - if it's a number (media ID), use it directly for the relation
      // If it's an object with ID, use the ID. Otherwise undefined
      heroImage: typeof cleanData.heroImage === 'number'
        ? cleanData.heroImage
        : cleanData.heroImage?.id || undefined,
      mainImage: typeof cleanData.mainImage === 'number'
        ? cleanData.mainImage
        : cleanData.mainImage?.id || undefined,
      seoTitle: cleanData.seoTitle || undefined,
      seoDescription: cleanData.seoDescription || undefined,
      seoImage: typeof cleanData.seoImage === 'number'
        ? cleanData.seoImage
        : cleanData.seoImage?.id || undefined,
      author: cleanData.author || undefined,
      tags: cleanData.tags || undefined,
      readingTime: cleanData.readingTime || undefined
    }

    // Remove any undefined values
    const finalArticleData = Object.fromEntries(
      Object.entries(articleData).filter(([_, v]) => v !== undefined)
    )

    console.log('Creating article with data:', finalArticleData)
    console.log('Request body:', JSON.stringify({ data: finalArticleData }))

    const response = await fetch(`${STRAPI_BASE_URL}/api/history-articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ data: finalArticleData })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Error creating article:', error)
      throw new Error(`Failed to create article: ${response.status}`)
    }

    const result = await response.json()

    return {
      id: result.data.id,
      documentId: result.data.documentId || '',
      ...result.data.attributes
    }
  } catch (error) {
    console.error('Error creating history article:', error)
    return null
  }
}

// Update article
export async function updateHistoryArticle(id: number | string, data: Partial<HistoryArticle>): Promise<HistoryArticle | null> {
  try {
    const token = getAuthToken()
    if (!token) throw new Error('Not authenticated')

    // Clean data for Strapi - remove all system fields
    const { id: _, documentId: docId, createdAt, updatedAt, publishedAt, ...cleanData } = data

    // Use documentId if available (Strapi v5), fallback to id
    const articleId = docId || id

    // Clean sidebar components - remove id field, flatten data, and filter out empty components
    // For Strapi v5, we need to send empty array to clear components, not undefined
    const cleanSidebarComponents = cleanData.sidebarComponents ?
      cleanData.sidebarComponents
        .map((comp: any) => {
          const { id, data, ...rest } = comp

          // Check if component has valid data before flattening
          if (comp.__component === 'sidebar.key-facts') {
            const facts = data?.facts || rest.facts || []
            if (facts.length === 0) {
              return null // Skip empty key-facts
            }
            // Return with valid facts, removing any id fields from facts
            return {
              __component: comp.__component,
              facts: facts.map((fact: any) => ({
                number: fact.number,
                title: fact.title,
                description: fact.description
              }))
            }
          }

          if (comp.__component === 'sidebar.timeline') {
            const events = data?.events || rest.events || []
            if (events.length === 0) {
              return null // Skip empty timeline
            }
            // Return with valid events, removing any id fields from events
            return {
              __component: comp.__component,
              events: events.map((event: any) => ({
                year: event.year || '',
                event: event.event || ''  // IMPORTANT: field name is 'event', not 'title'
              }))
            }
          }

          // For other component types, flatten data if exists
          if (data) {
            return {
              __component: comp.__component,
              ...data
            }
          }
          return {
            __component: comp.__component,
            ...rest
          }
        })
        .filter(Boolean) // Remove null entries
      : [] // Use empty array instead of undefined to clear all components

    // Handle contentImages - clean up any invalid fields
    const cleanContentImages = cleanData.contentImages
      ? (Array.isArray(cleanData.contentImages) ? cleanData.contentImages : [])
        .map((img: any) => {
          // Only keep valid fields for content-image component
          const { blockIndex, ...validImageData } = img
          return {
            image: typeof img.image === 'number' ? img.image : img.image?.id,
            caption: img.caption || '',
            alt: img.alt || '',
            position: img.position || 'left',
            width: img.width || '50',
            showCaption: img.showCaption !== false,
            rounded: img.rounded !== false,
            shadow: img.shadow !== false,
            pairWithNext: img.pairWithNext === true
          }
        })
        .filter(img => img.image) // Only keep images with valid IDs
      : []

    // Handle image relations - convert to media IDs if needed
    const processedData: any = {
      ...cleanData,
      sidebarComponents: cleanSidebarComponents,
      contentImages: cleanContentImages.length > 0 ? cleanContentImages : undefined,
      heroImage: typeof cleanData.heroImage === 'number'
        ? cleanData.heroImage
        : cleanData.heroImage?.id || undefined,
      mainImage: typeof cleanData.mainImage === 'number'
        ? cleanData.mainImage
        : cleanData.mainImage?.id || undefined,
      seoImage: typeof cleanData.seoImage === 'number'
        ? cleanData.seoImage
        : cleanData.seoImage?.id || undefined
    }

    // Extra safety - remove any id field that might have snuck in
    if ('id' in processedData) {
      delete processedData.id
    }

    // Remove undefined values
    Object.keys(processedData).forEach(key => {
      if (processedData[key] === undefined) {
        delete processedData[key]
      }
    })

    console.log('Updating article with ID:', articleId)
    console.log('Processed data:', processedData)
    console.log('Data keys:', Object.keys(processedData))

    const bodyToSend = { data: processedData }
    console.log('Full body being sent:', JSON.stringify(bodyToSend, null, 2))

    const response = await fetch(`${STRAPI_BASE_URL}/api/history-articles/${articleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(bodyToSend)
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Error updating article:', error)
      throw new Error(`Failed to update article: ${response.status}`)
    }

    const result = await response.json()

    return {
      id: result.data.id,
      documentId: result.data.documentId || '',
      ...result.data.attributes
    }
  } catch (error) {
    console.error('Error updating history article:', error)
    return null
  }
}

// Delete article - using documentId for Strapi v5
export async function deleteHistoryArticle(idOrDocumentId: number | string): Promise<boolean> {
  try {
    const token = getAuthToken()
    if (!token) throw new Error('Not authenticated')

    console.log('Attempting to delete article with ID:', idOrDocumentId)

    // For Strapi v5, we need to use documentId
    const response = await fetch(`${STRAPI_BASE_URL}/api/history-articles/${idOrDocumentId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Error deleting article:', error)
      console.error('Response status:', response.status)
      return false
    }

    console.log('Article deleted successfully')
    return true
  } catch (error) {
    console.error('Error deleting history article:', error)
    return false
  }
}

// Upload image for article
export async function uploadArticleImage(file: File): Promise<any> {
  try {
    const formData = new FormData()
    formData.append('files', file)

    // Use raw-upload endpoint like gallery does
    const response = await fetch(`${STRAPI_BASE_URL}/api/raw-upload`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.status}`)
    }

    const result = await response.json()
    return result[0] // Strapi returns array of uploaded files
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

// Helper function to transform article for display
export function transformArticleForDisplay(article: any): HistoryArticle {
  if (!article) return null

  // Handle both direct object and Strapi response format
  if (article.attributes) {
    return {
      id: article.id,
      documentId: article.documentId || '',
      ...article.attributes,
      heroImage: article.attributes.heroImage?.data?.attributes || article.attributes.heroImage,
      seoImage: article.attributes.seoImage?.data?.attributes || article.attributes.seoImage,
      mainImage: article.attributes.mainImage?.data?.attributes || article.attributes.mainImage
    }
  }

  // Also handle the nested data structure in the main object
  if (article.heroImage?.data) {
    article.heroImage = article.heroImage.data.attributes || article.heroImage.data
  }
  if (article.seoImage?.data) {
    article.seoImage = article.seoImage.data.attributes || article.seoImage.data
  }
  if (article.mainImage?.data) {
    article.mainImage = article.mainImage.data.attributes || article.mainImage.data
  }

  return article
}

// Helper to generate slug from title
export function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/--+/g, '-') // Replace multiple - with single -
    .trim()
    .replace(/^-+|-+$/g, '') // Remove leading/trailing -

  // Add timestamp to ensure uniqueness
  const timestamp = Date.now()
  return `${baseSlug}-${timestamp}`
}

// Helper to calculate reading time
export function calculateReadingTime(content: any): number {
  if (!content) return 0

  const text = typeof content === 'string' ? content : JSON.stringify(content)
  const words = text.split(/\s+/).length
  const readingTime = Math.ceil(words / 200) // 200 words per minute

  return Math.max(1, readingTime) // Minimum 1 minute
}