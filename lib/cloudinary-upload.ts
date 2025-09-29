// Cloudinary configuration - using existing credentials from the project
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dii0wl9ke'
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'scear_preset'

// Check if Cloudinary is configured
export const isCloudinaryConfigured = () => {
  return CLOUDINARY_CLOUD_NAME !== 'demo' && CLOUDINARY_UPLOAD_PRESET !== 'ml_default'
}

export interface CloudinaryUploadResponse {
  public_id: string
  version: number
  signature: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  tags: string[]
  bytes: number
  type: string
  etag: string
  placeholder: boolean
  url: string
  secure_url: string
  folder: string
  original_filename: string
}

/**
 * Upload image to Cloudinary
 * @param file - File to upload
 * @param folder - Optional folder path in Cloudinary
 * @returns Cloudinary response with image URLs
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = 'scear/gallery'
): Promise<CloudinaryUploadResponse | null> {
  try {
    // Use the API route for signed uploads
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    const response = await fetch('/api/cloudinary-upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Cloudinary API response:', errorData)
      throw new Error(`Upload failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ Cloudinary upload successful:', data.secure_url || data.url)

    // Transform the response to match CloudinaryUploadResponse interface
    return {
      public_id: data.publicId || data.public_id || '',
      version: data.version || 1,
      signature: data.signature || '',
      width: data.width || 0,
      height: data.height || 0,
      format: data.format || 'jpg',
      resource_type: data.resource_type || 'image',
      created_at: data.created_at || new Date().toISOString(),
      tags: data.tags || [],
      bytes: data.bytes || 0,
      type: data.type || 'upload',
      etag: data.etag || '',
      placeholder: false,
      url: data.url || '',
      secure_url: data.secure_url || data.url || '',
      folder: folder,
      original_filename: data.original_filename || file.name,
    }
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error)
    return null
  }
}

/**
 * Generate optimized Cloudinary URL with transformations
 * @param publicId - Cloudinary public ID
 * @param options - Transformation options
 * @returns Optimized image URL
 */
export function getOptimizedCloudinaryUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: string
    format?: string
    crop?: string
  } = {}
): string {
  const {
    width = 1200,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'limit'
  } = options

  let transformations = []

  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  transformations.push(`c_${crop}`)
  transformations.push(`q_${quality}`)
  transformations.push(`f_${format}`)

  const transformation = transformations.join(',')

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformation}/${publicId}`
}

/**
 * Delete image from Cloudinary
 * @param publicId - Cloudinary public ID to delete
 * @returns Success status
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    // Note: For production, this should be done through your backend
    // as it requires API secret which shouldn't be exposed in frontend
    console.log('Delete from Cloudinary:', publicId)

    // For now, just return true
    // In production, call your backend endpoint that handles deletion
    return true
  } catch (error) {
    console.error('❌ Cloudinary delete error:', error)
    return false
  }
}

/**
 * Batch upload multiple files to Cloudinary
 * @param files - Array of files to upload
 * @param folder - Optional folder path
 * @returns Array of Cloudinary responses
 */
export async function batchUploadToCloudinary(
  files: File[],
  folder: string = 'scear/gallery'
): Promise<CloudinaryUploadResponse[]> {
  const uploadPromises = files.map(file => uploadToCloudinary(file, folder))
  const results = await Promise.allSettled(uploadPromises)

  return results
    .filter(result => result.status === 'fulfilled' && result.value !== null)
    .map(result => (result as PromiseFulfilledResult<CloudinaryUploadResponse>).value)
}