
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Project } from '@/types/project';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*');

      if (error) throw error;
      
      // Transform the data to match the Project type
      const projects = data.map(project => ({
        ...project,
        description: typeof project.description === 'string' 
          ? JSON.parse(project.description) 
          : project.description,
        short_description: typeof project.short_description === 'string' 
          ? JSON.parse(project.short_description) 
          : project.short_description
      }));
      
      return projects as Project[];
    },
  });
};

export const useProject = (slug: string) => {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      
      // Transform the data to match the Project type
      const project = {
        ...data,
        description: typeof data.description === 'string' 
          ? JSON.parse(data.description) 
          : data.description,
        short_description: typeof data.short_description === 'string' 
          ? JSON.parse(data.short_description) 
          : data.short_description
      };
      
      return project as Project;
    },
    enabled: !!slug,
  });
};
