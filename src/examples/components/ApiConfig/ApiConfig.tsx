import { useState, useEffect } from 'react';
import { ApiCredentials } from './ApiCredentials';
import { PromptConfig } from './PromptConfig';
import { JsonConfig } from './JsonConfig';
import { UtilitiesConfig } from './UtilitiesConfig';
import { VoiceProfileConfig } from './VoiceProfileConfig';
import { ApiConfigData, ExtendedApiConfigData } from 'src/types';

interface ApiConfigProps {
  config: ExtendedApiConfigData | null;
  onConfigChange: (config: ExtendedApiConfigData) => void;
  isOpen: boolean;
  onToggle: () => void;
  onPlay: () => void;
  children?: React.ReactNode;
}

const DEFAULT_API_URL = 'https://pug.stg.uglabs.app/api/';

export const ApiConfig: React.FC<ApiConfigProps> = ({
  config,
  onConfigChange,
  isOpen,
  onToggle,
  onPlay,
  children,
}) => {
  const [fullConfigString, setFullConfigString] = useState(config ? JSON.stringify(config, null, 2) : '');
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    setFullConfigString(config ? JSON.stringify(config, null, 2) : '');
  }, [config]);

  const updateConfig = (key: keyof ApiConfigData, value: any) => {
    const newValue = value === '' ? null : value;
    if (config) {
      const newConfig = { ...config, [key]: newValue };
      onConfigChange(newConfig);
    }
  };

  const handleUtilityToggle = (utilityName: string) => {
    if (config && config.utilities) {
      const newUtilities = { ...config.utilities };
      newUtilities[utilityName].enabled = !newUtilities[utilityName].enabled;
      updateConfig('utilities', newUtilities);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const newConfig = JSON.parse(content);
        onConfigChange(newConfig);
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
      onConfigChange(parsedConfig);
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

  if (!config) {
    return null;
  }

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
              apiUrl={config.apiUrl}
              setApiUrl={(value) => onConfigChange({ ...config, apiUrl: value })}
              apiKey={config.apiKey}
              setApiKey={(value) => onConfigChange({ ...config, apiKey: value })}
              federatedId={config.federatedId}
              setFederatedId={(value) => onConfigChange({ ...config, federatedId: value })}
              defaultApiUrl={DEFAULT_API_URL}
            />
            <PromptConfig
              prompt={config.prompt}
              setPrompt={(value) => updateConfig('prompt', value)}
              context={config.context || {}}
              setContext={(value) => updateConfig('context', value)}
            />
            <div className="space-y-2">
              <label htmlFor="safety_policy" className="block">Safety Policy</label>
              <input
                id="safety_policy"
                type="text"
                placeholder='Enter safety policy id or keep empty for Default'
                className="w-full border rounded px-2 py-1 border-gray-500 rounded"
                value={config.safety_policy || ''}
                onChange={(e) => updateConfig('safety_policy', e.target.value)}
              />
            </div>
            <VoiceProfileConfig voiceProfile={config.voiceProfile} />
            <UtilitiesConfig
              utilities={config.utilities}
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