import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Info } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/lib/auth"

export function InfoMenu() {
  const { t } = useTranslation()
  const { user, signInWithGoogle } = useAuth()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
          <Info className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="h-full">
          <SheetTitle className="text-xl sm:text-2xl">{t("info.title")}</SheetTitle>
          <SheetDescription className="h-[calc(100vh-6rem)] overflow-y-auto pb-8">
            {/* Intro section with fun emoji */}
            <div className="space-y-2">
              <p className="text-base leading-relaxed">{t("info.intro")}</p>
              <p className="text-base leading-relaxed">{t("info.mainFeature")}</p>
              <p className="text-base leading-relaxed">{t("info.convenience")}</p>
            </div>

            {/* Usage examples with emojis in a nice grid */}
            <div className="space-y-2">
              <p className="text-base whitespace-pre-line leading-relaxed">{t("info.usage")}</p>
            </div>

            {/* Login perks section with a nice card-like design */}
            {!user && (
              <div className="rounded-lg bg-primary/5 p-4 space-y-3">
                <p className="text-base whitespace-pre-line leading-relaxed">{t("info.loginPerks")}</p>
                <Button 
                  onClick={signInWithGoogle}
                  className="w-full"
                  variant="outline"
                >
                  {t("info.loginButton")}
                </Button>
              </div>
            )}

            {/* Get started section */}
            <div className="pt-2">
              <p className="text-base font-medium">{t("info.getStarted")}</p>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
