import AIEngine, { GenerateOptions } from './ai_engine';
import * as gemini from '../geminiService';

export default class GeminiEngine extends AIEngine {
  apiKey?: string;
  constructor(apiKey?: string) { super(); this.apiKey = apiKey; }

  async *generate(prompt: string, options?: GenerateOptions) {
    // delegate to existing gemini service stream
    const stream = gemini.sendMessageStream(prompt as any, null as any, [], { apiKey: options?.apiKey || this.apiKey, model: options?.model as any });
    for await (const chunk of stream) yield chunk;
  }
}
