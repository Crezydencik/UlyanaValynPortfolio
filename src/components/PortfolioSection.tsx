import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useProjects } from '../hooks/useProjects';
import { CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { Skeleton } from './ui/skeleton';
import { ExternalLink, Info } from 'lucide-react';

const PortfolioSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { data: projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <section id="portfolio" className="section bg-gray-50">
        <h2 className="section-title">{t('portfolio.title')}</h2>
        <p className="section-subtitle">{t('portfolio.subtitle')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="border rounded-lg shadow-sm bg-white p-6">
              <Skeleton className="h-48 w-full mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!projects?.length) {
    return (
      <section id="portfolio" className="section bg-gray-50 text-center py-20">
        <h2 className="section-title">{t('portfolio.title')}</h2>
        <p className="section-subtitle">{t('portfolio.subtitle')}</p>
        <p className="text-muted-foreground">{t('portfolio.noProjects')}</p>
      </section>
    );
  }

  const displayedProjects = (() => {
    const priority = projects.filter(p => p.is_priority);
    const rest = projects.filter(p => !p.is_priority);
    return [...priority, ...rest].slice(0, 4);
  })();

  return (
    <section id="portfolio" className="section-container bg-white">
      <div className="text-center mb-16">
        <h2 className="section-title">{t('portfolio.title')}</h2>
        <p className="section-subtitle">{t('portfolio.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedProjects.map((project) => (
          <div
            key={project.id}
            className="portfolio-card animate-on-scroll group border rounded-lg overflow-hidden shadow-sm bg-white"
          >
            <div className="relative overflow-hidden rounded-md mb-4">
              {(project.cover_image || project.image_url) && (
                <img
                  src={project.cover_image || project.image_url}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
              )}

              {project.technologies?.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-2 flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <Badge
                      key={index}
                      className="bg-white text-black text-xs rounded-md px-2 py-1"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Link
                  to={`/project/${project.slug}`}
                  className="bg-white text-black px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#f542c8] hover:text-white transition-colors"
                >
                  {t('portfolio.viewAll')} <ExternalLink size={16} />
                </Link>
              </div>
            </div>

            <div className="p-6">
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>
                {project.short_description?.[language] ||
                  project.short_description?.['en'] ||
                  ''}
              </CardDescription>

              <div className="flex justify-between items-center mt-4">
                <Link
                  to={`/project/${project.slug}`}
                  className="text-portfolio-black font-medium inline-flex items-center border-b border-transparent hover:border-portfolio-black"
                >
                  {t('portfolio.viewProject')} <Info size={14} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link
          to="/projects"
          className="portfolio-button"
        >
          {t('portfolio.moreProjects')}
        </Link>
      </div>
    </section>
  );
};

export default PortfolioSection;
