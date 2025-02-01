import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { LogIn, LogOut } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

export function AuthButton() {
  const { t } = useTranslation();
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: error instanceof Error ? error.message : t('auth.signInError')
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: error instanceof Error ? error.message : t('auth.signOutError')
      });
    }
  };

  if (loading) {
    return null;
  }

  if (user) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSignOut}
        className="relative"
        title={t('auth.signOut')}
      >
        <LogOut className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleSignIn}
      className="relative"
      title={t('auth.signIn')}
    >
      <LogIn className="h-5 w-5" />
    </Button>
  );
}
