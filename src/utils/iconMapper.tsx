import React from 'react';
import FolderIcon from '../components/shared/icons/FolderIcon';
import MusicIcon from '../components/shared/icons/MusicIcon';
import NoteIcon from '../components/shared/icons/NoteIcon';

export const getIconForItem = (id: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    about: <NoteIcon />,
    work: <NoteIcon />,
    blog: <FolderIcon />,
    community: <FolderIcon />,
    mentorship: <NoteIcon />,
    activities: <FolderIcon />,
    guestbook: <FolderIcon />,
    music: <MusicIcon />,
  };

  return iconMap[id] || <NoteIcon />;
};
