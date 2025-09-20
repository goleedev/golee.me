import { useState, useEffect } from 'react';
import type { Track } from '../types';
import { defaultTrack } from '../data/musicData';

export const useMusic = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isLoadingTrack, setIsLoadingTrack] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchYouTubeTrack = async () => {
    setIsLoadingTrack(true);

    setTimeout(() => {
      setCurrentTrack(defaultTrack);
      setIsLoadingTrack(false);
    }, 1000);
  };

  useEffect(() => {
    fetchYouTubeTrack();
  }, []);

  return {
    currentTrack,
    isLoadingTrack,
    isPlaying,
    setIsPlaying,
  };
};
