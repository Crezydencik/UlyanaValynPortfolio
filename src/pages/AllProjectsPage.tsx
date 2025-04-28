import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useProjects } from '../hooks/useProjects';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, Info } from 'lucide-react';
import Header from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import Footer from '../components/Footer';


const AllProjectsPage: React.FC = () => { const { t, language } = useLanguage();
const { data: projects, isLoading } = useProjects();

if (isLoading) {
  return (
    <section className="section bg-gray-50">
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
    <section  className="section bg-gray-50">
      <h2 className="section-title">{t('portfolio.allProjects')}</h2>
      <p className="section-subtitle">{t('portfolio.subtitle')}</p>
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t('portfolio.noProjects')}</p>
      </div>
    </section>
  );
}

return (
  <div className="min-h-screen flex flex-col">
      <Header />
  <section id="portfolio" className="section-container bg-white">
    <div className="text-center mb-16">
      <h2 className="section-title">{t('portfolio.allProjects')}</h2>
      <p className="section-subtitle">{t('portfolio.subtitle')}</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects?.map((project) => (
        <div key={project.id} className="portfolio-card animate-on-scroll group border rounded-lg overflow-hidden shadow-sm bg-white">
            <div className="relative overflow-hidden rounded-md mb-4">
              {(project.cover_image || project.image_url) && (
                <img
                  src={project.cover_image || project.image_url}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
              )}

              {/* Технологии поверх картинки */}
              {project.technologies && project.technologies.length > 0 && (
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

              {/* Затемнение и кнопка при наведении */}
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
              {project.short_description?.[language] || project.short_description?.['en'] || ''}
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
  </section>
  <Footer/>
  </div>
);
};

export default AllProjectsPage;
