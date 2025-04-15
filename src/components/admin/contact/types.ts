
import { Language } from '@/utils/languageUtils';

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export interface ContactData {
  id?: string;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  email: string;
  social_links: SocialLink[];
}

export interface ContactFormProps {
  contactInfo: ContactData;
  onContactInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedLanguage: Language;
}

export interface SocialLinksProps {
  socialLinks: SocialLink[];
  onSocialLinkChange: (id: string, field: keyof SocialLink, value: string) => void;
  onAddSocialLink: () => void;
  onRemoveSocialLink: (id: string) => void;
}
