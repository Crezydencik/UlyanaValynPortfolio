
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { languages, Language } from '@/utils/languageUtils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Minus, CheckCircle, Save, Trash } from 'lucide-react';
import { useSkills, useSaveSkill, useUpdateSkill, useDeleteSkill, Skill, SkillCategory } from '@/hooks/useSkills';
import { Slider } from '@/components/ui/slider';

const AdminSkills = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { data: skillCategories = [], isLoading, refetch } = useSkills();
  const saveSkill = useSaveSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();
  
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [localSkillCategories, setLocalSkillCategories] = useState<SkillCategory[]>([]);
  const [newCategory, setNewCategory] = useState('');
  
  useEffect(() => {
    if (skillCategories.length > 0) {
      setLocalSkillCategories(skillCategories);
    } else {
      // Initialize with empty categories if none exist
      setLocalSkillCategories([
        { id: 'journalism', title: 'Journalism', skills: [] },
        { id: 'videoEditing', title: 'Video Editing', skills: [] },
        { id: 'marketing', title: 'Marketing', skills: [] }
      ]);
    }
  }, [skillCategories]);

  const handleLanguageChange = (value: string) => {
    const newLang = value as Language;
    setSelectedLanguage(newLang);
  };

  const handleCategoryTitleChange = (categoryId: string, value: string) => {
    setLocalSkillCategories(prev => 
      prev.map(category => 
        category.id === categoryId 
          ? { ...category, title: value } 
          : category
      )
    );
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
                level: 75
              }
            ]
          };
        }
        return category;
      })
    );
  };

  const handleRemoveSkill = (categoryId: string, skillId: string) => {
    // If it's an existing skill (not temporary), delete it from DB
    if (!skillId.startsWith('new-')) {
      deleteSkill.mutate(skillId);
    }
    
    // Remove from local state
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

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const categoryId = newCategory.trim().toLowerCase().replace(/\s+/g, '-');
      setLocalSkillCategories(prev => [
        ...prev,
        {
          id: categoryId,
          title: newCategory.trim(),
          skills: []
        }
      ]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    // Delete all skills in this category first
    const categoryToRemove = localSkillCategories.find(cat => cat.id === categoryId);
    if (categoryToRemove) {
      categoryToRemove.skills.forEach(skill => {
        if (!skill.id.startsWith('new-')) {
          deleteSkill.mutate(skill.id);
        }
      });
    }
    
    // Remove category from local state
    setLocalSkillCategories(prev => prev.filter(category => category.id !== categoryId));
  };

  const handleSaveSkill = (skill: Skill) => {
    if (skill.id.startsWith('new-')) {
      // Remove temporary id for new skills
      const { id, ...skillData } = skill;
      saveSkill.mutate(skillData);
    } else {
      updateSkill.mutate(skill);
    }
  };

  const handleSaveAllSkills = async () => {
    try {
      // Save all skills in all categories
      const savePromises: Promise<any>[] = [];
      
      localSkillCategories.forEach(category => {
        category.skills.forEach(skill => {
          if (skill.id.startsWith('new-')) {
            // It's a new skill
            const { id, ...skillData } = skill;
            savePromises.push(saveSkill.mutateAsync(skillData));
          } else {
            // It's an existing skill
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
            <div className="flex items-center gap-2 mb-6">
              <Input 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add new category"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
              />
              <Button type="button" onClick={handleAddCategory}>
                <Plus className="h-4 w-4 mr-2" /> Add Category
              </Button>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              {localSkillCategories.map((category) => (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <span>{category.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`category-${category.id}`}>Category Title</Label>
                        <Input
                          id={`category-${category.id}`}
                          value={category.title}
                          onChange={(e) => handleCategoryTitleChange(category.id, e.target.value)}
                        />
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="icon"
                          onClick={() => handleRemoveCategory(category.id)}
                          title="Delete category"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <Label>Skills</Label>
                        {category.skills.map((skill) => (
                          <div key={skill.id} className="grid grid-cols-1 gap-3 p-3 border rounded-md">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="text-primary h-5 w-5 flex-shrink-0" />
                              <Input
                                value={skill.name[selectedLanguage] || ''}
                                onChange={(e) => handleSkillChange(category.id, skill.id, 'name', e.target.value)}
                                placeholder={`Skill name (${languages[selectedLanguage]})`}
                              />
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleRemoveSkill(category.id, skill.id)}
                                title="Remove skill"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => handleSaveSkill(skill)}
                                title="Save skill"
                              >
                                <Save className="h-4 w-4" />
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
