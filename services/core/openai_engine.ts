import AIEngine, { GenerateOptions } from './ai_engine';

export default class OpenAIEngine extends AIEngine {
  apiKey?: string;
  constructor(apiKey?: string) { super(); this.apiKey = apiKey; }

  async *generate(prompt: string, options?: GenerateOptions) {
    const key = (options?.apiKey && options.apiKey.length > 10) ? options.apiKey : this.apiKey || (process.env.OPENAI_API_KEY as string | undefined);
    if (!key) {
      yield 'OpenAI API key not found.';
      return;
    }

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({ model: options?.model || 'gpt-3.5-turbo', messages: [{ role: 'system', content: options?.system || '' }, { role: 'user', content: prompt }], max_tokens: 800 }),
      });
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || '';
      // yield whole text once (non-streaming)
      yield text;
    } catch (e) {
      yield 'Error contacting OpenAI.';
    }
  }
}
