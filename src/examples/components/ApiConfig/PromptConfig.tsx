import React from 'react'

interface PromptConfigProps {
  prompt: string
  setPrompt: (value: string) => void
  context: Record<string, string>
  setContext: (value: Record<string, string>) => void
}

const getVariablesFromPrompt = (prompt: string): string[] => {
  if (!prompt) return [];
  const regex = /{{\s*(\w+)\s*}}/g;
  const matches = prompt.match(regex) || []
  return [...new Set(matches.map((match) => match.replace(/{{\s*|\s*}}/g, '')))]
}

export const PromptConfig: React.FC<PromptConfigProps> = ({
  prompt,
  setPrompt,
  context,
  setContext,
}) => {
  return (
    <>
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
          {getVariablesFromPrompt(prompt).map((variable) => (
            <div key={variable} className="space-y-2">
              <label htmlFor={`context-${variable}`} className="block">
                {variable}
              </label>
              <input
                id={`context-${variable}`}
                type="text"
                value={context[variable] || ''}
                onChange={(e) => {
                  const newContext = { ...context, [variable]: e.target.value };
                  setContext(newContext);
                }}
                className="w-full border px-2 py-1 border-gray-500 rounded"
              />
            </div>
          ))}
        </div>
      )}
    </>
  )
}
