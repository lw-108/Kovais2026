"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, SkipBack, SkipForward } from 'lucide-react';

interface LuxuryVideoProps {
  videoSrc: string;
  posterSrc: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  showControls?: boolean;
  aspectRatio?: '16/9' | '9/16' | '4/3' | '1/1';
}

export default function LuxuryVideo({
  videoSrc,
  posterSrc,
  title = "Luxury Experience",
  className = "",
  autoPlay = false,
  muted = false,
  loop = false,
  showControls = true,
  aspectRatio = '16/9'
}: LuxuryVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ x: 50, y: 50 });

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateVolume = () => {
      setVolume(video.volume);
    };

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
    };

    video.addEventListener('volumechange', updateVolume);
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateTime);

    return () => {
      video.removeEventListener('volumechange', updateVolume);
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateTime);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const newZoom = direction === 'in' 
      ? Math.min(zoomLevel + 0.25, 3)
      : Math.max(zoomLevel - 0.25, 1);
    setZoomLevel(newZoom);
  };

  const handleMaskDrag = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMaskPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

   const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMaskDrag(e);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      videoRef.current.currentTime = (percentage / 100) * (videoRef.current.duration || 0);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case '16/9': return 'aspect-video';
      case '9/16': return 'aspect-video-9/16';
      case '4/3': return 'aspect-video-4/3';
      default: return 'aspect-video';
    }
  };

  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        title={title}
        className={`w-full h-full object-contain transition-transform duration-300`}
        style={{ 
          transform: `scale(${zoomLevel})`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        autoPlay={autoPlay}
        muted={isMuted}
        loop={loop}
        playsInline
        onClick={togglePlay}
      />
      
      {/* Draggable Mask Overlay */}
      <div 
        ref={containerRef}
        className={`absolute inset-0 pointer-events-none ${getAspectClass()}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute border-2 border-white/30 rounded-full pointer-events-auto transition-all duration-200"
          style={{
            left: `${maskPosition.x}%`,
            top: `${maskPosition.y}%`,
            width: '80px',
            height: '80px',
            transform: 'translate(-50%, -50%)',
            backdropFilter: 'blur(1px)',
            boxShadow: '0 0 20px rgba(0,0,0,0.3)'
          }}
        />
      </div>

      {/* Custom Controls */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="flex items-center justify-center w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full transition-all"
            >
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  <motion.div
                    key="pause"
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    exit={{ rotate: 180, scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Pause className="w-5 h-5 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="play"
                    initial={{ rotate: 180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    exit={{ rotate: -180, scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Play className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Time Display & Seek Bar */}
            <div className="flex-1 flex items-center gap-3">
              <span className="text-white text-xs font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <div 
                className="flex-1 h-1 bg-white/30 rounded-full relative cursor-pointer"
                onClick={handleSeek}
              >
                <div 
                  className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-200"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="flex items-center justify-center w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full transition-all"
              >
                <AnimatePresence mode="wait">
                  {isMuted ? (
                    <motion.div
                      key="unmute"
                      initial={{ rotate: -90, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: 90, scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <VolumeX className="w-4 h-4 text-white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="volume"
                      initial={{ rotate: 90, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: -90, scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Volume2 className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
              />
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleZoom('out')}
                className="flex items-center justify-center w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full transition-all"
              >
                <Minimize2 className="w-4 h-4 text-white" />
              </button>
              <span className="text-white text-xs font-mono px-2">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => handleZoom('in')}
                className="flex items-center justify-center w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full transition-all"
              >
                <Maximize2 className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Skip & Fullscreen */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => { if (videoRef.current) videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10); }}
                className="flex items-center justify-center w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full transition-all"
              >
                <SkipBack className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => { if (videoRef.current) videoRef.current.currentTime = Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + 10); }}
                className="flex items-center justify-center w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full transition-all"
              >
                <SkipForward className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="flex items-center justify-center w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full transition-all"
              >
                <AnimatePresence mode="wait">
                  {isFullscreen ? (
                    <motion.div
                      key="exit-fullscreen"
                      initial={{ rotate: 180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: -180, scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Minimize2 className="w-4 h-4 text-white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="enter-fullscreen"
                      initial={{ rotate: -90, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: 90, scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Maximize2 className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
