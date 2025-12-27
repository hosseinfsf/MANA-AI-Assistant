type SR = any;

export interface VoiceConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  wakeWord?: string;
  autoStop?: boolean;
  autoStopDelay?: number;
}

export class VoiceRecognition {
  private recognition: SR | null = null;
  private isListening = false;
  private callbacks: {
    onResult?: (text: string, confidence: number) => void;
    onError?: (error: Error) => void;
    onStart?: () => void;
    onEnd?: () => void;
  } = {};

  constructor(private config: VoiceConfig) {
    this.initialize();
  }

  private initialize() {
    const w = window as any;
    const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Not supported
      this.recognition = null;
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = this.config.language;
    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.maxAlternatives = this.config.maxAlternatives;

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.callbacks.onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence || 0;
      if (result.isFinal) {
        this.callbacks.onResult?.(transcript, confidence);
      }
    };

    this.recognition.onerror = (event: any) => {
      this.callbacks.onError?.(new Error(event.error || 'speech error'));
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.callbacks.onEnd?.();
      if (this.config.continuous && !this.isListening) {
        try { this.start(); } catch { /* ignore */ }
      }
    };
  }

  start() {
    if (!this.recognition || this.isListening) return;
    try { this.recognition.start(); } catch { /* swallow */ }
  }

  stop() {
    if (!this.recognition || !this.isListening) return;
    try { this.recognition.stop(); } catch { /* swallow */ }
  }

  abort() {
    if (!this.recognition) return;
    try { this.recognition.abort(); } catch { /* swallow */ }
    this.isListening = false;
  }

  onResult(cb: (text: string, confidence: number) => void) { this.callbacks.onResult = cb; }
  onError(cb: (e: Error) => void) { this.callbacks.onError = cb; }
  onStart(cb: () => void) { this.callbacks.onStart = cb; }
  onEnd(cb: () => void) { this.callbacks.onEnd = cb; }

  isActive(): boolean { return this.isListening; }
}

export default VoiceRecognition;
