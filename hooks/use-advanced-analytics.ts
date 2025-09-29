'use client'

import { useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import {
  trackAdvancedClick,
  trackScrollBehavior,
  trackPageEngagement,
  trackCTAClick,
  trackFormInteraction
} from '@/lib/advanced-tracking'

export const useAdvancedAnalytics = () => {
  const pathname = usePathname()

  useEffect(() => {
    // Initialize page tracking
    const cleanupScroll = trackScrollBehavior(pathname)
    const cleanupEngagement = trackPageEngagement(pathname)

    // Add click tracking to entire page
    const handleClick = (event: MouseEvent) => {
      trackAdvancedClick(event, pathname)
    }

    document.addEventListener('click', handleClick, { passive: true })

    // Cleanup function
    return () => {
      document.removeEventListener('click', handleClick)
      cleanupScroll()
      cleanupEngagement()
    }
  }, [pathname])

  // Utility functions for manual tracking
  const trackCTA = useCallback((ctaName: string, position: 'header' | 'content' | 'footer' | 'sidebar') => {
    trackCTAClick(ctaName, pathname, position)
  }, [pathname])

  const trackForm = useCallback((formName: string, action: 'start' | 'complete' | 'abandon', field?: string) => {
    trackFormInteraction(formName, action, field)
  }, [pathname])

  return {
    trackCTA,
    trackForm,
    currentPage: pathname
  }
}