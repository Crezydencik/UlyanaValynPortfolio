
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useProjects } from '../hooks/useProjects';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
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
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full" />
                <div className="mt-4 space-x-2">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="h-6 w-16 inline-block" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (!projects?.length) {
    return (
      <section id="portfolio" className="section bg-gray-50">
        <h2 className="section-title">{t('portfolio.title')}</h2>
        <p className="section-subtitle">{t('portfolio.subtitle')}</p>
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('portfolio.noProjects')}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="section-container bg-white">
            <div className="text-center mb-16">
              <h2 className="section-title">{t('portfolio.title')}</h2>
              <p className="section-subtitle">{t('portfolio.subtitle')}</p>
            </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="portfolio-card animate-on-scroll group border rounded-lg overflow-hidden shadow-sm bg-white">
            <div className="relative">
              {project.image_url && (
                <img 
                  src={project.image_url} 
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                
              )}
             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link 
                    to={`/project/${project.id}`} 
                    className="bg-white text-black px-4 py-2 rounded-md flex items-center gap-2 hover:bg-portfolio-yellow transition-colors"
                  >
                    {t('viewAll')} <ExternalLink size={16} />
                  </Link>
                </div>
              </div>
              <div className="p-6">
                  <CardTitle>{project.title}</CardTitle>
                    <CardDescription>
                      {project.short_description[language]}
                    </CardDescription>
               <div className="flex justify-between items-center">
                  <Link 
                    to={`/project/${project.id}`} 
                    className="text-portfolio-black font-medium inline-flex items-center border-b border-transparent hover:border-portfolio-black"
                    >
                  {t('portfolio.viewProject')} <Info size={14} className="ml-1" />
                </Link>
              </div>
             </div>
            </div>
        ))}
      </div>
    </section>
  );
};

export default PortfolioSection;
