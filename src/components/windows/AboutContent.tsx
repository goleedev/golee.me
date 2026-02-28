import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ContentSection } from '../shared/ContentSection';
import { ExternalLink } from '../shared/ExternalLink';
import { SkillBadge } from '../shared/SkillBadge';
import { StatCard } from '../shared/StatCard';

interface ExperienceItemProps {
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
}

const ExperienceItem = ({
  role,
  company,
  location,
  period,
  description,
}: ExperienceItemProps) => {
  return (
    <div className="border-l-2 border-gray-400 pl-4">
      <div className="flex items-center justify-between sm:justify-normal space-x-2 mb-1">
        <span className="font-medium text-gray-900 text-sm sm:text-base">
          {role}
        </span>
        <span className="text-xs sm:text-sm text-gray-500">• {company}</span>
      </div>
      <p className="text-xs sm:text-sm text-gray-600 mb-2">
        {location} • {period}
      </p>
      <p className="text-xs sm:text-sm text-gray-700 font-light">
        {description}
      </p>
    </div>
  );
};

export const AboutContent = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = '/bagel.png';

    const timeout = setTimeout(() => setImageLoaded(true), 3000);
    return () => clearTimeout(timeout);
  }, []);

  const skills = {
    frontend: [
      'TypeScript',
      'React',
      'Next.js',
      'TailwindCSS',
      'Jest',
      'Cypress',
    ],
    backend: ['Node.js', 'Deno', 'Supabase', 'PostgreSQL'],
    tools: ['Cloudflare Workers', 'AWS', 'Git', 'Figma', 'Storybook', 'Jira'],
  };

  const achievements = [
    { metric: '4+', label: 'Years Experience' },
    { metric: '11.5K+', label: 'Community Members' },
    { metric: 'First Class', label: 'Honours Degree' },
  ];

  const experiences = [
    {
      role: 'Systems Engineer',
      company: 'Cloudflare',
      location: 'London',
      period: 'December 2024 - Present',
      description:
        'Building secure dashboard experiences and improving user workflows for Zero Trust products.',
    },
    {
      role: 'Frontend Engineer',
      company: 'Uncutgems',
      location: 'Seoul',
      period: 'June 2023 - September 2024',
      description:
        'Built comprehensive e-commerce platform with personalized recommendations and A/B testing, driving £100k+ monthly transactions.',
    },
    {
      role: 'Frontend Developer',
      company: 'Hyper Cloud',
      location: 'Seoul',
      period: 'February 2022 - June 2023',
      description:
        'Developed scalable web applications with React and Next.js, improving performance and user experience across multiple projects.',
    },
    {
      role: 'Frontend Engineer',
      company: 'MediBloc',
      location: 'Seoul',
      period: 'February 2021 - May 2021 • Internship',
      description:
        'Built 15+ healthcare interface components for Cloud EMR Dr. Palette using React, TypeScript, and GraphQL.',
    },
    {
      role: 'Co-founder',
      company: 'DefyDefault',
      location: 'Global',
      period: 'July 2019 - Present',
      description:
        'Co-founded and scaled Women in Tech community to 11,500+ members with partnerships across Cloudflare, Apple, and Samsung.',
    },
  ];

  return (
    <div className="px-4 sm:px-6 pt-4 sm:pt-6 h-full overflow-auto bg-white/95 backdrop-blur-xl">
      <div className="w-full mx-auto min-w-0">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <img
            src="/memoji.png"
            alt="Go Lee Memoji"
            className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4"
            loading="lazy"
            style={{ filter: imageLoaded ? 'none' : 'blur(5px)' }}
          />
          <h1 className="text-xl sm:text-2xl font-light mb-2 text-gray-900">
            Go Lee
          </h1>
          <p className="text-sm sm:text-base text-gray-600 font-light mb-4 px-4">
            Frontend Engineer & Community Builder
          </p>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <MapPin size={12} />
              <span>London, UK</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail size={12} />
              <span>hey@golee.me</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {achievements.map((achievement, index) => (
            <StatCard
              key={index}
              metric={achievement.metric}
              label={achievement.label}
            />
          ))}
        </div>

        {/* About */}
        <ContentSection className="mb-6">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-light mb-4 break-words">
            Driven frontend engineer with 4+ years of experience building
            impactful web applications. Currently working at Cloudflare,
            focusing on user experience improvements and secure dashboard
            solutions.
          </p>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-light break-words">
            Co-founder of DefyDefault, a pioneering Women in Tech community that
            has grown to 11,500+ members globally, with partnerships across
            major tech companies.
          </p>
        </ContentSection>

        <ContentSection title="Experience" className="mb-6">
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <ExperienceItem
                key={index}
                role={exp.role}
                company={exp.company}
                location={exp.location}
                period={exp.period}
                description={exp.description}
              />
            ))}
          </div>
        </ContentSection>

        {/* Skills */}
        <ContentSection title="Technical Skills" className="mb-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Frontend
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills.frontend.map((skill) => (
                  <SkillBadge key={skill} skill={skill} />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Backend & Database
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills.backend.map((skill) => (
                  <SkillBadge key={skill} skill={skill} />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Tools & Infrastructure
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills.tools.map((skill) => (
                  <SkillBadge key={skill} skill={skill} />
                ))}
              </div>
            </div>
          </div>
        </ContentSection>

        {/* Education */}
        <ContentSection title="Education" className="mb-6">
          <div>
            <p className="font-medium text-gray-900 text-sm sm:text-base">
              Bachelor of Science in Computer Science
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              University of London • 2025 • First Class Honours
            </p>
          </div>
        </ContentSection>

        {/* Links */}
        <div className="bg-gray-50/50 rounded-2xl p-4 sm:p-6 mb-6">
          <h3 className="font-medium text-gray-900 mb-4">Connect</h3>
          <div className="grid grid-cols-1 gap-3">
            <ExternalLink
              href="https://github.com/goleedev"
              icon={<Github size={16} className="text-gray-600" />}
              label="GitHub"
            />
            <ExternalLink
              href="https://linkedin.com/in/goleedev"
              icon={<Linkedin size={16} className="text-gray-600" />}
              label="LinkedIn"
            />
            <ExternalLink
              href="mailto:hey@golee.me"
              icon={<Mail size={16} className="text-gray-600" />}
              label="Email"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
