import {
  ExternalLink,
  Instagram,
  Linkedin,
  Twitter,
  Users,
} from 'lucide-react';

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
        '2-hour virtual event celebrating International Women’s Day',
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

  return (
    <div className="px-8 py-8 h-full overflow-auto bg-white/95 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-light mb-2 text-gray-900">
            Community Journey
          </h2>
          <p className="text-gray-600 font-light">
            Building and empowering the women in tech community since 2019
          </p>
        </div>

        {/* Current Stats */}
        <div className="border-t border-gray-200 pt-8 pb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            DefyDefault Today
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-light text-gray-700 mb-1">
                11.5K+
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Members
              </div>
            </div>
            <div>
              <div className="text-2xl font-light text-gray-700 mb-1">
                Global
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Reach
              </div>
            </div>
            <div>
              <div className="text-2xl font-light text-gray-700 mb-1">6+</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Years
              </div>
            </div>
            <div>
              <div className="text-2xl font-light text-gray-700 mb-1">20+</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Events
              </div>
            </div>
          </div>
        </div>

        {/* Events Timeline */}
        <div className="space-y-12">
          {events.map((event, index) => (
            <div key={event.id} className="relative">
              {/* Timeline dot */}
              <div className="absolute left-0 top-0 w-2 h-2 bg-gray-400 rounded-full mt-1.5"></div>

              {/* Timeline line */}
              {index < events.length - 1 && (
                <div className="absolute left-0.5 top-4 w-0.5 h-full bg-gray-200"></div>
              )}

              {/* Content */}
              <div className="ml-8">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-medium text-gray-900">
                        {event.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-gray-600 mt-0.5">
                        <span className="font-medium">
                          {getEventTypeLabel(event.type)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mt-0.5">
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
                  </div>
                  {index === 0 && (
                    <div className="mt-2 md:mt-0">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-black/80 text-white">
                        Recent
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-700 font-light leading-relaxed mb-4 text-sm">
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
        <div className="border-t border-gray-200 pt-8 mt-12">
          <div className="bg-gray-50/50 rounded-2xl p-6">
            <h3 className="font-medium text-gray-900 mb-4">Join DefyDefault</h3>
            <div className="grid grid-cols-1 gap-3">
              <a
                href="https://discord.gg/8ADH6QzmAG"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users size={16} className="text-gray-600" />
                <span className="text-sm text-gray-700">Discord</span>
                <ExternalLink size={12} className="text-gray-400 ml-auto" />
              </a>
              <a
                href="https://www.linkedin.com/company/defy-default/about/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Linkedin size={16} className="text-gray-600" />
                <span className="text-sm text-gray-700">LinkedIn</span>
                <ExternalLink size={12} className="text-gray-400 ml-auto" />
              </a>
              <a
                href="https://www.instagram.com/defy.dflt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Instagram size={16} className="text-gray-600" />
                <span className="text-sm text-gray-700">Instagram</span>
                <ExternalLink size={12} className="text-gray-400 ml-auto" />
              </a>
              <a
                href="https://x.com/defydflt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Twitter size={16} className="text-gray-600" />
                <span className="text-sm text-gray-700">Twitter</span>
                <ExternalLink size={12} className="text-gray-400 ml-auto" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
