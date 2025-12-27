import OpenAIEngine from './openai_engine';
import GeminiEngine from './gemini_engine';
import AIEngine from './ai_engine';

type Provider = 'openai' | 'gemini' | 'mock';

export function getEngine(provider?: Provider, apiKey?: string): AIEngine {
  const p = provider || (localStorage.getItem('mana_settings_v2') ? (JSON.parse(localStorage.getItem('mana_settings_v2') as string).aiProvider) : 'gemini');
  switch (p) {
    case 'openai':
      return new OpenAIEngine(apiKey || undefined);
    case 'gemini':
    default:
      return new GeminiEngine(apiKey || undefined);
  }
}
