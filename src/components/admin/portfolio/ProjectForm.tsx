
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Language, languages } from '@/utils/languageUtils';
import { Project } from '@/types/project';
import { X, Image as ImageIcon, Check, ExternalLink } from 'lucide-react';

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

  const handleRemoveImage = (index: number) => {
    if (currentProject.additional_images) {
      const newImages = [...currentProject.additional_images];
      newImages.splice(index, 1);
      onProjectChange({
        ...currentProject,
        additional_images: newImages
      });
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
              value={(currentProject.short_description?.[selectedLanguage]) || ''}
              onChange={handleInputChange}
              placeholder="Brief description of the project"
            />
          </div>
          
          <div>
            <Label htmlFor={`description.${selectedLanguage}`}>Full Description</Label>
            <Textarea
              id={`description.${selectedLanguage}`}
              name={`description.${selectedLanguage}`}
              value={(currentProject.description?.[selectedLanguage]) || ''}
              onChange={handleInputChange}
              rows={5}
              placeholder="Detailed description of the project"
            />
          </div>
        </div>
      </Tabs>
      
      <div className="space-y-4">
        <MediaSection 
          currentProject={currentProject}
          newImageUrl={newImageUrl}
          setNewImageUrl={setNewImageUrl}
          onAddImage={handleAddImage}
          onRemoveImage={handleRemoveImage}
          onSetCoverImage={handleSetCoverImage}
          handleInputChange={handleInputChange}
        />

        <TechnologiesSection 
          technologies={currentProject.technologies || []}
          newTechnology={newTechnology}
          setNewTechnology={setNewTechnology}
          onAddTechnology={handleAddTechnology}
          onRemoveTechnology={handleRemoveTechnology}
        />
      </div>
    </div>
  );
};

interface MediaSectionProps {
  currentProject: Partial<Project>;
  newImageUrl: string;
  setNewImageUrl: (url: string) => void;
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
  onSetCoverImage: (url: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MediaSection = ({
  currentProject,
  newImageUrl,
  setNewImageUrl,
  onAddImage,
  onRemoveImage,
  onSetCoverImage,
  handleInputChange
}: MediaSectionProps) => (
  <>
    <div>
      <Label htmlFor="image_url">Main Image URL</Label>
      <div className="flex gap-2">
        <Input
          id="image_url"
          name="image_url"
          value={currentProject.image_url || ''}
          onChange={handleInputChange}
          placeholder="https://example.com/image.jpg"
        />
        {currentProject.image_url && (
          <Button variant="outline" size="icon" type="button" asChild>
            <a href={currentProject.image_url} target="_blank" rel="noopener noreferrer">
              <ImageIcon className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    </div>

    <div>
      <Label>Additional Images</Label>
      <div className="flex flex-wrap gap-2 mt-2">
        {currentProject.additional_images?.map((imageUrl, index) => (
          <div key={index} className="relative group border rounded-md p-2">
            <img 
              src={imageUrl} 
              alt={`Project image ${index + 1}`}
              className="h-24 w-24 object-cover rounded"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded">
              <Button
                variant="ghost"
                size="icon"
                className="text-white"
                onClick={() => onSetCoverImage(imageUrl)}
                title="Set as cover image"
              >
                {currentProject.cover_image === imageUrl ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <ImageIcon className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white"
                onClick={() => onRemoveImage(index)}
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white"
                onClick={() => window.open(imageUrl, '_blank')}
                title="View image"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            {currentProject.cover_image === imageUrl && (
              <Badge className="absolute top-2 right-2">Cover</Badge>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <Input
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="Add image URL"
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAddImage())}
        />
        <Button type="button" onClick={onAddImage}>
          Add
        </Button>
      </div>
    </div>
  </>
);

interface TechnologiesSectionProps {
  technologies: string[];
  newTechnology: string;
  setNewTechnology: (tech: string) => void;
  onAddTechnology: () => void;
  onRemoveTechnology: (index: number) => void;
}

const TechnologiesSection = ({
  technologies,
  newTechnology,
  setNewTechnology,
  onAddTechnology,
  onRemoveTechnology
}: TechnologiesSectionProps) => (
  <div>
    <Label>Technologies</Label>
    <div className="flex flex-wrap gap-2 mt-2">
      {technologies.map((tech, index) => (
        <Badge key={index} variant="secondary" className="flex items-center gap-1">
          {tech}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 ml-1"
            onClick={() => onRemoveTechnology(index)}
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
        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAddTechnology())}
      />
      <Button type="button" onClick={onAddTechnology}>
        Add
      </Button>
    </div>
  </div>
);
