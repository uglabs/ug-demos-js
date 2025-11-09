import { useState, useCallback } from 'react';
import ExampleTextOnlyAvatarPage from './examples/avatar/ExampleTextOnlyAvatarPage';
import ExampleVoiceToVoiceAvatarPage from './examples/avatar/ExampleVoiceToVoiceAvatarPage';
import ExampleChatPage from './examples/chat/ExampleChatPage';
import { ApiConfig } from './examples/components/ApiConfig/ApiConfig';

import './globals.css';
import './index.css';
import { ExtendedApiConfigData } from './types';

const DEFAULT_API_URL = 'https://pug.stg.uglabs.app/api/';

const DEFAULT_CONFIG: ExtendedApiConfigData = {
  app_name: 'Demos JS Host',
  app_description: 'Demos JS Host',
  version: '1.0.0',
  format_version: '1.0.0',
  prompt:
    'Say hello to the user first. then after he welcome you. play with him a story telling game. make it quick responses no more than 2 sentences each time.',
  context: {},
  utilities: {},
  voiceProfile: {},
  safety_policy: null,
  default_interaction_mode: 'text-only',
  apiUrl: DEFAULT_API_URL,
  apiKey: '',
  federatedId: '',
};

function App() {
  const [page, setPage] = useState<'avatar-voice' | 'avatar-text' | 'text-only'>('text-only');
  const [apiConfig, setApiConfig] = useState<ExtendedApiConfigData>(() => {
    const savedConfig = localStorage.getItem('apiConfig');
    const parsedConfig = savedConfig ? JSON.parse(savedConfig) : {};
    return { ...DEFAULT_CONFIG, ...parsedConfig };
  });
  const [isApiConfigOpen, setIsApiConfigOpen] = useState(true);

  const handleConfigChange = useCallback((config: ExtendedApiConfigData) => {
    setApiConfig(config);
    localStorage.setItem('apiConfig', JSON.stringify(config, null, 2));
    if (
      config.default_interaction_mode === 'avatar-voice' ||
      config.default_interaction_mode === 'avatar-text' ||
      config.default_interaction_mode === 'text-only'
    ) {
      setPage(config.default_interaction_mode);
    } else if (config.default_interaction_mode) {
      console.error(`Found invalid interaction mode ${config.default_interaction_mode}`);
    }
  }, []);

  const handleInteractionModeChange = (mode: 'avatar-voice' | 'avatar-text' | 'text-only') => {
    setPage(mode);
    if (apiConfig) {
      const newConfig = { ...apiConfig, default_interaction_mode: mode };
      setApiConfig(newConfig);
      localStorage.setItem('apiConfig', JSON.stringify(newConfig, null, 2));
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <nav className="p-4 bg-gray-100 border-b">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="font-semibold">Interaction Mode:</span>
            <div className="flex gap-4">
              <button
                onClick={() => handleInteractionModeChange('avatar-voice')}
                className={`px-4 py-2 rounded ${
                  page === 'avatar-voice' ? 'bg-purple-800 text-white' : 'bg-gray-200 text-black'
                }`}
              >
                Avatar Voice
              </button>
              <button
                onClick={() => handleInteractionModeChange('avatar-text')}
                className={`px-4 py-2 rounded ${
                  page === 'avatar-text' ? 'bg-purple-800 text-white' : 'bg-gray-200 text-black'
                }`}
              >
                Avatar Text
              </button>
              <button
                onClick={() => handleInteractionModeChange('text-only')}
                className={`px-4 py-2 rounded ${
                  page === 'text-only' ? 'bg-purple-800 text-white' : 'bg-gray-200 text-black'
                }`}
              >
                Text Only
              </button>
            </div>
          </div>
          <div className="w-full sm:w-auto sm:ml-auto flex justify-end">
            <ApiConfig
              config={apiConfig}
              onConfigChange={handleConfigChange}
              isOpen={isApiConfigOpen}
              onToggle={() => setIsApiConfigOpen(!isApiConfigOpen)}
              onPlay={() => setIsApiConfigOpen(false)}
            />
          </div>
        </div>
      </nav>
      <div className="flex-grow overflow-hidden">
        {page === 'avatar-voice' && (
          <ExampleVoiceToVoiceAvatarPage
            apiConfig={apiConfig}
            onPlay={() => setIsApiConfigOpen(false)}
          />
        )}
        {page === 'avatar-text' && (
          <ExampleTextOnlyAvatarPage
            apiConfig={apiConfig}
            onPlay={() => setIsApiConfigOpen(false)}
          />
        )}
        {page === 'text-only' && (
          <ExampleChatPage apiConfig={apiConfig} onPlay={() => setIsApiConfigOpen(false)} />
        )}
      </div>
    </div>
  );
}

export default App;