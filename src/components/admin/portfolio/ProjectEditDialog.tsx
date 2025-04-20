
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProjectForm } from './ProjectForm';
import { Language } from '@/utils/languageUtils';

interface ProjectEditDialogProps {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  currentProject: any;
  selectedLanguage: Language;
  setSelectedLanguage: (lang: Language) => void;
  onProjectChange: (project: any) => void;
  onSave: () => void;
}

export const ProjectEditDialog = ({
  isEditDialogOpen,
  setIsEditDialogOpen,
  currentProject,
  selectedLanguage,
  setSelectedLanguage,
  onProjectChange,
  onSave,
}: ProjectEditDialogProps) => (
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
        onProjectChange={onProjectChange}
      />
      <DialogFooter>
        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
          Cancel
        </Button>
        <Button onClick={onSave}>
          Save Changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
