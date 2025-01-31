import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Globe, Github, MessageCircle } from 'lucide-react';
import { UrlListCreator } from '@/components/url-list-creator';
import { UrlListViewer } from '@/components/url-list-viewer';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useTranslation } from '@/hooks/use-translation';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';

function App() {
  const { t } = useTranslation();

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <Globe className="h-6 w-6" />
                <span className="font-bold text-xl hidden sm:inline">{t('title')}</span>
              </Link>
              <div className="flex items-center space-x-4">
                <LanguageSwitcher />
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto py-8">
          <Routes>
            <Route
              path="/"
              element={
                <div className="flex flex-col items-center">
                  <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
                    <p className="text-muted-foreground">{t('description')}</p>
                  </div>
                  <UrlListCreator />
                </div>
              }
            />
            <Route
              path="/list/:id"
              element={
                <div className="max-w-5xl mx-auto px-4">
                  <UrlListViewer />
                </div>
              }
            />
          </Routes>
        </main>

        <footer className="mt-auto border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" asChild>
                  <a
                    href="https://t.me/kirniy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <a
                    href="https://github.com/kirniy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                </Button>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                <p>© 2025 Kirill Kholod. Все права защищены.</p>
                <p>Сделано с ❤️ и нейросетями</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;