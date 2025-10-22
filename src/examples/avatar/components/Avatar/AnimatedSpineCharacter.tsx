'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { SpinePlayer, type SpinePlayerConfig } from '@esotericsoftware/spine-player'
import { Bone, Physics, Vector2 } from '@esotericsoftware/spine-core'

const clickAnimations = ['body_laugh', 'body_waving', 'body_smile', 'body_idle']

export interface AvatarAssets {
  name: string
  atlasUrl: string
  skeletonUrl: string
  premultipliedAlpha?: boolean
}

export type AnimatedSpineCharacterHandle = {
  setAnimation: (trackIndex: number, name: string, loop?: boolean) => void
  addAnimation: (name: string, loop?: boolean, delay?: number) => void
  play: () => void
  pause: () => void
  getAvailableAnimations: () => string[]
  triggerViseme: (visemeName: string) => void
}

interface AnimatedSpineCharacterProps {
  debug?: boolean
  avatarAssets: AvatarAssets
  width?: string
  height?: string
  applyFilter?: boolean
  zIndex?: number
  isDraggable?: boolean
  className?: string
}

/**
 * Uses spine player and loads an animated character on screen.
 * Exposes an interface that allows to setAnimation to set the character animation
 */
const AnimatedSpineCharacter = forwardRef<AnimatedSpineCharacterHandle, AnimatedSpineCharacterProps>(
  (
    {
      debug,
      avatarAssets,
      width = '100%',
      height = '50vh',
      applyFilter = false,
      zIndex,
      isDraggable = false,
      className,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const playerRef = useRef<SpinePlayer | null>(null)
    const mousePosRef = useRef({ x: 0, y: 0 })
    const skeletonOffsetRef = useRef<Vector2 | null>(null)
    const skeletonSizeRef = useRef<Vector2 | null>(null)
    const mouseTrackBone = useRef<Bone | null>(null)
    const currentVisemeRef = useRef<string>('mouth_M') // M is close mouth
    const [availableAnimations, setAvailableAnimations] = useState<string[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
    const dragStartPos = useRef({ x: 0, y: 0 })
    const wasDragged = useRef(false)

    useEffect(() => {
      if (!containerRef.current) return

      const onGlobalMouseMove = (e: MouseEvent) => {
        const canvas = playerRef.current?.canvas
        if (!canvas) return
  
        const rect = canvas.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height
  
        const mappedX = x * 4
        const mappedY = y
  
        mousePosRef.current = { x: mappedX, y: mappedY }

        if (!isDraggable || !isDragging) return

        const deltaX = e.clientX - dragStartPos.current.x
        const deltaY = e.clientY - dragStartPos.current.y

        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
          wasDragged.current = true
        }

        setPosition((prev) => ({
          x: (prev?.x || 0) + deltaX,
          y: (prev?.y || 0) + deltaY,
        }))
        dragStartPos.current = { x: e.clientX, y: e.clientY }
      }

      const onGlobalMouseUp = () => {
        if (!isDraggable) return
        setIsDragging(false)
      }

      window.addEventListener('mousemove', onGlobalMouseMove)
      window.addEventListener('mouseup', onGlobalMouseUp)

      return () => {
        window.removeEventListener('mousemove', onGlobalMouseMove)
        window.removeEventListener('mouseup', onGlobalMouseUp)
      }
    }, [isDraggable, isDragging])

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDraggable) return
      if (containerRef.current?.parentElement) {
        const rect = containerRef.current.getBoundingClientRect()
        const parentRect = containerRef.current.parentElement.getBoundingClientRect()
        setPosition({ x: rect.left - parentRect.left, y: rect.top - parentRect.top })
      }
      setIsDragging(true)
      dragStartPos.current = { x: e.clientX, y: e.clientY }
      wasDragged.current = false
    }

    const onClick = () => {
      if (wasDragged.current) {
        wasDragged.current = false
        return
      }
      const animationState = playerRef.current?.animationState
      if (!animationState) return

      const current = animationState.getCurrent(0)
      const currentIndex = current?.animation?.name
        ? clickAnimations.indexOf(current.animation.name)
        : -1

      let nextIndex = (currentIndex + 1) % clickAnimations.length
      let nextAnimation = clickAnimations[nextIndex]

      while (
        !animationState.data.skeletonData.findAnimation(nextAnimation) &&
        nextIndex !== currentIndex
      ) {
        nextIndex = (nextIndex + 1) % clickAnimations.length
        nextAnimation = clickAnimations[nextIndex]
      }

      if (animationState.data.skeletonData.findAnimation(nextAnimation)) {
        animationState.setAnimation(0, nextAnimation, true)
      }
    }

    useEffect(() => {
      if (!containerRef.current) return

      const config: SpinePlayerConfig = {
        skeleton: avatarAssets.skeletonUrl,
        atlas: avatarAssets.atlasUrl,
        animation: 'body_idle',
        viewport: {
          padLeft: '0%',
          padRight: '0%',
          padTop: '0%',
          padBottom: '0%',
        },
        scale: 1,
        showControls: false,
        premultipliedAlpha: avatarAssets.premultipliedAlpha,
        alpha: true,
        showLoading: false,
        backgroundColor: '#00000000',
        preserveDrawingBuffer: true,
        success: (player) => {
          playerRef.current = player
          const skeleton = player.skeleton
          const animations = player.animationState?.data.skeletonData.animations
          if (animations) {
            const animationNames = animations.map((a) => a.name)
            console.debug('[Animated Spine Character] Available animations:', animationNames)
            setAvailableAnimations(animationNames)
          }
          if (skeleton) {
            mouseTrackBone.current = skeleton.findBone('crosshair')
          // Hide that crosshair bone
            if (mouseTrackBone.current) {
              mouseTrackBone.current.active = false
            }
            skeleton.updateWorldTransform(Physics.update)

            const offset = new Vector2()
            const size = new Vector2()
            skeleton.getBounds(offset, size, [])

            skeletonOffsetRef.current = offset
            skeletonSizeRef.current = size
          }

          playerRef.current?.animationState?.setAnimation(0, 'body_idle', true)
        // playerRef.current?.animationState?.setAnimation(1, "aim", true)
        },
        frame: (player, delta) => {
        // Update crosshair bones according to mouse position
          const mouse = mousePosRef.current
          const skeleton = player.skeleton
          const canvas = player.canvas
          const offset = skeletonOffsetRef.current
          const size = skeletonSizeRef.current

          if (!skeleton || !canvas || !offset || !size) return

          if (!mouseTrackBone.current) return

        // Convert mouse position to normalized device coordinates (-1 to 1)
          const ndcX = mouse.x * 2 - 1
          const ndcY = (1 - mouse.y) * 2 - 1

          mouseTrackBone.current!.x = offset.x + ndcX * (size.x / 2)
          mouseTrackBone.current!.y = offset.y + ndcY * (size.y / 2)

          skeleton.update(delta)
          skeleton.updateWorldTransform(Physics.update)
        },
      }

      const player = new SpinePlayer(containerRef.current, config)

      return () => {
        player?.dispose()
      }
    }, [avatarAssets])

    // Start test animations if debug is true
  useEffect(() => {
    if (debug && playerRef.current) {
      const timeForEachAnimation = 3000
      const animations = playerRef.current!.animationState!.data.skeletonData.animations

      let currentIndex = 0

      const playNextAnimation = () => {
        if (!playerRef.current) return

        const animation = animations[currentIndex]
        console.debug(`[Animated Spine Character] Playing ${animation.name}`)
        playerRef.current!.setAnimation(animation.name, true)
        currentIndex = (currentIndex + 1) % animations.length
        setTimeout(playNextAnimation, timeForEachAnimation)
      }

      playNextAnimation()
    }
  }, [debug, playerRef.current])

  useImperativeHandle(ref, () => ({
    setAnimation: (trackIndex: number, name: string, loop = true) => {
        if (debug) {
          return
        }
        if (!availableAnimations.includes(name)) {
          console.warn(`Animation "${name}" not found in available animations:`, availableAnimations)
          return
        }
        const current = playerRef.current?.animationState?.getCurrent(trackIndex)
        if (current?.animation?.name === name && current.loop === loop) {
          console.info(`Already playing animation ${name}`)
          return
        }
        console.debug(`[Animated Spin Character] Animation ${name}`)
        playerRef.current?.animationState?.setAnimation?.(trackIndex, name, loop)
      },
      addAnimation: (name: string, loop = true, delay = 0) => {
        if (debug) {
          return
        }
        if (!availableAnimations.includes(name)) {
          console.warn(`Animation "${name}" not found in available animations:`, availableAnimations)
          return
        }
        playerRef.current?.addAnimation(name, loop, delay)
      },
      play: () => {
        playerRef.current?.play()
      },
      pause: () => {
        playerRef.current?.pause()
      },
      getAvailableAnimations: () => availableAnimations,
      triggerViseme(visemeName: string) {
        const animationState = playerRef.current?.animationState
        const mixData = animationState?.data
        if (!animationState || !mixData) return

        if (visemeName === currentVisemeRef.current) return

        mixData.setMix(currentVisemeRef.current, visemeName, 0.06)
        const trackEntry = animationState.setAnimation(1, visemeName, false)
        trackEntry.timeScale = 1

        currentVisemeRef.current = visemeName
      },
  }))

    return (
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onClick={onClick}
        className={className}
        style={{
          display: 'block',
          width,
          height,
          filter: applyFilter ? 'blur(2px)' : 'none',
          zIndex: zIndex,
          position: isDraggable ? 'absolute' : 'relative',
          left: position ? `${position.x}px` : undefined,
          top: position ? `${position.y}px` : undefined,
          cursor: isDraggable ? (isDragging ? 'grabbing' : 'grab') : 'default',
        }}
      />
    )
  },
)

export default AnimatedSpineCharacter