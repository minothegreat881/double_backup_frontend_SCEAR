import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'scear-hero'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileBase64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${fileBase64}`

    // Use signed upload with API credentials from env
    const timestamp = Math.round(new Date().getTime() / 1000)
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '521365131889896'
    const apiSecret = process.env.CLOUDINARY_API_SECRET || 'bN5oAFXzoC-k-R31Z4Gxhd7Rngw'
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dii0wl9ke'

    // Create signature for signed upload
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`
    const signature = crypto
      .createHash('sha256')
      .update(`${paramsToSign}${apiSecret}`)
      .digest('hex')

    // Create form data for Cloudinary
    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append('file', dataURI)
    cloudinaryFormData.append('folder', folder)
    cloudinaryFormData.append('timestamp', timestamp.toString())
    cloudinaryFormData.append('api_key', apiKey)
    cloudinaryFormData.append('signature', signature)

    // Upload to Cloudinary
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData,
      }
    )

    const cloudinaryData = await cloudinaryResponse.json()

    if (!cloudinaryResponse.ok) {
      console.error('Cloudinary error:', cloudinaryData)
      return NextResponse.json(
        { error: 'Failed to upload to Cloudinary', details: cloudinaryData },
        { status: 500 }
      )
    }

    return NextResponse.json({
      url: cloudinaryData.secure_url,
      publicId: cloudinaryData.public_id,
      secure_url: cloudinaryData.secure_url,
      public_id: cloudinaryData.public_id,
      width: cloudinaryData.width,
      height: cloudinaryData.height,
      format: cloudinaryData.format,
      resource_type: cloudinaryData.resource_type,
      created_at: cloudinaryData.created_at,
      bytes: cloudinaryData.bytes,
      type: cloudinaryData.type,
      etag: cloudinaryData.etag,
      version: cloudinaryData.version,
      original_filename: cloudinaryData.original_filename,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}