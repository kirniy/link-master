import { useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { ExternalLink, ArrowLeft } from "lucide-react"

export function UrlListViewer() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { linkList, loading, error, getList } = useStore()

  useEffect(() => {
    if (id) {
      getList(id).catch((error) => {
        toast({
          title: t("error"),
          description: (error as Error).message,
          variant: "destructive"
        })
      })
    }
  }, [id, getList, t])

  if (loading) {
    return <div className="text-center">{t("loading")}</div>
  }

  if (error) {
    return <div className="text-center text-destructive">{error}</div>
  }

  if (!linkList) {
    return (
      <div className="text-center space-y-4">
        <div>{t("listNotFound")}</div>
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToHome")}
          </Link>
        </Button>
      </div>
    )
  }

  const copyShareableLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: t('list.copy'),
        description: t('list.copied')
      });
    } catch (err) {
      toast({
        title: t('error'),
        description: t('copyLinkError'),
        variant: 'destructive'
      });
    }
  };

  const openAllUrls = async () => {
    const urls = linkList.urls.map(u => u.url);
    if (!confirm(t('openMultipleTabsConfirm', { count: urls.length }))) {
      return;
    }

    let failedCount = 0;
    for (const url of urls) {
      try {
        const newWindow = window.open(url, '_blank');
        if (!newWindow) {
          failedCount++;
        }
        // Add a small delay between opening tabs to prevent browser blocking
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch {
        failedCount++;
      }
    }

    if (failedCount > 0) {
      toast({
        title: t('error'),
        description: t('errorOpeningUrl'),
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <Link to="/" className="text-muted-foreground hover:text-foreground inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToHome")}
          </Link>
          <h1 className="text-2xl font-bold break-words">{linkList.name}</h1>
        </div>
        
        <div className="flex flex-col gap-2 w-full">
          <Button 
            variant="default" 
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 text-lg py-6"
            onClick={openAllUrls}
          >
            {t('list.openAll')}
          </Button>
          <Button 
            variant="outline" 
            size="default"
            className="w-full"
            onClick={copyShareableLink}
          >
            {t('list.shareableLink')}
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {linkList.urls.map((entry, index) => (
          <div key={index} className="group relative">
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              {entry.comment && (
                <div className="mb-3 font-medium text-foreground/90 break-words">
                  {entry.comment}
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-primary hover:underline break-all flex-1">
                  {entry.url}
                </span>
                <ExternalLink className="h-4 w-4 shrink-0 text-primary" />
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}