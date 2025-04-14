
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { languages, Language } from '@/utils/languageUtils';
import translations from '@/translations';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Minus, CheckCircle } from 'lucide-react';

const AdminSkills = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  
  // Initialize skill categories from translations
  const [skillCategories, setSkillCategories] = useState([
    {
      id: 'journalism',
      title: translations[selectedLanguage].skills.journalism.title,
      skills: [
        translations[selectedLanguage].skills.journalism.newsWriting,
        translations[selectedLanguage].skills.journalism.interviewing,
        translations[selectedLanguage].skills.journalism.research,
        translations[selectedLanguage].skills.journalism.storytelling
      ]
    },
    {
      id: 'videoEditing',
      title: translations[selectedLanguage].skills.videoEditing.title,
      skills: [
        translations[selectedLanguage].skills.videoEditing.videoProduction,
        translations[selectedLanguage].skills.videoEditing.capCut,
        translations[selectedLanguage].skills.videoEditing.colorGrading,
        translations[selectedLanguage].skills.videoEditing.cinematography
      ]
    },
    {
      id: 'marketing',
      title: translations[selectedLanguage].skills.marketing.title,
      skills: [
        translations[selectedLanguage].skills.marketing.contentMarketing,
        translations[selectedLanguage].skills.marketing.socialMedia,
        translations[selectedLanguage].skills.marketing.seo,
        translations[selectedLanguage].skills.marketing.analytics
      ]
    }
  ]);

  const handleLanguageChange = (value: string) => {
    const newLang = value as Language;
    setSelectedLanguage(newLang);
    
    // Update skills with the selected language content
    setSkillCategories([
      {
        id: 'journalism',
        title: translations[newLang].skills.journalism.title,
        skills: [
          translations[newLang].skills.journalism.newsWriting,
          translations[newLang].skills.journalism.interviewing,
          translations[newLang].skills.journalism.research,
          translations[newLang].skills.journalism.storytelling
        ]
      },
      {
        id: 'videoEditing',
        title: translations[newLang].skills.videoEditing.title,
        skills: [
          translations[newLang].skills.videoEditing.videoProduction,
          translations[newLang].skills.videoEditing.capCut,
          translations[newLang].skills.videoEditing.colorGrading,
          translations[newLang].skills.videoEditing.cinematography
        ]
      },
      {
        id: 'marketing',
        title: translations[newLang].skills.marketing.title,
        skills: [
          translations[newLang].skills.marketing.contentMarketing,
          translations[newLang].skills.marketing.socialMedia,
          translations[newLang].skills.marketing.seo,
          translations[newLang].skills.marketing.analytics
        ]
      }
    ]);
  };

  const handleCategoryTitleChange = (categoryId: string, value: string) => {
    setSkillCategories(prev => 
      prev.map(category => 
        category.id === categoryId 
          ? { ...category, title: value } 
          : category
      )
    );
  };

  const handleSkillChange = (categoryId: string, index: number, value: string) => {
    setSkillCategories(prev => 
      prev.map(category => {
        if (category.id === categoryId) {
          const updatedSkills = [...category.skills];
          updatedSkills[index] = value;
          return { ...category, skills: updatedSkills };
        }
        return category;
      })
    );
  };

  const handleAddSkill = (categoryId: string) => {
    setSkillCategories(prev => 
      prev.map(category => {
        if (category.id === categoryId) {
          return { ...category, skills: [...category.skills, ''] };
        }
        return category;
      })
    );
  };

  const handleRemoveSkill = (categoryId: string, index: number) => {
    setSkillCategories(prev => 
      prev.map(category => {
        if (category.id === categoryId) {
          const updatedSkills = [...category.skills];
          updatedSkills.splice(index, 1);
          return { ...category, skills: updatedSkills };
        }
        return category;
      })
    );
  };

  const handleSave = () => {
    // In a real app, you would update translations or save to DB here
    toast({
      title: 'Skills updated',
      description: `Updated skills for ${languages[selectedLanguage]} language`,
    });
  };

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
              {skillCategories.map((category, categoryIndex) => (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <span>{category.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-4 space-y-4">
                      <div>
                        <Label htmlFor={`category-${category.id}`}>Category Title</Label>
                        <Input
                          id={`category-${category.id}`}
                          value={category.title}
                          onChange={(e) => handleCategoryTitleChange(category.id, e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Label>Skills</Label>
                        {category.skills.map((skill, skillIndex) => (
                          <div key={skillIndex} className="flex items-center gap-2">
                            <CheckCircle className="text-primary h-5 w-5 flex-shrink-0" />
                            <Input
                              value={skill}
                              onChange={(e) => handleSkillChange(category.id, skillIndex, e.target.value)}
                              placeholder="Skill name"
                            />
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRemoveSkill(category.id, skillIndex)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
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
            
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminSkills;
