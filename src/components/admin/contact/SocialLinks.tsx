
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X, Facebook, Instagram, Twitter, Mail, Link } from 'lucide-react';
import { SocialLinksProps, SocialLink } from './types';

export const SocialLinks: React.FC<SocialLinksProps> = ({
  socialLinks,
  onSocialLinkChange,
  onAddSocialLink,
  onRemoveSocialLink,
}) => {
  const getSocialIcon = (icon: string) => {
    switch (icon.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'mail':
        return <Mail className="h-5 w-5" />;
      default:
        return <Link className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Social Media Links</Label>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddSocialLink}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Link
        </Button>
      </div>
      
      {socialLinks.map(link => (
        <div key={link.id} className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {getSocialIcon(link.icon)}
          </div>
          <div className="grid grid-cols-3 gap-3 flex-grow">
            <Input
              value={link.name}
              onChange={(e) => onSocialLinkChange(link.id, 'name', e.target.value)}
              placeholder="Name (Instagram, Facebook, etc.)"
            />
            <Input
              value={link.icon}
              onChange={(e) => onSocialLinkChange(link.id, 'icon', e.target.value)}
              placeholder="Icon (instagram, facebook, etc.)"
            />
            <Input
              value={link.url}
              onChange={(e) => onSocialLinkChange(link.id, 'url', e.target.value)}
              placeholder="URL (https://...)"
            />
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onRemoveSocialLink(link.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
