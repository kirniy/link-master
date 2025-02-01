import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-8 w-8 sm:h-9 sm:w-9"
      onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'ru' : 'en')}
    >
      <Languages className="h-4 w-4 sm:h-5 sm:w-5" />
    </Button>
  )
}