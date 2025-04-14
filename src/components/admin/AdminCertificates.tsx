
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash, Edit } from 'lucide-react';

interface Certificate {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  issuer: Record<Language, string>;
  date: Record<Language, string>;
}

const AdminCertificates = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  
  // Initialize certificates from translations
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: 'polishCert',
      title: {
        en: translations.en.certifications.polishCert.title,
        pl: translations.pl.certifications.polishCert.title,
        ru: translations.ru.certifications.polishCert.title
      },
      description: {
        en: translations.en.certifications.polishCert.description,
        pl: translations.pl.certifications.polishCert.description,
        ru: translations.ru.certifications.polishCert.description
      },
      issuer: {
        en: translations.en.certifications.polishCert.issuer,
        pl: translations.pl.certifications.polishCert.issuer,
        ru: translations.ru.certifications.polishCert.issuer
      },
      date: {
        en: translations.en.certifications.polishCert.date,
        pl: translations.pl.certifications.polishCert.date,
        ru: translations.ru.certifications.polishCert.date
      }
    },
    {
      id: 'journalismCert',
      title: {
        en: translations.en.certifications.journalismCert.title,
        pl: translations.pl.certifications.journalismCert.title,
        ru: translations.ru.certifications.journalismCert.title
      },
      description: {
        en: translations.en.certifications.journalismCert.description,
        pl: translations.pl.certifications.journalismCert.description,
        ru: translations.ru.certifications.journalismCert.description
      },
      issuer: {
        en: translations.en.certifications.journalismCert.issuer,
        pl: translations.pl.certifications.journalismCert.issuer,
        ru: translations.ru.certifications.journalismCert.issuer
      },
      date: {
        en: translations.en.certifications.journalismCert.date,
        pl: translations.pl.certifications.journalismCert.date,
        ru: translations.ru.certifications.journalismCert.date
      }
    }
  ]);

  const [editingCert, setEditingCert] = useState<string | null>(null);

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value as Language);
  };

  const handleInputChange = (certId: string, field: keyof Certificate, value: string) => {
    setCertificates(prev => 
      prev.map(cert => {
        if (cert.id === certId) {
          return {
            ...cert,
            [field]: {
              ...cert[field] as Record<Language, string>,
              [selectedLanguage]: value
            }
          };
        }
        return cert;
      })
    );
  };

  const handleAddCertificate = () => {
    const newId = `cert_${Date.now()}`;
    const newCert: Certificate = {
      id: newId,
      title: { en: '', pl: '', ru: '' },
      description: { en: '', pl: '', ru: '' },
      issuer: { en: '', pl: '', ru: '' },
      date: { en: '', pl: '', ru: '' }
    };
    setCertificates(prev => [...prev, newCert]);
    setEditingCert(newId);
  };

  const handleDeleteCertificate = (id: string) => {
    setCertificates(prev => prev.filter(cert => cert.id !== id));
    if (editingCert === id) {
      setEditingCert(null);
    }
  };

  const handleSave = () => {
    // In a real app, you would update translations or save to DB here
    toast({
      title: 'Certificates updated',
      description: `Updated certificates for all languages`,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Edit Certificates</CardTitle>
          <CardDescription>
            Manage your certifications in different languages.
          </CardDescription>
        </div>
        <Button onClick={handleAddCertificate}>
          <Plus className="mr-2 h-4 w-4" /> Add Certificate
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedLanguage} onValueChange={handleLanguageChange}>
          <TabsList className="mb-4">
            {Object.entries(languages).map(([code, name]) => (
              <TabsTrigger key={code} value={code}>{name}</TabsTrigger>
            ))}
          </TabsList>
          
          <div className="space-y-6">
            <Accordion 
              type="single" 
              collapsible 
              className="w-full"
              value={editingCert || undefined}
              onValueChange={(value) => setEditingCert(value || null)}
            >
              {certificates.map((cert) => (
                <AccordionItem key={cert.id} value={cert.id}>
                  <div className="flex items-center justify-between">
                    <AccordionTrigger className="flex-1">
                      {cert.title[selectedLanguage] || 'New Certificate'}
                    </AccordionTrigger>
                    <div className="flex gap-2 px-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setEditingCert(cert.id === editingCert ? null : cert.id);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleDeleteCertificate(cert.id);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <AccordionContent>
                    <div className="pl-4 space-y-4 pt-4">
                      <div>
                        <Label htmlFor={`title-${cert.id}`}>Title</Label>
                        <Input
                          id={`title-${cert.id}`}
                          value={cert.title[selectedLanguage] || ''}
                          onChange={(e) => handleInputChange(cert.id, 'title', e.target.value)}
                          placeholder="Certificate title"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`description-${cert.id}`}>Description</Label>
                        <Textarea
                          id={`description-${cert.id}`}
                          value={cert.description[selectedLanguage] || ''}
                          onChange={(e) => handleInputChange(cert.id, 'description', e.target.value)}
                          placeholder="Certificate description"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`issuer-${cert.id}`}>Issuer</Label>
                          <Input
                            id={`issuer-${cert.id}`}
                            value={cert.issuer[selectedLanguage] || ''}
                            onChange={(e) => handleInputChange(cert.id, 'issuer', e.target.value)}
                            placeholder="Certificate issuer"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`date-${cert.id}`}>Date</Label>
                          <Input
                            id={`date-${cert.id}`}
                            value={cert.date[selectedLanguage] || ''}
                            onChange={(e) => handleInputChange(cert.id, 'date', e.target.value)}
                            placeholder="Certificate date"
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminCertificates;
