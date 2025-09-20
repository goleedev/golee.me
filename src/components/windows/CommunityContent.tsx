import { Instagram, Linkedin, Twitter, Users } from 'lucide-react';
import { PageHeader } from '../shared/PageHeader';
import { StatCard } from '../shared/StatCard';
import { ExternalLink } from '../shared/ExternalLink';

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  attendees?: number;
  type: 'conference' | 'meetup' | 'workshop' | 'milestone' | 'rebrand';
  image?: string;
  link?: string;
  highlights?: string[];
}

export const CommunityContent = () => {
  const events: CommunityEvent[] = [
    {
      id: 'ctrl-shift-2025',
      title: 'CTRL+SHIFT – Rethinking Our Next Step',
      type: 'conference',
      date: 'September 2025',
      location: 'Seoul, Korea',
      attendees: 100,
      description:
        'Our first major offline gathering in Seoul since the rebrand! This 4-hour event focused on career transitions and the path from IC roles to management, with sponsorship from leading tech companies.',
      image: '/community/ctrl-shift.jpg',
      highlights: [
        'First major offline event after the rebrand',
        'Sponsored by Cloudflare, Hanbit&, Supabase, and Ringle',
        'Insights on career growth for ICs and transitioning to management',
        'Opportunities for in-person networking and meaningful connections',
      ],
    },
    {
      id: 'oops-i-did-it-again-2025',
      title: 'Oops…I Did It Again!: Mistakes and Growth',
      type: 'conference',
      date: 'March 2025',
      attendees: 180,
      description:
        "A special event for International Women's Day, exploring how women can embrace mistakes as stepping stones for growth, featuring four inspiring speakers.",
      image: '/community/mistakes-growth.gif',
      highlights: [
        "2-hour virtual event celebrating International Women's Day",
        'Structured approach to learning from mistakes',
        'Raising awareness of internalized biases and redefining leadership',
      ],
    },
    {
      id: 'breaking-barriers-2024',
      title: 'Breaking Barriers: Women, Work, and the World',
      type: 'conference',
      date: 'December 2024',
      attendees: 120,
      description:
        'Our first major DefyDefault event, featuring four inspiring speakers sharing their global career journeys. This 3-hour virtual event kept participants highly engaged throughout.',
      image: '/community/breaking-barriers.gif',
      highlights: [
        'Insights on global career experiences in the UK and US',
        'Strategies for optimizing LinkedIn profiles',
        'Stories on transforming work-life balance',
      ],
    },
    {
      id: 'defydefault-rebrand',
      title: 'XXIT → DefyDefault Rebrand',
      type: 'rebrand',
      date: 'November 2024',
      attendees: 11500,
      description:
        'Successfully rebranded XXIT to DefyDefault, expanding our mission to empower women globally to break stereotypes and thrive in technology.',
      image: '/community/rebrand.png',
      highlights: [
        'Complete overhaul of brand identity',
        'Expansion of the global community',
        'Enhanced engagement with community members',
      ],
    },
    {
      id: 'xxit-major-events',
      title: 'XXIT Major Community Events',
      type: 'milestone',
      date: '2019 - 2023',
      location: 'Seoul, Korea',
      attendees: 1000,
      description:
        'Organized landmark events that defined our community impact, bringing together over 1,000 participants across online and offline formats and establishing XXIT as a leading Women in Tech community in Korea.',
      image: '/community/xxit-events.jpg',
      highlights: [
        'Over 1,000 participants across major events',
        'Blend of online and offline engagement',
        'Featuring an industry-leading speaker lineup',
        'Community-driven content and networking opportunities',
      ],
    },
  ];

  const getEventTypeLabel = (type: CommunityEvent['type']) => {
    switch (type) {
      case 'conference':
        return 'Conference';
      case 'meetup':
        return 'Meetup';
      case 'workshop':
        return 'Workshop';
      case 'milestone':
        return 'Milestone';
      case 'rebrand':
        return 'Rebrand';
      default:
        return 'Event';
    }
  };

  const stats = [
    { metric: '11.5K+', label: 'Members' },
    { metric: 'Global', label: 'Reach' },
    { metric: '6+', label: 'Years' },
    { metric: '20+', label: 'Events' },
  ];

  return (
    <div className="px-4 sm:px-8 py-4 sm:py-8 h-full overflow-auto bg-white/95 backdrop-blur-xl">
      <div className="w-full mx-auto min-w-0">
        <PageHeader
          title="Community Journey"
          subtitle="Building and empowering the women in tech community since 2019"
        />

        {/* Current Stats */}
        <div className="border-t border-gray-200 pt-6 sm:pt-8 pb-6 sm:pb-8">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6">
            DefyDefault Today
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} metric={stat.metric} label={stat.label} />
            ))}
          </div>
        </div>

        {/* Events Timeline */}
        <div className="space-y-8 sm:space-y-12">
          {events.map((event, index) => (
            <div key={event.id} className="relative">
              {/* Timeline dot */}
              <div className="absolute left-0 top-0 w-2 h-2 bg-gray-400 rounded-full mt-1.5"></div>

              {/* Timeline line */}
              {index < events.length - 1 && (
                <div className="absolute left-0.5 top-4 w-0.5 h-full bg-gray-200"></div>
              )}

              {/* Content */}
              <div className="ml-6 sm:ml-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-medium text-gray-900">
                      {event.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-gray-600 mt-0.5">
                      <span className="font-medium text-xs sm:text-sm">
                        {getEventTypeLabel(event.type)}
                      </span>
                    </div>
                    <div className="flex flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 mt-0.5">
                      {event.location && (
                        <>
                          <span>{event.location}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>{event.date}</span>
                      {event.attendees && (
                        <>
                          <span>•</span>
                          <span>
                            {event.attendees.toLocaleString()} participants
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {index === 0 && (
                    <div className="mt-2 sm:mt-0">
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-800/50 text-white whitespace-nowrap">
                        Recent
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 font-light leading-relaxed mb-4 mt-3">
                  {event.description}
                </p>

                {/* Event Image */}
                {event.image && (
                  <div className="mb-4">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover rounded border border-gray-200"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Highlights */}
                {event.highlights && (
                  <div className="mb-4">
                    <ul className="space-y-2">
                      {event.highlights.map((highlight, hlIndex) => (
                        <li
                          key={hlIndex}
                          className="text-sm text-gray-700 font-light leading-relaxed flex items-start"
                        >
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">
                            •
                          </span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Event Meta Tags */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-light">
                    {getEventTypeLabel(event.type)}
                  </span>
                  {event.type === 'milestone' && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-light">
                      Major Achievement
                    </span>
                  )}
                  {event.type === 'rebrand' && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-light">
                      Brand Evolution
                    </span>
                  )}
                  {event.attendees && event.attendees > 1000 && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-light">
                      Large Scale
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="border-t border-gray-200 pt-6 sm:pt-8 mt-8 sm:mt-12">
          <div className="bg-gray-50/50 rounded-2xl p-4 sm:p-6">
            <h3 className="font-medium text-gray-900 mb-4">Join DefyDefault</h3>
            <div className="grid grid-cols-1 gap-3">
              <ExternalLink
                href="https://discord.gg/8ADH6QzmAG"
                icon={<Users size={16} className="text-gray-600" />}
                label="Discord"
              />
              <ExternalLink
                href="https://www.linkedin.com/company/defy-default/about/"
                icon={<Linkedin size={16} className="text-gray-600" />}
                label="LinkedIn"
              />
              <ExternalLink
                href="https://www.instagram.com/defy.dflt"
                icon={<Instagram size={16} className="text-gray-600" />}
                label="Instagram"
              />
              <ExternalLink
                href="https://x.com/defydflt"
                icon={<Twitter size={16} className="text-gray-600" />}
                label="Twitter"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
