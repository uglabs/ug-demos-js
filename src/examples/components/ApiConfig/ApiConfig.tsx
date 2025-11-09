import { useState, useEffect } from 'react';
import { ApiCredentials } from './ApiCredentials';
import { PromptConfig } from './PromptConfig';
import { JsonConfig } from './JsonConfig';
import { UtilitiesConfig } from './UtilitiesConfig';
import { VoiceProfileConfig } from './VoiceProfileConfig';
import { ApiConfigData, ExtendedApiConfigData } from 'src/types';

interface ApiConfigProps {
  onConfigChange: (config: ExtendedApiConfigData) => void;
  isOpen: boolean;
  onToggle: () => void;
  onPlay: () => void;
  children?: React.ReactNode;
}

const DEFAULT_API_URL = 'https://pug.stg.uglabs.app/api/';

const DEFAULT_CONFIG: ApiConfigData = {
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
};

export const ApiConfig: React.FC<ApiConfigProps> = ({
  onConfigChange,
  isOpen,
  onToggle,
  onPlay,
  children,
}) => {
  const [apiUrl, setApiUrl] = useState(() => localStorage.getItem('apiUrl') || DEFAULT_API_URL);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('apiKey') || '');
  const [federatedId, setFederatedId] = useState(() => localStorage.getItem('federatedId') || '');
  const [fullConfig, setFullConfig] = useState<ApiConfigData>(() => {
    const savedConfig = localStorage.getItem('fullConfig');
    const parsedConfig = savedConfig ? JSON.parse(savedConfig) : {};
    return { ...DEFAULT_CONFIG, ...parsedConfig };
  });
  const [fullConfigString, setFullConfigString] = useState(JSON.stringify(fullConfig, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  const updateConfig = (key: keyof ApiConfigData, value: any) => {
    const newValue = value === '' ? null : value;
    const newConfig = { ...fullConfig, [key]: newValue };
    setFullConfig(newConfig);
    setFullConfigString(JSON.stringify(newConfig, null, 2));
  };

  const handleUtilityToggle = (utilityName: string) => {
    const newUtilities = { ...fullConfig.utilities };
    newUtilities[utilityName].enabled = !newUtilities[utilityName].enabled;
    updateConfig('utilities', newUtilities);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const config = JSON.parse(content);
        setFullConfig({ ...config });
        setFullConfigString(JSON.stringify(config, null, 2));
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleStartPlayingClick = () => {
    try {
      const parsedConfig = JSON.parse(fullConfigString);
      setFullConfig(parsedConfig);
      setJsonError(null);
      onPlay();
    } catch (error) {
      setJsonError('Invalid JSON in Full Config. Please correct it.');
    }
  };

  const handlePasteConfig = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setFullConfigString(text);
    } catch (error) {
      console.error('Failed to read clipboard contents: ', error);
    }
  };

  useEffect(() => {
    localStorage.setItem('apiUrl', apiUrl);
  }, [apiUrl]);

  useEffect(() => {
    localStorage.setItem('apiKey', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('federatedId', federatedId);
  }, [federatedId]);

  useEffect(() => {
    localStorage.setItem('fullConfig', JSON.stringify(fullConfig, null, 2));
  }, [fullConfig]);

  useEffect(() => {
    const configToPass: ExtendedApiConfigData = { ...fullConfig, apiUrl, apiKey, federatedId };

    // Filter out null or empty string values
    for (const key in configToPass) {
      const typedKey = key as keyof ExtendedApiConfigData;
      if (configToPass[typedKey] === null || configToPass[typedKey] === '') {
        delete configToPass[typedKey];
      }
    }
    onConfigChange(configToPass);
  }, [fullConfig, apiUrl, apiKey, federatedId, onConfigChange]);

  return (
    <div className="relative">
      <button onClick={onToggle} className="bg-purple-800 text-white rounded p-2">
        API Configuration {isOpen ? '▲' : '▼'}
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-5 bg-white border rounded-lg shadow-lg z-[100] w-screen max-w-2xl max-h-[80vh] flex flex-col">
          <div className="p-4 space-y-4 overflow-y-auto flex-grow">
            <div className="p-4 border-l-4 border-blue-400 bg-blue-50 text-sm">
              <p>
                To get started, you can import a configuration file from the playground. Set your
                settings - then click on Import / Export
                <br />
                <a
                  href="https://pug-playground.stg.uglabs.app/playground"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Click here to create and export a configuration file.
                </a>
              </p>
              <input
                type="file"
                id="file-upload"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-blue-500 text-white rounded p-2 mt-2 inline-block"
              >
                Import Configuration
              </label>
              <button
                onClick={handlePasteConfig}
                className="cursor-pointer bg-blue-500 text-white rounded p-2 mt-2 ml-2 inline-block"
              >
                Paste Config
              </button>
            </div>
            <ApiCredentials
              apiUrl={apiUrl}
              setApiUrl={setApiUrl}
              apiKey={apiKey}
              setApiKey={setApiKey}
              federatedId={federatedId}
              setFederatedId={setFederatedId}
              defaultApiUrl={DEFAULT_API_URL}
            />
            <PromptConfig
              prompt={fullConfig.prompt}
              setPrompt={(value) => updateConfig('prompt', value)}
              context={fullConfig.context || {}}
              setContext={(value) => updateConfig('context', value)}
            />
            <div className="space-y-2">
              <label htmlFor="safety_policy" className="block">Safety Policy</label>
              <input
                id="safety_policy"
                type="text"
                placeholder='Enter safety policy id or keep empty for Default'
                className="w-full border px-2 py-1 border-gray-500 rounded"
                value={fullConfig.safety_policy || ''}
                onChange={(e) => updateConfig('safety_policy', e.target.value)}
              />
            </div>
            <VoiceProfileConfig voiceProfile={fullConfig.voiceProfile} />
            <UtilitiesConfig
              utilities={fullConfig.utilities}
              onUtilityToggle={handleUtilityToggle}
            />
            <JsonConfig
              fullConfig={fullConfigString}
              handleFullConfigChange={(e) => setFullConfigString(e.target.value)}
              jsonError={jsonError}
            />
            {children}
          </div>
          <div className="p-4 border-t">
            <button
              onClick={handleStartPlayingClick}
              className="w-full bg-purple-800 text-white rounded p-2"
            >
              Start playing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};