import React from 'react'

interface JsonConfigProps {
  fullConfig: string
  handleFullConfigChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  jsonError: string | null
}

export const JsonConfig: React.FC<JsonConfigProps> = ({
  fullConfig,
  handleFullConfigChange,
  jsonError,
}) => {
  return (
    <div className="space-y-2 p-4 border-l-4 border-gray-400 bg-gray-50">
      <label htmlFor="fullConfig" className="block font-semibold">
        Full Config (JSON)
      </label>
      <textarea
        id="fullConfig"
        className="w-full border rounded px-2 py-1 border-gray-500 rounded font-mono text-xs"
        value={fullConfig}
        onChange={handleFullConfigChange}
        rows={10}
      />
      {jsonError && <p className="text-red-500 text-sm mt-1">{jsonError}</p>}
    </div>
  )
}
