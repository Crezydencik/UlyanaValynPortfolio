
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProjectFormBasicFieldsProps {
  currentProject: any;
  onProjectChange: (values: any) => void;
  selectedLanguage?: string;
}

export const ProjectFormBasicFields = ({ 
  currentProject, 
  onProjectChange, 
  selectedLanguage = 'en' 
}: ProjectFormBasicFieldsProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // For title field, update based on selected language
    if (name === "title" && selectedLanguage) {
      onProjectChange({ 
        ...currentProject, 
        title_translations: {
          ...currentProject.title_translations,
          [selectedLanguage]: value
        }
      });
    } else {
      onProjectChange({ ...currentProject, [name]: value });
    }
  };

  // Get the appropriate title based on selected language if available
  const getLocalizedTitle = () => {
    if (currentProject.title_translations && currentProject.title_translations[selectedLanguage]) {
      return currentProject.title_translations[selectedLanguage];
    }
    return currentProject.title || '';
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="id">Project ID</Label>
        <Input id="id" name="id" value={currentProject.id || ''} disabled />
      </div>
      <div>
        <Label htmlFor="author">Author</Label>
        <Input 
          id="author"
          name="author"
          value={currentProject.author || ''}
          onChange={handleChange}
          placeholder="Author"
        />
      </div>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title"
          name="title"
          value={getLocalizedTitle()}
          onChange={handleChange}
          placeholder={`Title (${selectedLanguage})`}
        />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input 
          id="date"
          name="date"
          type="date"
          value={currentProject.date || ''}
          onChange={handleChange}
          placeholder="Date"
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input 
          id="category"
          name="category"
          value={currentProject.category || ''}
          onChange={handleChange}
          placeholder="Category"
        />
      </div>
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          value={currentProject.slug || ''}
          onChange={handleChange}
          placeholder="project-slug"
        />
      </div>
    </div>
  );
};
