
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const PortfolioSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section id="portfolio" className="section bg-gray-50">
      <h2 className="section-title">{t('portfolio.title')}</h2>
      <p className="section-subtitle">{t('portfolio.subtitle')}</p>
      
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t('portfolio.noProjects')}</p>
      </div>
    </section>
  );
};

export default PortfolioSection;
