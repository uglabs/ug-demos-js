export interface ApiConfigData {
  app_name?: string
  app_description?: string
  version?: string
  format_version?: string
  prompt: string
  context?: Record<string, string>
  utilities?: Record<string, any>
  voiceProfile?: Record<string, any>
  safety_policy?: string | null
  default_interaction_mode?: 'text-only' | 'avatar-voice' | 'avatar-text'
}

// We don't want to store api credentials in the original config file
export interface ExtendedApiConfigData extends ApiConfigData {
  apiUrl: string
  apiKey: string
  federatedId: string
}
