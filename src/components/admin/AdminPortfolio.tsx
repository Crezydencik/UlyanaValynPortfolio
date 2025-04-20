
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Language } from '@/utils/languageUtils';
import { useProjects } from '@/hooks/useProjects';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';
import { ProjectList } from './portfolio/ProjectList';
import { AdminPortfolioHeader } from './portfolio/AdminPortfolioHeader';
import { ProjectEditDialog } from './portfolio/ProjectEditDialog';
import { ProjectCreateDialog } from './portfolio/ProjectCreateDialog';

const emptyProject: Partial<Project> = {
  title: '',
  slug: '',
  description: { en: '', pl: '', ru: '' },
  short_description: { en: '', pl: '', ru: '' },
  image_url: '',
  cover_image: '',
  additional_images: [],
  video_url: '',
  technologies: []
};

const AdminPortfolio = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { data: projects, isLoading, refetch } = useProjects();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>(emptyProject);

  const handleEditProject = (project: Project) => {
    setCurrentProject({
      ...project,
      additional_images: project.additional_images || []
    });
    setIsEditDialogOpen(true);
  };

  const handleCreateProject = () => {
    setCurrentProject({...emptyProject});
    setIsCreateDialogOpen(true);
  };

  const handleSaveProject = async () => {
    try {
      if (!currentProject.title || !currentProject.slug) {
        toast({
          title: 'Error',
          description: 'Title and slug are required',
          variant: 'destructive'
        });
        return;
      }

      const projectData = {
        ...currentProject,
        title: currentProject.title,
        slug: currentProject.slug,
        description: JSON.stringify(currentProject.description),
        short_description: JSON.stringify(currentProject.short_description),
        image_url: currentProject.image_url,
        cover_image: currentProject.cover_image || currentProject.image_url,
        additional_images: currentProject.additional_images || [],
        video_url: currentProject.video_url,
        technologies: currentProject.technologies
      };

      let response;
      if (currentProject.id) {
        response = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', currentProject.id);
      } else {
        response = await supabase
          .from('projects')
          .insert(projectData);
      }

      if (response.error) throw response.error;
      
      toast({
        title: currentProject.id ? 'Project updated' : 'Project created',
        description: `Successfully ${currentProject.id ? 'updated' : 'created'} ${currentProject.title}`
      });
      
      refetch();
      setIsEditDialogOpen(false);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: 'Error',
        description: 'Failed to save project',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Project deleted',
        description: 'Project has been successfully deleted'
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading projects...</div>;
  }

  return (
    <Card>
      <AdminPortfolioHeader onCreate={handleCreateProject} />
      <CardContent>
        <ProjectList 
          projects={projects || []}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
        />
      </CardContent>
      <ProjectEditDialog
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        currentProject={currentProject}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        onProjectChange={setCurrentProject}
        onSave={handleSaveProject}
      />
      <ProjectCreateDialog
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        currentProject={currentProject}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        onProjectChange={setCurrentProject}
        onSave={handleSaveProject}
      />
    </Card>
  );
};

export default AdminPortfolio;
