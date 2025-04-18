
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Instagram, Facebook, Twitter, Link as LinkIcon, Loader2, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ContactData, transformSocialLinks } from './admin/contact/types';
import { Language } from '@/utils/languageUtils';

const ContactSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('contact')
          .select('*')
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setContactData({
            id: data.id,
            title: data.title as Record<Language, string> || { en: '', pl: '', ru: '' },
            subtitle: data.subtitle as Record<Language, string> || { en: '', pl: '', ru: '' },
            email: data.email || '',
            social_links: transformSocialLinks(data.social_links),
            location: data.location as Record<Language, string> || { en: '', pl: '', ru: '' }
          });
        }
      } catch (error) {
        console.error('Error fetching contact data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  const getSocialIcon = (icon: string) => {
    switch (icon.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-6 w-6 text-primary" />;
      case 'facebook':
        return <Facebook className="h-6 w-6 text-primary" />;
      case 'twitter':
        return <Twitter className="h-6 w-6 text-primary" />;
      case 'mail':
        return <Mail className="h-6 w-6 text-primary" />;
      default:
        return <LinkIcon className="h-6 w-6 text-primary" />;
    }
  };
  
  return (
    <section id="contact" className="section bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="section-title">
          {contactData?.title?.[language] || t('contact.title')}
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          {contactData?.subtitle?.[language] || t('contact.subtitle')}
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <div className="mb-8 space-y-4">
            <h3 className="text-xl font-semibold mb-4">{t('contact.info')}</h3>
            
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="h-5 w-5 text-primary" />
              <span className="font-medium">{t('contact.email')}:</span>
              <a href={`mailto:${contactData?.email || 'info@ulyana.com'}`} className="hover:text-primary">
                {contactData?.email || 'info@ulyana.com'}
              </a>
            </div>
            
            {contactData?.location && contactData.location[language] && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-medium">{t('contact.location')}:</span>
                <span>{contactData.location[language]}</span>
              </div>
            )}
          </div>
          
          {contactData?.social_links && contactData.social_links.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">{t('contact.followMe')}</h3>
              <div className="flex gap-4">
                {contactData.social_links.map((link, index) => (
                  <a 
                    key={link.id || index} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                  >
                    {getSocialIcon(link.icon)}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ContactSection;
