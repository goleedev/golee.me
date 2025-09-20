import React from 'react';
import { AboutContent } from '../windows/AboutContent';
import { WorkContent } from '../windows/WorkContent';
import { CommunityContent } from '../windows/CommunityContent';
import { ActivitiesContent } from '../windows/ActivitiesContent';
import { MusicContent } from '../windows/MusicContent';
import { MentorshipContent } from '../windows/MentorshipContent';
import { GuestbookContent } from '../windows/GuestbookContent';
import { useMusic } from '../../hooks/useMusic';

interface FullPageContentProps {
  pageId: string;
}

const getPageContent = (pageId: string) => {
  switch (pageId) {
    case 'about':
      return <AboutContent />;
    case 'work':
      return <WorkContent />;
    case 'community':
      return <CommunityContent />;
    case 'activities':
      return <ActivitiesContent />;
    case 'music':
      return <MusicContentWithProps />;
    case 'mentorship':
      return <MentorshipContent />;
    case 'guestbook':
      return <GuestbookContent />;
    default:
      return <AboutContent />;
  }
};

// MusicContent with required props
const MusicContentWithProps = () => {
  const { currentTrack, isLoadingTrack, isPlaying, setIsPlaying } = useMusic();
  return (
    <MusicContent
      currentTrack={currentTrack}
      isLoadingTrack={isLoadingTrack}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
    />
  );
};

export const FullPageContent: React.FC<FullPageContentProps> = ({ pageId }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">{getPageContent(pageId)}</div>
      </div>
    </div>
  );
};
