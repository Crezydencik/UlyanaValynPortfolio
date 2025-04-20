
import React, { useState } from "react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { ProjectFormPhotos } from "./ProjectFormPhotos";
import { Badge } from "@/components/ui/badge";

interface ProjectFormMediaTabsProps {
  photos: string[];
  onPhotosChange: (urls: string[]) => void;
}

export const ProjectFormMediaTabs = ({ photos, onPhotosChange }: ProjectFormMediaTabsProps) => {
  const [activeTab, setActiveTab] = useState("photos");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
      <TabsList>
        <TabsTrigger value="photos"><Badge className="mr-2">Photos</Badge></TabsTrigger>
        <TabsTrigger value="videos">Videos</TabsTrigger>
        <TabsTrigger value="related">Related Projects</TabsTrigger>
      </TabsList>
      <TabsContent value="photos">
        <ProjectFormPhotos photos={photos} onPhotosChange={onPhotosChange} />
      </TabsContent>
      <TabsContent value="videos">
        <div className="p-4 text-center text-muted-foreground">Video section (в разработке)</div>
      </TabsContent>
      <TabsContent value="related">
        <div className="p-4 text-center text-muted-foreground">Related projects (в разработке)</div>
      </TabsContent>
    </Tabs>
  );
};
