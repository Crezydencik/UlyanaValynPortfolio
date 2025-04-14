
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Instagram, Facebook, Twitter } from 'lucide-react';

const ContactSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section id="contact" className="section bg-gray-50">
          <div className="text-center mb-12">

      <h2 className="section-title">{t('contact.title')}</h2>
      <p className="text-center text-muted-foreground mb-12">{t('contact.subtitle')}</p>
          </div>
      
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">{t('contact.info')}</h3>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Mail className="h-5 w-5 text-primary" />
            <span className="font-medium">{t('contact.email')}:</span>
            <a href="mailto:info@ulyana.com" className="hover:text-primary">info@ulyana.com</a>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4">{t('contact.followMe')}</h3>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
              <Instagram className="h-6 w-6 text-primary" />
            </a>
            <a href="#" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
              <Facebook className="h-6 w-6 text-primary" />
            </a>
            <a href="#" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
              <Twitter className="h-6 w-6 text-primary" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
