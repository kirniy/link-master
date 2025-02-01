import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';

export function UserLists() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { userLists, loading, getUserLists, deleteList } = useStore();

  useEffect(() => {
    if (user) {
      getUserLists();
    }
  }, [user, getUserLists]);

  if (!user) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-16">
      <h2 className="text-2xl font-bold mb-6">{t('lists.myLists')}</h2>
      {loading ? (
        <div className="text-center">{t('actions.list.loading')}</div>
      ) : userLists.length === 0 ? (
        <div className="text-center text-muted-foreground">{t('lists.noLists')}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {userLists.map((list) => (
            <Card key={list.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{list.name}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => list.id && deleteList(list.id)}
                      title={t('lists.delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {list.id && (
                      <Link to={`/edit/${list.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          title={t('lists.edit')}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    {list.id && (
                      <Link to={`/list/${list.id}`} target="_blank">
                        <Button
                          variant="ghost"
                          size="icon"
                          title={t('lists.view')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardTitle>
                <CardDescription className="flex items-center justify-between">
                  <span>{t('lists.urlCount', { count: list.urls.length })}</span>
                  {new Date(list.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
