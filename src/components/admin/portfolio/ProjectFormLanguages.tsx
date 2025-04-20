
import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { languages } from "@/utils/languageUtils";

interface ProjectFormLanguagesProps {
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
}

export const ProjectFormLanguages = ({ selectedLanguage, setSelectedLanguage }: ProjectFormLanguagesProps) => (
  <div className="flex items-center gap-2 mb-2">
    <span className="text-muted-foreground">Language:</span>
    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(languages).map(([lang, display]) => (
          <SelectItem value={lang} key={lang}>{display}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
