import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { Button } from "@/components/ui/button"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 sm:h-9 sm:w-9"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 sm:h-5 sm:w-5" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 sm:h-5 sm:w-5" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}