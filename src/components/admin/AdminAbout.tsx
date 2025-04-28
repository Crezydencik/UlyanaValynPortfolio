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
  const [formData, setFormData] = useState({
    subtitle: '',
    description: '',
    imageUrl: '',
  });

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
      setFormData({
        subtitle: data.subtitle?.[selectedLanguage] || '',
        description: data.description?.[selectedLanguage] || '',
        imageUrl: data.image_url || '',
      });
    };

    fetchAbout();
  }, [selectedLanguage, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value as Language);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // 1. Загружаем текущее состояние из базы
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
  
    // 2. Обновляем только выбранный язык
    const updatedSubtitle = {
      ...(existingData.subtitle || {}),
      [selectedLanguage]: formData.subtitle,
    };
  
    const updatedDescription = {
      ...(existingData.description || {}),
      [selectedLanguage]: formData.description,
    };
  
    // 3. Сохраняем обратно в базу
    const { data, error } = await supabase
      .from('about')
      .upsert([
        {
          id: aboutId || crypto.randomUUID(),
          subtitle: updatedSubtitle,
          description: updatedDescription,
          image_url: formData.imageUrl,
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
  
    const bucket = 'juliana'; // ✅ используем один и тот же bucket
  
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
  
    console.log('Загруженное изображение:', imageData.publicUrl);
  
    setFormData(prev => ({
      ...prev,
      imageUrl: imageData.publicUrl,
    }));
  
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

          <TabsContent value={selectedLanguage}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subtitle">Подзаголовок</Label>
                  <Input
                    id="subtitle"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={8}
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="image">Изображение</Label>
                  <div className="mt-2 flex items-start space-x-4">
                    <div className="w-32 h-32 overflow-hidden rounded-lg border bg-gray-100 flex items-center justify-center">
                      {formData.imageUrl ? (
                        <img
                          src={formData.imageUrl}
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
              </div>

              <Button type="submit">Сохранить изменения</Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminAbout;
