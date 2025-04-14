
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CheckCircle } from 'lucide-react';

const SkillsSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section id="skills" className="section">
      <h2 className="section-title">{t('skills.title')}</h2>
      <p className="section-subtitle">{t('skills.subtitle')}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card-skill">
          <h3 className="text-xl font-semibold mb-6">{t('skills.journalism.title')}</h3>
          <ul>
            <li className="skill-item">
              <CheckCircle className="text-primary h-5 w-5" />
              <span>{t('skills.journalism.newsWriting')}</span>
            </li>
            <li className="skill-item">
              <CheckCircle className="text-primary h-5 w-5" />
              <span>{t('skills.journalism.interviewing')}</span>
            </li>
            <li className="skill-item">
              <CheckCircle className="text-primary h-5 w-5" />
              <span>{t('skills.journalism.research')}</span>
            </li>
            <li className="skill-item">
              <CheckCircle className="text-primary h-5 w-5" />
              <span>{t('skills.journalism.storytelling')}</span>
            </li>
          </ul>
        </div>
        
        <div className="card-skill">
          <h3 className="text-xl font-semibold mb-6">{t('skills.videoEditing.title')}</h3>
          <ul>
            <li className="skill-item">
              <CheckCircle className="text-primary h-5 w-5" />
              <span>{t('skills.videoEditing.videoProduction')}</span>
            </li>
            <li className="skill-item">
              <CheckCircle className="text-primary h-5 w-5" />
              <span>{t('skills.videoEditing.capCut')}</span>
            </li>
            <li className="skill-item">
              <CheckCircle className="text-primary h-5 w-5" />
              <span>{t('skills.videoEditing.colorGrading')}</span>
            </li>
            <li className="skill-item">
              <CheckCircle className="text-primary h-5 w-5" />
              <span>{t('skills.videoEditing.cinematography')}</span>
            </li>
          </ul>
        </div>
        
        <div className="card-skill">
          <h3 className="text-xl font-semibold mb-6">{t('skills.marketing.title')}</h3>
          <ul>
            <li className="skill-item">
              <CheckCircle className="text-primary h-5 w-5" />
              <span>{t('skills.marketing.contentMarketing')}</span>
            </li>
            <li className="skill-item">
              <CheckCircle className="text-primary h-5 w-5" />
              <span>{t('skills.marketing.socialMedia')}</span>
            </li>
            <li className="skill-item">
              <CheckCircle className="text-primary h-5 w-5" />
              <span>{t('skills.marketing.seo')}</span>
            </li>
            <li className="skill-item">
              <CheckCircle className="text-primary h-5 w-5" />
              <span>{t('skills.marketing.analytics')}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
