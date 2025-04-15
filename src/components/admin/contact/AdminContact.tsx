
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { languages, Language } from '@/utils/languageUtils';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ContactForm } from './ContactForm';
import { SocialLinks } from './SocialLinks';
import { ContactData, SocialLink } from './types';

const AdminContact = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [contactInfo, setContactInfo] = useState<ContactData>({
    title: { en: '', pl: '', ru: '' },
    subtitle: { en: '', pl: '', ru: '' },
    email: '',
    social_links: []
  });

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('contact')
          .select('*')
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setContactInfo({
            id: data.id,
            title: data.title || { en: '', pl: '', ru: '' },
            subtitle: data.subtitle || { en: '', pl: '', ru: '' },
            email: data.email || '',
            social_links: data.social_links || []
          });
        }
      } catch (error) {
        console.error('Error fetching contact data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load contact information',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, [toast]);

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value as Language);
  };

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [field, lang] = name.split('.');
      setContactInfo(prev => ({
        ...prev,
        [field]: {
          ...prev[field as keyof typeof prev] as Record<Language, string>,
          [lang]: value
        }
      }));
    } else {
      setContactInfo(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSocialLinkChange = (id: string, field: keyof SocialLink, value: string) => {
    setContactInfo(prev => ({
      ...prev,
      social_links: prev.social_links.map(link => 
        link.id === id 
          ? { ...link, [field]: value } 
          : link
      )
    }));
  };

  const handleAddSocialLink = () => {
    const newId = Date.now().toString();
    setContactInfo(prev => ({
      ...prev,
      social_links: [...prev.social_links, { 
        id: newId, 
        name: '', 
        url: '', 
        icon: 'link' 
      }]
    }));
  };

  const handleRemoveSocialLink = (id: string) => {
    setContactInfo(prev => ({
      ...prev,
      social_links: prev.social_links.filter(link => link.id !== id)
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const updateData = {
        title: contactInfo.title,
        subtitle: contactInfo.subtitle,
        email: contactInfo.email,
        social_links: contactInfo.social_links
      };

      let response;
      
      if (contactInfo.id) {
        response = await supabase
          .from('contact')
          .update(updateData)
          .eq('id', contactInfo.id);
      } else {
        response = await supabase
          .from('contact')
          .insert([updateData]);
      }

      if (response.error) throw response.error;

      toast({
        title: 'Contact information updated',
        description: 'Successfully saved contact information to the database',
      });
    } catch (error) {
      console.error('Error saving contact data:', error);
      toast({
        title: 'Error',
        description: 'Failed to save contact information',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading contact information...</span>
        </CardContent>
      </Card>
    );
  }

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
            
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="w-full"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminContact;
