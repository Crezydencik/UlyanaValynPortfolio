import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Image, CheckCircle, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface ProjectFormPhotosProps {
  photos: string[];
  onPhotosChange: (urls: string[]) => void;
  mainPhoto: string | null;
  onMainPhotoChange: (url: string) => void;
}

export const ProjectFormPhotos = ({
  photos,
  onPhotosChange,
  mainPhoto,
  onMainPhotoChange,
}: ProjectFormPhotosProps) => {
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPhoto = () => {
    if (photoUrl.trim()) {
      const newPhotos = [...photos, photoUrl.trim()];
      onPhotosChange(newPhotos);
      setPhotoUrl("");
      if (photos.length === 0 && !mainPhoto) {
        onMainPhotoChange(photoUrl.trim());
      }
    }
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `projects/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(path, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      setUploading(false);
      return;
    }

    const { data: publicUrlData, error: publicUrlError } = supabase.storage
      .from("project-images")
      .getPublicUrl(path);

    if (publicUrlError || !publicUrlData?.publicUrl) {
      console.error("Public URL error:", publicUrlError);
      setUploading(false);
      return;
    }

    const url = publicUrlData.publicUrl;
    const newPhotos = [...photos, url];
    onPhotosChange(newPhotos);

    if (!mainPhoto) {
      onMainPhotoChange(url);
    }

    setUploading(false);
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...photos];
    const removedUrl = newPhotos[index];
    newPhotos.splice(index, 1);
    onPhotosChange(newPhotos);
    if (removedUrl === mainPhoto) {
      onMainPhotoChange(newPhotos.length > 0 ? newPhotos[0] : null);
    }
  };

  const handleSetMain = (url: string) => {
    onMainPhotoChange(url);
  };

  return (
    <div>
      <div className="flex gap-2 mt-4 mb-4 flex-wrap">
        <Input
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          placeholder="Enter photo URL"
          className="flex-grow"
        />
        <Button
          type="button"
          onClick={handleAddPhoto}
          variant="secondary"
          disabled={!photoUrl.trim()}
        >
          <Image className="h-4 w-4 mr-2" /> Add Photo
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="h-4 w-4 mr-2" /> Upload 
        </Button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleUploadPhoto}
        />
      </div>

      {photos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {photos.map((url, index) => (
            <div
              key={index}
              className={`
                relative group border rounded-lg overflow-hidden
                ${mainPhoto === url ? "ring-2 ring-primary ring-offset-2" : ""}
              `}
            >
              <img
                src={url}
                alt={`Project photo ${index + 1}`}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                  e.currentTarget.classList.add("bg-muted");
                }}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8 opacity-90"
                  onClick={() => handleRemovePhoto(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-2 left-2">
                {mainPhoto === url ? (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Main Photo
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs bg-white/80 hover:bg-primary/20"
                    onClick={() => handleSetMain(url)}
                  >
                    Set as Main
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border border-dashed rounded-lg bg-muted/50">
          <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">
            No photos added yet. Add your first photo.
          </p>
        </div>
      )}
    </div>
  );
};
