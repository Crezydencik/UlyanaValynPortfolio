
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Language, languages } from '@/utils/languageUtils';
import { Project } from '@/types/project';
import { X, Image as ImageIcon, Check, ExternalLink } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

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
  const [newTechnology, setNewTechnology] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

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

  const handleRichTextChange = (content: string, language: Language) => {
    onProjectChange({
      ...currentProject,
      description: {
        ...(currentProject.description || {}),
        [language]: content
      }
    });
  };

  const handleAddTechnology = () => {
    if (newTechnology.trim() && currentProject.technologies) {
      onProjectChange({
        ...currentProject,
        technologies: [...(currentProject.technologies || []), newTechnology.trim()]
      });
      setNewTechnology('');
    }
  };

  const handleRemoveTechnology = (index: number) => {
    if (currentProject.technologies) {
      const newTechnologies = [...currentProject.technologies];
      newTechnologies.splice(index, 1);
      onProjectChange({
        ...currentProject,
        technologies: newTechnologies
      });
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      onProjectChange({
        ...currentProject,
        additional_images: [...(currentProject.additional_images || []), newImageUrl.trim()]
      });
      setNewImageUrl('');
    }
  };

  const handleSetCoverImage = (imageUrl: string) => {
    onProjectChange({
      ...currentProject,
      cover_image: imageUrl
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
              onChange={(content) => handleRichTextChange(content, selectedLanguage)}
            />
          </div>
        </div>
      </Tabs>
      
      <div className="space-y-4">
        <div>
          <Label>Images</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
            {/* Main Image */}
            <div className="relative group border rounded-md p-2">
              {currentProject.image_url ? (
                <>
                  <img 
                    src={currentProject.image_url} 
                    alt="Main project image"
                    className="h-24 w-full object-cover rounded"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-white"
                      onClick={() => onProjectChange({ ...currentProject, image_url: '' })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Badge className="absolute top-2 right-2">Main</Badge>
                </>
              ) : (
                <div className="h-24 w-full flex items-center justify-center border-2 border-dashed rounded">
                  <Input
                    type="text"
                    placeholder="Main image URL"
                    className="w-full"
                    value={currentProject.image_url || ''}
                    onChange={(e) => onProjectChange({ ...currentProject, image_url: e.target.value })}
                  />
                </div>
              )}
            </div>

            {/* Additional Images */}
            {currentProject.additional_images?.map((imageUrl, index) => (
              <div key={index} className="relative group border rounded-md p-2">
                <img 
                  src={imageUrl} 
                  alt={`Project image ${index + 1}`}
                  className="h-24 w-full object-cover rounded"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-white"
                    onClick={() => {
                      const newImages = [...(currentProject.additional_images || [])];
                      newImages.splice(index, 1);
                      onProjectChange({
                        ...currentProject,
                        additional_images: newImages
                      });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-white"
                    onClick={() => handleSetCoverImage(imageUrl)}
                  >
                    {currentProject.cover_image === imageUrl ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <ImageIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {currentProject.cover_image === imageUrl && (
                  <Badge className="absolute top-2 right-2">Cover</Badge>
                )}
              </div>
            ))}

            {/* Add New Image Input */}
            <div className="h-24 w-full flex items-center justify-center border-2 border-dashed rounded p-2">
              <div className="w-full">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Add image URL"
                  className="mb-2"
                />
                <Button 
                  type="button"
                  onClick={handleAddImage}
                  className="w-full"
                  size="sm"
                >
                  Add Image
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Video URL Input */}
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

        {/* Technologies Section */}
        <div>
          <Label>Technologies</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {currentProject.technologies?.map((tech, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tech}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleRemoveTechnology(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <Input
              value={newTechnology}
              onChange={(e) => setNewTechnology(e.target.value)}
              placeholder="Add a technology"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTechnology();
                }
              }}
            />
            <Button 
              type="button"
              onClick={handleAddTechnology}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
