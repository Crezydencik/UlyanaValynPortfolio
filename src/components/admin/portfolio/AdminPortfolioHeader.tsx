
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AdminPortfolioHeaderProps {
  onCreate: () => void;
}

export const AdminPortfolioHeader = ({ onCreate }: AdminPortfolioHeaderProps) => (
  <CardHeader className="flex flex-row items-center justify-between">
    <div>
      <CardTitle>Manage Portfolio</CardTitle>
      <CardDescription>
        Add, edit, or remove projects from your portfolio.
      </CardDescription>
    </div>
    <Button onClick={onCreate}>
      <Plus className="mr-2 h-4 w-4" /> Add Project
    </Button>
  </CardHeader>
);
