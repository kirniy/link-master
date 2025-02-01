import { Routes, Route, Link } from 'react-router-dom';
import { Github } from 'lucide-react';
import { UrlListCreator } from '@/components/url-list-creator';
import { UrlListViewer } from '@/components/url-list-viewer';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { InfoMenu } from '@/components/info-menu';
import { useTranslation } from 'react-i18next';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { AuthButton } from '@/components/auth-button';
import { UserLists } from '@/components/user-lists'; // Added import statement

function TelegramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.495 7.952c-.199 2.16-.835 7.395-1.18 9.81-.145 1.015-.436 1.355-.715 1.387-.61.072-1.07-.402-1.66-.789-.923-.644-1.445-1.047-2.339-1.673-.995-.758-.35-1.174.216-1.855.149-.179 2.733-2.505 2.781-2.722a.21.21 0 00-.05-.184c-.056-.056-.138-.037-.197-.022-.084.022-1.421.903-4.013 2.643-.38.261-.724.388-1.032.382-.34-.009-.994-.194-1.482-.354-.597-.2-1.072-.307-1.03-.65.021-.177.299-.358.832-.542 3.265-1.423 5.441-2.36 6.527-2.81 3.106-1.29 3.754-1.514 4.173-1.522.093-.002.302.021.437.128a.46.46 0 01.159.329c.016.095.036.332-.027.524z"/>
    </svg>
  );
}

function LinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function App() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
        <div className="nav-gradient-container">
          <div className="nav-gradient-content w-full px-2 py-3 sm:px-4 sm:py-4">
            <div className="flex items-center justify-between max-w-[2000px] mx-auto">
              <Link to="/" className="flex items-center space-x-1.5 flex-shrink-0">
                <LinkIcon className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
                <span className="text-lg font-semibold whitespace-nowrap sm:text-xl text-foreground">{t('app.title')}</span>
              </Link>
              <div className="flex items-center gap-1.5 sm:gap-4">
                <InfoMenu />
                <LanguageSwitcher />
                <ThemeSwitcher />
                <AuthButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full px-4 py-8">
        <Routes>
          <Route
            path="/"
            element={
              <div className="max-w-[2000px] mx-auto">
                <UrlListCreator />
                <UserLists />
              </div>
            }
          />
          <Route
            path="/list/:id"
            element={
              <div className="max-w-5xl mx-auto">
                <UrlListViewer />
              </div>
            }
          />
        </Routes>
      </main>

      <footer className="mt-auto border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-4 py-6">
          <div className="max-w-[2000px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://t.me/kirniy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  <TelegramIcon className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href={t('footer.github')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  <Github className="h-5 w-5" />
                </a>
              </Button>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>&copy; {t('footer.rights')}</p>
              <p>{t('footer.made')}</p>
            </div>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}

export default App;