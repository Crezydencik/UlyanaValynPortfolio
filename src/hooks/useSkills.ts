import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Language } from '@/utils/languageUtils';
import { Json } from '@/integrations/supabase/types';

export interface Skill {
  id: string;
  name: Record<Language, string>;
  category: string;
  level: number;
  icon?: string;
  created_at?: string;
}

export interface SkillCategory {
  id: string;
  title: Record<Language, string>;
  skills: Skill[];
}

export interface SkillCategoryRecord {
  id: string;
  title: Record<Language, string>;
}

const PREDEFINED_CATEGORIES: SkillCategory[] = [
  {
    id: 'journalism',
    title: {
      en: 'Journalism',
      ru: 'Журналистика',
      pl: 'Dziennikarstwo',
    },
    skills: [],
  },
  {
    id: 'video-editing',
    title: {
      en: 'Video Editing',
      ru: 'Видеомонтаж',
      pl: 'Montaż Wideo',
    },
    skills: [],
  },
  {
    id: 'marketing',
    title: {
      en: 'Marketing',
      ru: 'Маркетинг',
      pl: 'Marketing',
    },
    skills: [],
  },
];

export const useSkills = () => {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*');

      if (error) throw error;

      const skills = data.map(skill => ({
        ...skill,
        name: typeof skill.name === 'string' ? JSON.parse(skill.name) : skill.name,
      })) as Skill[];

      const skillsByCategory = PREDEFINED_CATEGORIES.reduce((acc, category) => {
        acc[category.id] = { ...category };
        return acc;
      }, {} as Record<string, SkillCategory>);

      skills.forEach(skill => {
        if (skillsByCategory[skill.category]) {
          skillsByCategory[skill.category].skills.push(skill);
        }
      });

      return Object.values(skillsByCategory);
    },
  });
};

export const useSaveSkill = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skill: Omit<Skill, 'id' | 'created_at'>) => {
      const { error } = await supabase
        .from('skills')
        .insert({
          name: skill.name as Json,
          category: skill.category,
          level: Number(skill.level),
          icon: skill.icon || null,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Skill saved',
        description: 'Skill has been successfully saved',
      });
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
    onError: (error) => {
      console.error('Error saving skill:', error);
      toast({
        title: 'Error',
        description: 'Failed to save skill',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateSkill = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skill: Skill) => {
      const { data, error } = await supabase
        .from('skills')
        .update({
          name: skill.name as Json,
          category: skill.category,
          level: Number(skill.level),
          icon: skill.icon || null,
        })
        .eq('id', skill.id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Skill updated',
        description: 'Skill has been successfully updated',
      });
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
    onError: (error) => {
      console.error('Error updating skill:', error);
      toast({
        title: 'Error',
        description: 'Failed to update skill',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteSkill = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Skill deleted',
        description: 'Skill has been successfully deleted',
      });
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
    onError: (error) => {
      console.error('Error deleting skill:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete skill',
        variant: 'destructive',
      });
    },
  });
};