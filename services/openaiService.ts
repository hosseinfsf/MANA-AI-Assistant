/* Simple OpenAI service wrapper (non-streaming) */
import type { AIModel } from '../types';

export async function* sendMessageStreamOpenAI(prompt: string, model: AIModel | string, apiKey?: string) {
  const key = apiKey && apiKey.length > 10 ? apiKey : process.env.OPENAI_API_KEY;
  if (!key) {
    yield 'OpenAI API key not set.';
    return;
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: model || 'gpt-3.5-turbo', messages: [{ role: 'user', content: prompt }], max_tokens: 600 }),
    });
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || 'بدون پاسخ';
    yield text;
  } catch (e) {
    yield 'خطا در ارتباط با OpenAI.';
  }
}

export async function generateSpeechOpenAI(text: string) {
  // Placeholder: OpenAI TTS not implemented here.
  return null;
}
