
import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { languages } from "@/utils/languageUtils";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProjectFormLanguagesProps {
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
}

export const ProjectFormLanguages = ({ selectedLanguage, setSelectedLanguage }: ProjectFormLanguagesProps) => (
  <div className="flex items-center gap-2 mb-2">
    <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage}>
    <TabsList className="mb-4">
          {Object.entries(languages).map(([code, name]) => (
            <TabsTrigger key={code} value={code}>{name}</TabsTrigger>
          ))}
        </TabsList>
    </Tabs>
  </div>
);
