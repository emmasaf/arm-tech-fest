'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Locale, defaultLocale, translations, Messages } from '@/i18n'

interface TranslationContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, variables?: Record<string, string | number>) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  // Load locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale
    if (savedLocale && translations[savedLocale]) {
      setLocaleState(savedLocale)
    }
  }, [])

  // Save locale to localStorage when it changes
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
  }

  // Translation function
  const t = (key: string, variables?: Record<string, string | number>): string => {
    const keys = key.split('.')
    let value: any = translations[locale]

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to English if key not found
        let fallbackValue: any = translations[defaultLocale]
        for (const fallbackK of keys) {
          if (fallbackValue && typeof fallbackValue === 'object' && fallbackK in fallbackValue) {
            fallbackValue = fallbackValue[fallbackK]
          } else {
            return key // Return key if no translation found
          }
        }
        value = fallbackValue
        break
      }
    }

    if (typeof value !== 'string') {
      return key
    }

    // Replace variables in the translation
    if (variables) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
        return variables[varName]?.toString() || match
      })
    }

    return value
  }

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}

// Hook for just the translation function
export function useTranslations() {
  const { t } = useTranslation()
  return t
}