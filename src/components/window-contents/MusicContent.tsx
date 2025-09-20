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
        }
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

export const MusicContent: React.FC<MusicContentProps> = ({
  currentTrack,
  isLoadingTrack,
  setIsPlaying,
}) => {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
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

  // 비율이 1:2인지 확인 (약간의 허용 오차 포함)
  const isOptimalRatio = useMemo(() => {
    if (windowDimensions.width === 0 || windowDimensions.height === 0)
      return true;
    const aspectRatio = windowDimensions.width / windowDimensions.height;
    const targetRatio = 1 / 2; // 0.5
    const tolerance = 0.15; // 15% 허용 오차
    return Math.abs(aspectRatio - targetRatio) <= tolerance;
  }, [windowDimensions]);

  // YouTube API 초기화
  useEffect(() => {
    if (window.YT?.Player) {
      setApiReady(true);
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

    // 기존 플레이어 재사용 시도
    if (playerRef.current) {
      try {
        playerRef.current.cueVideoById(currentTrack.id);
        setIsPlayerLoading(false);
        return;
      } catch (error) {
        console.log(error);

        try {
          playerRef.current.destroy();
        } catch (destroyError) {
          console.log(destroyError);
        }
        playerRef.current = null;
        setPlayerReady(false);
      }
    }

    const onReady = (event: YouTubePlayerEvent): void => {
      console.log('YouTube player ready');
      setPlayerReady(true);
      setIsPlayerLoading(false);
      setIsBuffering(false);

      const totalDuration = event.target.getDuration();
      setDuration(totalDuration);

      try {
        const initialState = event.target.getPlayerState?.();
        console.log('Initial player state:', initialState);
        const initiallyPlaying = initialState === YouTubePlayerState.PLAYING;
        console.log('Setting initial playing state:', initiallyPlaying);
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
      console.log(error);
      setIsPlayerLoading(false);
    }

    return () => {
      stopTimeUpdate();
    };
  }, [apiReady, currentTrack]);

  // 컴포넌트 언마운트시 플레이어 정리
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.log(error);
        }
        playerRef.current = null;
      }
      setPlayerReady(false);
    };
  }, []);

  const startTimeUpdate = useCallback((): void => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      if (playerRef.current && !isDraggingProgress) {
        try {
          const current = playerRef.current.getCurrentTime();
          const total = playerRef.current.getDuration();
          setCurrentTime(current);
          if (total !== duration && total > 0) {
            setDuration(total);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }, 200);
  }, [isDraggingProgress, duration]);

  const stopTimeUpdate = useCallback((): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
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
      setIconType('play'); // 🔥 일시정지하면 재생 아이콘
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
      setIconType('pause'); // 🔥 재생하면 일시정지 아이콘
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
      console.log(error);
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
      console.log(error);
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
          console.log(error);
        }
        setIsDraggingProgress(false);

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [duration, playerReady]
  );

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isLoading =
    isLoadingTrack || !apiReady || isPlayerLoading || isBuffering;
  const isInteractionDisabled = !playerReady || isLoading;

  // 🔥 간단한 아이콘 렌더링 함수
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
    if (isLoadingTrack) return 'Loading track...';
    if (!apiReady) return 'Loading player...';
    if (isPlayerLoading) return 'Initializing...';
    if (isBuffering) return 'Buffering...';
    return '';
  };

  return (
    <div
      ref={windowRef}
      className="h-full bg-white/95 backdrop-blur-xl relative"
    >
      <div className="hidden">
        <div ref={containerRef}></div>
      </div>

      {/* 최적 비율일 때의 레이아웃 */}
      {isOptimalRatio ? (
        <div className="flex flex-col items-center mx-auto h-full">
          <div className="relative w-full flex-1">
            <img
              src={currentTrack?.thumbnail}
              alt={currentTrack?.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://img.youtube.com/vi/${currentTrack?.id}/hqdefault.jpg`;
              }}
            />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/100 to-transparent pointer-events-none" />

            {/* 로딩 오버레이 */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-sm font-light">{getLoadingMessage()}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center w-full py-6">
            <div className="text-center space-y-2 w-full p-4">
              <h3 className="text-lg md:text-xl font-light text-gray-900 leading-tight break-words">
                {currentTrack?.title}
              </h3>
              <p className="text-base md:text-lg text-gray-600 font-light">
                {currentTrack?.artist}
              </p>
            </div>

            {/* 진행률 바 */}
            <div className="w-full space-y-3 px-4">
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-500 font-light w-10 text-right">
                  {formatTime(currentTime)}
                </span>
                <div
                  ref={progressBarRef}
                  className={`flex-1 bg-gray-200 rounded-full h-1 relative select-none ${
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
                    className="absolute w-4 h-4 bg-[#fd5163] rounded-full -top-1.5 shadow-sm pointer-events-none select-none"
                    style={{ left: `calc(${progress}% - 8px)` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 font-light w-10">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* 플레이어 컨트롤 */}
            <div className="flex items-center justify-center py-4 space-x-4">
              <button
                onClick={handleSkipBackward}
                disabled={isInteractionDisabled}
                title="Skip Backward 10s"
                className={`text-gray-500 rotate-180 ${
                  isInteractionDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'opacity-100'
                }`}
              >
                <FastForwardIcon />
              </button>

              {/* 재생/일시정지 버튼 */}
              <button
                className={`p-4 relative text-gray-500 ${
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
                title="Skip Forward 10s"
                className={`transition-opacity text-gray-500 ${
                  isInteractionDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'opacity-100'
                }`}
              >
                <FastForwardIcon />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 비최적 비율일 때의 레이아웃 - 블러 배경과 중앙 배치 */
        <div className="h-full relative flex items-center justify-center">
          {/* 블러 배경 이미지 - 전체 화면 꽉 채움 */}
          <img
            src={currentTrack?.thumbnail}
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-125"
            style={{
              filter: 'blur(3px) brightness(0.8)',
              transform: 'scale(1.1)',
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://img.youtube.com/vi/${currentTrack?.id}/hqdefault.jpg`;
            }}
          />

          {/* 로딩 오버레이 */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="text-center text-gray-800">
                <div className="w-12 h-12 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-lg font-light">{getLoadingMessage()}</p>
              </div>
            </div>
          )}

          {/* 중앙 콘텐츠 - 모든 내용물 중앙 배치 */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md mx-auto p-8">
            {/* 트랙 정보 */}
            <div className="text-center space-y-3 mb-8">
              <h3 className="text-2xl font-light text-white leading-tight break-words px-4 drop-shadow-sm">
                {currentTrack?.title}
              </h3>
              <p className="text-xl text-white font-light drop-shadow-sm">
                {currentTrack?.artist}
              </p>
            </div>

            {/* 진행률 바 */}
            <div className="w-full space-y-4 mb-8 px-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-white font-light w-12 text-right">
                  {formatTime(currentTime)}
                </span>
                <div
                  ref={progressBarRef}
                  className={`flex-1 bg-white/60 rounded-full h-3 relative select-none ${
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
                    className="absolute w-5 h-5 bg-[#fd5163] rounded-full -top-1 shadow-lg pointer-events-none select-none"
                    style={{ left: `calc(${progress}% - 10px)` }}
                  ></div>
                </div>
                <span className="text-sm text-white font-light w-12">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* 플레이어 컨트롤 */}
            <div className="flex items-center justify-center space-x-8">
              {/* 10초 뒤로 */}
              <button
                onClick={handleSkipBackward}
                disabled={isInteractionDisabled}
                title="10초 뒤로"
                className={`text-white rotate-180 ${
                  isInteractionDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'opacity-100'
                }`}
              >
                <FastForwardIcon />
              </button>

              {/* 재생/일시정지 버튼 */}
              <button
                className={`relative text-white ${
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

              {/* 10초 앞으로 */}
              <button
                onClick={handleSkipForward}
                disabled={isInteractionDisabled}
                title="10초 앞으로"
                className={`text-white ${
                  isInteractionDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'opacity-100'
                }`}
              >
                <FastForwardIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
