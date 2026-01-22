export enum Platform {
  WeChat = 'WECHAT',
  Xiaohongshu = 'XHS'
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