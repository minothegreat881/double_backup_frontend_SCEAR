'use client'

import { useAdvancedAnalytics } from '@/hooks/use-advanced-analytics'

export default function AdvancedTracker() {
  useAdvancedAnalytics()

  // This component only handles tracking, renders nothing
  return null
}