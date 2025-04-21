
import { Language } from '@/utils/languageUtils';
import { Json } from '@/integrations/supabase/types';

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}
export interface HomeData {
  id: string;
  description: Record<Language, string>;
  image_url?: string | null;
}
export interface AboutData {
  id: string;
  // title: Record<Language, string>;
  subtitle: Record<Language, string>;
  description: Record<Language, string>;
  image_url?: string | null;
}

export interface ContactData {
  id?: string;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  email: string;
  phone: string;
  social_links: SocialLink[];
  location: Record<Language, string>;
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
      const typedLink = link as Record<string, Json>;
      return {
        id: typeof typedLink.id === 'string' ? typedLink.id : String(Date.now()),
        name: typeof typedLink.name === 'string' ? typedLink.name : '',
        url: typeof typedLink.url === 'string' ? typedLink.url : '',
        icon: typeof typedLink.icon === 'string' ? typedLink.icon : 'link'
      };
    }
    return { id: String(Date.now()), name: '', url: '', icon: 'link' };
  });
}

export function socialLinksToJson(socialLinks: SocialLink[]): Json {
  return socialLinks as unknown as Json;
}
