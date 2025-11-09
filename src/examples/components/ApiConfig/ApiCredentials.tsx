import React from 'react'

interface ApiCredentialsProps {
  apiUrl: string
  setApiUrl: (value: string) => void
  apiKey: string
  setApiKey: (value: string) => void
  federatedId: string
  setFederatedId: (value: string) => void
  defaultApiUrl: string
}

export const ApiCredentials: React.FC<ApiCredentialsProps> = ({
  apiUrl,
  setApiUrl,
  apiKey,
  setApiKey,
  federatedId,
  setFederatedId,
  defaultApiUrl,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label htmlFor="apiUrl" className="block">
            API URL
          </label>
          <div className="flex items-center">
            <input
              id="apiUrl"
              type="url"
              placeholder="Enter API URL"
              value={apiUrl}
              className="w-full border px-2 py-1 border-gray-500 rounded"
              onChange={(e) => setApiUrl(e.target.value)}
            />
            {apiUrl !== defaultApiUrl && (
              <button
                onClick={() => setApiUrl(defaultApiUrl)}
                className="ml-2 px-2 py-1 bg-gray-200 text-black rounded text-xs"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50 mt-4 text-sm">
        <p>
          Please login to{' '}
          <a
            href="https://pug-playground.stg.uglabs.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            https://pug-playground.stg.uglabs.app/
          </a>{' '}
          and:
        </p>
        <ol className="list-decimal list-inside mt-2">
          <li>
            Create a{' '}
            <a
              href="https://pug-playground.stg.uglabs.app/service-accounts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Service account
            </a>{' '}
            and "Copy" the API Key.
          </li>
          <li>
            Create a{' '}
            <a
              href="https://pug-playground.stg.uglabs.app/players"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Player
            </a>{' '}
            and copy the "Federated Id" (Player's secret).
          </li>
        </ol>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label htmlFor="apiKey" className="block">
            API Key:
          </label>
          <input
            id="apiKey"
            type="text"
            placeholder="Enter Service Account API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full border px-2 py-1 border-gray-500 rounded"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="federatedId" className="block">
            Federated Id:
          </label>
          <input
            id="federatedId"
            type="text"
            placeholder="Enter Federated Id"
            value={federatedId}
            onChange={(e) => setFederatedId(e.target.value)}
            className="w-full border px-2 py-1 border-gray-500 rounded"
          />
        </div>
      </div>
    </>
  )
}
