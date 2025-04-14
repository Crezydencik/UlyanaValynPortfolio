
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useProjects } from '../hooks/useProjects';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { Skeleton } from './ui/skeleton';

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
    <section id="portfolio" className="section bg-gray-50">
      <h2 className="section-title">{t('portfolio.title')}</h2>
      <p className="section-subtitle">{t('portfolio.subtitle')}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>
                {project.short_description[language]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {project.image_url && (
                <img 
                  src={project.image_url} 
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to={`/project/${project.slug}`}>
                  {t('portfolio.viewProject')}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PortfolioSection;
