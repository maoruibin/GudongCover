export enum Platform {
  WeChat = 'WECHAT',
  Xiaohongshu = 'XHS'
}

export enum AIProvider {
  Gemini = 'GEMINI',
  DeepSeek = 'DEEPSEEK'
}

export interface AppSettings {
  provider: AIProvider;
  apiKey: string;
  deepseekBaseUrl?: string; // Optional, in case they want to use a proxy
}

export interface GeneratedCover {
  html: string;
  platform: Platform;
  timestamp: number;
}

export interface GenerationConfig {
  topic: string;
  platform: Platform;
}