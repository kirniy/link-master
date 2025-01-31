import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"

const languages = {
  en: { nativeName: "English" },
  ru: { nativeName: "Русский" },
}

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  return (
    <div className="flex gap-x-2">
      {Object.keys(languages).map((lng) => (
        <Button
          key={lng}
          variant={i18n.resolvedLanguage === lng ? "default" : "outline"}
          type="submit"
          onClick={() => {
            i18n.changeLanguage(lng)
          }}
        >
          {languages[lng as keyof typeof languages].nativeName}
        </Button>
      ))}
    </div>
  )
}