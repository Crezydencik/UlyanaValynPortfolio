import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface TechnologyInputProps {
  technologies: string[];
  onTechnologyChange: (technologies: string[]) => void;
}

export const TechnologyInput = ({ technologies, onTechnologyChange }: TechnologyInputProps) => {
  const [newTechnology, setNewTechnology] = useState('');

  const handleAddTechnology = () => {
    const tech = newTechnology.trim();
    if (tech && !technologies.includes(tech)) {
      onTechnologyChange([...technologies, tech]);
      setNewTechnology('');
    }
  };

  const handleRemoveTechnology = (index: number) => {
    const newTechnologies = [...technologies];
    newTechnologies.splice(index, 1);
    onTechnologyChange(newTechnologies);
  };

  return (
    <div>
      <Label>Technologies</Label>
      <div className="flex flex-wrap gap-2 mt-2">
        {technologies?.map((tech, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {tech}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 ml-1"
              onClick={() => handleRemoveTechnology(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <Input
          value={newTechnology}
          onChange={(e) => setNewTechnology(e.target.value)}
          placeholder="Add a technology"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTechnology();
            }
          }}
        />
        <Button 
          type="button"
          onClick={handleAddTechnology}
        >
          Add
        </Button>
      </div>
    </div>
  );
};
