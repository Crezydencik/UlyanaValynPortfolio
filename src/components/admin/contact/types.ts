
import { Language } from '@/utils/languageUtils';
import { Json } from '@/integrations/supabase/types';

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

export function transformSocialLinks(socialLinks: Json): SocialLink[] {
  if (!socialLinks || !Array.isArray(socialLinks)) return [];
  
  return socialLinks.map(link => {
    if (typeof link === 'object' && link !== null) {
      return {
        id: typeof link.id === 'string' ? link.id : '',
        name: typeof link.name === 'string' ? link.name : '',
        url: typeof link.url === 'string' ? link.url : '',
        icon: typeof link.icon === 'string' ? link.icon : 'link'
      };
    }
    return { id: '', name: '', url: '', icon: 'link' };
  });
}

export function socialLinksToJson(socialLinks: SocialLink[]): Json {
  return socialLinks as unknown as Json;
}
