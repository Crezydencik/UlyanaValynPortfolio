
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <Card>
      <CardContent className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Загрузка контактной информации...</span>
      </CardContent>
    </Card>
  );
};
