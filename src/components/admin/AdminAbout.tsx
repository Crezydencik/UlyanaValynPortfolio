
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

const AdminAbout = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  
  // Use the correct translations based on the language
  const [formData, setFormData] = useState({
    subtitle: translations[selectedLanguage].about.subtitle,
    description: translations[selectedLanguage].about.description,
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (value: string) => {
    const newLang = value as Language;
    setSelectedLanguage(newLang);
    
    // Update the form with the selected language content
    setFormData({
      subtitle: translations[newLang].about.subtitle,
      description: translations[newLang].about.description,
      imageUrl: formData.imageUrl // Keep the same image URL
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would update translations or save to DB here
    toast({
      title: 'About section updated',
      description: `Updated content for ${languages[selectedLanguage]} language`,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to storage here
      // For demo purposes, we'll create a local URL
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, imageUrl }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit About Me</CardTitle>
        <CardDescription>
          Modify your about section in different languages.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedLanguage} onValueChange={handleLanguageChange}>
          <TabsList className="mb-4">
            {Object.entries(languages).map(([code, name]) => (
              <TabsTrigger key={code} value={code}>{name}</TabsTrigger>
            ))}
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={8}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="image">Profile Image</Label>
                <div className="mt-2 flex items-start space-x-4">
                  <div className="w-32 h-32 overflow-hidden rounded-lg border">
                    <img
                      src={formData.imageUrl}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="max-w-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Upload a profile image (recommended size: 800x800px)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <Button type="submit">Save Changes</Button>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminAbout;
