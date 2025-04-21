
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Project } from "../../../types/project";

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

  // Get the appropriate title based on selected language if available
  const getLocalizedTitle = () => {
    if (currentProject.title_translations && currentProject.title_translations[selectedLanguage]) {
      return currentProject.title_translations[selectedLanguage];
    }
    return currentProject.title || '';
  };
  
  return (
    <div className="">
      <div>
        <Label htmlFor="id">Project ID</Label>
        <Input id="id" name="id" value={currentProject.id || ''} disabled />
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
