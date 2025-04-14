
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const AboutSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section id="about" className="section-container bg-white ">
          <div className="text-center mb-16">
             <h2 className="section-title mx-auto">{t('about.title')}</h2>
          </div>
      
      <div className="flex flex-col md:flex-row gap-16 items-center">
        <div className="md:w-1/2">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"
            alt="About Ulyana" 
            className="rounded-lg shadow-md w-full max-w-md mx-auto"
          />
        </div>
        
        <div className="md:w-1/2">
          <h3 className="text-2xl font-bold mb-4">{t('about.subtitle')}</h3>
          <div className="text-muted-foreground space-y-4 whitespace-pre-line">
            {t('about.description')}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
