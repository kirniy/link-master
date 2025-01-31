import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore } from '@/lib/store';
import { Language } from '@/lib/translations';
import { useTranslation } from '@/hooks/use-translation';

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const [language, setLanguage] = useStore((state) => [
    state.language,
    state.setLanguage,
  ]);

  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t('language')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ru">Русский</SelectItem>
      </SelectContent>
    </Select>
  );
}