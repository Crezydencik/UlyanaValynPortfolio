
import React, { useState } from "react";
import { RichTextEditor } from "./RichTextEditor";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ProjectFormMediaTabs } from "./ProjectFormMediaTabs";

interface ProjectFormContentProps {
  description: string;
  onDescriptionChange: (desc: string) => void;
  photos: string[];
  onPhotosChange: (urls: string[]) => void;
}

export const ProjectFormContent = ({
  description,
  onDescriptionChange,
  photos,
  onPhotosChange,
}: ProjectFormContentProps) => {
  const [mediaType, setMediaType] = useState("photo");

  return (
    <div className="space-y-4">
      <Label>projectContent</Label>
      <RichTextEditor value={description} onChange={onDescriptionChange} />

      <div className="flex gap-2 mt-2">
        <Button type="button" variant={mediaType === "photo" ? "secondary" : "outline"} onClick={() => setMediaType("photo")}>
          Photo
        </Button>
        <Button type="button" variant={mediaType === "video" ? "secondary" : "outline"} onClick={() => setMediaType("video")}>
          Video
        </Button>
      </div>
      <ProjectFormMediaTabs photos={photos} onPhotosChange={onPhotosChange} />
    </div>
  );
};
