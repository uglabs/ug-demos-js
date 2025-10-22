import React from 'react'

interface ImageFrameProps {
  currentImage: string | null
  mode?: string
}

export const ImageFrame: React.FC<ImageFrameProps> = ({ currentImage, mode }) => {
  if (!currentImage) return null

  if (mode === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-[-1] select-none">
        <img
          src={currentImage}
          alt="Background"
          className="w-full h-full object-cover"
          draggable="false"
        />
      </div>
    )
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    const target = e.currentTarget as HTMLDivElement
    const startX = e.clientX
    const startY = e.clientY
    const startRight = parseInt(target.style.right)
    const startTop = parseInt(target.style.top)

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = startX - moveEvent.clientX
      const deltaY = moveEvent.clientY - startY // Inverted Y delta

      // Calculate new position
      let newRight = startRight + deltaX
      let newTop = startTop + deltaY

      // Get frame dimensions
      const frameWidth = parseInt(target.style.width)
      const frameHeight = parseInt(target.style.height)

      // Set boundaries (allow 20% of frame to go off screen)
      const maxRight = window.innerWidth + frameWidth * 0.2
      const minRight = -frameWidth * 0.2
      const maxTop = window.innerHeight + frameHeight * 0.2
      const minTop = -frameHeight * 0.2

      // Clamp values within boundaries
      newRight = Math.min(Math.max(newRight, minRight), maxRight)
      newTop = Math.min(Math.max(newTop, minTop), maxTop)

      target.style.right = `${newRight}px`
      target.style.top = `${newTop}px`
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleResize = (e: React.MouseEvent, direction: string) => {
    e.preventDefault()
    e.stopPropagation()

    const target = e.currentTarget.parentElement as HTMLDivElement
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = parseInt(target.style.width)
    const startHeight = parseInt(target.style.height)
    const startRight = parseInt(target.style.right)
    const startTop = parseInt(target.style.top)

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY

      // Set minimum size
      const minSize = 100 // minimum width/height in pixels
      const maxSize = Math.max(window.innerWidth, window.innerHeight) // maximum size

      if (direction.includes('right')) {
        const newWidth = Math.min(Math.max(startWidth + deltaX, minSize), maxSize)
        const newRight = startRight - (newWidth - startWidth)
        if (newRight >= -newWidth * 0.2 && newRight <= window.innerWidth + newWidth * 0.2) {
          target.style.width = `${newWidth}px`
        }
      }
      if (direction.includes('left')) {
        const newWidth = Math.min(Math.max(startWidth - deltaX, minSize), maxSize)
        const newRight = startRight + (startWidth - newWidth)
        if (newRight >= -newWidth * 0.2 && newRight <= window.innerWidth + newWidth * 0.2) {
          target.style.width = `${newWidth}px`
        }
      }
      if (direction.includes('bottom')) {
        const newHeight = Math.min(Math.max(startHeight + deltaY, minSize), maxSize)
        const newTop = startTop - (newHeight - startHeight)
        if (newTop >= -newHeight * 0.2 && newTop <= window.innerHeight + newHeight * 0.2) {
          target.style.height = `${newHeight}px`
        }
      }
      if (direction.includes('top')) {
        const newHeight = Math.min(Math.max(startHeight - deltaY, minSize), maxSize)
        const newTop = startTop + (startHeight - newHeight)
        if (newTop >= -newHeight * 0.2 && newTop <= window.innerHeight + newHeight * 0.2) {
          target.style.height = `${newHeight}px`
        }
      }
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault()
    const target = e.currentTarget as HTMLDivElement
    localStorage.setItem('imageFrameWidth', target.style.width)
    localStorage.setItem('imageFrameHeight', target.style.height)
    localStorage.setItem('imageFrameRight', target.style.right)
    localStorage.setItem('imageFrameTop', target.style.top)
  }

  return (
    <div
      className="image-frame-container absolute bg-white rounded-lg shadow-lg p-2 cursor-move"
      style={{
        width: localStorage.getItem('imageFrameWidth') || '256px',
        height: localStorage.getItem('imageFrameHeight') || '256px',
        overflow: 'hidden',
        position: 'absolute',
        right: localStorage.getItem('imageFrameRight') || '16px',
        top: localStorage.getItem('imageFrameTop') || '16px',
        zIndex: 5,
        isolation: 'isolate',
      }}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
    >
      <div
        className="resize-handle resize-handle-top absolute top-0 left-0 right-0 h-2 cursor-ns-resize"
        onMouseDown={(e) => handleResize(e, 'top')}
      ></div>
      <div
        className="resize-handle resize-handle-right absolute top-0 right-0 bottom-0 w-2 cursor-ew-resize"
        onMouseDown={(e) => handleResize(e, 'right')}
      ></div>
      <div
        className="resize-handle resize-handle-bottom absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize"
        onMouseDown={(e) => handleResize(e, 'bottom')}
      ></div>
      <div
        className="resize-handle resize-handle-left absolute top-0 left-0 bottom-0 w-2 cursor-ew-resize"
        onMouseDown={(e) => handleResize(e, 'left')}
      ></div>
      <img
        src={currentImage}
        alt="Gen Visual"
        className="w-full h-full object-contain rounded cursor-move select-none"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        draggable="false"
      />
    </div>
  )
}
