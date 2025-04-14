
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const CertificatesSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section id="certificates" className="section-container bg-white">
            <div className="text-center mb-12">

      <p className="title-gradient text-xl font-medium mb-2">{t('certifications.subtitle')}</p>
      <h2 className=" section-title text-4xl md:text-5xl font-bold mb-8 text-portfolio-black font-display">{t('certifications.title')}</h2>
            </div>
      
      <div className="max-w-3xl mx-auto mt-12">
        <div className="certification-item">
          <h3 className="text-xl font-bold">{t('certifications.polishCert.title')}</h3>
          <p className="text-sm text-muted-foreground mb-2">
            {t('certifications.polishCert.issuer')} • {t('certifications.polishCert.date')}
          </p>
          <p className="text-muted-foreground">
            {t('certifications.polishCert.description')}
          </p>
        </div>
        
        <div className="certification-item">
          <h3 className="text-xl font-bold">{t('certifications.journalismCert.title')}</h3>
          <p className="text-sm text-muted-foreground mb-2">
            {t('certifications.journalismCert.issuer')} • {t('certifications.journalismCert.date')}
          </p>
          <p className="text-muted-foreground">
            {t('certifications.journalismCert.description')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CertificatesSection;
