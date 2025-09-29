import { NextResponse } from 'next/server'
import { getVercelAnalyticsData, convertVercelToAnalytics } from '@/lib/vercel-analytics'

export async function GET() {
  try {
    console.log('🔍 Fetching Vercel Analytics data...')

    const vercelData = await getVercelAnalyticsData()

    if (!vercelData) {
      return NextResponse.json({
        success: false,
        error: 'No Vercel Analytics data available'
      })
    }

    const { realTimeData, reportData } = convertVercelToAnalytics(vercelData)

    console.log('✅ Vercel Analytics data processed successfully')
    console.log('Real-time active users:', realTimeData.activeUsers)
    console.log('Total users:', reportData.totalUsers)

    return NextResponse.json({
      success: true,
      isLiveDataAvailable: true,
      source: 'Vercel Analytics',
      realTimeData,
      reportData,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Vercel Analytics API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
  }
}