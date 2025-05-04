// components/ProjectList.tsx
import React, { useState, useEffect } from 'react';
import { Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Star, GripVertical } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProjectListProps {
  projects: Project[];
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
}

function SortableProjectItem({
  project,
  onEditProject,
  onDeleteProject,
  onTogglePriority,
  isPriority,
}: {
  project: Project;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onTogglePriority: (id: string) => void;
  isPriority: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: project.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const { language } = useLanguage();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div className="cursor-grab" {...attributes} {...listeners}>
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        {project.cover_image && (
          <img
            src={project.cover_image}
            alt={project.title}
            className="h-16 w-16 object-cover rounded"
          />
        )}
        <div>
          <h3 className="font-medium">{project.title}</h3>
          <p className="text-sm text-muted-foreground truncate max-w-sm">
            {project.short_description?.[language]}
          </p>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <Button
          variant="ghost"
          size="icon"
          className={isPriority ? 'text-yellow-500' : 'text-muted-foreground'}
          onClick={() => onTogglePriority(project.id)}
        >
          <Star className="h-4 w-4 fill-current" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onEditProject(project)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="icon" onClick={() => onDeleteProject(project.id)}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export const ProjectList = ({ projects, onEditProject, onDeleteProject }: ProjectListProps) => {
  const [items, setItems] = useState<Project[]>([]);
  const [priorityIds, setPriorityIds] = useState<string[]>([]);

  useEffect(() => {
    const sorted = [...projects]
      .sort((a, b) => {
        if (a.is_priority === b.is_priority) {
          return (a.order ?? 0) - (b.order ?? 0);
        }
        return a.is_priority ? -1 : 1;
      });

    setItems(sorted);
    setPriorityIds(sorted.filter(p => p.is_priority).map(p => p.id));
  }, [projects]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex(p => p.id === active.id);
      const newIndex = items.findIndex(p => p.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      await saveOrder(newItems);
    }
  };

  const togglePriority = (id: string) => {
    setPriorityIds(prev => {
      const isAlready = prev.includes(id);
      if (isAlready) return prev.filter(pid => pid !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  useEffect(() => {
    savePriorities(items, priorityIds);
  }, [priorityIds]);

  const saveOrder = async (projects: Project[]) => {
    const updates = projects.map((project, index) => ({
      id: project.id,
      order: index,
    }));

    const results = await Promise.all(
      updates.map(async (item) => {
        const { error } = await supabase
          .from('projects')
          .update({ order: item.order ?? 0 })
          .eq('id', item.id);
        return error;
      })
    );

    if (results.some(e => e)) {
      console.error('Ошибка при сохранении порядка:', results);
      toast.error('Ошибка при сохранении порядка');
    } else {
      toast.success('Порядок проектов обновлён');
    }
  };

  const savePriorities = async (projects: Project[], priorityIds: string[]) => {
    const results = await Promise.all(
      projects.map(async (project) => {
        const { error } = await supabase
          .from('projects')
          .update({ is_priority: priorityIds.includes(project.id) })
          .eq('id', project.id);
        return error;
      })
    );

    if (results.some(e => e)) {
      console.error('Ошибка при сохранении приоритетов:', results);
      toast.error('Ошибка при сохранении приоритетов');
    } else {
      toast.success('Приоритеты обновлены');
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No projects found. Add your first project to get started.
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(p => p.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {items.map(project => (
            <SortableProjectItem
              key={project.id}
              project={project}
              onEditProject={onEditProject}
              onDeleteProject={onDeleteProject}
              onTogglePriority={togglePriority}
              isPriority={priorityIds.includes(project.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
