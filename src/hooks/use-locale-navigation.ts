'use client'

import { useLocale } from 'next-intl'

export function useLocaleNavigation() {
  const locale = useLocale()

  const getLocalizedPath = (path: string) => {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.substring(1) : path
    
    // If path is empty (home), just return locale
    if (!cleanPath) {
      return `/${locale}`
    }
    
    // Return localized path
    return `/${locale}/${cleanPath}`
  }

  return { getLocalizedPath, locale }
}