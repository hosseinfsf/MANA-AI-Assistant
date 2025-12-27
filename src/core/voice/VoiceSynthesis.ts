export interface SpeechSynthesisConfig {
  voice?: string;
  rate: number;
  pitch: number;
  volume: number;
  language: string;
}

export class VoiceSynthesis {
  private synthesis: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private queue: string[] = [];
  private isSpeaking = false;

  constructor(private config: SpeechSynthesisConfig) {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
  }

  private loadVoices() {
    this.voices = this.synthesis.getVoices();
    if (this.voices.length === 0) {
      this.synthesis.addEventListener('voiceschanged', () => {
        this.voices = this.synthesis.getVoices();
      });
    }
  }

  async speak(text: string, options?: Partial<SpeechSynthesisConfig>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const finalConfig = { ...this.config, ...options } as SpeechSynthesisConfig;
      utterance.rate = finalConfig.rate;
      utterance.pitch = finalConfig.pitch;
      utterance.volume = finalConfig.volume;
      utterance.lang = finalConfig.language;

      const voice = this.selectVoice(finalConfig.language, finalConfig.voice);
      if (voice) utterance.voice = voice;

      utterance.onstart = () => { this.isSpeaking = true; };
      utterance.onend = () => { this.isSpeaking = false; this.processQueue(); resolve(); };
      utterance.onerror = (e: any) => { this.isSpeaking = false; reject(new Error(e.error || 'synthesis error')); };

      this.currentUtterance = utterance;
      this.synthesis.speak(utterance);
    });
  }

  pause() { this.synthesis.pause(); }
  resume() { this.synthesis.resume(); }
  cancel() { this.synthesis.cancel(); this.queue = []; this.isSpeaking = false; }
  enqueue(text: string) { this.queue.push(text); if (!this.isSpeaking) this.processQueue(); }

  private async processQueue() {
    if (this.queue.length === 0 || this.isSpeaking) return;
    const text = this.queue.shift();
    if (text) await this.speak(text);
  }

  private selectVoice(language: string, voiceName?: string): SpeechSynthesisVoice | null {
    if (voiceName) {
      const v = this.voices.find(vv => vv.name === voiceName);
      if (v) return v;
    }
    const languageVoices = this.voices.filter(v => v.lang && v.lang.startsWith(language.split('-')[0]));
    if (languageVoices.length > 0) {
      const local = languageVoices.find(v => v.localService);
      return local || languageVoices[0];
    }
    return null;
  }

  getVoices(): SpeechSynthesisVoice[] { return this.voices; }
  isCurrentlySpeaking(): boolean { return this.isSpeaking; }
}

export default VoiceSynthesis;
