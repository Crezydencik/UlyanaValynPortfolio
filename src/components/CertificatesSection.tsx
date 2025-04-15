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
        const { data, error } = await supabase
          .from('certificates')
          .select('*');

        if (error) throw error;

        // Transform the data to match the Certificate type
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
        <h2 className="section-title text-4xl md:text-5xl font-bold mb-8 text-portfolio-black font-display">{t('certifications.title')}</h2>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : certificates.length > 0 ? (
        <div className="max-w-3xl mx-auto mt-12 space-y-8">
          {certificates.map(cert => (
            <div key={cert.id} className="certification-item">
              <h3 className="text-xl font-bold">{cert.title[language] || ''}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {cert.issuer[language] || ''} • {new Date(cert.date).toLocaleDateString()}
              </p>
              <p className="text-muted-foreground">
                {cert.description[language] || ''}
              </p>
              {cert.image_url && (
                <img 
                  src={cert.image_url} 
                  alt={cert.title[language] || 'Certificate'}
                  className="mt-4 max-h-40 object-contain"
                />
              )}
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
