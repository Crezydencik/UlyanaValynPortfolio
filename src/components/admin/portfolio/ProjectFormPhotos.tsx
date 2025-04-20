
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Image } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    // Если удалили главное фото — сбрасываем mainPhoto
    if (photos[index] === mainPhoto) {
      onMainPhotoChange(newPhotos[0] || null);
    }
  };

  const handleSetMain = (url: string) => {
    onMainPhotoChange(url);
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
          <Image className="h-4 w-4" /> Добавить
        </Button>
      </div>
      {/* Галерея фото, сетка карточек */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {photos.map((url, i) => (
          <div
            key={i}
            className={`
              relative border rounded-lg overflow-hidden bg-white transition-all
              ${mainPhoto === url ? "ring-2 ring-primary ring-offset-2" : ""}
            `}
          >
            <img
              src={url}
              alt={`photo ${i}`}
              className="w-full h-52 object-cover"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="bg-red-50 text-red-600 hover:bg-red-100"
                onClick={() => handleRemovePhoto(i)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
            {/* Кнопка сделать главным */}
            <Button
              type="button"
              size="sm"
              variant={mainPhoto === url ? "secondary" : "outline"}
              className={`
                absolute left-1 top-1
                bg-white/80 hover:bg-primary/80 border border-primary/40
                px-2 py-1 text-xs font-semibold rounded
                ${mainPhoto === url ? "text-primary" : "text-gray-500"}
              `}
              onClick={() => handleSetMain(url)}
            >
              {mainPhoto === url ? "Главное" : "Сделать главным"}
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};
