import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, Link as LinkIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BorderBeam } from '@/components/ui/border-beam';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/hooks/use-translation';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bulkUrls: z.string(),
  urls: z.array(z.object({
    url: z.string().regex(urlRegex, { message: 'Invalid URL' }),
    comment: z.string().optional().default(''),
  })).optional().default([{ url: '', comment: '' }]),
});

export function UrlListCreator() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const addList = useStore((state) => state.addList);
  const navigate = useNavigate();
  const [showIndividual, setShowIndividual] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      bulkUrls: '',
      urls: [{ url: '', comment: '' }],
    },
  });

  console.log('Form state:', form.formState);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log('onSubmit called with data:', data);
    try {
      let urls = [];
      if (showIndividual) {
        urls = data.urls?.filter(({ url }) => url.trim()) || [];
        console.log('Individual mode URLs:', urls);
      } else {
        console.log('Processing bulk URLs:', data.bulkUrls);
        urls = data.bulkUrls
          .split(/[\n\r]+/)
          .map(url => {
            url = url.trim();
            if (!url.startsWith('http')) {
              url = 'https://' + url;
            }
            console.log('Processing URL:', url);
            return url;
          })
          .filter(url => {
            const isValid = urlRegex.test(url);
            if (!isValid) {
              console.warn('Invalid URL:', url);
            }
            return isValid;
          })
          .slice(0, 50)
          .map(url => ({ url, comment: '' }));
        console.log('Final processed URLs:', urls);
      }

      if (urls.length === 0) {
        console.warn('No valid URLs found');
        form.setError('bulkUrls', {
          type: 'manual',
          message: t('atLeastOneUrl'),
        });
        return;
      }

      console.log('Calling addList with:', { name: data.name, urls });
      const id = await addList({ name: data.name, urls });
      console.log('List saved successfully with ID:', id);
      navigate(`/list/${id}`);
    } catch (error) {
      console.error('Error in onSubmit:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const toggleMode = () => {
    setShowIndividual(!showIndividual);
    if (!showIndividual) {
      const bulkUrls = form.getValues('urls')
        ?.map(({ url }) => url)
        .filter(Boolean)
        .join('\n') || '';
      form.setValue('bulkUrls', bulkUrls);
    } else {
      const urls = form.getValues('bulkUrls')
        .split(/[\n\r]+/)
        .map(url => url.trim())
        .filter(Boolean)
        .slice(0, 50)
        .map(url => ({ url, comment: '' }));
      form.setValue('urls', urls);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4">
      <Card className="p-6">
        <Form {...form}>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              console.log('Form submitted');
              const formData = form.getValues();
              console.log('Form data:', formData);
              const errors = form.formState.errors;
              console.log('Form errors:', errors);
              
              if (Object.keys(errors).length > 0) {
                console.log('Form validation failed');
                return;
              }

              onSubmit(formData).catch(error => {
                console.error('Form submission error:', error);
              });
            }} 
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">{t('listName')}</FormLabel>
                  <FormControl>
                    <Input {...field} className="text-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!showIndividual ? (
              <FormField
                control={form.control}
                name="bulkUrls"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          {...field}
                          className="min-h-[200px] resize-y font-mono rounded-lg"
                          placeholder={t('bulkPasteHint')}
                        />
                        <BorderBeam
                          size={400}
                          duration={8}
                          colorFrom="#ffaa40"
                          colorTo="#9c40ff"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="space-y-4">
                {form.watch('urls')?.map((_, index) => (
                  <div key={index} className="grid gap-4 md:grid-cols-[1fr,1fr,auto]">
                    <FormField
                      control={form.control}
                      name={`urls.${index}.url`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input {...field} placeholder={t('urlPlaceholder')} />
                              <LinkIcon className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`urls.${index}.comment`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder={t('comment')} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const urls = form.getValues('urls') || [];
                        if (urls.length > 1) {
                          const newUrls = [...urls];
                          newUrls.splice(index, 1);
                          form.setValue('urls', newUrls);
                        }
                      }}
                      className="h-10 w-10"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const urls = form.getValues('urls') || [];
                    if (urls.length < 50) {
                      form.setValue('urls', [...urls, { url: '', comment: '' }]);
                    }
                  }}
                  disabled={(form.watch('urls')?.length || 0) >= 50}
                  className="w-full sm:w-auto"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('addUrl')}
                </Button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={toggleMode}
                className="w-full sm:w-auto"
              >
                {showIndividual ? t('switchToBulk') : t('switchToIndividual')}
              </Button>
              <Button 
                type="submit" 
                className="w-full sm:w-auto"
              >
                {t('save')}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}