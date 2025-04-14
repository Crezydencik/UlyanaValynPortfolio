
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { languages, Language } from '@/utils/languageUtils';
import translations from '@/translations';
import { Facebook, Instagram, Twitter, Mail, Link, Plus, X } from 'lucide-react';

interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

const AdminContact = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  
  const [contactInfo, setContactInfo] = useState({
    title: translations[selectedLanguage].contact.title,
    subtitle: translations[selectedLanguage].contact.subtitle,
    email: 'info@ulyana.com',
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { id: '1', name: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
    { id: '2', name: 'Facebook', url: 'https://facebook.com', icon: 'facebook' },
    { id: '3', name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' }
  ]);

  const handleLanguageChange = (value: string) => {
    const newLang = value as Language;
    setSelectedLanguage(newLang);
    
    // Update the form with the selected language content
    setContactInfo({
      ...contactInfo,
      title: translations[newLang].contact.title,
      subtitle: translations[newLang].contact.subtitle
    });
  };

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (id: string, field: keyof SocialLink, value: string) => {
    setSocialLinks(prev => 
      prev.map(link => 
        link.id === id 
          ? { ...link, [field]: value } 
          : link
      )
    );
  };

  const handleAddSocialLink = () => {
    const newId = Date.now().toString();
    setSocialLinks(prev => [...prev, { 
      id: newId, 
      name: '', 
      url: '', 
      icon: 'link' 
    }]);
  };

  const handleRemoveSocialLink = (id: string) => {
    setSocialLinks(prev => prev.filter(link => link.id !== id));
  };

  const getSocialIcon = (icon: string) => {
    switch (icon.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'mail':
        return <Mail className="h-5 w-5" />;
      default:
        return <Link className="h-5 w-5" />;
    }
  };

  const handleSave = () => {
    // In a real app, you would update translations or save to DB here
    toast({
      title: 'Contact information updated',
      description: `Updated contact information for ${languages[selectedLanguage]} language`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Contact Information</CardTitle>
        <CardDescription>
          Update your contact details and social media links.
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
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Section Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={contactInfo.title}
                  onChange={handleContactInfoChange}
                />
              </div>
              
              <div>
                <Label htmlFor="subtitle">Section Subtitle</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  value={contactInfo.subtitle}
                  onChange={handleContactInfoChange}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={contactInfo.email}
                onChange={handleContactInfoChange}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Social Media Links</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddSocialLink}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Link
                </Button>
              </div>
              
              {socialLinks.map(link => (
                <div key={link.id} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {getSocialIcon(link.icon)}
                  </div>
                  <div className="grid grid-cols-3 gap-3 flex-grow">
                    <Input
                      value={link.name}
                      onChange={(e) => handleSocialLinkChange(link.id, 'name', e.target.value)}
                      placeholder="Name"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(link.id, 'url', e.target.value)}
                      placeholder="URL"
                      className="col-span-2"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemoveSocialLink(link.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminContact;
