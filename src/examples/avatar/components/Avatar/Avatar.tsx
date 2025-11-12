import React, { useState, useEffect, useRef } from 'react'
import {
  ConversationManager,
  ConversationConfig,
  ConversationState,
  WordHighlightEvent,
  SubtitleChangeEvent,
  ImageChangeEvent,
  ConversationError,
} from 'ug-js-sdk'
import { AvatarAssets } from './AnimatedSpineCharacter'
import AnimatedSpineCharacter, { AnimatedSpineCharacterHandle } from './AnimatedSpineCharacter'
import { ImageFrame } from './ImageFrame'
import { PlayButton } from '../../../components/PlayButton/PlayButton'
import { SubtitlesDisplay } from './SubtitlesDisplay'
import { ChatInputBox } from './ChatInputBox'
import { useToast } from '../../../../components/Toast/ToastProvider'
import { ScreenWakeLock } from '../../../../utils/screenWakeLock'
import { useIsMobile } from '../../../../hooks/useIsMobile'
import { MicIcon } from '../../../components/icons/MicIcon'
import { MicOffIcon } from '../../../components/icons/MicOffIcon'
import { ExtendedApiConfigData } from 'src/types'

interface AnyUtility {
  enabled: boolean
  [key: string]: any
}

function getActiveUtilities(utilities?: { [key: string]: AnyUtility } | null): string[] {
  if (!utilities) {
    return []
  }

  return Object.entries(utilities)
    .filter(([, utility]) => utility.enabled)
    .map(([name]) => name)
}

interface AvatarProps {
  config: ExtendedApiConfigData
  avatarAssets: AvatarAssets
  imageFrame?: string
  isEnabledSubtitles?: boolean
  onPlay?: () => void
  initialIsTextOnly?: boolean
}

