import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { BorderBeam } from '@/components/ui/border-beam';

const formSchema = z.object({
  name: z.string().min(1),
  urls: z.array(z.object({
    url: z.string().url(),
    comment: z.string().optional()
  })).min(1)
});

export function UrlListCreator() {
  const navigate = useNavigate();
  const createList = useStore((state) => state.createList);
  const { t } = useTranslation();
  const [urlsText, setUrlsText] = useState('');
  const [urlComments, setUrlComments] = useState<{ [url: string]: string }>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      urls: []
    }
  });

  const processUrls = (text: string) => {
    const urls = text
      .split(/[\n,]/)
      .map(url => url.trim())
      .filter(url => url.length > 0)
      .map(url => url.startsWith('http') ? url : `https://${url}`);

    console.log('Processed URLs:', urls);
    return urls.map(url => ({
      url,
      comment: urlComments[url] || ''
    }));
  };

  const onSubmit = async () => {
    const name = form.getValues('name');
    if (!name) {
      toast({
        title: t('error'),
        description: t('listNameRequired'),
        variant: 'destructive'
      });
      return;
    }

    try {
      const urls = processUrls(urlsText);
      console.log('Submitting with comments:', urls);
      
      if (urls.length === 0) {
        toast({
          title: t('error'),
          description: t('noUrlsProvided'),
          variant: 'destructive'
        });
        return;
      }

      const id = await createList({
        name,
        urls
      });

      toast({
        title: t('listCreated'),
        description: t('listCreatedDescription')
      });
      navigate(`/list/${id}`);
    } catch (error) {
      console.error('Error submitting:', error);
      toast({
        title: t('error'),
        description: (error as Error).message,
        variant: 'destructive'
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <Form {...form}>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">{t('app.title')}</h1>
          <p className="text-muted-foreground text-lg">{t('app.description')}</p>
        </div>

        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">{t('listName')}</FormLabel>
                <FormControl>
                  <div className="relative rounded-lg">
                    <Input 
                      placeholder={t('listNamePlaceholder')} 
                      {...field} 
                      className="bg-background text-lg h-12"
                    />
                    <BorderBeam delay={1} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel className="text-base">{t('bulkUrls')}</FormLabel>
            <FormControl>
              <div className="relative rounded-lg">
                <Textarea
                  placeholder={t('bulkUrlsPlaceholder')}
                  className="min-h-[200px] bg-background text-base resize-y font-mono"
                  value={urlsText}
                  onChange={(e) => setUrlsText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <BorderBeam delay={2} />
              </div>
            </FormControl>
            <FormDescription className="text-sm">
              {t('bulkUrlsHelp')}
              <br />
              {t('pressEnterToSubmit')}
            </FormDescription>
          </FormItem>

          <div className="space-y-4">
            {processUrls(urlsText).map((entry) => (
              <div key={entry.url} className="space-y-2 bg-card p-4 rounded-lg border">
                <div className="text-sm font-medium text-foreground break-all">
                  {entry.url}
                </div>
                <Textarea
                  placeholder={t('commentPlaceholder')}
                  className="h-20 resize-none bg-background text-sm"
                  value={urlComments[entry.url] || ''}
                  onChange={(e) => {
                    console.log('Setting comment for URL:', entry.url);
                    setUrlComments(prev => ({
                      ...prev,
                      [entry.url]: e.target.value
                    }));
                  }}
                />
              </div>
            ))}
          </div>

          <Button 
            type="button" 
            size="lg" 
            className="w-full text-lg"
            onClick={onSubmit}
          >
            {t('createList')}
          </Button>
        </div>
      </div>
    </Form>
  );
}