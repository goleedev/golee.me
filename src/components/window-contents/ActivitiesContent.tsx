import {
  BookOpen,
  Building2,
  ExternalLink,
  Mail,
  MessageSquare,
  Mic,
  Star,
  Users,
} from 'lucide-react';

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
}

export const ActivitiesContent = () => {
  const activities: Activity[] = [
    // {
    //   id: 'lead-developer-book-2025',
    //   title: 'Lead Developer Career Guide Book Recommendation',
    //   description:
    //     'Provided a recommendation for the Korean translation of "Lead Developer Career Guide" published by Jpub, sharing insights on technical leadership and career development paths in the tech industry.',
    //   date: 'October 2025',
    //   category: 'book-recommendation',
    //   organization: 'Jpub',
    //   image: '/activities/lead-developer-book.jpg',
    // },
    // {
    //   id: 'k-devcon-recorder-2025',
    //   title: 'RE:CORDER Interview Project',
    //   description:
    //     'Featured in K-DEVCON\'s "RE:CORDER" interview project, which records and highlights the work and lives of diverse people in the IT industry. Shared personal career journey, experiences about working in tech, building pioneering women in tech community in South Korea, and insights about the transition from Korea to working at Cloudflare in London.',
    //   date: 'September 2025',
    //   category: 'interview',
    //   organization: 'K-DEVCON',
    //   image: '/activities/k-devcon-recorder.jpg',
    // },
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
    // Featured items come first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    // Then sort by date (newest first)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const groupedActivities = sortedActivities.reduce((acc, activity) => {
    if (!acc[activity.category]) {
      acc[activity.category] = [];
    }
    acc[activity.category].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  // 각 카테고리 내에서 날짜순 정렬 (최신순)
  Object.keys(groupedActivities).forEach((category) => {
    groupedActivities[category].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

  return (
    <div className="px-6 pt-6 h-full overflow-auto bg-white/95 backdrop-blur-xl">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-light mb-2 text-gray-900">Activities</h2>
          <p className="text-gray-600 font-light">
            Speaking engagements, media appearances, and industry contributions
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50/80 rounded-2xl p-4 text-center">
            <div className="text-xl font-light text-gray-700 mb-1">
              {
                activities.filter(
                  (a) => a.category === 'speaking' || a.category === 'workshop'
                ).length
              }
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Presentations
            </div>
          </div>
          <div className="bg-gray-50/80 rounded-2xl p-4 text-center">
            <div className="text-xl font-light text-gray-700 mb-1">
              {
                activities.filter(
                  (a) =>
                    a.category === 'interview' ||
                    a.category === 'book-recommendation'
                ).length
              }
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Media & Interviews
            </div>
          </div>
          <div className="bg-gray-50/80 rounded-2xl p-4 text-center">
            <div className="text-xl font-light text-gray-700 mb-1">
              {new Set(activities.map((a) => a.organization)).size}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Organizations
            </div>
          </div>
        </div>

        {/* Activities by Category */}
        <div className="space-y-8">
          {Object.entries(groupedActivities).map(
            ([category, categoryActivities]) => (
              <div key={category}>
                {/* Category Header */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    {getCategoryIcon(category as Activity['category'])}
                    <h3 className="font-medium text-gray-900">
                      {getCategoryLabel(category as Activity['category'])}
                    </h3>
                  </div>

                  {/* Activities List */}
                  <div className="space-y-4">
                    {categoryActivities.map((activity) => (
                      <div key={activity.id}>
                        <div className="flex flex-col space-y-1 mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900 border-l-2 border-gray-400 pl-4 mb-2">
                              {activity.title}
                            </span>
                            {activity.featured && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-black/80 text-white">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{activity.date}</span>
                            <span>•</span>
                            <span>{activity.organization}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 font-light mb-3">
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
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Contact */}
        <div className="bg-gray-50/50 rounded-2xl p-6 mb-6">
          <h3 className="font-medium text-gray-900 mb-4">
            Collaboration Opportunities
          </h3>
          <p className="text-gray-600 font-light mb-4">
            Open to speaking engagements, workshops, mentoring programs, and
            other collaboration opportunities.
          </p>
          <a
            href="mailto:golee.dev@gmail.com"
            className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Mail size={16} className="text-gray-600" />
            <span className="text-sm text-gray-700">Get in Touch</span>
            <ExternalLink size={12} className="text-gray-400 ml-auto" />
          </a>
        </div>
      </div>
    </div>
  );
};
