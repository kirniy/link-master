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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';

const urlSchema = z.object({
  url: z.string().url(),
  comment: z.string().optional()
});

const formSchema = z.object({
  name: z.string().min(1),
  urls: z.array(urlSchema).min(1)
});

type FormValues = z.infer<typeof formSchema>;

export function UrlListCreator() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createList = useStore((state) => state.createList);
  const [urlCount, setUrlCount] = useState(1);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      urls: [{ url: '', comment: '' }]
    }
  });

  async function onSubmit(data: FormValues) {
    try {
      const id = await createList(data);
      toast({
        title: t('listCreated'),
        description: t('listCreatedDescription')
      });
      navigate(`/list/${id}`);
    } catch (error) {
      toast({
        title: t('error'),
        description: (error as Error).message,
        variant: 'destructive'
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('listName')}</FormLabel>
              <FormControl>
                <Input placeholder={t('listNamePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {Array.from({ length: urlCount }).map((_, index) => (
          <div key={index} className="space-y-4">
            <FormField
              control={form.control}
              name={`urls.${index}.url`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('url')} {index + 1}</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://example.com" {...field} />
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
                  <FormLabel>{t('comment')} ({t('optional')})</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('commentPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setUrlCount((count) => count + 1)}
          >
            {t('addAnotherUrl')}
          </Button>
          <Button type="submit">{t('createList')}</Button>
        </div>
      </form>
    </Form>
  );
}