import React from 'react';
import { AboutContent } from '../components/windows/AboutContent';
import { WorkContent } from '../components/windows/WorkContent';
import { BlogContent } from '../components/windows/BlogContent';
import { ActivitiesContent } from '../components/windows/ActivitiesContent';
import { CommunityContent } from '../components/windows/CommunityContent';
import { MentorshipContent } from '../components/windows/MentorshipContent';
import { GuestbookContent } from '../components/windows/GuestbookContent';
import { MusicContent } from '../components/windows/MusicContent';
import type { Track } from '../types';

interface MusicContentProps {
  currentTrack: Track | null;
  isLoadingTrack: boolean;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export const getWindowContent = (
  id: string,
  musicProps?: MusicContentProps
): React.ReactNode => {
  const contents: Record<string, React.ReactNode> = {
    about: <AboutContent />,
    work: <WorkContent />,
    blog: <BlogContent />,
    activities: <ActivitiesContent />,
    community: <CommunityContent />,
    mentorship: <MentorshipContent />,
    guestbook: <GuestbookContent />,
    music: musicProps ? (
      <MusicContent
        currentTrack={musicProps.currentTrack}
        isLoadingTrack={musicProps.isLoadingTrack}
        isPlaying={musicProps.isPlaying}
        setIsPlaying={musicProps.setIsPlaying}
      />
    ) : (
      <AboutContent />
    ),
  };

  return contents[id] || <AboutContent />;
};
