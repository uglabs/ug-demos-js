import { useState, useEffect } from 'react';

export interface ApiConfigData {
  apiUrl: string;
  apiKey: string;
  federatedId: string;
  prompt: string;
}

interface ApiConfigProps {
  onConfigChange: (config: ApiConfigData) => void;
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

export const ApiConfig: React.FC<ApiConfigProps> = ({ onConfigChange, isOpen, onToggle, children }) => {
  const [apiUrl, setApiUrl] = useState('https://pug.stg.uglabs.app/api/');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('apiKey') || '');
  const [federatedId, setFederatedId] = useState(() => localStorage.getItem('federatedId') || '');
  const [prompt, setPrompt] = useState("Say hello to the user first. then after he welcome you. play with him a story telling game. make it quick responses no more than 2 sentences each time.");

  useEffect(() => {
    localStorage.setItem('apiKey', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('federatedId', federatedId);
  }, [federatedId]);

  useEffect(() => {
    onConfigChange({ apiUrl, apiKey, federatedId, prompt });
  }, [apiUrl, apiKey, federatedId, prompt, onConfigChange]);

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="bg-purple-800 text-white rounded p-2"
      >
        API Configuration {isOpen ? '▲' : '▼'}
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-5 p-4 bg-white border rounded-lg shadow-lg z-[100] space-y-4 w-screen max-w-2xl">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label htmlFor="apiUrl" className="block">API URL</label>
              <input
                id="apiUrl"
                type="url"
                placeholder="Enter API URL"
                value={apiUrl}
                className="w-full border px-2 py-1 border-gray-500 rounded"
                onChange={(e) => setApiUrl(e.target.value)}
              />
            </div>
          </div>
          <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50 mt-4 text-sm">
            <p>Please login to <a href="https://pug-playground.stg.uglabs.app/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://pug-playground.stg.uglabs.app/</a> and:</p>
            <ol className="list-decimal list-inside mt-2">
              <li>Create a <a href="https://pug-playground.stg.uglabs.app/service-accounts" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Service account</a> and "Copy" the API Key.</li>
              <li>Create a <a href="https://pug-playground.stg.uglabs.app/players" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Player</a> and copy the "Federated Id" (Player's secret).</li>
            </ol>
          </div>
          <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                  <label htmlFor="apiKey" className="block">API Key:</label>
                  <input
                  id="apiKey"
                  type="text"
                  placeholder="Enter Service Account API Key"
                  value={apiKey}
                  onChange={(e:any) => setApiKey(e.target.value)}
                  className="w-full border px-2 py-1 border-gray-500 rounded"
                  />
              </div>
              <div className="space-y-2">
                  <label htmlFor="federatedId" className="block">Federated Id:</label>
                  <input
                  id="federatedId"
                  type="text"
                  placeholder="Enter Federated Id"
                  value={federatedId}
                  onChange={(e:any) => setFederatedId(e.target.value)}
                  className="w-full border px-2 py-1 border-gray-500 rounded"
                  />
              </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="prompt">Prompt</label>
            <textarea
              id="prompt"
              className="w-full border rounded px-2 py-1 border-gray-500 rounded"
              placeholder="Enter prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
          </div>
          {children}
          <button
            onClick={onToggle}
            className="w-full bg-gray-200 text-black rounded p-2 mt-4"
          >
            Start playing
          </button>
        </div>
      )}
    </div>
  );
};