
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash, Edit, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Certificate {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  issuer: Record<Language, string>;
  date: string;
  image_url?: string | null;
}

const AdminCertificates = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCert, setEditingCert] = useState<string | null>(null);

  // Fetch certificates from the database
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('certificates')
          .select('*');

        if (error) throw error;

        // Transform data to match our component's structure
        const transformedCerts = data.map(cert => ({
          id: cert.id,
          title: cert.title || { en: '', pl: '', ru: '' },
          description: cert.description || { en: '', pl: '', ru: '' },
          issuer: cert.issuer || { en: '', pl: '', ru: '' },
          date: cert.date || '',
          image_url: cert.image_url
        }));

        setCertificates(transformedCerts);
      } catch (error) {
        console.error('Error fetching certificates:', error);
        toast({
          title: 'Error',
          description: 'Failed to load certificates',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [toast]);

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value as Language);
  };

  const handleInputChange = (certId: string, field: keyof Certificate, value: string) => {
    setCertificates(prev => 
      prev.map(cert => {
        if (cert.id === certId) {
          if (field === 'date') {
            return { ...cert, [field]: value };
          } else if (field === 'image_url') {
            return { ...cert, [field]: value };
          } else {
            return {
              ...cert,
              [field]: {
                ...cert[field] as Record<Language, string>,
                [selectedLanguage]: value
              }
            };
          }
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
      date: new Date().toISOString().split('T')[0]
    };
    setCertificates(prev => [...prev, newCert]);
    setEditingCert(newId);
  };

  const handleDeleteCertificate = async (id: string) => {
    try {
      // Check if it's a new unsaved certificate
      if (id.startsWith('cert_')) {
        setCertificates(prev => prev.filter(cert => cert.id !== id));
        if (editingCert === id) {
          setEditingCert(null);
        }
        return;
      }

      // Delete from database
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCertificates(prev => prev.filter(cert => cert.id !== id));
      if (editingCert === id) {
        setEditingCert(null);
      }

      toast({
        title: 'Certificate deleted',
        description: 'Certificate has been successfully removed'
      });
    } catch (error) {
      console.error('Error deleting certificate:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete certificate',
        variant: 'destructive'
      });
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Process each certificate
      for (const cert of certificates) {
        const certData = {
          title: cert.title,
          description: cert.description,
          issuer: cert.issuer,
          date: cert.date,
          image_url: cert.image_url
        };

        if (cert.id.startsWith('cert_')) {
          // New certificate - remove local ID and insert
          const { error } = await supabase
            .from('certificates')
            .insert([certData]);
          
          if (error) throw error;
        } else {
          // Update existing certificate
          const { error } = await supabase
            .from('certificates')
            .update(certData)
            .eq('id', cert.id);
          
          if (error) throw error;
        }
      }

      // Refresh data after save
      const { data, error } = await supabase
        .from('certificates')
        .select('*');

      if (error) throw error;

      // Update the state with fresh data from the database
      const transformedCerts = data.map(cert => ({
        id: cert.id,
        title: cert.title || { en: '', pl: '', ru: '' },
        description: cert.description || { en: '', pl: '', ru: '' },
        issuer: cert.issuer || { en: '', pl: '', ru: '' },
        date: cert.date || '',
        image_url: cert.image_url
      }));

      setCertificates(transformedCerts);
      
      toast({
        title: 'Certificates updated',
        description: 'All certificates have been successfully saved',
      });
    } catch (error) {
      console.error('Error saving certificates:', error);
      toast({
        title: 'Error',
        description: 'Failed to save certificates',
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
        <span className="ml-2">Loading certificates...</span>
      </div>
    );
  }

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
                            type="date"
                            value={cert.date}
                            onChange={(e) => handleInputChange(cert.id, 'date', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor={`image-${cert.id}`}>Image URL</Label>
                        <Input
                          id={`image-${cert.id}`}
                          value={cert.image_url || ''}
                          onChange={(e) => handleInputChange(cert.id, 'image_url', e.target.value)}
                          placeholder="https://example.com/certificate.jpg"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
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

export default AdminCertificates;