export const Avatar: React.FC<AvatarProps> = ({
  config,
  avatarAssets,
  imageFrame,
  isEnabledSubtitles,
  onPlay,
  initialIsTextOnly,
}) => {
  const [state, setState] = useState<ConversationState>()
  const [subtitles, setSubtitles] = useState<any>(null)
  const [hasExperienceStarted, setHasExperienceStarted] = useState(false)
  const [isTextOnly, setIsTextOnly] = useState(initialIsTextOnly || false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [textInput, setTextInput] = useState('')
  const [isNetworkReady, setIsNetworkReady] = useState(false)
  const conversationManagerRef = useRef<ConversationManager | null>(null)
  const animatedCharacterRef = useRef<AnimatedSpineCharacterHandle>(null)
  const chatInputRef = useRef<HTMLTextAreaElement>(null)
  const screenWakeLockRef = useRef(new ScreenWakeLock())
  const { addToast } = useToast()
  const isMobile = useIsMobile()

  const isPaused = state === 'uninitialized' || state === 'idle'
  const isAudioPlaying = state === 'playing'
  const isUserSpeaking = state === 'userSpeaking'
  const isPlaybackPaused = state === 'paused'

  const handlePlayButtonClick = async () => {
    if (!hasExperienceStarted) {
      onPlay?.()
      screenWakeLockRef.current?.request()
      if (imageFrame === 'fullscreen') {
        setIsTransitioning(true)
        setTimeout(async () => {
          setHasExperienceStarted(true)
          setIsTransitioning(false)
          await conversationManagerRef.current?.initialize()
          if (isTextOnly) {
            chatInputRef.current?.focus()
          }
        }, 500)
      } else {
        setHasExperienceStarted(true)
        await conversationManagerRef.current?.initialize()
        if (isTextOnly) {
          chatInputRef.current?.focus()
        }
      }
      return
    }

    if (isAudioPlaying) {
      conversationManagerRef.current?.pause()
      screenWakeLockRef.current?.release()
    } else if (isPlaybackPaused) {
      conversationManagerRef.current?.resume()
      screenWakeLockRef.current?.request()
    } else if (isUserSpeaking) {
      conversationManagerRef.current?.forceInputComplete()
    }
  }

  const handleSendText = async () => {
    if (textInput.trim()) {
      const text = textInput
      setTextInput('')
      const activeUtilities = getActiveUtilities(config.utilities)
      await conversationManagerRef.current?.interact({
        uid: '',
        kind: 'interact',
        type: 'stream',
        text: text,
        on_output: activeUtilities,
      })
    }
  }

  const handleToggleTextOnly = async () => {
    const newIsTextOnly = !isTextOnly
    setIsTextOnly(newIsTextOnly)
    await conversationManagerRef.current?.toggleTextOnlyInput(newIsTextOnly)
    addToast(
      newIsTextOnly ? 'Text-only mode activated 💬' : 'Microphone mode activated 🎙️',
      'success'
    )
  }

  useEffect(() => {
    const convConfig: ConversationConfig = {
      apiUrl: config.apiUrl,
      apiKey: config.apiKey,
      federatedId: config.federatedId,
      prompt: config.prompt,
      context: config.context,
      utilities: config.utilities,
      voiceProfile: config.voiceProfile,
      safetyPolicy: config.safety_policy || undefined,
      imageFrame,
      inputCapabilities: {
        audio: !isTextOnly,
        text: isTextOnly,
      },
      hooks: {
        onStateChange: (state: ConversationState) => {
          setState(state)
        },
        onNetworkStatusChange: (isReady: boolean) => {
          setIsNetworkReady(isReady)
        },
        onSubtitleHighlight: (event: WordHighlightEvent) => {
          setSubtitles(event)
        },
        onSubtitleChange: (event: SubtitleChangeEvent) => {
          if (event.currentLine || event.nextLine) {
            setSubtitles({
              globalWordIndex: -1,
              currentLineIndex: 0,
              wordIndexInLine: -1,
              currentLineData: event.currentLine,
              nextLineData: event.nextLine,
            })
          } else {
            setSubtitles(null)
          }
        },
        onImageChange: (event: ImageChangeEvent) => {
          const imageData = `data:${event.format};base64,${event.image}`
          setCurrentImage(imageData)
        },
        onError: (error: ConversationError) => {
          addToast(typeof error === 'string' ? error : error?.message || 'Unknown error', 'error')
        },
        onAvatarAnimationChanged: ({
          name,
          layer,
          loop,
        }: {
          name: string
          layer: number
          loop: boolean
        }) => {
          animatedCharacterRef.current?.setAnimation(layer, name, loop)
        },
      },
    }
    conversationManagerRef.current = new ConversationManager(convConfig)

    return () => {
      // conversationManagerRef.current?.destroy();
    }
  }, [config, imageFrame, addToast])

  return (
    <div className="flex flex-col flex-grow w-full relative">
      <div className="absolute top-10 left-4 z-[60] flex gap-2">
        <button
          onClick={handleToggleTextOnly}
          className="p-2 bg-gray-800 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={state === 'initializing'}
        >
          {isTextOnly ? <MicOffIcon width={24} height={24} /> : <MicIcon width={24} height={24} />}
        </button>
      </div>
      <div
        className="relative w-full flex-grow"
        style={{
          zIndex: 50,
        }}
      >
        <AnimatedSpineCharacter
          ref={animatedCharacterRef}
          avatarAssets={avatarAssets}
          applyFilter={!hasExperienceStarted}
          zIndex={imageFrame === 'fullscreen' ? 51 : undefined}
          isDraggable={imageFrame === 'fullscreen'}
          height={
            imageFrame === 'fullscreen'
              ? isMobile
                ? hasExperienceStarted
                  ? '30vh'
                  : '65vh'
                : '53%'
              : '59vh'
          }
          width={
            imageFrame === 'fullscreen'
              ? isMobile
                ? hasExperienceStarted
                  ? '40vw'
                  : '65vw'
                : '44vw'
              : '100%'
          }
          className={`transition-opacity duration-500 ease-in-out ${
            imageFrame === 'fullscreen'
              ? isTransitioning
                ? 'opacity-0 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                : hasExperienceStarted
                  ? 'opacity-100 fixed bottom-4 left-0'
                  : 'opacity-100 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
              : 'absolute'
          }`}
        />
        {imageFrame && <ImageFrame currentImage={currentImage} mode={imageFrame} />}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-150 ${
            !hasExperienceStarted ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{
            display: hasExperienceStarted ? 'none' : 'flex',
            zIndex: 60,
          }}
        >
          <PlayButton
            isAudioPlaying={isAudioPlaying}
            isUserSpeaking={isUserSpeaking}
            onClick={handlePlayButtonClick}
            showTapToPlay={true}
            hasExperienceStarted={hasExperienceStarted}
            isPlaybackPaused={isPlaybackPaused}
            disabled={!isTextOnly && isAudioPlaying}
          />
        </div>
      </div>
      <div
        className={`relative w-full flex flex-col items-center justify-end px-4 z-[60] pb-4 ${
          isMobile ? 'fixed bottom-0 left-0 right-0' : ''
        }`}
      >
        {/* {config.isEnabledSubtitles && (
          <div className="w-full max-w-lg">
            <SubtitlesDisplay subtitles={subtitles} isPaused={isPlaybackPaused} />
          </div>
        )} */}
        {isTextOnly ? (
          <div className="w-full max-w-lg mt-4">
            <ChatInputBox
              ref={chatInputRef}
              textInput={textInput}
              setTextInput={setTextInput}
              onSend={handleSendText}
              isEnabled={!isAudioPlaying && isNetworkReady}
              isAudioPlaying={isAudioPlaying}
              isPlaybackPaused={isPlaybackPaused}
              onPause={() => conversationManagerRef.current?.pause()}
              onResume={() => conversationManagerRef.current?.resume()}
            />
          </div>
        ) : (
          <div
            className={`flex flex-col items-center transition-all duration-150 mt-4 ${
              hasExperienceStarted ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{
              zIndex: 10,
            }}
          >
            <PlayButton
              isAudioPlaying={isAudioPlaying}
              isUserSpeaking={isUserSpeaking}
              onClick={handlePlayButtonClick}
              showTapToPlay={false}
              hasExperienceStarted={hasExperienceStarted}
              isPlaybackPaused={isPlaybackPaused}
              className="w-20 h-20"
              disabled={!isTextOnly && isAudioPlaying}
            />
          </div>
        )}
      </div>
      {/* {!config.isEnabledSubtitles && !isTextOnly && <div className="h-6" />} */}
      {isMobile && <div className="h-8" />}
    </div>
  )
}
