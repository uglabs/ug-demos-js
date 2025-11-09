import React from 'react'
import { SendIcon } from '../../../components/icons/SendIcon'
import { PlayButton } from '../../../components/PlayButton/PlayButton'

interface ChatInputBoxProps {
  textInput: string
  setTextInput: (value: string) => void
  onSend: () => void
  isEnabled: boolean
  isAudioPlaying: boolean
  isPlaybackPaused: boolean
  onPause: () => void
  onResume: () => void
}

export const ChatInputBox = React.forwardRef<HTMLTextAreaElement, ChatInputBoxProps>(
  (
    {
      textInput,
      setTextInput,
      onSend,
      isEnabled,
      isAudioPlaying,
      isPlaybackPaused,
      onPause,
      onResume,
    },
    ref
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && isEnabled) {
        e.preventDefault()

        onSend()
      }
    }

    const rows = Math.min(3, (textInput.match(/\n/g) || []).length + 1)

    const renderButton = () => {
      if (isAudioPlaying || isPlaybackPaused) {
        return (
          <PlayButton
            isAudioPlaying={isAudioPlaying}
            isUserSpeaking={false}
            onClick={isPlaybackPaused ? onResume : onPause}
            isPlaybackPaused={isPlaybackPaused}
            className="w-10 h-10"
          />
        )
      }
      return (
        <button
          onClick={onSend}
          disabled={!isEnabled || !textInput?.trim()}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon width={24} height={24} />
        </button>
      )
    }

    return (
      <div className="flex items-center gap-2 mt-4 max-w-[530px] mx-auto sm:px-4">
        <textarea
          ref={ref}
          name={'user-input'}
          value={textInput}
          onChange={(e: any) => setTextInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={'Type your message...'}
          className="flex-1 border px-2 py-1 border-gray-500 rounded resize-none"
          rows={rows}
        />
        {renderButton()}
      </div>
    )
  }
)
