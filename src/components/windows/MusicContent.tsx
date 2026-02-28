import { FastForwardIcon, PauseIcon, PlayIcon } from 'lucide-react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Track } from '../../types';

interface MusicContentProps {
  currentTrack: Track | null;
  isLoadingTrack: boolean;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

interface YouTubePlayer {
  playVideo(): void;
  pauseVideo(): void;
  getCurrentTime(): number;
  getDuration(): number;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setVolume(volume: number): void;
  getVolume(): number;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  cueVideoById(videoId: string): void;
  getPlayerState?(): number;
  destroy(): void;
}

interface YouTubePlayerEvent {
  target: YouTubePlayer;
  data: number;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        element: HTMLElement,
        config: {
          height: string;
          width: string;
          videoId: string;
          playerVars: Record<string, number>;
          events: {
            onReady: (event: YouTubePlayerEvent) => void;
            onStateChange: (event: YouTubePlayerEvent) => void;
          };
        },
      ) => YouTubePlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
        BUFFERING: number;
        CUED: number;
        UNSTARTED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

const YouTubePlayerState = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

type PlayIconType = 'play' | 'pause' | 'loading';

export const MusicContent = ({
  currentTrack,
  isLoadingTrack,
  isPlaying,
  setIsPlaying,
}: MusicContentProps) => {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const [apiReady, setApiReady] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const [isDraggingProgress, setIsDraggingProgress] = useState<boolean>(false);
  const [isPlayerLoading, setIsPlayerLoading] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [iconType, setIconType] = useState<PlayIconType>('loading');

  useEffect(() => {
    if (isPlaying) {
      setIconType('pause');
    } else {
      setIconType('play');
    }
  }, [isPlaying]);

  useEffect(() => {
    const updateDimensions = () => {
      if (windowRef.current) {
        const rect = windowRef.current.getBoundingClientRect();
        setWindowDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (windowRef.current) {
      resizeObserver.observe(windowRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // 비율이 2:3인지 확인 (약간의 허용 오차 포함)
  const isOptimalRatio = useMemo(() => {
    if (windowDimensions.width === 0 || windowDimensions.height === 0)
      return true;
    const aspectRatio = windowDimensions.width / windowDimensions.height;
    const targetRatio = 2 / 3; // 0.667 (400:600)
    const tolerance = 0.2; // 20% 허용 오차
    return Math.abs(aspectRatio - targetRatio) <= tolerance;
  }, [windowDimensions]);

  // YouTube API 초기화
  useEffect(() => {
    if (window.YT?.Player) {
      setApiReady(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    if (existingScript) {
      const checkApi = () => {
        if (window.YT?.Player) {
          setApiReady(true);
        } else {
          setTimeout(checkApi, 100);
        }
      };
      checkApi();
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag?.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      setApiReady(true);
    };
  }, []);

  // 플레이어 초기화
  useEffect(() => {
    if (!apiReady || !currentTrack || !containerRef.current || !window.YT) {
      return;
    }

    setIsPlayerLoading(true);
    setIconType('loading');

    if (playerRef.current) {
      try {
        playerRef.current.cueVideoById(currentTrack.id);
        setIsPlayerLoading(false);
        return;
      } catch (error) {
        console.error(error);

        try {
          playerRef.current.destroy();
        } catch (destroyError) {
          console.error(destroyError);
        }
        playerRef.current = null;
        setPlayerReady(false);
      }
    }

    const onReady = (event: YouTubePlayerEvent): void => {
      setPlayerReady(true);
      setIsPlayerLoading(false);
      setIsBuffering(false);

      const totalDuration = event.target.getDuration();
      setDuration(totalDuration);

      try {
        const initialState = event.target.getPlayerState?.();
        const initiallyPlaying = initialState === YouTubePlayerState.PLAYING;
        setIsPlaying(initiallyPlaying);

        if (initiallyPlaying) {
          setIconType('pause');
        } else {
          setIconType('play');
        }
      } catch (error) {
        console.error('Error getting initial state:', error);
        setIsPlaying(false);
        setIconType('play');
      }
    };

    const onStateChange = (event: YouTubePlayerEvent): void => {
      const state = event.data;

      if (state === YouTubePlayerState.PLAYING) {
        setIsPlaying(true);
        setIconType('pause');
        setIsBuffering(false);
        startTimeUpdate();
      } else if (state === YouTubePlayerState.PAUSED) {
        setIsPlaying(false);
        setIconType('play');
        setIsBuffering(false);
        stopTimeUpdate();
      } else if (state === YouTubePlayerState.ENDED) {
        setIsPlaying(false);
        setIconType('play');
        setIsBuffering(false);
        stopTimeUpdate();
      } else if (state === YouTubePlayerState.BUFFERING) {
        setIconType('loading');
      }
    };

    try {
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '200',
        width: '300',
        videoId: currentTrack.id,
        playerVars: {
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          autoplay: 0,
          playsinline: 1,
        },
        events: {
          onReady,
          onStateChange,
        },
      });
    } catch (error) {
      console.error(error);
      setIsPlayerLoading(false);
    }

    return () => {
      stopTimeUpdate();
    };
  }, [apiReady, currentTrack]);

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.error(error);
        }
        playerRef.current = null;
      }
      setPlayerReady(false);
    };
  }, []);

  const startTimeUpdate = useCallback((): void => {
    if (intervalRef.current) return;

    intervalRef.current = window.setInterval(() => {
      if (playerRef.current && !isDraggingProgress) {
        try {
          const current = playerRef.current.getCurrentTime();
          const total = playerRef.current.getDuration();
          setCurrentTime(current);
          if (total !== duration && total > 0) {
            setDuration(total);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }, 200);
  }, [isDraggingProgress, duration]);

  const stopTimeUpdate = useCallback((): void => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handlePlayPause = useCallback(() => {
    if (!playerRef.current || !playerReady || isPlayerLoading) return;

    const state = playerRef.current.getPlayerState?.();
    const actuallyPlaying = state === YouTubePlayerState.PLAYING;

    if (actuallyPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
      setIconType('play');
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
      setIconType('pause');
    }
  }, [playerReady, isPlayerLoading]);

  const handleSkipForward = useCallback((): void => {
    if (!playerRef.current || !playerReady) return;

    try {
      const currentTime = playerRef.current.getCurrentTime();
      const newTime = Math.min(currentTime + 10, duration);
      playerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
    } catch (error) {
      console.error(error);
    }
  }, [playerReady, duration]);

  const handleSkipBackward = useCallback((): void => {
    if (!playerRef.current || !playerReady) return;

    try {
      const currentTime = playerRef.current.getCurrentTime();
      const newTime = Math.max(0, currentTime - 10);
      playerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
    } catch (error) {
      console.error(error);
    }
  }, [playerReady]);

  const handleProgressMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>): void => {
      event.preventDefault();
      event.stopPropagation();
      setIsDraggingProgress(true);

      const handleMouseMove = (e: MouseEvent): void => {
        e.preventDefault();
        e.stopPropagation();

        if (
          !progressBarRef.current ||
          !playerRef.current ||
          !playerReady ||
          duration === 0
        )
          return;

        const rect = progressBarRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        const newTime = percentage * duration;

        setCurrentTime(newTime);
      };

      const handleMouseUp = (e: MouseEvent): void => {
        e.preventDefault();
        e.stopPropagation();

        if (
          !progressBarRef.current ||
          !playerRef.current ||
          !playerReady ||
          duration === 0
        )
          return;

        const rect = progressBarRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        const newTime = percentage * duration;

        try {
          playerRef.current.seekTo(newTime, true);
          setCurrentTime(newTime);
        } catch (error) {
          console.error(error);
        }
        setIsDraggingProgress(false);

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [duration, playerReady],
  );

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isLoading =
    isLoadingTrack ||
    !apiReady ||
    isPlayerLoading ||
    isBuffering ||
    !currentTrack;
  const isInteractionDisabled = !playerReady || isLoading;

  const renderPlayPauseIcon = () => {
    switch (iconType) {
      case 'loading':
        return (
          <div className="w-6 h-6 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
        );
      case 'pause':
        return (
          <PauseIcon
            className={isInteractionDisabled ? 'cursor-not-allowed' : ''}
          />
        );
      case 'play':
      default:
        return (
          <PlayIcon
            className={isInteractionDisabled ? 'cursor-not-allowed' : ''}
          />
        );
    }
  };

  const getLoadingMessage = (): string => {
    if (!currentTrack) return 'Loading track...';
    if (isLoadingTrack) return 'Loading track...';
    if (!apiReady) return 'Loading player...';
    if (isPlayerLoading) return 'Initializing...';
    if (isBuffering) return 'Buffering...';
    return 'Loading...';
  };

  return (
    <div
      ref={windowRef}
      className="h-full bg-white/95 backdrop-blur-xl relative"
    >
      <div className="hidden">
        <div ref={containerRef}></div>
      </div>

      {/* 통합 레이아웃 - CSS로 전환 */}
      <div
        className={`h-full w-full flex items-center justify-center p-6 bg-white overflow-hidden transition-all duration-500 ease-in-out ${
          isOptimalRatio ? 'flex-col' : 'flex-row gap-6 md:gap-8'
        }`}
      >
        {/* 로딩 오버레이 */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="text-center text-gray-800">
              <div className="w-12 h-12 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg font-light">{getLoadingMessage()}</p>
            </div>
          </div>
        )}

        {/* 썸네일 */}
        <div
          className={`relative flex-shrink-0 transition-all duration-500 ease-in-out ${
            isOptimalRatio ? 'mb-6' : ''
          }`}
        >
          <img
            src={currentTrack?.thumbnail}
            alt={currentTrack?.title}
            className="object-cover shadow-lg transition-all duration-500 ease-in-out"
            style={{
              width: isOptimalRatio ? '256px' : '128px',
              height: isOptimalRatio ? '256px' : '128px',
              borderRadius: isOptimalRatio ? '16px' : '12px',
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://img.youtube.com/vi/${currentTrack?.id}/hqdefault.jpg`;
            }}
          />
        </div>

        {/* 컨트롤 영역 */}
        <div
          className={`flex flex-col justify-center flex-1 max-w-md transition-all duration-500 ease-in-out ${
            isOptimalRatio
              ? 'items-center text-center min-w-full'
              : 'items-start text-left min-w-0'
          }`}
        >
          {/* 트랙 정보 */}
          <div
            className={`space-y-1 mb-6 transition-all duration-500 ease-in-out ${
              isOptimalRatio ? 'px-4' : ''
            }`}
          >
            <h3
              className={`font-light text-gray-900 leading-tight break-words line-clamp-2 transition-all duration-500 ease-in-out ${
                isOptimalRatio ? 'text-xl' : 'text-lg md:text-xl'
              }`}
            >
              {currentTrack?.title}
            </h3>
            <p
              className={`text-gray-600 font-light transition-all duration-500 ease-in-out ${
                isOptimalRatio ? 'text-base' : 'text-sm md:text-base truncate'
              }`}
            >
              {currentTrack?.artist}
            </p>
          </div>

          {/* 진행률 바 */}
          <div className="w-full space-y-3 mb-6 transition-all duration-500 ease-in-out">
            <div className="flex items-center gap-3">
              <span
                className={`text-gray-500 font-light text-right flex-shrink-0 transition-all duration-500 ease-in-out ${
                  isOptimalRatio ? 'text-sm w-12' : 'text-sm w-10'
                }`}
              >
                {formatTime(currentTime)}
              </span>
              <div
                ref={progressBarRef}
                className={`flex-1 bg-gray-200 rounded-full h-2 relative select-none min-w-0 ${
                  !isInteractionDisabled ? 'cursor-pointer' : 'cursor-default'
                }`}
                onMouseDown={
                  !isInteractionDisabled ? handleProgressMouseDown : undefined
                }
              >
                <div
                  className="bg-[#fd5163] h-full rounded-full transition-all duration-100 ease-out pointer-events-none"
                  style={{ width: `${progress}%` }}
                ></div>
                <div
                  className="absolute w-4 h-4 bg-[#fd5163] rounded-full -top-1 shadow-md pointer-events-none select-none"
                  style={{ left: `calc(${progress}% - 8px)` }}
                ></div>
              </div>
              <span
                className={`text-gray-500 font-light flex-shrink-0 transition-all duration-500 ease-in-out ${
                  isOptimalRatio ? 'text-sm w-12' : 'text-sm w-10'
                }`}
              >
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* 플레이어 컨트롤 */}
          <div
            className={`flex items-center gap-6 transition-all duration-500 ease-in-out ${
              isOptimalRatio ? 'justify-center' : 'justify-start'
            }`}
          >
            <button
              onClick={handleSkipBackward}
              disabled={isInteractionDisabled}
              title="10초 뒤로"
              className={`text-gray-600 rotate-180 hover:text-gray-900 transition-colors ${
                isInteractionDisabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'opacity-100'
              }`}
            >
              <FastForwardIcon
                size={isOptimalRatio ? 24 : 22}
                className="transition-all duration-500"
              />
            </button>

            <button
              className={`p-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative text-gray-600 ${
                isInteractionDisabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'opacity-100'
              }`}
              onClick={handlePlayPause}
              disabled={isInteractionDisabled}
              title={
                iconType === 'loading'
                  ? 'Loading...'
                  : iconType === 'pause'
                    ? 'Pause'
                    : 'Play'
              }
            >
              {renderPlayPauseIcon()}
            </button>

            <button
              onClick={handleSkipForward}
              disabled={isInteractionDisabled}
              title="10초 앞으로"
              className={`text-gray-600 hover:text-gray-900 transition-colors ${
                isInteractionDisabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'opacity-100'
              }`}
            >
              <FastForwardIcon
                size={isOptimalRatio ? 24 : 22}
                className="transition-all duration-500"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
