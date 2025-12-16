import React from 'react';

export enum Sender {
  User = 'user',
  Bot = 'bot'
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: number;
}

export enum AssistantMode {
  Chat = 'chat',
  FixGrammar = 'fix',
  Summarize = 'summarize',
  Translate = 'translate',
  ImageGen = 'image_gen'
}

export type Theme = 'light' | 'dark';
export type QuoteSource = 'motivational' | 'hafez' | 'programming' | 'great_people';
export type MusicProvider = 'local' | 'spotify';

export interface AppSettings {
  apiKey: string;
  model: string;
  theme: Theme;
  backgroundImage: string;
  quoteSource: QuoteSource;
  fontSize: 'small' | 'medium' | 'large';
  musicProvider: MusicProvider;
}

export interface DockItem {
  id: string;
  icon: any;
  label: string;
  mode: AssistantMode;
  pinned: boolean;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  category: 'daily' | 'shopping';
}