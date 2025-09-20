import { ExternalLink } from 'lucide-react';

export const WorkContent = () => {
  const experiences = [
    {
      id: 'cloudflare',
      company: 'Cloudflare',
      role: 'Systems Engineer (Frontend)',
      team: 'Zero Trust Team',
      location: 'London, UK',
      period: 'December 2024 - Present',
      type: 'Full-time',
      description:
        'Building secure dashboard experiences and improving user workflows for Zero Trust products serving millions of users globally.',
      achievements: [
        'Redesigned Zero Trust dashboard onboarding flows, achieving 2-4x improvement in completion rates across key user journeys',
        'Extended Cloudflare CASB from visibility-only detection to actionable security controls for SaaS misconfigurations',
        'Overhauled some core UI components reducing duplicate implementations and improving accessibility compliance (WCAG 2.2)',
        'Migrated MCP Agent Gateway into Zero Trust dashboard, unifying security controls and Access policies as part of Cloudflare AI Week launch',
      ],
      technologies: ['React', 'TypeScript', 'Jest', 'Cypress', 'Tailwind CSS'],
    },
    {
      id: 'uncutgems',
      company: 'Uncutgems Company',
      role: 'Frontend Engineer',
      team: 'E-commerce Platform (Fabrill)',
      location: 'Seoul, South Korea',
      period: 'June 2023 - September 2024',
      type: 'Full-time',
      description:
        'Led frontend development for a luxury jewelry e-commerce platform, focusing on user experience and performance optimization.',
      achievements: [
        'Launched comprehensive e-commerce platform for web and mobile in just 3 months as part of 2-person development team, driving over £100,000 in monthly transactions',
        'Enhanced user retention by 30% and transactions by 15% by implementing personalized product recommendations using OpenAI embeddings',
        'Increased customer satisfaction by 15% through systematic A/B testing with GrowthBook to optimize user experience and engagement',
        'Boosted time interactivity and reduced infrastructure costs to under $100/month by integrating Supabase RESTful APIs with PostgreSQL',
        'Designed and implemented CI/CD pipeline using GitHub Actions, reducing deployment time by 40% and increasing release frequency to daily',
      ],
      technologies: [
        'React',
        'Next.js',
        'TypeScript',
        'Tailwind CSS',
        'Supabase',
      ],
    },
    {
      id: 'hypercloud',
      company: 'Hyper Cloud',
      role: 'Frontend Developer',
      team: 'AR Content Creation SaaS',
      location: 'Seoul, South Korea',
      period: 'February 2022 - June 2023',
      type: 'Full-time',
      description:
        'Developed scalable web applications for AR content creation platform, focusing on cross-device compatibility and performance.',
      achievements: [
        'Built and maintained scalable web applications with Next.js and React.js, delivering 5 major projects including in-house CMS platforms',
        'Improved cross-device compatibility by implementing responsive design, reducing page load time by 40% and increasing mobile user satisfaction by 25%',
        'Implemented unit and integration testing with Jest, achieving 90% coverage and reducing bug reports by 40%',
      ],
      technologies: [
        'React',
        'Next.js',
        'TypeScript',
        'Node.js',
        'styled-components',
      ],
    },
    {
      id: 'medibloc',
      company: 'MediBloc',
      role: 'Frontend Engineer',
      team: 'Cloud EMR Dr. Palette',
      location: 'Seoul, South Korea',
      period: 'February 2021 - May 2021',
      type: 'Internship',
      description:
        'Contributed to Cloud EMR Dr. Palette project, developing healthcare interface components and optimizing data management systems.',
      achievements: [
        'Developed over 15 front-end components using React and TypeScript, resulting in 30% improvement in user interface responsiveness and usability',
        'Leveraged GraphQL and Apollo Client to optimize data fetching and state management, reducing API call latency by 25%',
        'Implemented and maintained Storybook, creating a library of 20+ reusable UI components and improving development efficiency by 40%',
      ],
      technologies: [
        'React',
        'TypeScript',
        'GraphQL',
        'Apollo Client',
        'styled-components',
      ],
    },
  ];

  return (
    <div className="px-8 py-8 h-full overflow-auto bg-white/95 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-light mb-2 text-gray-900">
            Work Experience
          </h2>
          <p className="text-gray-600 font-light">
            Building impactful web applications and user experiences
          </p>
        </div>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="relative">
              {/* Timeline dot */}
              <div className="absolute left-0 top-0 w-2 h-2 bg-gray-400 rounded-full mt-1.5"></div>

              {/* Timeline line */}
              {index < experiences.length - 1 && (
                <div className="absolute left-0.5 top-4 w-0.5 h-full bg-gray-200"></div>
              )}

              {/* Content */}
              <div className="ml-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-medium text-gray-900">
                      {exp.role}
                    </h3>
                    <div className="flex items-center space-x-2 text-gray-600 mt-0.5">
                      <span className="font-medium">{exp.company}</span>
                      <span>•</span>
                      <span className="text-sm">{exp.team}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-0.5">
                      <span>{exp.location}</span>
                      <span>•</span>
                      <span>{exp.period}</span>
                      <span>•</span>
                      <span>{exp.type}</span>
                    </div>
                  </div>
                  {index === 0 && (
                    <div className="mt-2 md:mt-0">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
                        Current
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-700 font-light leading-relaxed mb-4 text-sm">
                  {exp.description}
                </p>

                {/* Achievements */}
                <div className="mb-4">
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, achIndex) => (
                      <li
                        key={achIndex}
                        className="text-sm text-gray-700 font-light leading-relaxed flex items-start"
                      >
                        <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">
                          •
                        </span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-light"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="border-t border-gray-200 pt-8 mt-12">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Career Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-light text-gray-700 mb-1">4+</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Years Experience
              </div>
            </div>
            <div>
              <div className="text-2xl font-light text-gray-700 mb-1">4</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Companies
              </div>
            </div>
            <div>
              <div className="text-2xl font-light text-gray-700 mb-1">15+</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Projects Delivered
              </div>
            </div>
            <div>
              <div className="text-2xl font-light text-gray-700 mb-1">50+</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Components Built
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <h3 className="font-medium text-gray-900 mb-4">
            Professional Profiles
          </h3>
          <div className="flex space-x-4">
            <a
              href="https://linkedin.com/in/goleedev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>LinkedIn</span>
              <ExternalLink size={12} />
            </a>
            <a
              href="https://github.com/goleedev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>GitHub</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
