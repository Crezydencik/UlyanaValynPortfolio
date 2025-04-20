
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProjectFormVideoProps {
  videoUrl: string;
  onVideoUrlChange: (url: string) => void;
}

export const ProjectFormVideo = ({ videoUrl, onVideoUrlChange }: ProjectFormVideoProps) => {
  const [inputUrl, setInputUrl] = useState(videoUrl || "");

  const handleSave = () => {
    onVideoUrlChange(inputUrl.trim());
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Input
          type="text"
          value={inputUrl}
          placeholder="Youtube/Vimeo/Direct Video Link"
          onChange={(e) => setInputUrl(e.target.value)}
          className="w-full"
        />
        <Button type="button" onClick={handleSave} variant="secondary">
          Save Video
        </Button>
      </div>
      {videoUrl && (
        <div className="w-full max-w-md">
          <video src={videoUrl} controls className="w-full rounded shadow mt-3" />
        </div>
      )}
    </div>
  );
};
