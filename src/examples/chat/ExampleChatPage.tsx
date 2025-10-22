import React, { useState, useEffect, useRef } from 'react';
import {
  ConversationManager,
  ConversationConfig,
  TextEvent,
  ConversationState,
  ConversationError,
} from 'ug-js-sdk';
import { PlayButton } from '../components/PlayButton/PlayButton';
import { ApiConfigData } from '../components/ApiConfig';
import { useToast } from '../../components/Toast/ToastProvider';

type Sender = 'user' | 'chatbot';

interface Message {
  text: string;
  sender: Sender;
}

interface ExampleChatPageProps {
  apiConfig: ApiConfigData | null;
  onPlay: () => void;
}

export default function ExampleChatPage({ apiConfig, onPlay }: ExampleChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState('');
  const conversationManagerRef = useRef<ConversationManager | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [hasExperienceStarted, setHasExperienceStarted] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (!apiConfig) {
      return;
    }
    const convConfig: ConversationConfig = {
      capabilities: {
        audio: false,
        viseme: false,
        subtitles: false,
        avatar: false,
      },
      inputCapabilities: {
        audio: false,
        text: true,
      },
      apiUrl: apiConfig.apiUrl,
      apiKey: apiConfig.apiKey,
      federatedId: apiConfig.federatedId,
      prompt: apiConfig.prompt,
      hooks: {
        onTextMessage: (event: TextEvent) => {
          setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            if (lastMessage && lastMessage.sender === 'chatbot') {
              const newMessages = [...prevMessages];
              newMessages[newMessages.length - 1] = { ...lastMessage, text: lastMessage.text + event.text };
              return newMessages;
            } else {
              return [...prevMessages, { text: event.text, sender: 'chatbot' }];
            }
          });
        },
        onStateChange: (state: ConversationState) => {},
        onError: (error: ConversationError) => {
          addToast(error.message, 'error')
        },
        onAvatarAnimationChanged: () => {},
        onNetworkStatusChange: () => {},
      },
    };
    conversationManagerRef.current = new ConversationManager(convConfig);

    return () => {
      // conversationManagerRef.current?.destroy();
    };
  }, [apiConfig]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (textInput.trim()) {
      setMessages([...messages, { text: textInput, sender: 'user' }]);
      conversationManagerRef.current?.sendText(textInput);
      setTextInput('');
    }
  };

  const handlePlayButtonClick = async () => {
    if (!hasExperienceStarted) {
      onPlay?.();
      setHasExperienceStarted(true);
      await conversationManagerRef.current?.initialize();
      textAreaRef.current?.focus();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {apiConfig && (
        <div className="max-w-6xl flex flex-col flex-grow w-full rounded-lg overflow-hidden relative self-center">
          {!hasExperienceStarted && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <PlayButton
                isAudioPlaying={false}
                isUserSpeaking={false}
                onClick={handlePlayButtonClick}
                showTapToPlay={true}
                hasExperienceStarted={hasExperienceStarted}
                isPlaybackPaused={false}
              />
            </div>
          )}
          <div
            className={`flex-grow p-4 overflow-y-auto flex flex-col gap-4 ${
              !hasExperienceStarted ? 'filter blur-sm' : ''
            }`}
            ref={chatContainerRef}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`py-2 px-4 rounded-2xl max-w-[80%] ${
                  msg.sender === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-black self-start'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className={`flex p-4 ${!hasExperienceStarted ? 'pointer-events-none' : ''}`}>
            <textarea
              ref={textAreaRef}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              className="flex-grow border border-gray-300 rounded-2xl py-2 px-4 mr-4 resize-none"
              rows={Math.min(3, (textInput.match(/\n/g) || []).length + 1)}
              disabled={!hasExperienceStarted}
            />
            <button
              onClick={handleSend}
              className="border-none bg-blue-500 text-white py-2 px-4 rounded-2xl cursor-pointer"
              disabled={!hasExperienceStarted}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}