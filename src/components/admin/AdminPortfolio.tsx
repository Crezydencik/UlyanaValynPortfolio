import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Language } from '@/utils/languageUtils';
import { useProjects } from '@/hooks/useProjects';
import { supabase } from '@/integrations/supabase/client';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Project } from '@/types/project';
import { ProjectForm } from './portfolio/ProjectForm';
import { ProjectList } from './portfolio/ProjectList';

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
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Portfolio</CardTitle>
          <CardDescription>
            Add, edit, or remove projects from your portfolio.
          </CardDescription>
        </div>
        <Button onClick={handleCreateProject}>
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </CardHeader>
      <CardContent>
        <ProjectList 
          projects={projects || []}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
        />
      </CardContent>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Make changes to your project details.
            </DialogDescription>
          </DialogHeader>
          <ProjectForm
            currentProject={currentProject}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            onProjectChange={setCurrentProject}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProject}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Project Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project to your portfolio.
            </DialogDescription>
          </DialogHeader>
          <ProjectForm
            currentProject={currentProject}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            onProjectChange={setCurrentProject}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProject}>
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminPortfolio;
