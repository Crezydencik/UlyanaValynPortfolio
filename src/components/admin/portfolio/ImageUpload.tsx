import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Image as ImageIcon, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploadProps {
  mainImageUrl: string;
  additionalImages: string[];
  coverImage: string;
  onMainImageChange: (url: string) => void;
  onAdditionalImagesChange: (urls: string[]) => void;
  onCoverImageChange: (url: string) => void;
}

export const ImageUpload = ({
  mainImageUrl,
  additionalImages,
  coverImage,
  onMainImageChange,
  onAdditionalImagesChange,
  onCoverImageChange,
}: ImageUploadProps) => {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingImageUrl, setUploadingImageUrl] = useState<string | null>(null);

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const previewUrl = URL.createObjectURL(file);
    setUploadingImageUrl(previewUrl);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `project-images/${fileName}`;

    const { error } = await supabase.storage.from('project-images').upload(filePath, file);
    if (error) {
      console.error('Upload error:', error.message);
    } else {
      const { data: publicUrl } = supabase.storage.from('project-images').getPublicUrl(filePath);
      if (publicUrl?.publicUrl) {
        onAdditionalImagesChange([...additionalImages, publicUrl.publicUrl]);
      }
    }

    setUploading(false);
    setUploadingImageUrl(null);
  };

  const handleRemoveAdditionalImage = (index: number) => {
    const newImages = [...additionalImages];
    newImages.splice(index, 1);
    onAdditionalImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <Label>Images</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
        {/* Main Image */}
        <div className="relative group border rounded-md p-2">
          {mainImageUrl ? (
            <>
              <img
                src={mainImageUrl}
                alt="Main project image"
                className="h-24 w-full object-cover rounded"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-white"
                  onClick={() => onMainImageChange('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Badge className="absolute top-2 right-2">Main</Badge>
            </>
          ) : (
            <div className="h-24 w-full flex items-center justify-center border-2 border-dashed rounded">
              <Input
                type="text"
                placeholder="Main image URL"
                className="w-full"
                value={mainImageUrl}
                onChange={(e) => onMainImageChange(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Uploading Placeholder */}
        {uploadingImageUrl && (
          <div className="relative group border rounded-md p-2 animate-pulse bg-muted">
            <img
              src={uploadingImageUrl}
              alt="Uploading..."
              className="h-24 w-full object-cover rounded opacity-50"
            />
            <Badge className="absolute top-2 right-2">Uploading...</Badge>
          </div>
        )}

        {/* Additional Images */}
        {additionalImages?.map((imageUrl, index) => (
          <div key={index} className="relative group border rounded-md p-2">
            <img
              src={imageUrl}
              alt={`Project image ${index + 1}`}
              className="h-24 w-full object-cover rounded"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-white"
                onClick={() => handleRemoveAdditionalImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-white"
                onClick={() => onCoverImageChange(imageUrl)}
              >
                {coverImage === imageUrl ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <ImageIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
            {coverImage === imageUrl && (
              <Badge className="absolute top-2 right-2">Cover</Badge>
            )}
          </div>
        ))}

        {/* File Upload */}
        <div className="h-24 w-full flex items-center justify-center border-2 border-dashed rounded p-2">
          <div className="w-full">
            <Input
              type="file"
              onChange={handleAddImage}
              accept="image/*"
              className="mb-2"
            />
            <Button
              type="button"
              disabled={uploading}
              className="w-full"
              size="sm"
            >
              Upload Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
