
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SaveButtonProps {
  saving: boolean;
  onSave: () => void;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ saving, onSave }) => {
  return (
    <Button 
      onClick={onSave} 
      disabled={saving}
      className="w-full"
    >
      {saving ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Сохранение...
        </>
      ) : (
        'Сохранить изменения'
      )}
    </Button>
  );
};
