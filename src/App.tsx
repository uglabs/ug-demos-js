import { useState } from 'react';
import ExampleTextOnlyAvatarPage from './examples/avatar/ExampleTextOnlyAvatarPage';
import ExampleVoiceToVoiceAvatarPage from './examples/avatar/ExampleVoiceToVoiceAvatarPage';
import ExampleChatPage from './examples/chat/ExampleChatPage';
import { ApiConfig, ApiConfigData } from './examples/components/ApiConfig';

import './globals.css';
import './index.css';

function App() {
  const [page, setPage] = useState<'voice' | 'text' | 'chat'>('chat');
  const [apiConfig, setApiConfig] = useState<ApiConfigData | null>(null);
  const [isApiConfigOpen, setIsApiConfigOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col">
      <nav className="p-4 bg-gray-100 border-b">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center items-center gap-4">
          <div className="flex gap-4">
            <button
              onClick={() => setPage('voice')}
              className={`px-4 py-2 rounded ${
                page === 'voice' ? 'bg-purple-800 text-white' : 'bg-gray-200 text-black'
              }`}
            >
              Voice-to-Voice Avatar (Beta)
            </button>
            <button
              onClick={() => setPage('text')}
              className={`px-4 py-2 rounded ${
                page === 'text' ? 'bg-purple-800 text-white' : 'bg-gray-200 text-black'
              }`}
            >
              Text-Only Avatar
            </button>
            <button
              onClick={() => setPage('chat')}
              className={`px-4 py-2 rounded ${
                page === 'chat' ? 'bg-purple-800 text-white' : 'bg-gray-200 text-black'
              }`}
            >
              Chat Example
            </button>
          </div>
          <div className="w-full sm:w-auto sm:ml-auto flex justify-center">
            <ApiConfig
              onConfigChange={setApiConfig}
              isOpen={isApiConfigOpen}
              onToggle={() => setIsApiConfigOpen(!isApiConfigOpen)}
            />
          </div>
        </div>
      </nav>
      <div className="flex-grow overflow-hidden">
        {page === 'voice' && <ExampleVoiceToVoiceAvatarPage apiConfig={apiConfig} onPlay={() => setIsApiConfigOpen(false)} />}
        {page === 'text' && <ExampleTextOnlyAvatarPage apiConfig={apiConfig} onPlay={() => setIsApiConfigOpen(false)} />}
        {page === 'chat' && <ExampleChatPage apiConfig={apiConfig} onPlay={() => setIsApiConfigOpen(false)} />}
      </div>
    </div>
  );
}

export default App;