
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ContactFormProps } from './types';

export const ContactForm: React.FC<ContactFormProps> = ({
  contactInfo,
  onContactInfoChange,
  selectedLanguage,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`title.${selectedLanguage}`}>Section Title</Label>
        <Input
          id={`title.${selectedLanguage}`}
          name={`title.${selectedLanguage}`}
          value={contactInfo.title[selectedLanguage] || ''}
          onChange={onContactInfoChange}
          placeholder="Contact title"
        />
      </div>
      
      <div>
        <Label htmlFor={`subtitle.${selectedLanguage}`}>Section Subtitle</Label>
        <Input
          id={`subtitle.${selectedLanguage}`}
          name={`subtitle.${selectedLanguage}`}
          value={contactInfo.subtitle[selectedLanguage] || ''}
          onChange={onContactInfoChange}
          placeholder="Contact subtitle"
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={contactInfo.email}
          onChange={onContactInfoChange}
          placeholder="your@email.com"
        />
      </div>

      <div>
        <Label htmlFor={`location.${selectedLanguage}`}>Location</Label>
        <Input
          id={`location.${selectedLanguage}`}
          name={`location.${selectedLanguage}`}
          value={contactInfo.location[selectedLanguage] || ''}
          onChange={onContactInfoChange}
          placeholder="Your location"
        />
      </div>
    </div>
  );
};
