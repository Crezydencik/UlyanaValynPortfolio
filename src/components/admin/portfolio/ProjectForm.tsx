
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Language, languages } from '@/utils/languageUtils';
import { Project } from '@/types/project';
import { RichTextEditor } from './RichTextEditor';
import { TechnologyInput } from './TechnologyInput';
import { ImageUpload } from './ImageUpload';

interface ProjectFormProps {
  currentProject: Partial<Project>;
  selectedLanguage: Language;
  setSelectedLanguage: (lang: Language) => void;
  onProjectChange: (project: Partial<Project>) => void;
}

export const ProjectForm = ({ 
  currentProject, 
  selectedLanguage, 
  setSelectedLanguage,
  onProjectChange 
}: ProjectFormProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      onProjectChange({
        ...currentProject,
        [parent]: {
          ...(currentProject[parent as keyof Project] as Record<string, any>),
          [child]: value
        }
      });
    } else {
      onProjectChange({ ...currentProject, [name]: value });
    }
  };

  const handleRichTextChange = (content: string) => {
    onProjectChange({
      ...currentProject,
      description: {
        ...(currentProject.description || {}),
        [selectedLanguage]: content
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={currentProject.title || ''}
            onChange={handleInputChange}
            placeholder="Project title"
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            value={currentProject.slug || ''}
            onChange={handleInputChange}
            placeholder="project-slug"
          />
        </div>
      </div>
      
      <Tabs value={selectedLanguage} onValueChange={(value: string) => setSelectedLanguage(value as Language)}>
        <TabsList className="mb-4">
          {Object.entries(languages).map(([code, name]) => (
            <TabsTrigger key={code} value={code}>{name}</TabsTrigger>
          ))}
        </TabsList>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor={`short_description.${selectedLanguage}`}>Short Description</Label>
            <Input
              id={`short_description.${selectedLanguage}`}
              name={`short_description.${selectedLanguage}`}
              value={currentProject.short_description?.[selectedLanguage] || ''}
              onChange={handleInputChange}
              placeholder="Brief description of the project"
            />
          </div>
          
          <div>
            <Label htmlFor={`description.${selectedLanguage}`}>Full Description</Label>
            <RichTextEditor
              value={currentProject.description?.[selectedLanguage] || ''}
              onChange={handleRichTextChange}
            />
          </div>
        </div>
      </Tabs>

      <ImageUpload
        mainImageUrl={currentProject.image_url || ''}
        additionalImages={currentProject.additional_images || []}
        coverImage={currentProject.cover_image || ''}
        onMainImageChange={(url) => onProjectChange({ ...currentProject, image_url: url })}
        onAdditionalImagesChange={(urls) => onProjectChange({ ...currentProject, additional_images: urls })}
        onCoverImageChange={(url) => onProjectChange({ ...currentProject, cover_image: url })}
      />

      <div>
        <Label htmlFor="video_url">Video URL</Label>
        <Input
          id="video_url"
          name="video_url"
          value={currentProject.video_url || ''}
          onChange={handleInputChange}
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>

      <TechnologyInput
        technologies={currentProject.technologies || []}
        onTechnologyChange={(technologies) => onProjectChange({ ...currentProject, technologies })}
      />
    </div>
  );
};
