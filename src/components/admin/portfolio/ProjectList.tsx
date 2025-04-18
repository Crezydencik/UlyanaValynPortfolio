
import React from 'react';
import { Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProjectListProps {
  projects: Project[];
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectList = ({ projects, onEditProject, onDeleteProject }: ProjectListProps) => {
  const { language } = useLanguage();

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No projects found. Add your first project to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map(project => (
        <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-4">
            {project.cover_image && (
              <img 
                src={project.cover_image} 
                alt={project.title}
                className="h-16 w-16 object-cover rounded"
              />
            )}
            <div>
              <h3 className="font-medium">{project.title}</h3>
              <p className="text-sm text-muted-foreground truncate max-w-sm">
                {project.short_description[language]}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEditProject(project)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDeleteProject(project.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
