
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSkills } from '@/hooks/useSkills';
import { Skeleton } from '@/components/ui/skeleton';
import { Award } from 'lucide-react';
import * as lucideIcons from 'lucide-react';

const SkillsSection = () => {
  const { language } = useLanguage();
  const { data: skills, isLoading, error } = useSkills();

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            <Skeleton className="h-8 w-1/2 mx-auto" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center p-4 border rounded-lg shadow-sm">
                <Skeleton className="w-16 h-16 rounded-full mb-2" />
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">Error loading skills.</div>;
  }

  const renderSkillItem = (skill: any) => {
    let IconComponent: React.ElementType = Award;
    
    if (skill.icon && typeof skill.icon === 'string' && skill.icon in lucideIcons) {
      IconComponent = lucideIcons[skill.icon as keyof typeof lucideIcons] as React.ElementType;
    }
    
    return (
      <div key={skill.id} className="flex flex-col items-center p-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
          <IconComponent className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">{skill.name?.[language] || skill.name?.en}</h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className="bg-primary h-2.5 rounded-full" style={{ width: `${skill.level}%` }}></div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills?.map(renderSkillItem)}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
