import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Language } from '@/utils/languageUtils';
import { AboutData } from './admin/contact/types';

const AboutSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [about, setAbout] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbouts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('about')
          .select('*')
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setAbout({
            id: data.id,
            description: data.description as Record<Language, string> || { en: '', pl: '', ru: '' },
            subtitle: data.subtitle as Record<Language, string> || { en: '', pl: '', ru: '' },
            image_url: data.image_url,
          });
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAbouts();
  }, []);

  return (
    <section id="about" className="section-container bg-white">
      <div className="text-center mb-16">
        <h2 className="section-title mx-auto">{t('about.title')}</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-16 items-center">
        <div className="md:w-1/2">
          <img
            src={
              about?.image_url ||
              'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3'
            }
            alt="About section image"
            className="rounded-lg shadow-md w-full max-w-md mx-auto"
          />
        </div>

        <div className="md:w-1/2">
          <h3 className="text-2xl font-bold mb-4">
            {about?.subtitle?.[language] || t('about.subtitle')}
          </h3>
          <div className="text-muted-foreground space-y-4 whitespace-pre-line">
            {about?.description?.[language] || t('about.description')}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
