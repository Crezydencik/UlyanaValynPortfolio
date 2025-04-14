
export type Language = 'en' | 'pl' | 'ru';

export const languages: Record<Language, string> = {
  en: 'English',
  pl: 'Polski',
  ru: 'Русский'
};

export const defaultLanguage: Language = 'en';
