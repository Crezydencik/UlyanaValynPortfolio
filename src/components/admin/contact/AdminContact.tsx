
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { languages, Language } from '@/utils/languageUtils';
import { ContactForm } from './ContactForm';
import { SocialLinks } from './SocialLinks';
import { LoadingState } from './LoadingState';
import { SaveButton } from './SaveButton';
import { useContactData } from '@/hooks/useContactData';

const AdminContact = () => {
  const { language } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  
  const {
    loading,
    saving,
    contactInfo,
    handleContactInfoChange,
    handleSocialLinkChange,
    handleAddSocialLink,
    handleRemoveSocialLink,
    handleSave
  } = useContactData();

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value as Language);
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Редактирование контактной информации</CardTitle>
        <CardDescription>
          Обновите ваши контактные данные и ссылки на социальные сети.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedLanguage} onValueChange={handleLanguageChange}>
          <TabsList className="mb-4">
            {Object.entries(languages).map(([code, name]) => (
              <TabsTrigger key={code} value={code}>{name}</TabsTrigger>
            ))}
          </TabsList>
          
          <div className="space-y-6">
            <ContactForm 
              contactInfo={contactInfo}
              onContactInfoChange={handleContactInfoChange}
              selectedLanguage={selectedLanguage}
            />
            
            <SocialLinks 
              socialLinks={contactInfo.social_links}
              onSocialLinkChange={handleSocialLinkChange}
              onAddSocialLink={handleAddSocialLink}
              onRemoveSocialLink={handleRemoveSocialLink}
            />
            
            <SaveButton saving={saving} onSave={handleSave} />
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminContact;
