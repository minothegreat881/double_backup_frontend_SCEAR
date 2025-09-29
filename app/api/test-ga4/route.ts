import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    GA4_PROPERTY_ID: process.env.GA4_PROPERTY_ID || 'missing',
    GA4_CLIENT_EMAIL: process.env.GA4_CLIENT_EMAIL ? 'present' : 'missing',
    GA4_PRIVATE_KEY: process.env.GA4_PRIVATE_KEY ? 'present' : 'missing',
    NODE_ENV: process.env.NODE_ENV
  })
}