
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
  if (!socialLinks || typeof socialLinks !== 'object') return [];
  
  if (Array.isArray(socialLinks)) {
    return socialLinks.map(link => {
      if (typeof link === 'object' && link !== null) {
        return {
          id: link.id || '',
          name: link.name || '',
          url: link.url || '',
          icon: link.icon || 'link'
        };
      }
      return { id: '', name: '', url: '', icon: 'link' };
    });
  }
  
  return [];
}
