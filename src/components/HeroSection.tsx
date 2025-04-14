
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="section flex flex-col md:flex-row justify-between items-center min-h-[80vh] pt-0">
      <div className="md:w-1/2 text-left mb-8 md:mb-0">
        <h1 className="text-5xl font-bold mb-2">
          {t('hero.greeting')}
        </h1>
        <h2 className="text-5xl font-bold mb-6">
          {t('hero.intro')} <span className="hero-name">Ulyana</span>
        </h2>
        <p className="text-muted-foreground mb-8 max-w-lg">
          {t('hero.description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="bg-primary hover:bg-primary/90">
            {t('hero.viewWork')}
          </Button>
          <Button variant="outline">
            {t('hero.contactMe')}
          </Button>
        </div>
      </div>
      
      <div className="md:w-1/2 flex justify-center">
        <div className="relative">
          <img 
            src="/lovable-uploads/60d37c69-f4c1-4906-ba3b-310be8ad926e.png" 
            alt="Ulyana" 
            className="max-w-xs md:max-w-sm rounded-md shadow-lg rotate-3 border-4 border-white" 
          />
          <div className="absolute inset-0 border-8 border-white rotate-3 rounded-md shadow-lg -z-10"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
