
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../hooks/useProjects';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { ArrowLeft, Image as ImageIcon, Video } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

const ProjectPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { data: project, isLoading, error } = useProject(slug || '');

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('portfolio.projectNotFound')}</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('portfolio.backToHome')}
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-[400px] w-full mb-6" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-2/3 mb-2" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen">
      <div 
        className="h-[400px] w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${project.image_url})` }}
      >
        <div className="absolute inset-0 bg-black/50">
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')} 
              className="text-white mb-4 w-fit"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to projects
            </Button>
            <h1 className="text-4xl font-bold text-white mb-4">{project.title}</h1>
            <div className="flex gap-4">
              <span className="inline-flex items-center text-white">
                <ImageIcon className="mr-2 h-4 w-4" /> Photo
              </span>
              {project.video_url && (
                <span className="inline-flex items-center text-white">
                  <Video className="mr-2 h-4 w-4" /> Video
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="prose max-w-none mb-12">
          <p className="text-lg leading-relaxed">
            {project.description[language]}
          </p>
        </div>

        {project.video_url && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Video className="mr-2 h-6 w-6" /> Video
            </h2>
            <div className="aspect-video">
              <iframe
                src={project.video_url}
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <ImageIcon className="mr-2 h-6 w-6" /> Photo
          </h2>
          {project.image_url && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <img 
                src={project.image_url}
                alt={project.title}
                className="w-full rounded-lg"
              />
              <img 
                src={project.image_url}
                alt={project.title}
                className="w-full rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
