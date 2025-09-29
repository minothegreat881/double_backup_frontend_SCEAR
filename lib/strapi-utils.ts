// Helper function to get full URL for Strapi images
export function getStrapiImageUrl(url: string | undefined): string {
  if (!url) return ''

  // If it's already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // If it starts with /, add the Strapi API URL
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1341'
  return `${apiUrl}${url.startsWith('/') ? '' : '/'}${url}`
}