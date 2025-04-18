
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ContactData, SocialLink, transformSocialLinks } from '@/components/admin/contact/types';
import { Language } from '@/utils/languageUtils';

export const useContactData = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactData>({
    title: { en: '', pl: '', ru: '' },
    subtitle: { en: '', pl: '', ru: '' },
    email: '',
    social_links: [],
    location: { en: '', pl: '', ru: '' }
  });

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact')
        .select('*')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setContactInfo({
          id: data.id,
          title: data.title as Record<Language, string> || { en: '', pl: '', ru: '' },
          subtitle: data.subtitle as Record<Language, string> || { en: '', pl: '', ru: '' },
          email: data.email || '',
          social_links: transformSocialLinks(data.social_links),
          location: data.location as Record<Language, string> || { en: '', pl: '', ru: '' }
        });
      }
    } catch (error) {
      console.error('Error fetching contact data:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить контактную информацию',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
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
        social_links: contactInfo.social_links,
        location: contactInfo.location
      };

      console.log("Saving contact data:", updateData);

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

      if (response.error) {
        console.error("Supabase error:", response.error);
        throw response.error;
      }

      toast({
        title: 'Информация обновлена',
        description: 'Контактная информация успешно сохранена',
      });
    } catch (error) {
      console.error('Error saving contact data:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить контактную информацию',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    contactInfo,
    handleContactInfoChange,
    handleSocialLinkChange,
    handleAddSocialLink,
    handleRemoveSocialLink,
    handleSave
  };
};
