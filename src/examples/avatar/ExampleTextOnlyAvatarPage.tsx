import { Avatar } from './components/Avatar/Avatar'
import { getAvatarAssets, type AvatarKey } from './components/Avatar/config/avatars'
import { ExtendedApiConfigData } from 'src/types'

interface ExampleAvatarPageProps {
  apiConfig: ExtendedApiConfigData | null
  onPlay: () => void
}

export default function ExampleTextOnlyAvatarPage({ apiConfig, onPlay }: ExampleAvatarPageProps) {
  const avatarKey: AvatarKey = 'robot'
  const imageFrame = undefined
  const isEnabledSubtitles = true

  try {
    const avatarAssets = getAvatarAssets(avatarKey)

    return (
      <div className="h-full flex flex-col">
        {apiConfig && (
          <Avatar
            config={apiConfig}
            avatarAssets={avatarAssets}
            imageFrame={imageFrame}
            isEnabledSubtitles={isEnabledSubtitles}
            onPlay={onPlay}
            initialIsTextOnly={true}
          />
        )}
      </div>
    )
  } catch (error) {
    return <div className="p-4 text-red-500">Could not find avatar: {avatarKey}</div>
  }
}
