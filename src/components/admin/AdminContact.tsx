
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { languages, Language } from '@/utils/languageUtils';
import { Facebook, Instagram, Twitter, Mail, Link, Plus, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

interface ContactData {
  id?: string;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  email: string;
  social_links: SocialLink[];
}

const AdminContact = () => {
  const { t, language } = useLanguage();
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

  // Fetch contact data from the database
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

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        // Update existing record
        response = await supabase
          .from('contact')
          .update(updateData)
          .eq('id', contactInfo.id);
      } else {
        // Create new record
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading contact information...</span>
      </div>
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
            <div className="space-y-4">
              <div>
                <Label htmlFor={`title.${selectedLanguage}`}>Section Title</Label>
                <Input
                  id={`title.${selectedLanguage}`}
                  name={`title.${selectedLanguage}`}
                  value={contactInfo.title[selectedLanguage] || ''}
                  onChange={handleContactInfoChange}
                  placeholder="Contact title"
                />
              </div>
              
              <div>
                <Label htmlFor={`subtitle.${selectedLanguage}`}>Section Subtitle</Label>
                <Input
                  id={`subtitle.${selectedLanguage}`}
                  name={`subtitle.${selectedLanguage}`}
                  value={contactInfo.subtitle[selectedLanguage] || ''}
                  onChange={handleContactInfoChange}
                  placeholder="Contact subtitle"
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
                placeholder="your@email.com"
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
              
              {contactInfo.social_links.map(link => (
                <div key={link.id} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {getSocialIcon(link.icon)}
                  </div>
                  <div className="grid grid-cols-3 gap-3 flex-grow">
                    <Input
                      value={link.name}
                      onChange={(e) => handleSocialLinkChange(link.id, 'name', e.target.value)}
                      placeholder="Name (Instagram, Facebook, etc.)"
                    />
                    <Input
                      value={link.icon}
                      onChange={(e) => handleSocialLinkChange(link.id, 'icon', e.target.value)}
                      placeholder="Icon (instagram, facebook, etc.)"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(link.id, 'url', e.target.value)}
                      placeholder="URL (https://...)"
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
