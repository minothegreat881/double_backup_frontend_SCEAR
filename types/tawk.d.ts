interface Window {
  Tawk_API?: {
    maximize: () => void
    minimize: () => void
    toggle: () => void
    popup: () => void
    showWidget: () => void
    hideWidget: () => void
    onLoad: () => void
    onStatusChange: (status: string) => void
    addEvent: (event: string, metadata: any) => void
    addTags: (tags: string[], callback?: () => void) => void
    removeTags: (tags: string[], callback?: () => void) => void
  }
  Tawk_LoadStart?: Date
}
