import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Project } from '@/types/project';

interface ProjectData {
  id: string;
  title: string;
  description: string | null;
  short_description: string | null;
  image_url: string | null;
  cover_image?: string | null;
  additional_images?: string[];
  video_url: string | null;
  technologies: string[] | null;
  created_at: string;
  slug: string;
  is_priority?: boolean;
  order?: number;
}

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('is_priority', { ascending: false })
        .order('order', { ascending: true });

      if (error) throw error;

      const projects = data.map((project: ProjectData) => ({
        ...project,
        description: typeof project.description === 'string' 
          ? JSON.parse(project.description) 
          : project.description,
        short_description: typeof project.short_description === 'string' 
          ? JSON.parse(project.short_description) 
          : project.short_description,
        additional_images: project.additional_images || [],
        cover_image: project.cover_image || project.image_url,
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

      const project = {
        ...data,
        description: typeof data.description === 'string' 
          ? JSON.parse(data.description) 
          : data.description,
        short_description: typeof data.short_description === 'string' 
          ? JSON.parse(data.short_description) 
          : data.short_description,
        additional_images: data.additional_images || [],
        cover_image: data.cover_image || data.image_url,
      };

      return project as Project;
    },
    enabled: !!slug,
  });
};
