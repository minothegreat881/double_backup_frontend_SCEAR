// Advanced user behavior tracking utilities

export interface ClickData {
  element: string
  page: string
  position: { x: number; y: number }
  timestamp: string
  viewport: { width: number; height: number }
  elementText?: string
  elementClass?: string
  elementId?: string
}

export interface ScrollData {
  page: string
  maxDepth: number
  timeToMaxDepth: number
  sections: string[]
  timestamp: string
}

export interface UserSession {
  sessionId: string
  startTime: string
  pages: string[]
  totalTime: number
  interactions: number
  device: string
  location?: string
}

// Enhanced click tracking with element details
export const trackAdvancedClick = (event: MouseEvent, page: string) => {
  const target = event.target as HTMLElement
  const rect = target.getBoundingClientRect()
  const scrollY = window.scrollY || document.documentElement.scrollTop

  const clickData: ClickData = {
    element: target.tagName.toLowerCase(),
    page: page,
    position: {
      x: event.clientX,
      y: event.clientY + scrollY
    },
    timestamp: new Date().toISOString(),
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    elementText: target.textContent?.slice(0, 50) || '',
    elementClass: target.className || '',
    elementId: target.id || ''
  }

  // Send to Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'advanced_click', {
      element_type: clickData.element,
      element_text: clickData.elementText,
      element_class: clickData.elementClass,
      element_id: clickData.elementId,
      click_x: clickData.position.x,
      click_y: clickData.position.y,
      viewport_width: clickData.viewport.width,
      viewport_height: clickData.viewport.height,
      page_location: page,
      custom_parameter_1: 'scear_interaction'
    })
  }

  return clickData
}

// Scroll behavior tracking
export const trackScrollBehavior = (page: string) => {
  let maxScrollDepth = 0
  let scrollStartTime = Date.now()
  let lastScrollTime = Date.now()
  const sectionsViewed: string[] = []

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const documentHeight = document.documentElement.scrollHeight
    const windowHeight = window.innerHeight

    const scrollPercentage = Math.round((scrollTop / (documentHeight - windowHeight)) * 100)

    if (scrollPercentage > maxScrollDepth) {
      maxScrollDepth = scrollPercentage

      // Track significant scroll milestones
      if ([25, 50, 75, 90, 100].includes(scrollPercentage)) {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'scroll_milestone', {
            page_location: page,
            scroll_percentage: scrollPercentage,
            time_to_scroll: Date.now() - scrollStartTime,
            scroll_speed: 'normal'
          })
        }
      }
    }

    // Track sections in view
    const sections = document.querySelectorAll('[data-section]')
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect()
      if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
        const sectionName = section.getAttribute('data-section') || 'unknown'
        if (!sectionsViewed.includes(sectionName)) {
          sectionsViewed.push(sectionName)

          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'section_view', {
              page_location: page,
              section_name: sectionName,
              time_to_view: Date.now() - scrollStartTime
            })
          }
        }
      }
    })

    lastScrollTime = Date.now()
  }

  window.addEventListener('scroll', handleScroll, { passive: true })

  // Return cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll)

    // Send final scroll data
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'scroll_session_end', {
        page_location: page,
        max_scroll_depth: maxScrollDepth,
        sections_viewed: sectionsViewed.length,
        total_scroll_time: lastScrollTime - scrollStartTime
      })
    }
  }
}

// Page engagement tracking
export const trackPageEngagement = (page: string) => {
  const startTime = Date.now()
  let isActive = true
  let totalActiveTime = 0
  let lastActivityTime = Date.now()

  const trackActivity = () => {
    if (isActive) {
      totalActiveTime += Date.now() - lastActivityTime
    }
    lastActivityTime = Date.now()
    isActive = true
  }

  const trackInactivity = () => {
    isActive = false
  }

  // Listen for user activity
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
  events.forEach(event => {
    document.addEventListener(event, trackActivity, { passive: true })
  })

  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      trackInactivity()
    } else {
      trackActivity()
    }
  })

  // Send engagement data periodically
  const engagementInterval = setInterval(() => {
    if (totalActiveTime > 0) {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_engagement', {
          page_location: page,
          engagement_time_msec: totalActiveTime,
          total_time_on_page: Date.now() - startTime,
          engagement_ratio: totalActiveTime / (Date.now() - startTime)
        })
      }
    }
  }, 30000) // Every 30 seconds

  // Return cleanup function
  return () => {
    events.forEach(event => {
      document.removeEventListener(event, trackActivity)
    })
    clearInterval(engagementInterval)

    // Send final engagement data
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_engagement_final', {
        page_location: page,
        total_engagement_time: totalActiveTime,
        total_session_time: Date.now() - startTime,
        final_engagement_ratio: totalActiveTime / (Date.now() - startTime)
      })
    }
  }
}

// Form interaction tracking
export const trackFormInteraction = (formName: string, action: 'start' | 'complete' | 'abandon', field?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'form_interaction', {
      form_name: formName,
      interaction_type: action,
      field_name: field || '',
      timestamp: new Date().toISOString()
    })
  }
}

// CTA (Call to Action) tracking
export const trackCTAClick = (ctaName: string, page: string, position: 'header' | 'content' | 'footer' | 'sidebar') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'cta_click', {
      cta_name: ctaName,
      page_location: page,
      cta_position: position,
      timestamp: new Date().toISOString()
    })
  }
}