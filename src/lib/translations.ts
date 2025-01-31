export const translations = {
  en: {
    title: 'Link Master',
    description: 'Create, save, and share lists of URLs to open them all at once',
    addList: 'Create New List',
    listName: 'List Name',
    addUrl: 'Add URL',
    urlPlaceholder: 'Enter URL',
    comment: 'Comment (optional)',
    save: 'Save List',
    copy: 'Copy Share Link',
    openAll: 'Open All URLs',
    preview: 'Preview',
    maxUrls: 'Maximum 50 URLs per list',
    copied: 'Share link copied!',
    invalidUrl: 'Please enter a valid URL',
    required: 'Required',
    delete: 'Delete',
    language: 'Language',
    bulkPasteHint: 'Enter or paste URLs, one per line (max 50)',
    switchToBulk: 'Switch to Bulk Mode',
    switchToIndividual: 'Switch to Individual Mode',
    atLeastOneUrl: 'At least one valid URL is required',
  },
  ru: {
    title: 'Link Master',
    description: 'Создавайте, сохраняйте и делитесь списками URL для их одновременного открытия',
    addList: 'Создать новый список',
    listName: 'Название списка',
    addUrl: 'Добавить URL',
    urlPlaceholder: 'Введите URL',
    comment: 'Комментарий (необязательно)',
    save: 'Сохранить список',
    copy: 'Копировать ссылку',
    openAll: 'Открыть все URL',
    preview: 'Предпросмотр',
    maxUrls: 'Максимум 50 URL в списке',
    copied: 'Ссылка скопирована!',
    invalidUrl: 'Пожалуйста, введите корректный URL',
    required: 'Обязательное поле',
    delete: 'Удалить',
    language: 'Язык',
    bulkPasteHint: 'Введите или вставьте URL, по одному в строке (макс. 50)',
    switchToBulk: 'Переключиться на массовый режим',
    switchToIndividual: 'Переключиться на индивидуальный режим',
    atLeastOneUrl: 'Требуется хотя бы один действительный URL',
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey =
  | 'title'
  | 'description'
  | 'addList'
  | 'listName'
  | 'addUrl'
  | 'urlPlaceholder'
  | 'comment'
  | 'save'
  | 'copy'
  | 'openAll'
  | 'preview'
  | 'maxUrls'
  | 'copied'
  | 'invalidUrl'
  | 'required'
  | 'delete'
  | 'language'
  | 'bulkPasteHint'
  | 'switchToBulk'
  | 'switchToIndividual'
  | 'atLeastOneUrl';