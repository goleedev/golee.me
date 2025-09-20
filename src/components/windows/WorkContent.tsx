import { PageHeader } from '../shared/PageHeader';
import { TimelineItem } from '../shared/TimelineItem';
import { StatCard } from '../shared/StatCard';

export const WorkContent = () => {
  const experiences = [
    {
      id: 'cloudflare',
      company: 'Cloudflare',
      role: 'Systems Engineer (Frontend)',
      location: 'London, UK',
      period: 'December 2024 - Present',
      type: 'Full-time',
      description:
        'Building secure dashboard experiences and improving user workflows for Zero Trust products serving millions of users globally.',
      achievements: [
        "Redesigned core dashboard workflows for Cloudflare's Zero Trust platform, significantly improving completion rates and user experience across key journeys.",
        'Overhauled core UI components at Cloudflare, improving code reusability and accessibility to industry-leading standards.',
        'Extended Cloudflare CASB from visibility-only detection to actionable remediation workflows, adding automated security controls for SaaS misconfigurations.',
        "Integrated MCP Agent Gateway into Zero Trust dashboard, unifying security and access management as part of Cloudflare's AI Week launch.",
      ],
      technologies: ['React', 'TypeScript', 'Jest', 'Cypress', 'Tailwind CSS'],
      isCurrent: true,
    },
    {
      id: 'uncutgems',
      company: 'Uncutgems',
      role: 'Frontend Engineer',
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

  const stats = [
    { metric: '4+', label: 'Years Experience' },
    { metric: '4', label: 'Companies' },
    { metric: '15+', label: 'Projects Delivered' },
    { metric: '50+', label: 'Components Built' },
  ];

  return (
    <div className="px-4 sm:px-8 py-4 sm:py-8 h-full overflow-auto bg-white/95 backdrop-blur-xl">
      <div className="w-full mx-auto min-w-0">
        <PageHeader
          title="Work Experience"
          subtitle="Building impactful web applications and user experiences"
        />

        <div className="space-y-8 sm:space-y-12">
          {experiences.map((exp, index) => (
            <TimelineItem
              key={exp.id}
              title={exp.role}
              subtitle={exp.company}
              date={`${exp.location} • ${exp.period} • ${exp.type}`}
              description={exp.description}
              achievements={exp.achievements}
              tags={exp.technologies}
              isLast={index === experiences.length - 1}
              isCurrent={exp.isCurrent}
            />
          ))}
        </div>

        {/* Summary Stats */}
        <div className="border-t border-gray-200 pt-6 sm:pt-8 mt-8 mb-6 sm:mt-12">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6">
            Career Summary
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} metric={stat.metric} label={stat.label} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
