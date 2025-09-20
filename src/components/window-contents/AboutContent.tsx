import { ExternalLink, Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

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

  return (
    <div className="px-6 pt-6 h-full overflow-auto bg-white/95 backdrop-blur-xl">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <img
            src="/memoji.png"
            alt="Goeun Lee Memoji"
            className="w-20 h-20 mx-auto mb-4"
            loading="lazy"
            style={{ filter: imageLoaded ? 'none' : 'blur(5px)' }}
          />
          <h1 className="text-2xl font-light mb-2 text-gray-900">Goeun Lee</h1>
          <p className="text-base text-gray-600 font-light mb-4">
            Frontend Engineer & Community Builder
          </p>

          {/* Contact Info */}
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <MapPin size={12} />
              <span>London, UK</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail size={12} />
              <span>golee.dev@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="bg-gray-50/80 rounded-2xl p-4 text-center"
            >
              <div className="text-xl font-light text-gray-700 mb-1">
                {achievement.metric}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                {achievement.label}
              </div>
            </div>
          ))}
        </div>

        {/* About */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <p className="text-gray-700 leading-relaxed font-light mb-4">
            Driven frontend engineer with 4+ years of experience building
            impactful web applications. Currently working at Cloudflare on the
            Zero Trust team, focusing on user experience improvements and secure
            dashboard solutions.
          </p>
          <p className="text-gray-700 leading-relaxed font-light">
            Co-founder of DefyDefault (formerly XXIT), a pioneering Women in
            Tech community that has grown to 11,500+ members globally, with
            partnerships across major tech companies.
          </p>
        </div>

        {/* Experience */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <h3 className="font-medium text-gray-900 mb-4">Experience</h3>
          <div className="space-y-4">
            <div className="border-l-2 border-gray-400 pl-4">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-900">
                  Systems Engineer (Frontend)
                </span>
                <span className="text-sm text-gray-500">• Cloudflare</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                London • December 2024 - Present
              </p>
              <p className="text-sm text-gray-700 font-light">
                Building secure dashboard experiences and improving user
                workflows for Zero Trust products.
              </p>
            </div>

            <div className="border-l-2 border-gray-400 pl-4">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-900">
                  Frontend Engineer
                </span>
                <span className="text-sm text-gray-500">• Uncutgems</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Seoul • June 2023 - September 2024
              </p>
              <p className="text-sm text-gray-700 font-light">
                Built comprehensive e-commerce platform with personalized
                recommendations and A/B testing, driving £100k+ monthly
                transactions.
              </p>
            </div>

            <div className="border-l-2 border-gray-400 pl-4">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-900">
                  Frontend Developer
                </span>
                <span className="text-sm text-gray-500">• Hyper Cloud</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Seoul • February 2022 - June 2023
              </p>
              <p className="text-sm text-gray-700 font-light">
                Developed scalable web applications with React and Next.js,
                improving performance and user experience across multiple
                projects.
              </p>
            </div>

            <div className="border-l-2 border-gray-400 pl-4">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-900">
                  Frontend Engineer
                </span>
                <span className="text-sm text-gray-500">• MediBloc</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Seoul • February 2021 - May 2021 • Internship
              </p>
              <p className="text-sm text-gray-700 font-light">
                Built 15+ healthcare interface components for Cloud EMR Dr.
                Palette using React, TypeScript, and GraphQL.
              </p>
            </div>

            <div className="border-l-2 border-gray-400 pl-4">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-900">Co-founder</span>
                <span className="text-sm text-gray-500">• DefyDefault</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Global • July 2019 - Present
              </p>
              <p className="text-sm text-gray-700 font-light">
                Co-founded and scaled Women in Tech community to 11,500+ members
                with partnerships across Cloudflare, Apple, and Samsung.
              </p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <h3 className="font-medium text-gray-900 mb-4">Technical Skills</h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Frontend
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills.frontend.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-light border border-gray-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Backend & Database
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills.backend.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-light border border-gray-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Tools & Infrastructure
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills.tools.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-light border border-gray-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <h3 className="font-medium text-gray-900 mb-4">Education</h3>
          <div>
            <p className="font-medium text-gray-900">
              Bachelor of Science in Computer Science
            </p>
            <p className="text-sm text-gray-600">
              University of London • 2025 • First Class Honours
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="bg-gray-50/50 rounded-2xl p-6 mb-6">
          <h3 className="font-medium text-gray-900 mb-4">Connect</h3>
          <div className="grid grid-cols-1 gap-3">
            <a
              href="https://github.com/goleedev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Github size={16} className="text-gray-600" />
              <span className="text-sm text-gray-700">GitHub</span>
              <ExternalLink size={12} className="text-gray-400 ml-auto" />
            </a>
            <a
              href="https://linkedin.com/in/goleedev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Linkedin size={16} className="text-gray-600" />
              <span className="text-sm text-gray-700">LinkedIn</span>
              <ExternalLink size={12} className="text-gray-400 ml-auto" />
            </a>
            <a
              href="mailto:golee.dev@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Mail size={16} className="text-gray-600" />
              <span className="text-sm text-gray-700">Email</span>
              <ExternalLink size={12} className="text-gray-400 ml-auto" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
