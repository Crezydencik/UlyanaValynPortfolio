
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from "lucide-react";

interface ProjectFormPhotosProps {
  photos: string[];
  onPhotosChange: (urls: string[]) => void;
}

export const ProjectFormPhotos = ({ photos, onPhotosChange }: ProjectFormPhotosProps) => {
  const [photoUrl, setPhotoUrl] = useState("");

  const handleAddPhoto = () => {
    if (photoUrl.trim()) {
      onPhotosChange([...photos, photoUrl.trim()]);
      setPhotoUrl("");
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    onPhotosChange(newPhotos);
  };

  return (
    <>
      <div className="flex gap-2 mt-4 mb-2">
        <Input 
          value={photoUrl}
          onChange={e => setPhotoUrl(e.target.value)}
          placeholder="Photo URL"
          className="w-full"
        />
        <Button type="button" onClick={handleAddPhoto} variant="secondary">
          <Plus className="h-4 w-4" /> addPhoto
        </Button>
      </div>
      <div className="flex gap-4 flex-wrap">
        {photos.map((url, i) => (
          <div key={i} className="relative">
            <img src={url} alt={`photo ${i}`} className="w-36 h-36 object-cover rounded shadow border" />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2"
              onClick={() => handleRemovePhoto(i)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};
