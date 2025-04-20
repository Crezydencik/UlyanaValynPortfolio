
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProjectFormBasicFieldsProps {
  currentProject: any;
  onProjectChange: (values: any) => void;
}

export const ProjectFormBasicFields = ({ currentProject, onProjectChange }: ProjectFormBasicFieldsProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onProjectChange({ ...currentProject, [name]: value });
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
          value={currentProject.title || ''}
          onChange={handleChange}
          placeholder="Title"
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
