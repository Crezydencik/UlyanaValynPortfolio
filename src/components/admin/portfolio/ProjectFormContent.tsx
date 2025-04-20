
import React, { useState } from "react";
import { RichTextEditor } from "./RichTextEditor";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ProjectFormMediaTabs } from "./ProjectFormMediaTabs";
import { Textarea } from "@/components/ui/textarea";
import { ProjectFormVideo } from "./ProjectFormVideo";
import { ProjectFormLanguages } from "./ProjectFormLanguages";
import { ProjectFormPhotos } from "./ProjectFormPhotos";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProjectFormContentProps {
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  description: string;
  onDescriptionChange: (desc: string) => void;
  shortDescription: string;
  onShortDescriptionChange: (desc: string) => void;
  photos: string[];
  onPhotosChange: (urls: string[]) => void;
  mainPhoto: string | null;
  onMainPhotoChange: (url: string) => void;
  videoUrl: string;
  onVideoUrlChange: (url: string) => void;
}

export const ProjectFormContent = ({
  selectedLanguage,
  setSelectedLanguage,
  description,
  onDescriptionChange,
  shortDescription,
  onShortDescriptionChange,
  photos,
  onPhotosChange,
  mainPhoto,
  onMainPhotoChange,
  videoUrl,
  onVideoUrlChange
}: ProjectFormContentProps) => {
  const { t } = useLanguage();
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");

  return (
    <div className="space-y-4">
      <ProjectFormLanguages
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />

      <Label>Description</Label>
      <RichTextEditor value={description} onChange={onDescriptionChange} />

      <Label>Short Description</Label>
      <Textarea
        value={shortDescription}
        onChange={e => onShortDescriptionChange(e.target.value)}
        className="min-h-[80px]"
        placeholder={`Enter a short description (${selectedLanguage})`}
      />

      <div className="flex gap-2 mt-2">
        <Button 
          type="button" 
          variant={mediaType === "photo" ? "secondary" : "outline"} 
          onClick={() => setMediaType("photo")}
        >
          Photo
        </Button>
        <Button 
          type="button" 
          variant={mediaType === "video" ? "secondary" : "outline"} 
          onClick={() => setMediaType("video")}
        >
          Video
        </Button>
      </div>

      {/* Media type switch - show images or video UI */}
      {mediaType === "photo" ? (
        <ProjectFormPhotos
          photos={photos}
          onPhotosChange={onPhotosChange}
          mainPhoto={mainPhoto}
          onMainPhotoChange={onMainPhotoChange}
        />
      ) : (
        <ProjectFormVideo videoUrl={videoUrl} onVideoUrlChange={onVideoUrlChange} />
      )}
    </div>
  );
};
