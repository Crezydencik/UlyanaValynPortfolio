
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language, languages } from '../utils/languageUtils';
import { Globe } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

const Header: React.FC = () => {
  const { t, language, changeLanguage } = useLanguage();
  
  return (
    <header className="py-4 px-6 md:px-8 lg:px-12 flex justify-between items-center">
      <div className="ulyana-logo text-xl">
        Ulyana<span>Logo</span>
      </div>
      
      <nav className="hidden md:flex items-center space-x-8">
        <a href="#" className="hover:text-primary transition-colors">{t('navigation.home')}</a>
        <a href="#about" className="hover:text-primary transition-colors">{t('navigation.about')}</a>
        <a href="#portfolio" className="hover:text-primary transition-colors">{t('navigation.portfolio')}</a>
        <a href="#certificates" className="hover:text-primary transition-colors">{t('navigation.certificates')}</a>
        <a href="#contact" className="hover:text-primary transition-colors">{t('navigation.contact')}</a>
      </nav>
      
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Globe className="h-5 w-5" />
              <span className="sr-only">Toggle language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.entries(languages).map(([code, name]) => (
              <DropdownMenuItem 
                key={code} 
                onClick={() => changeLanguage(code as Language)}
                className={language === code ? "bg-muted" : ""}
              >
                {name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
