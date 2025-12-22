
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
  Chat = 'chat',
  AI = 'ai',
  ToDo = 'todo',
  News = 'news'
}

export type ThemeType = 'macos' | 'purple' | 'ocean' | 'nature';
export type TodoCategory = 'daily' | 'shopping' | 'notes';
export type NewsCategory = 'سیاسی' | 'اجتماعی' | 'ورزشی' | 'تکنولوژی' | 'اقتصادی' | 'هنری';
export type AIToolType = 'translate' | 'summarize' | 'shorten' | 'lengthen' | 'change_tone';
export type ToneType = 'formal' | 'slang' | 'friendly' | 'humorous';

export interface AppSettings {
  apiKey: string;
  model: string;
  theme: 'light' | 'dark';
  activeTheme: ThemeType;
  backgroundImage: string;
  fontSize: 'small' | 'medium' | 'large';
  autoSpeech: boolean;
  showSingleNotification: boolean;
  newsCategory: NewsCategory;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  timestamp: number;
  category: TodoCategory;
}
