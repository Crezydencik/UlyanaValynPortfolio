import React, { useState } from "react";
import { ProjectFormBasicFields } from "./ProjectFormBasicFields";
import { ProjectFormContent } from "./ProjectFormContent";
import { Language } from "@/utils/languageUtils";

interface ProjectFormProps {
  currentProject: any;
  selectedLanguage: Language;
  setSelectedLanguage: (lang: Language) => void;
  onProjectChange: (project: any) => void;
}

export const ProjectForm = ({
  currentProject,
  selectedLanguage,
  setSelectedLanguage,
  onProjectChange,
}: ProjectFormProps) => {
  const [localPhotos, setLocalPhotos] = useState<string[]>(currentProject.additional_images || []);
  const mainPhoto = currentProject.image_url || null;

  const handlePhotosChange = (urls: string[]) => {
    setLocalPhotos(urls);
    onProjectChange({ ...currentProject, additional_images: urls });
  };

  const handleMainPhotoChange = (url: string) => {
    onProjectChange({ ...currentProject, image_url: url });
  };

  const handleDescriptionChange = (value: string) => {
    onProjectChange({
      ...currentProject,
      description: {
        ...currentProject.description,
        [selectedLanguage]: value,
      },
    });
  };

  const handleShortDescriptionChange = (value: string) => {
    onProjectChange({
      ...currentProject,
      short_description: {
        ...currentProject.short_description,
        [selectedLanguage]: value,
      },
    });
  };

  const handleVideoUrlChange = (url: string) => {
    onProjectChange({
      ...currentProject,
      video_url: url,
    });
  };

  const handleTechnologiesChange = (newTechnologies: string[]) => {
    onProjectChange({
      ...currentProject,
      technologies: newTechnologies,
    });
  };

  return (
    <div className="space-y-6">
      <ProjectFormBasicFields 
        currentProject={currentProject} 
        onProjectChange={onProjectChange} 
        selectedLanguage={selectedLanguage}
      />
      <ProjectFormContent
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        description={currentProject.description?.[selectedLanguage] || ""}
        onDescriptionChange={handleDescriptionChange}
        shortDescription={currentProject.short_description?.[selectedLanguage] || ""}
        onShortDescriptionChange={handleShortDescriptionChange}
        photos={localPhotos}
        onPhotosChange={handlePhotosChange}
        mainPhoto={mainPhoto}
        onMainPhotoChange={handleMainPhotoChange}
        videoUrl={currentProject.video_url || ""}
        onVideoUrlChange={handleVideoUrlChange}
        technologies={currentProject.technologies || []}
        onTechnologiesChange={handleTechnologiesChange}
      />
    </div>
  );
};
