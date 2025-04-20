
import React, { useState } from "react";
import { ProjectFormBasicFields } from "./ProjectFormBasicFields";
import { ProjectFormContent } from "./ProjectFormContent";

interface ProjectFormProps {
  currentProject: any;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  onProjectChange: (project: any) => void;
}

export const ProjectForm = ({
  currentProject,
  selectedLanguage,
  setSelectedLanguage,
  onProjectChange,
}: ProjectFormProps) => {
  // Фото на вкладке media (Можно расширить на видео, связанные проекты)
  const [localPhotos, setLocalPhotos] = useState<string[]>(currentProject.additional_images || []);

  // Пробросим изменения фото вверх
  const handlePhotosChange = (urls: string[]) => {
    setLocalPhotos(urls);
    onProjectChange({ ...currentProject, additional_images: urls });
  };

  return (
    <div className="space-y-6">
      <ProjectFormBasicFields currentProject={currentProject} onProjectChange={onProjectChange} />
      <ProjectFormContent
        description={currentProject.description?.[selectedLanguage] || ""}
        onDescriptionChange={(desc) =>
          onProjectChange({
            ...currentProject,
            description: {
              ...currentProject.description,
              [selectedLanguage]: desc,
            },
          })
        }
        photos={localPhotos}
        onPhotosChange={handlePhotosChange}
      />
    </div>
  );
};
