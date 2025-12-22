
export enum Sender {
  User = 'user',
  Bot = 'bot'
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: number;
  type?: 'text' | 'image' | 'audio';
  audioData?: string;
  suggestions?: string[];
}

export interface SocialNotification {
  id: string;
  app: 'WhatsApp' | 'Telegram' | 'Instagram';
  sender: string;
  content: string;
  time: string;
  suggestions: string[];
}

export enum AssistantMode {
  Home = 'home',
  Chat = 'chat',
  Widgets = 'widgets',
  News = 'news'
}

export type ThemeType = 'purple' | 'midnight' | 'ocean' | 'nature' | 'macos';
export type NewsCategory = 'سیاسی' | 'اجتماعی' | 'ورزشی' | 'تکنولوژی' | 'اقتصادی' | 'هنری';
export type AIToolType = 'translate' | 'summarize' | 'shorten' | 'lengthen' | 'change_tone';
export type ToneType = 'formal' | 'slang' | 'friendly' | 'humorous';
export type AIModel = 'gemini-3-flash-preview' | 'gemini-3-pro-preview';

export interface WidgetConfig {
  id: string;
  enabled: boolean;
  title: string;
  type: 'weather' | 'calendar' | 'stocks' | 'notes' | 'battery';
}

export interface AppSettings {
  // Pro Settings
  apiKey: string; // Custom User API Key
  useCustomKey: boolean;
  model: AIModel;
  
  // Appearance
  activeTheme: ThemeType;
  backgroundImage: string;
  fontSize: 'small' | 'medium' | 'large';
  
  // Features
  autoSpeech: boolean;
  newsCategory: NewsCategory;
  widgets: WidgetConfig[];
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  timestamp: number;
  category: 'daily' | 'shopping' | 'notes';
}
