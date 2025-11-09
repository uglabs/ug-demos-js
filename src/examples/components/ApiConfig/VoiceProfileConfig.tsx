import React from 'react'

interface VoiceProfileConfigProps {
  voiceProfile: Record<string, any> | undefined
}

export const VoiceProfileConfig: React.FC<VoiceProfileConfigProps> = ({ voiceProfile }) => {
  if (!voiceProfile || Object.keys(voiceProfile).length === 0) {
    return null
  }

  return (
    <div className="space-y-2 p-4 border-l-4 border-purple-400 bg-purple-50">
      <label className="block font-semibold">Voice Profile</label>
      <pre className="text-sm bg-purple-100 p-2 rounded overflow-auto">
        {JSON.stringify(voiceProfile, null, 2)}
      </pre>
    </div>
  )
}
