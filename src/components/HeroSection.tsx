
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center bg-portfolio-gray pt-16"
    >
      <div className="container max-w-6xl mx-auto px-4">

      <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1 animate-fade-up">
            <div className="mb-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {t('hero.greeting')}<br />
                {t('hero.intro')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent from-purple-400 to-pink-500">Ulyana</span>
              </h1>
              <p className="text-lg text-gray-600 mb-6">
              {t('hero.description')}
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#portfolio" 
                  className="portfolio-button flex items-center "
                  >
                  View My Work <ArrowRight size={16} />
                </a>
                <a 
                  href="#contact" 
                  className="inline-block border-2 border-black text-portfolio-black hover:bg-black hover:text-white font-medium py-2 px-4 rounded transition-all duration-300"
                  >
                  {t('hero.contactMe')}
                </a>
              </div>
            </div>
          </div>
      <div className="order-1 md:order-2 animate-fade-in">
            <div className="relative aspect-[4/3] bg-white p-4 shadow-lg rotate-3 hover:rotate-0 transition-all duration-500">
              <img 
                src="/photo/Main.png" 
                alt="Ulijana - Journalist" 
                className="w-full h-full object-cover"
                loading="lazy"
                />
            </div>
          </div>
          </div>
                </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#about" className="block">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14m-7-7 7 7 7-7" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
