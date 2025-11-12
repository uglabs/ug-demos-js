import React from 'react'
import './pulse-animation.css'

interface PlayButtonProps {
  isAudioPlaying: boolean
  isUserSpeaking: boolean
  onClick: () => void
  showTapToPlay?: boolean
  hasExperienceStarted?: boolean
  isPlaybackPaused: boolean
  className?: string
  disabled?: boolean
}

export const PlayButton: React.FC<PlayButtonProps> = ({
  isUserSpeaking,
  isAudioPlaying,
  onClick,
  showTapToPlay = false,
  hasExperienceStarted = false,
  isPlaybackPaused,
  className = 'w-24 h-24',
  disabled = false,
}) => {
  // Generate unique ID for this component instance to avoid SVG gradient conflicts
  const uniqueId = React.useMemo(() => Math.random().toString(36).substr(2, 9), [])
  const handleClick = () => {
    if (disabled) return;
    onClick()
  }

  const renderIcon = () => {
    if (isPlaybackPaused) {
      return <path d="M8 5v14l11-7z" fill={`url(#buttonGradient-${uniqueId})`} /> // Play icon
    }
    if (isAudioPlaying) {
      return <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill={`url(#buttonGradient-${uniqueId})`} /> // Pause icon
    }
    // Default play icon
    return <path d="M8 5v14l11-7z" fill={`url(#buttonGradient-${uniqueId})`} />
  }

  return (
    <div
      className={`relative z-30 flex flex-col items-center ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      }`}
      onClick={handleClick}
    >
      {/* Pulsating circles - Only show when playing */}
      {isAudioPlaying && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 rounded-full mic-gradient-bg pulse-circle-1"></div>
          <div className="absolute inset-0 rounded-full mic-gradient-bg pulse-circle-2"></div>
        </div>
      )}
      {isUserSpeaking && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 rounded-full user-speaking-gradient speaking-pulse"></div>
          <div className="absolute inset-0 rounded-full user-speaking-gradient speaking-pulse-2"></div>
        </div>
      )}

      {/* White circle with play/pause icon */}
      <div
        className={`rounded-full bg-white flex items-center justify-center shadow-lg relative z-10 transition-all duration-300 ${
          hasExperienceStarted
            ? 'hover:shadow-2xl hover:scale-105 group'
            : 'hover:shadow-2xl hover:scale-105 group'
        } ${className}`}
      >
        <div className="w-1/2 h-1/2 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={'w-full h-full'}>
            <defs>
              <linearGradient id={`buttonGradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#94d7d7" />
                <stop offset="100%" stopColor="#987fdd" />
              </linearGradient>
            </defs>
            {renderIcon()}
          </svg>
        </div>
        {/* Glow effect on hover */}
        <div
          className={`absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 pointer-events-none ${
            hasExperienceStarted ? 'group-hover:opacity-100' : 'group-hover:opacity-100'
          }`}
          style={{
            background:
              'linear-gradient(135deg, rgba(219, 253, 109, 0.3) 0%, rgba(197, 253, 117, 0.3) 5%, rgba(160, 236, 153, 0.3) 15%, rgba(125, 228, 182, 0.3) 25%, rgba(94, 220, 210, 0.3) 35%, rgba(148, 215, 215, 0.3) 45%, rgba(148, 215, 215, 0.3) 60%, rgba(152, 127, 221, 0.3) 75%, rgba(225, 89, 133, 0.3) 90%)',
            filter: 'blur(8px)',
            transform: 'scale(1.2)',
          }}
        />
      </div>

      {showTapToPlay && (
        <div className={`mt-5 relative flex justify-center ${hasExperienceStarted ? '' : 'group'}`}>
          <div
            className={`relative inline-block px-5 py-3 text-lg font-medium text-white bg-black/70 rounded-full backdrop-blur-sm transition-all duration-300 z-10 ${
              hasExperienceStarted ? '' : 'hover:bg-black/80'
            }`}
            style={{ width: 'auto', minWidth: 0 }}
          >
            Tap to play
            {/* Glow effect on hover for text badge */}
            <span
              className={`absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 pointer-events-none ${
                hasExperienceStarted ? '' : 'group-hover:opacity-100'
              }`}
              style={{
                background:
                  'linear-gradient(135deg, rgba(219, 253, 109, 0.4) 0%, rgba(197, 253, 117, 0.4) 5%, rgba(160, 236, 153, 0.4) 15%, rgba(125, 228, 182, 0.4) 25%, rgba(94, 220, 210, 0.4) 35%, rgba(148, 215, 215, 0.4) 45%, rgba(148, 215, 215, 0.4) 60%, rgba(152, 127, 221, 0.4) 75%, rgba(225, 89, 133, 0.4) 90%)',
                filter: 'blur(6px)',
                transform: 'scale(1.1)',
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
