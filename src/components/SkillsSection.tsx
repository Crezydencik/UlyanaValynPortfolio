
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Language } from '@/utils/languageUtils';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Skill {
  id: string;
  name: Record<Language, string>;
  category: string;
  level: number;
  icon?: string;
}

interface GroupedSkill {
  category: string;
  title: Record<Language, string>;
  skills: Skill[];
}

const CATEGORY_TITLES: Record<string, Record<Language, string>> = {
  journalism: {
    en: 'Journalism',
    ru: 'Журналистика',
    pl: 'Dziennikarstwo'
  },
  'video-editing': {
    en: 'Video Editing',
    ru: 'Видеомонтаж',
    pl: 'Montaż Wideo'
  },
  marketing: {
    en: 'Marketing',
    ru: 'Маркетинг',
    pl: 'Marketing'
  }
};

const DEFAULT_ICON = Icons.CheckCircle;

const SkillsSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [groupedSkills, setGroupedSkills] = useState<GroupedSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('skills').select('*');

      if (error) {
        console.error('Ошибка при загрузке:', error);
        setLoading(false);
        return;
      }

      const skills: Skill[] = Array.isArray(data)
        ? data.map((s: any) => ({
            ...s,
            name: typeof s.name === 'string' ? JSON.parse(s.name) : s.name,
            icon: s.icon || ''
          }))
        : [];

      const groupsMap: Record<string, GroupedSkill> = {};

      skills.forEach((skill) => {
        const categoryId = skill.category;
        if (!groupsMap[categoryId]) {
          groupsMap[categoryId] = {
            category: categoryId,
            title: CATEGORY_TITLES[categoryId] || {
              en: categoryId,
              ru: categoryId,
              pl: categoryId
            },
            skills: []
          };
        }
        groupsMap[categoryId].skills.push(skill);
      });

      setGroupedSkills(Object.values(groupsMap));
      setLoading(false);
    };

    fetchSkills();
  }, []);

  return (
    <section id="skills" className="section-container bg-portfolio-gray">
      <div className="text-center mb-16">
        <h2 className="section-title">{t('skills.title')}</h2>
        <p className="section-subtitle">{t('skills.subtitle')}</p>
      </div>

      {loading ? (
        <p className="text-center">Загрузка...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {groupedSkills.map((group) => (
            <div key={group.category} className="card-skill">
              <h3 className="text-xl font-semibold mb-6">
                {group.title[language]}
              </h3>
              <ul className="space-y-2">
                {group.skills.map((skill) => {
                  // Fix the icon component usage
                  const Icon = skill.icon && Icons[skill.icon as keyof typeof Icons] 
                    ? Icons[skill.icon as keyof typeof Icons] 
                    : DEFAULT_ICON;

                  return (
                    <li key={skill.id} className="flex items-center gap-3">
                      <Icon className="text-primary w-5 h-5 MR-3" />
                      <span className="font-medium">{skill.name[language]}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SkillsSection;
