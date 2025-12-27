export type GenerateOptions = {
  system?: string;
  model?: string;
  apiKey?: string;
};

export default abstract class AIEngine {
  abstract generate(prompt: string, options?: GenerateOptions): AsyncGenerator<string, void, unknown>;
  // convenience method to get full text
  async generateText(prompt: string, options?: GenerateOptions) {
    let full = '';
    for await (const chunk of this.generate(prompt, options)) {
      full += chunk;
    }
    return full;
  }
}
