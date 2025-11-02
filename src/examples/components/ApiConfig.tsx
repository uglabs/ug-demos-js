import { useState, useEffect } from 'react';

export interface ApiConfigData {
  app_name?: string;
  app_description?: string;
  version?: string;
  format_version?: string;
  apiUrl: string;
  apiKey: string;
  federatedId: string;
  prompt: string;
  context?: Record<string, string>;
  utilities?: Record<string, any>;
  voiceProfile?: Record<string, any>;
  safetyPolicy?: string;
  default_interaction_mode?: string;
}

interface ApiConfigProps {
  onConfigChange: (config: ApiConfigData) => void;
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

export const ApiConfig: React.FC<ApiConfigProps> = ({ onConfigChange, isOpen, onToggle, children }) => {
  const [context, setContext] = useState<Record<string, string>>({});
  const [utilities, setUtilities] = useState<Record<string, any> | undefined>();
  const [voiceProfile, setVoiceProfile] = useState<Record<string, any> | undefined>();
  const [safetyPolicy, setSafetyPolicy] = useState<string | undefined>();
  const [default_interaction_mode, setDefaultInteractionMode] = useState<string | undefined>();
  const [app_name, setAppName] = useState<string | undefined>("Demos JS Host");
  const [app_description, setAppDescription] = useState<string | undefined>("Demos JS Host");
  const [version, setVersion] = useState<string | undefined>("1.0.0");
  const [format_version, setFormatVersion] = useState<string | undefined>("1.0.0");
  const [apiUrl, setApiUrl] = useState('https://pug.stg.uglabs.app/api/');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('apiKey') || '');
  const [federatedId, setFederatedId] = useState(() => localStorage.getItem('federatedId') || '');
  const [prompt, setPrompt] = useState("Say hello to the user first. then after he welcome you. play with him a story telling game. make it quick responses no more than 2 sentences each time.");

  const handleUtilityToggle = (utilityName: string) => {
    setUtilities(prev => {
      if (!prev) return prev;
      const newUtilities = { ...prev };
      newUtilities[utilityName].enabled = !newUtilities[utilityName].enabled;
      return newUtilities;
    });
  };

  const getVariablesFromPrompt = (prompt: string): string[] => {
    const regex = /{{\s*(\w+)\s*}}/g;
    const matches = prompt.match(regex) || [];
    return [...new Set(matches.map(match => match.replace(/{{\s*|\s*}}/g, '')))];
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const config = JSON.parse(content);
          if (config.apiUrl) setApiUrl(config.apiUrl);
          if (config.apiKey) setApiKey(config.apiKey);
          if (config.federatedId) setFederatedId(config.federatedId);
          if (config.prompt) setPrompt(config.prompt);
          if (config.context) setContext(config.context);
          if (config.utilities) setUtilities(config.utilities);
          if (config.voiceProfile) setVoiceProfile(config.voiceProfile);
          if (config.safetyPolicy) setSafetyPolicy(JSON.stringify(config.safetyPolicy));
          if (config.default_interaction_mode) setDefaultInteractionMode(config.default_interaction_mode);
          if (config.app_name) setAppName(config.app_name);
          if (config.app_description) setAppDescription(config.app_description);
          if (config.version) setVersion(config.version);
          if (config.format_version) setFormatVersion(config.format_version);
        } catch (error) {
          console.error("Error parsing JSON file:", error);
          alert("Invalid JSON file.");
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    localStorage.setItem('apiKey', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('federatedId', federatedId);
  }, [federatedId]);

  useEffect(() => {
    onConfigChange({ apiUrl, apiKey, federatedId, prompt, context, utilities, voiceProfile, safetyPolicy, default_interaction_mode, app_name, app_description, version, format_version });
  }, [apiUrl, apiKey, federatedId, prompt, context, onConfigChange, utilities, voiceProfile, safetyPolicy, default_interaction_mode, app_name, app_description, version, format_version]);

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="bg-purple-800 text-white rounded p-2"
      >
        API Configuration {isOpen ? '▲' : '▼'}
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-5 p-4 bg-white border rounded-lg shadow-lg z-[100] space-y-4 w-screen max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="p-4 border-l-4 border-blue-400 bg-blue-50 text-sm">
            <p>
              To get started, you can import a configuration file from the playground.
              Set your settings - then click on Import / Export
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
          </div>
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
          {getVariablesFromPrompt(prompt).length > 0 && (
            <div className="space-y-2 p-4 border-l-4 border-green-400 bg-green-50">
              <label className="block font-semibold">Context Variables</label>
              {getVariablesFromPrompt(prompt).map(variable => (
                <div key={variable} className="space-y-2">
                  <label htmlFor={`context-${variable}`} className="block">{variable}</label>
                  <input
                    id={`context-${variable}`}
                    type="text"
                    value={context[variable] || ''}
                    onChange={(e) => setContext(prev => ({ ...prev, [variable]: e.target.value }))}
                    className="w-full border px-2 py-1 border-gray-500 rounded"
                  />
                </div>
              ))}
            </div>
          )}

          {voiceProfile && (
            <div className="space-y-2 p-4 border-l-4 border-purple-400 bg-purple-50">
              <label className="block font-semibold">Voice Profile</label>
              <pre className="text-sm bg-purple-100 p-2 rounded overflow-auto">
                {JSON.stringify(voiceProfile, null, 2)}
              </pre>
            </div>
          )}

          {utilities && Object.keys(utilities).length > 0 && (
            <div className="space-y-2 p-4 border-l-4 border-orange-400 bg-orange-50">
              <label className="block font-semibold">Utilities</label>
              {Object.entries(utilities).map(([name, utility]) => (
                <div key={name} className="py-1">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`utility-${name}`}
                      checked={utility.enabled}
                      onChange={() => handleUtilityToggle(name)}
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
          )}
          <div className="space-y-2 p-4 border-l-4 border-gray-400 bg-gray-50">
            <label htmlFor="fullConfig" className="block font-semibold">Full Config (JSON)</label>
            <textarea
              id="fullConfig"
              className="w-full border rounded px-2 py-1 border-gray-500 rounded font-mono text-xs"
              value={JSON.stringify({
                app_name,
                app_description,
                version,
                format_version,
                prompt,
                context,
                utilities,
                voiceProfile,
                safetyPolicy: safetyPolicy ? JSON.parse(safetyPolicy) : undefined,
                default_interaction_mode,
              }, null, 2)}
              rows={10}
              readOnly
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