import { useStore } from '@/lib/store';
import { translations, TranslationKey } from '@/lib/translations';

export function useTranslation() {
  const language = useStore((state) => state.language);
  
  const t = (key: TranslationKey) => {
    return translations[language][key];
  };

  return { t };
}