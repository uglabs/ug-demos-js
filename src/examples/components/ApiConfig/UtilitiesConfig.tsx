import React from 'react'

interface UtilitiesConfigProps {
  utilities: Record<string, any> | undefined
  onUtilityToggle: (utilityName: string) => void
}

export const UtilitiesConfig: React.FC<UtilitiesConfigProps> = ({ utilities, onUtilityToggle }) => {
  if (!utilities || Object.keys(utilities).length === 0) {
    return null
  }

  return (
    <div className="space-y-2 p-4 border-l-4 border-orange-400 bg-orange-50">
      <label className="block font-semibold">Utilities</label>
      {Object.entries(utilities).map(([name, utility]: [string, any]) => (
        <div key={name} className="py-1">
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`utility-${name}`}
              checked={utility.enabled}
              onChange={() => onUtilityToggle(name)}
              className="mr-2"
            />
            <label htmlFor={`utility-${name}`}>{name}</label>
          </div>
          <details className="ml-6 mt-1">
            <summary className="cursor-pointer text-xs text-gray-600">View Content</summary>
            <pre className="text-xs bg-orange-100 p-2 rounded overflow-auto mt-1">
              {JSON.stringify(utility, null, 2)}
            </pre>
          </details>
        </div>
      ))}
    </div>
  )
}
