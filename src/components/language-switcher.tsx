'use client'

import { locales } from '@/i18n'
import { useTranslation } from '@/contexts/translation-context'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Globe } from 'lucide-react'

const languageNames = {
  en: 'English',
  am: 'Հայերեն',
  ru: 'Русский'
} as const

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation()

  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale as any)
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-gray-600" />
      <Select value={locale} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[130px] border-none bg-transparent focus:ring-0">
          <SelectValue>
            {languageNames[locale as keyof typeof languageNames]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {locales.map((loc) => (
            <SelectItem key={loc} value={loc}>
              {languageNames[loc as keyof typeof languageNames]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}