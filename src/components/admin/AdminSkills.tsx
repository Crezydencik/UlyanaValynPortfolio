import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { languages, Language } from '@/utils/languageUtils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Minus, CheckCircle, Save } from 'lucide-react';
import { useSkills, useSaveSkill, useUpdateSkill, useDeleteSkill, Skill, SkillCategory } from '@/hooks/useSkills';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const iconOptions = [
  { value: 'Newspaper', label: '📰 News Writing' },
  { value: 'Mic', label: '🎤 Interviewing' },
  { value: 'Search', label: '🔍 Research' },
  { value: 'PenLine', label: '✏️ Storytelling' },
  { value: 'Video', label: '🎞️ Video Editing' },
  { value: 'Camera', label: '📷 Cinematography' },
  { value: 'BarChart2', label: '📊 Analytics' },
  { value: 'Users2', label: '👥 Teamwork' },
];

const AdminSkills = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { data: skillCategories = [], isLoading, refetch } = useSkills();
  const saveSkill = useSaveSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();

  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [localSkillCategories, setLocalSkillCategories] = useState<SkillCategory[]>([]);

  useEffect(() => {
    if (skillCategories.length > 0) {
      setLocalSkillCategories(skillCategories);
    }
  }, [skillCategories]);

  const handleLanguageChange = (value: string) => {
    const newLang = value as Language;
    setSelectedLanguage(newLang);
  };

  const handleSkillChange = (categoryId: string, skillId: string, field: keyof Skill, value: any) => {
    setLocalSkillCategories(prev =>
      prev.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            skills: category.skills.map(skill =>
              skill.id === skillId
                ? {
                    ...skill,
                    [field]: field === 'name'
                      ? { ...skill.name, [selectedLanguage]: value }
                      : value
                  }
                : skill
            )
          };
        }
        return category;
      })
    );
  };

  const handleAddSkill = (categoryId: string) => {
    const newSkillId = `new-${Date.now()}`;
    const emptyNameRecord = Object.keys(languages).reduce((acc, lang) => {
      acc[lang as Language] = '';
      return acc;
    }, {} as Record<Language, string>);

    setLocalSkillCategories(prev =>
      prev.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            skills: [
              ...category.skills,
              {
                id: newSkillId,
                name: emptyNameRecord,
                category: categoryId,
                level: 50,
                icon: ''
              }
            ]
          };
        }
        return category;
      })
    );
  };

  const handleRemoveSkill = (categoryId: string, skillId: string) => {
    if (!skillId.startsWith('new-')) {
      deleteSkill.mutate(skillId);
    }

    setLocalSkillCategories(prev =>
      prev.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            skills: category.skills.filter(skill => skill.id !== skillId)
          };
        }
        return category;
      })
    );
  };

  const handleSaveSkill = (skill: Skill) => {
    if (skill.id.startsWith('new-')) {
      const { id, ...skillData } = skill;
      saveSkill.mutate(skillData);
    } else {
      updateSkill.mutate(skill);
    }
  };

  const handleSaveAllSkills = async () => {
    try {
      const savePromises: Promise<any>[] = [];

      localSkillCategories.forEach(category => {
        category.skills.forEach(skill => {
          if (skill.id.startsWith('new-')) {
            const { id, ...skillData } = skill;
            savePromises.push(saveSkill.mutateAsync(skillData));
          } else {
            savePromises.push(updateSkill.mutateAsync(skill));
          }
        });
      });

      await Promise.all(savePromises);

      toast({
        title: 'Skills saved',
        description: 'All skills have been successfully saved'
      });

      refetch();
    } catch (error) {
      console.error('Error saving skills:', error);
      toast({
        title: 'Error',
        description: 'Failed to save skills',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading skills...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Skills</CardTitle>
        <CardDescription>
          Manage your skill categories and individual skills.
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
            <Accordion type="single" collapsible className="w-full">
              {localSkillCategories.map(category => (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <span>{category.title[selectedLanguage]}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-4 space-y-4">
                      <Label>Skills</Label>
                      {category.skills.map(skill => (
                        <div key={skill.id} className="grid grid-cols-1 gap-3 p-3 border rounded-md">
                          <div className="flex flex-col md:flex-row gap-2 md:items-center">
                            <CheckCircle className="text-primary h-5 w-5 flex-shrink-0" />
                            <Input
                              value={skill.name[selectedLanguage] || ''}
                              onChange={(e) => handleSkillChange(category.id, skill.id, 'name', e.target.value)}
                              placeholder={`Skill name (${languages[selectedLanguage]})`}
                            />
                            <Select
                              value={skill.icon || ''}
                              onValueChange={(val) => handleSkillChange(category.id, skill.id, 'icon', val)}
                            >
                              <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select icon" />
                              </SelectTrigger>
                              <SelectContent>
                                {iconOptions.map(({ value, label }) => (
                                  <SelectItem key={value} value={value}>
                                    <i className={`${value} mr-2`}></i> {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleSaveSkill(skill)}
                              title="Save skill"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveSkill(category.id, skill.id)}
                              title="Remove skill"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-4">
                            <Label htmlFor={`skill-level-${skill.id}`} className="min-w-20">
                              Level: {skill.level}%
                            </Label>
                            <Slider
                              id={`skill-level-${skill.id}`}
                              min={0}
                              max={100}
                              step={5}
                              value={[skill.level]}
                              onValueChange={(value) => handleSkillChange(category.id, skill.id, 'level', value[0])}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddSkill(category.id)}
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Skill
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Button onClick={handleSaveAllSkills} className="mt-6">
              <Save className="h-4 w-4 mr-2" /> Save All Changes
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminSkills;