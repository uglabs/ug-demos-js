import { AvatarAssets } from '../AnimatedSpineCharacter'

export const avatars = {
  robot: {
    name: 'Robot',
    skeletonUrl: '/assets/robot/Robot.skel.bytes',
    atlasUrl: '/assets/robot/Robot.atlas',
    premultipliedAlpha: true,
  },
  pink_robot: {
    name: 'Pink Robot',
    skeletonUrl: '/assets/pink_robot/Robot.skel.bytes',
    atlasUrl: '/assets/pink_robot/Robot.atlas',
    premultipliedAlpha: true,
  },
  hawaii_robot: {
    name: 'Hawaii Robot',
    skeletonUrl: '/assets/hawaii_robot/Robot.skel.bytes',
    atlasUrl: '/assets/hawaii_robot/Robot.atlas',
    premultipliedAlpha: true,
  },
} as const

export type AvatarKey = keyof typeof avatars

export function getAvatarAssets(avatarKey: AvatarKey): AvatarAssets {
  const assets = avatars[avatarKey]
  if (!assets) {
    throw new Error(`Avatar "${avatarKey}" not found`)
  }
  return assets
}
