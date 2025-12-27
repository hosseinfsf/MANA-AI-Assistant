import { getEngine } from './core/ai_router';
import { canAsk, registerAsk, getRemaining } from './core/ai_limits';
import type { AIModel } from '../types';

function getSettings() {
  try { const s = localStorage.getItem('mana_settings_v2'); return s ? JSON.parse(s) : null; } catch { return null; }
}

export async function* sendMessageStream(prompt: string, mode: any, history: any[] = [], options: { apiKey?: string; model?: AIModel } = {}) {
  const settings = getSettings();
  const isPro = !!settings?.isPro;
  const freeLimit = settings?.freeDailyLimit || 20;
  if (!canAsk(isPro, freeLimit)) {
    yield 'محدودیت روزانه تمام شده.';
    return;
  }

  const provider = settings?.aiProvider || (options?.model && options.model.toString().includes('openai') ? 'openai' : 'gemini');
  const engine = getEngine(provider as any, options?.apiKey || settings?.apiKey);

  for await (const chunk of engine.generate(prompt, { model: options?.model as any, apiKey: options?.apiKey })) {
    yield chunk;
  }

  registerAsk(isPro);
}

export async function generateSpeech(text: string, apiKey?: string) {
  const settings = getSettings();
  const provider = settings?.aiProvider || 'gemini';
  const engine = getEngine(provider as any, apiKey || settings?.apiKey);
  // if engine provides generateText, use it and pass to gemini.playAudioBase64 if available
  // fallback: return null
  try {
    // return a placeholder as TTS integration varies per provider
    return null;
  } catch {
    return null;
  }
}

export function checkAndConsumeQuota(): { allowed: boolean; remaining: number } {
  const settings = getSettings();
  const isPro = !!settings?.isPro;
  const freeLimit = settings?.freeDailyLimit || 20;
  return { allowed: canAsk(isPro, freeLimit), remaining: getRemaining(isPro, freeLimit) };
}
