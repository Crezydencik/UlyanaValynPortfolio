
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProjectForm } from './ProjectForm';
import { Language } from '@/utils/languageUtils';

interface ProjectCreateDialogProps {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  currentProject: any;
  selectedLanguage: Language;
  setSelectedLanguage: (lang: Language) => void;
  onProjectChange: (project: any) => void;
  onSave: () => void;
}

export const ProjectCreateDialog = ({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  currentProject,
  selectedLanguage,
  setSelectedLanguage,
  onProjectChange,
  onSave,
}: ProjectCreateDialogProps) => (
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
        onProjectChange={onProjectChange}
      />
      <DialogFooter>
        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
          Cancel
        </Button>
        <Button onClick={onSave}>
          Create Project
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
