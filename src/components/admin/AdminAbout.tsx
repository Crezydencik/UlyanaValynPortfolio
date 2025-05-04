import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { languages, Language } from '@/utils/languageUtils';
import { AboutData } from './contact/types';

const AdminAbout = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [formDataByLang, setFormDataByLang] = useState<Record<Language, { subtitle: string; description: string }>>({
    en: { subtitle: '', description: '' },
    ru: { subtitle: '', description: '' },
    pl: { subtitle: '', description: '' },
  });

  const [imageUrl, setImageUrl] = useState('');
  const [aboutId, setAboutId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      const { data, error } = await supabase
        .from('about')
        .select('*')
        .single<AboutData>();

      if (error || !data) {
        console.error('Ошибка загрузки about:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить данные из Supabase',
          variant: 'destructive',
        });
        return;
      }

      setAboutId(data.id);
      setImageUrl(data.image_url || '');

      const updated = { ...formDataByLang };
      for (const lang of Object.keys(languages) as Language[]) {
        updated[lang] = {
          subtitle: data.subtitle?.[lang] || '',
          description: data.description?.[lang] || '',
        };
      }
      setFormDataByLang(updated);
    };

    fetchAbout();
  }, [toast]);

  const handleChange = (lang: Language, field: 'subtitle' | 'description', value: string) => {
    setFormDataByLang(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value,
      },
    }));
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value as Language);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: existingData, error: fetchError } = await supabase
      .from('about')
      .select('*')
      .single<AboutData>();

    if (fetchError || !existingData) {
      console.error('Ошибка получения текущих данных:', fetchError);
      toast({
        title: 'Ошибка',
        description: 'Не удалось получить текущее содержимое для обновления',
        variant: 'destructive',
      });
      return;
    }

    const updatedSubtitle = {
      ...(existingData.subtitle || {}),
      [selectedLanguage]: formDataByLang[selectedLanguage].subtitle,
    };

    const updatedDescription = {
      ...(existingData.description || {}),
      [selectedLanguage]: formDataByLang[selectedLanguage].description,
    };

    const { data, error } = await supabase
      .from('about')
      .upsert([
        {
          id: aboutId || crypto.randomUUID(),
          subtitle: updatedSubtitle,
          description: updatedDescription,
          image_url: imageUrl,
        }
      ], { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Ошибка сохранения:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить изменения',
        variant: 'destructive',
      });
    } else {
      setAboutId(data.id);
      toast({
        title: 'Успешно',
        description: `Секция обновлена (${languages[selectedLanguage]})`,
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `about/${fileName}`;
    const bucket = 'juliana';

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      console.error('Ошибка загрузки в Storage:', uploadError);
      toast({
        title: 'Ошибка',
        description: `Ошибка Supabase: ${uploadError.message}`,
        variant: 'destructive',
      });
      return;
    }

    const { data: imageData, error: publicUrlError } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    if (publicUrlError || !imageData?.publicUrl) {
      console.error('Ошибка получения ссылки:', publicUrlError);
      toast({
        title: 'Ошибка',
        description: 'Не удалось получить ссылку на изображение',
        variant: 'destructive',
      });
      return;
    }

    setImageUrl(imageData.publicUrl);

    toast({
      title: 'Изображение загружено',
      description: 'Ссылка успешно обновлена',
    });

    e.target.value = '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Редактирование "Обо мне"</CardTitle>
        <CardDescription>Измените информацию на нужном языке.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedLanguage} onValueChange={handleLanguageChange}>
          <TabsList className="mb-4">
            {Object.entries(languages).map(([code, name]) => (
              <TabsTrigger key={code} value={code}>{name}</TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(languages).map(([code]) => {
            const lang = code as Language;
            return (
              <TabsContent key={lang} value={lang}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`subtitle-${lang}`}>Подзаголовок</Label>
                      <Input
                        id={`subtitle-${lang}`}
                        name="subtitle"
                        value={formDataByLang[lang]?.subtitle || ''}
                        onChange={(e) => handleChange(lang, 'subtitle', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`description-${lang}`}>Описание</Label>
                      <Textarea
                        id={`description-${lang}`}
                        name="description"
                        rows={8}
                        value={formDataByLang[lang]?.description || ''}
                        onChange={(e) => handleChange(lang, 'description', e.target.value)}
                      />
                    </div>

                    {lang === selectedLanguage && (
                      <div>
                        <Label htmlFor="image">Изображение</Label>
                        <div className="mt-2 flex items-start space-x-4">
                          <div className="w-32 h-32 overflow-hidden rounded-lg border bg-gray-100 flex items-center justify-center">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt="Превью"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xs text-gray-400">Нет изображения</span>
                            )}
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
                              Рекомендуемый размер: 800x800px
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button type="submit">Сохранить изменения</Button>
                </form>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminAbout;
