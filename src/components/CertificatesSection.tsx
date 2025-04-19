import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Language } from '@/utils/languageUtils';

interface Certificate {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  issuer: Record<Language, string>;
  date: string;
  image_url?: string | null;
}

const CertificatesSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('certificates').select('*');

        if (error) throw error;

        const transformedCerts = data.map(cert => ({
          id: cert.id,
          title: cert.title as Record<Language, string> || { en: '', pl: '', ru: '' },
          description: cert.description as Record<Language, string> || { en: '', pl: '', ru: '' },
          issuer: cert.issuer as Record<Language, string> || { en: '', pl: '', ru: '' },
          date: cert.date,
          image_url: cert.image_url
        }));

        setCertificates(transformedCerts);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  return (
    <section id="certificates" className="section-container bg-white">
      <div className="text-center mb-12">
        <p className="title-gradient text-xl font-medium mb-2">{t('certifications.subtitle')}</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-portfolio-black font-display">
          {t('certifications.title')}
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : certificates.length > 0 ? (
        <div className="max-w-4xl mx-auto">
          {certificates.map(cert => (
            <div key={cert.id} className="mb-12 relative pl-10 animate-on-scroll">
              <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-pink-500"></div>
              <div className="absolute left-1.5 top-5 w-0.5 h-full bg-pink-300"></div>

              <div className="flex flex-col md:flex-row md:justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2 font-display">{cert.title[language]}</h3>
                  <p className="text-gray-600 mb-2">{cert.description[language]}</p>
                </div>
                <div className="mt-2 md:mt-0 md:ml-8 md:text-right whitespace-nowrap text-gray-500">
                  {cert.issuer[language]} · {new Date(cert.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          {t('certifications.noCertificates')}
        </div>
      )}
    </section>
  );
};

export default CertificatesSection;