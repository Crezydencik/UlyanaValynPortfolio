
import React, { useState } from "react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { ProjectFormPhotos } from "./ProjectFormPhotos";
import { Badge } from "@/components/ui/badge";
import { ProjectFormVideo } from "./ProjectFormVideo";

interface ProjectFormMediaTabsProps {
  photos: string[];
  onPhotosChange: (urls: string[]) => void;
  mainPhoto: string | null;
  onMainPhotoChange: (url: string) => void;
  videoUrl: string;
  onVideoUrlChange: (url: string) => void;
}

export const ProjectFormMediaTabs = ({ 
  photos, 
  onPhotosChange,
  mainPhoto,
  onMainPhotoChange,
  videoUrl,
  onVideoUrlChange
}: ProjectFormMediaTabsProps) => {
  const [activeTab, setActiveTab] = useState("photos");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
      <TabsList>
        <TabsTrigger value="photos"><Badge className="mr-2">Photos</Badge></TabsTrigger>
        <TabsTrigger value="videos">Videos</TabsTrigger>
        <TabsTrigger value="related">Related Projects</TabsTrigger>
      </TabsList>
      <TabsContent value="photos">
        <ProjectFormPhotos 
          photos={photos} 
          onPhotosChange={onPhotosChange}
          mainPhoto={mainPhoto}
          onMainPhotoChange={onMainPhotoChange} 
        />
      </TabsContent>
      <TabsContent value="videos">
        <ProjectFormVideo videoUrl={videoUrl} onVideoUrlChange={onVideoUrlChange} />
      </TabsContent>
      <TabsContent value="related">
        <div className="p-4 text-center text-muted-foreground">Related projects (в разработке)</div>
      </TabsContent>
    </Tabs>
  );
};
