
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-portfolio-black text-white py-12">
    <div className="container max-w-6xl mx-auto px-4">
      <div className="flex flex-col justify-center items-center mb-8">
        <h2 className="text-2xl font-display font-bold">
          <span className="text-white">Ulyana</span>
          <span className="title-gradient">Valyn</span>
        </h2>
        <p className="text-gray-400 mt-2">{t('footer.description')}</p>
      </div>
      
      <div className="text-center">
        <p className="text-gray-400 text-sm">
          &copy; {currentYear} UlyanaValyn {t('footer.rights')}
        </p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
