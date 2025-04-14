
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
        description: JSON.parse(project.description),
        short_description: JSON.parse(project.short_description)
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
        description: JSON.parse(data.description),
        short_description: JSON.parse(data.short_description)
      };
      
      return project as Project;
    },
  });
};
