
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="ulyana-logo text-xl mb-4">
          Ulyana<span>Logo</span>
        </div>
        <p className="text-gray-400 mb-6">{t('footer.description')}</p>
        <p className="text-sm">{t('footer.rights')}</p>
      </div>
    </footer>
  );
};

export default Footer;
