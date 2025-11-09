'use client'

import React, { CSSProperties } from 'react'
import { useIsMobile } from '../../../../hooks/useIsMobile'
import { WordHighlightEvent } from 'ug-js-sdk'

const HIGHLIGHTED_WORD_STYLES: CSSProperties = {
  background: '#e8f5e9',
  borderRadius: '3px',
  color: '#2e7d32',
  whiteSpace: 'nowrap', // Prevent breaking inside the highlighted word
  display: 'inline-block', // Ensure the whole word stays together
  wordBreak: 'keep-all', // Prevent breaking inside the word
  overflowWrap: 'normal', // Prevent breaking inside the word
  textOverflow: 'ellipsis', // Show ellipsis if too long
  overflow: 'hidden', // Hide overflow
}

const CONTAINER_STYLES: CSSProperties = {
  marginTop: '1rem',
  padding: '1rem',
  border: '2px solid #e0e0e0',
  borderRadius: '12px',
  backgroundColor: '#f8f9fa',
  minHeight: '80px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  fontSize: '1.3rem',
  color: '#333',
  letterSpacing: 'normal',
  transition: 'opacity 0.2s ease-in-out',
  textAlign: 'center',
  lineHeight: '1.4',
  wordWrap: 'break-word',
  overflowWrap: 'break-word',
  maxWidth: '100%',
  width: '500px',
  gap: '0.5rem',
}

const SUBTITLE_LINE_STYLES: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '1.4em',
}

interface Props {
  subtitles?: WordHighlightEvent
  isPaused: boolean
}

const SubtitleLine: React.FC<{
  lineData: { characters: string[]; wordBoundaries: Array<{ start: number; end: number }> } | null
  lineIndex: number
  currentLineIndex: number
  wordIndexInLine: number
  isPaused: boolean
}> = ({ lineData, lineIndex, currentLineIndex, wordIndexInLine, isPaused }) => {
  if (!lineData) {
    return <div style={SUBTITLE_LINE_STYLES} />
  }

  const { characters, wordBoundaries } = lineData

  const BASE_WORD_STYLE: CSSProperties = {
    display: 'inline-block',
    padding: '0',
    fontWeight: 'normal',
  }

  const CURRENT_HIGHLIGHTED_STYLE: CSSProperties = {
    ...BASE_WORD_STYLE,
    ...HIGHLIGHTED_WORD_STYLES,
    fontWeight: 'bold',
  }

  return (
    <div style={SUBTITLE_LINE_STYLES}>
      {wordBoundaries.map(({ start, end }, idx) => {
        const word = characters.slice(start, end + 1).join('')
        const shouldHighlight =
          !isPaused && currentLineIndex === lineIndex && idx === wordIndexInLine

        const style = shouldHighlight ? CURRENT_HIGHLIGHTED_STYLE : BASE_WORD_STYLE

        return (
          <React.Fragment key={idx}>
            <span style={style}>{word}</span>
            {idx < wordBoundaries.length - 1 && <span>&nbsp;</span>}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export const SubtitlesDisplay: React.FC<Props> = ({ subtitles, isPaused }) => {
  const isMobile = useIsMobile()
  const { currentLineIndex, wordIndexInLine, currentLineData, nextLineData } = subtitles || {}

  const containerStyles: CSSProperties = {
    ...CONTAINER_STYLES,
    marginTop: isMobile ? '0.75rem' : '1rem',
    marginLeft: isMobile ? '0.125rem' : '0',
    marginRight: isMobile ? '0.125rem' : '0',
    padding: isMobile ? '1rem' : '1.5rem',
    border: '1px solid #e0e0e0',
    borderRadius: isMobile ? '8px' : '12px',
    minHeight: isMobile ? '100px' : '120px',
    maxHeight: isMobile ? '140px' : '160px',
    fontSize: isMobile ? '1.15rem' : '1.3rem',
    textAlign: isMobile ? 'left' : 'center',
    maxWidth: isMobile ? '100%' : '50ch',
  }

  return (
    <div style={containerStyles}>
      <SubtitleLine
        lineData={currentLineData || null}
        lineIndex={0}
        currentLineIndex={currentLineIndex ?? -1}
        wordIndexInLine={wordIndexInLine ?? -1}
        isPaused={isPaused}
      />
      <SubtitleLine
        lineData={nextLineData || null}
        lineIndex={1}
        currentLineIndex={currentLineIndex ?? -1}
        wordIndexInLine={wordIndexInLine ?? -1}
        isPaused={isPaused}
      />
    </div>
  )
}
