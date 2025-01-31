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

  const openAllUrls = () => {
    const urls = linkList.urls.map(({ url }) => url)
    
    // Request permission to open multiple tabs
    const confirmed = window.confirm(
      t("openMultipleTabsConfirm", { count: urls.length })
    )
    
    if (confirmed) {
      urls.forEach((url) => {
        try {
          window.open(url, "_blank", "noopener,noreferrer")
        } catch (error) {
          console.error(`Failed to open URL: ${url}`, error)
        }
      })
    }
  }

  const copyShareableLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(
      () => {
        toast({
          title: t("linkCopied"),
          description: t("linkCopiedDescription")
        })
      },
      (err) => {
        console.error("Failed to copy link:", err)
        toast({
          title: t("error"),
          description: t("copyLinkError"),
          variant: "destructive"
        })
      }
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="space-y-1">
          <Link to="/" className="text-muted-foreground hover:text-foreground inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToHome")}
          </Link>
          <h1 className="text-2xl font-bold">{linkList.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={copyShareableLink}>
            {t("copyLink")}
          </Button>
          <Button onClick={openAllUrls}>
            <ExternalLink className="mr-2 h-4 w-4" />
            {t("openAll")}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {linkList.urls.map(({ url, comment }, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between gap-4">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                {url}
              </a>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="shrink-0"
              >
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("openInNewTab")}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
            {comment && (
              <p className="mt-2 text-muted-foreground">{comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}