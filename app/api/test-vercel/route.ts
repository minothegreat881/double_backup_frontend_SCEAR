import { NextResponse } from 'next/server'
import { getVercelAnalyticsData, testVercelConnection } from '@/lib/vercel-analytics'

export async function GET() {
  try {
    console.log('Testing Vercel Analytics integration...')

    const connected = await testVercelConnection()
    const data = await getVercelAnalyticsData()

    console.log('Vercel connection:', connected)
    console.log('Vercel data:', data)

    return NextResponse.json({
      success: true,
      connected,
      data
    })
  } catch (error) {
    console.error('Vercel Analytics test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
  }
}