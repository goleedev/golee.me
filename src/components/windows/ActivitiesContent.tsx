import {
  BookOpen,
  Building2,
  ExternalLink as ExternalLinkIcon,
  Mail,
  MessageSquare,
  Mic,
  Star,
  Users,
} from 'lucide-react';
import { PageHeader } from '../shared/PageHeader';
import { StatCard } from '../shared/StatCard';
import { ContentSection } from '../shared/ContentSection';
import { ExternalLink } from '../shared/ExternalLink';

interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  category:
    | 'speaking'
    | 'workshop'
    | 'mentoring'
    | 'interview'
    | 'book-recommendation'
    | 'recognition';
  link?: string;
  image?: string;
  organization: string;
  featured?: boolean;
  highlights?: string[];
}

export const ActivitiesContent = () => {
  const activities: Activity[] = [
    {
      id: 'lead-developer-book-2025',
      title: 'Lead Developer Career Guide Book Recommendation',
      description:
        'Provided a recommendation for the Korean translation of "Lead Developer Career Guide" published by Jpub, sharing insights on technical leadership and career development paths in the tech industry.',
      date: 'October 2025',
      category: 'book-recommendation',
      organization: 'Jpub',
      image: '/activities/lead-developer-book.png',
    },
    {
      id: 'k-devcon-recorder-2025',
      title: 'RE:CORDER Interview Project',
      description:
        'Featured in K-DEVCON\'s "RE:CORDER" interview project, which records and highlights the work and lives of diverse people in the IT industry. Shared personal career journey, experiences about working in tech, building pioneering women in tech community in South Korea, and insights about the transition from Korea to working at Cloudflare in London.',
      date: 'September 2025',
      category: 'interview',
      organization: 'K-DEVCON',
      image: '/activities/k-devcon-recorder.jpg',
    },
    {
      id: 'loko-devgirls-2025',
      title: 'Reflecting on 6 Months at Cloudflare',
      description:
        'Presented insights from the first 6 months at Cloudflare during LOKOCON. Shared experiences about the transition from working in Seoul to the London tech scene, connecting with Korean women in tech and discussing career growth strategies.',
      date: 'June 2025',
      category: 'speaking',
      organization: 'LoKo-DevGirls',
      image: '/activities/loko-devgirls.jpg',
    },
    {
      id: 'wtm-ethiopia-react-2025',
      title: 'React Fundamentals Workshop - From Design to Market Series',
      description:
        'Delivered a 90-minute React Fundamentals session for Week 5 of the From Design to Market series hosted by Google Women Techmakers Ethiopia. Taught nearly 50 participants the basics of React development, focusing on making React concepts accessible and engaging.',
      date: 'June 2025',
      category: 'workshop',
      organization: 'Google Women Techmakers Ethiopia',
      image: '/activities/wtm-ethiopia.jpg',
      featured: true,
    },
    {
      id: 'its-study-cohost-2025',
      title: "Co-hosting IT's Study 3.0 + Global Mentoring Sessions",
      description:
        "Served as co-host for IT's Study 3.0, marking the first time an individual host collaborated in this role for the Seoul Metropolitan Government initiative. Facilitated global mentorship connections by coordinating with international experts including Amber Shand MBCS, Rakiya Suleiman, and Vinita Silaparasetty. Supported orientation for 120 women in tech from Seoul.",
      date: 'February 2025',
      category: 'mentoring',
      organization: "Seoul Women IT's (Seoul Metropolitan Government)",
      image: '/activities/its-study.jpg',
    },
    {
      id: 'defydefault-breaking-barriers-2024',
      title: 'How to Land a Global Job Using LinkedIn',
      description:
        "Delivered keynote presentation at DefyDefault's first major event as co-founder and featured speaker. Presented LinkedIn strategies for global career advancement during a 3-hour virtual event.",
      date: 'December 2024',
      category: 'speaking',
      organization: 'DefyDefault',
      image: '/community/breaking-barriers.gif',
    },
    {
      id: 'wtm-ambassador-2024',
      title: 'Google Women Techmakers Ambassador',
      description:
        'Selected as Google Women Techmakers Ambassador to champion women in technology, collaborate with inspiring tech leaders globally, and drive initiatives that foster diversity and inclusion in the tech industry.',
      date: 'August 2024 - Present',
      category: 'recognition',
      organization: 'Google Women Techmakers',
      image: '/activities/wtm-ambassador.jpg',
    },
  ];

  const getCategoryIcon = (category: Activity['category']) => {
    switch (category) {
      case 'speaking':
        return <Mic className="text-gray-600" size={16} />;
      case 'workshop':
        return <Building2 className="text-gray-600" size={16} />;
      case 'mentoring':
        return <Users className="text-gray-600" size={16} />;
      case 'interview':
        return <MessageSquare className="text-gray-600" size={16} />;
      case 'book-recommendation':
        return <BookOpen className="text-gray-600" size={16} />;
      case 'recognition':
        return <Star className="text-gray-600" size={16} />;
      default:
        return <Mic className="text-gray-600" size={16} />;
    }
  };

  const getCategoryLabel = (category: Activity['category']) => {
    switch (category) {
      case 'speaking':
        return 'Speaking';
      case 'workshop':
        return 'Workshop';
      case 'mentoring':
        return 'Mentoring';
      case 'interview':
        return 'Interview';
      case 'book-recommendation':
        return 'Book Recommendation';
      case 'recognition':
        return 'Recognition';
      default:
        return 'Activity';
    }
  };

  // Sort activities - featured items first, then by date
  const sortedActivities = [...activities].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const groupedActivities = sortedActivities.reduce((acc, activity) => {
    if (!acc[activity.category]) {
      acc[activity.category] = [];
    }
    acc[activity.category].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  Object.keys(groupedActivities).forEach((category) => {
    groupedActivities[category].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

  const stats = [
    {
      metric: activities.filter(
        (a) => a.category === 'speaking' || a.category === 'workshop'
      ).length,
      label: 'Presentations',
    },
    {
      metric: activities.filter(
        (a) =>
          a.category === 'interview' || a.category === 'book-recommendation'
      ).length,
      label: 'Media & Interviews',
    },
    {
      metric: new Set(activities.map((a) => a.organization)).size,
      label: 'Organizations',
    },
  ];

  return (
    <div className="px-4 sm:px-6 pt-4 sm:pt-6 h-full overflow-auto bg-white/95 backdrop-blur-xl">
      <div className="w-full mx-auto min-w-0">
        <PageHeader
          title="Activities"
          subtitle="Speaking engagements, media appearances, and industry contributions"
        />

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} metric={stat.metric} label={stat.label} />
          ))}
        </div>

        {/* Activities by Category */}
        <div className="space-y-6 sm:space-y-8">
          {Object.entries(groupedActivities).map(
            ([category, categoryActivities]) => (
              <ContentSection
                key={category}
                title={getCategoryLabel(category as Activity['category'])}
                className="mb-6"
              >
                <div className="flex items-center space-x-2 mb-4">
                  {getCategoryIcon(category as Activity['category'])}
                  <h3 className="font-medium text-gray-900">
                    {getCategoryLabel(category as Activity['category'])}
                  </h3>
                </div>

                {/* Activities List */}
                <div className="space-y-6">
                  {categoryActivities.map((activity) => (
                    <div key={activity.id}>
                      <div className="flex flex-col space-y-1 mb-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-medium text-gray-900 border-l-2 border-gray-400 pl-4 mb-2 flex-1 text-sm sm:text-base">
                            {activity.title}
                          </span>
                          {activity.featured && (
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-800/50 text-white whitespace-nowrap">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 pl-4">
                          <span>{activity.date}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{activity.organization}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 font-light mb-3 leading-relaxed break-words">
                        {activity.description}
                      </p>

                      {/* Activity Image */}
                      {activity.image && (
                        <div className="mb-3">
                          <img
                            src={activity.image}
                            alt={activity.title}
                            className="w-full h-48 object-cover rounded border border-gray-200"
                            loading="lazy"
                          />
                        </div>
                      )}

                      {/* Highlights - 여기가 문제였습니다 */}
                      {activity.highlights &&
                        activity.highlights.length > 0 && (
                          <div className="mb-3 bg-gray-50/50 rounded-lg p-3 sm:p-4">
                            <h4 className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                              Highlights
                            </h4>
                            <ul className="space-y-2">
                              {activity.highlights.map((highlight, hlIndex) => (
                                <li
                                  key={hlIndex}
                                  className="text-sm text-gray-700 font-light leading-relaxed flex items-start"
                                >
                                  <span className="text-gray-400 mr-3 mt-1 flex-shrink-0">
                                    •
                                  </span>
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* Tags and Link */}
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-light">
                          {getCategoryLabel(activity.category)}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-light">
                          {activity.organization}
                        </span>
                        {activity.link && (
                          <a
                            href={activity.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-light hover:bg-gray-200 transition-colors inline-flex items-center space-x-1"
                          >
                            <span>View</span>
                            <ExternalLinkIcon size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ContentSection>
            )
          )}
        </div>

        {/* Contact */}
        <div className="bg-gray-50/50 rounded-2xl p-4 sm:p-6 mb-6">
          <h3 className="font-medium text-gray-900 mb-4">
            Collaboration Opportunities
          </h3>
          <p className="text-sm sm:text-base text-gray-600 font-light mb-4">
            Open to speaking engagements, workshops, mentoring programs, and
            other collaboration opportunities.
          </p>
          <ExternalLink
            href="mailto:golee.dev@gmail.com"
            icon={<Mail size={16} className="text-gray-600" />}
            label="Get in Touch"
          />
        </div>
      </div>
    </div>
  );
};
