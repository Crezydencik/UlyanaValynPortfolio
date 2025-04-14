
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { languages, Language } from '@/utils/languageUtils';
import { useProjects } from '@/hooks/useProjects';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash, Edit, Image, Video, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Project } from '@/types/project';

const AdminPortfolio = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { data: projects, isLoading, refetch } = useProjects();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTechnology, setNewTechnology] = useState('');
  
  const emptyProject: Partial<Project> = {
    title: '',
    slug: '',
    description: { en: '', pl: '', ru: '' },
    short_description: { en: '', pl: '', ru: '' },
    image_url: '',
    video_url: '',
    technologies: []
  };
  
  const [currentProject, setCurrentProject] = useState<Partial<Project>>(emptyProject);

  const handleEditProject = (project: Project) => {
    setCurrentProject(project);
    setIsEditDialogOpen(true);
  };

  const handleCreateProject = () => {
    setCurrentProject({...emptyProject});
    setIsCreateDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCurrentProject(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as Record<string, any>,
          [child]: value
        }
      }));
    } else {
      setCurrentProject(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddTechnology = () => {
    if (newTechnology.trim() && currentProject.technologies) {
      setCurrentProject(prev => ({
        ...prev,
        technologies: [...(prev.technologies || []), newTechnology.trim()]
      }));
      setNewTechnology('');
    }
  };

  const handleRemoveTechnology = (index: number) => {
    if (currentProject.technologies) {
      const newTechnologies = [...currentProject.technologies];
      newTechnologies.splice(index, 1);
      setCurrentProject(prev => ({
        ...prev,
        technologies: newTechnologies
      }));
    }
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
        description: JSON.stringify(currentProject.description),
        short_description: JSON.stringify(currentProject.short_description)
      };

      let response;
      if (currentProject.id) {
        // Update existing project
        response = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', currentProject.id);
      } else {
        // Create new project
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

  const ProjectForm = () => (
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
      
      <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage}>
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
        <div>
          <Label htmlFor="image_url">Image URL</Label>
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
                  <Image className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
        
        <div>
          <Label htmlFor="video_url">Video URL</Label>
          <div className="flex gap-2">
            <Input
              id="video_url"
              name="video_url"
              value={currentProject.video_url || ''}
              onChange={handleInputChange}
              placeholder="https://example.com/video.mp4"
            />
            {currentProject.video_url && (
              <Button variant="outline" size="icon" type="button" asChild>
                <a href={currentProject.video_url} target="_blank" rel="noopener noreferrer">
                  <Video className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
        
        <div>
          <Label>Technologies</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {currentProject.technologies?.map((tech, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tech}
                <Button
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
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
            />
            <Button type="button" onClick={handleAddTechnology}>
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

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
        <div className="space-y-4">
          {projects && projects.length > 0 ? (
            projects.map(project => (
              <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{project.title}</h3>
                  <p className="text-sm text-muted-foreground truncate max-w-sm">
                    {project.short_description[language]}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditProject(project)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No projects found. Add your first project to get started.
            </div>
          )}
        </div>
      </CardContent>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Make changes to your project details.
            </DialogDescription>
          </DialogHeader>
          <ProjectForm />
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project to your portfolio.
            </DialogDescription>
          </DialogHeader>
          <ProjectForm />
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
