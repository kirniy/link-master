import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink, Copy, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore, UrlList } from '@/lib/store';
import { useTranslation } from '@/hooks/use-translation';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export function UrlListViewer() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const getList = useStore((state) => state.getList);
  const [list, setList] = useState<UrlList | undefined>();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      setList(getList(id));
    }
  }, [id, getList]);

  if (!list) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold mb-4">List not found</h2>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back home
          </Link>
        </Button>
      </div>
    );
  }

  const openAllUrls = () => {
    list.urls.forEach(({ url }) => {
      window.open(url, '_blank');
    });
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast({
      title: t('copied'),
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link to="/" className="text-muted-foreground hover:text-foreground inline-flex items-center mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
          <h1 className="text-3xl font-bold">{list.name}</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={copyShareLink} className="w-full sm:w-auto">
            {copied ? (
              <Check className="mr-2 h-4 w-4" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
            {t('copy')}
          </Button>
          <Button onClick={openAllUrls} className="w-full sm:w-auto">
            <ExternalLink className="mr-2 h-4 w-4" />
            {t('openAll')}
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {list.urls.map(({ url, comment }, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center justify-between text-base">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline truncate mr-2"
                >
                  {url}
                </a>
                <Button variant="ghost" size="icon" asChild className="shrink-0">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardTitle>
              {comment && (
                <CardDescription className="mt-1 line-clamp-2">
                  {comment}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-video bg-muted">
                <iframe
                  src={url}
                  title={url}
                  className="w-full h-full"
                  sandbox="allow-same-origin"
                  loading="lazy"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}