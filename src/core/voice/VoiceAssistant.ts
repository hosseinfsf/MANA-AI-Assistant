import WakeWordDetector from './WakeWordDetector';
import VoiceRecognition, { VoiceConfig } from './VoiceRecognition';
import VoiceSynthesis, { SpeechSynthesisConfig } from './VoiceSynthesis';
import CommandProcessor from './CommandProcessor';

export class VoiceAssistant {
  private recognition: VoiceRecognition;
  private synthesis: VoiceSynthesis;
  private wakeWordDetector: WakeWordDetector;
  private commandProcessor: CommandProcessor;
  private isActive = false;
  private listeningForCommand = false;

  constructor(
    private aiEngine: any,
    voiceConfig?: Partial<VoiceConfig>,
    synthesisConfig?: Partial<SpeechSynthesisConfig>
  ) {
    const defaultVoiceConfig: VoiceConfig = {
      language: 'fa-IR',
      continuous: true,
      interimResults: true,
      maxAlternatives: 1,
      ...voiceConfig,
    };

    const defaultSynthesisConfig: SpeechSynthesisConfig = {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      language: 'fa-IR',
      ...synthesisConfig,
    };

    this.recognition = new VoiceRecognition(defaultVoiceConfig);
    this.synthesis = new VoiceSynthesis(defaultSynthesisConfig);
    this.wakeWordDetector = new WakeWordDetector();
    this.commandProcessor = new CommandProcessor();

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.recognition.onResult(async (text, confidence) => {
      if (!this.listeningForCommand && this.wakeWordDetector.detect(text)) {
        this.listeningForCommand = true;
        await this.synthesis.speak('بله؟ در خدمتم');
        return;
      }

      if (this.listeningForCommand) {
        await this.processVoiceCommand(text);
        this.listeningForCommand = false;
      }
    });

    this.recognition.onError((err) => {
      console.error('Voice recognition error:', err);
      this.synthesis.speak('متأسفم، مشکلی پیش آمد');
    });
  }

  private async processVoiceCommand(text: string) {
    try {
      const result = await this.commandProcessor.process(text);
      switch (result.action) {
        case 'addTask':
          await this.synthesis.speak(`باشه، کار ${result.data.title} رو اضافه می‌کنم`);
          break;
        case 'showTasks':
          await this.synthesis.speak('در حال نمایش لیست کارها');
          break;
        case 'completeTask':
          await this.synthesis.speak('کار انجام شد علامت می‌زنم');
          break;
        case 'newChat':
          await this.synthesis.speak('چت جدید شروع شد');
          break;
        case 'changeTone':
          await this.synthesis.speak('باشه، لحن رو عوض می‌کنم');
          break;
        case 'getFortune':
          await this.synthesis.speak('در حال دریافت فال حافظ');
          break;
        case 'close':
          this.stop();
          break;
        case 'openSettings':
          await this.synthesis.speak('در حال باز کردن تنظیمات');
          break;
        case 'showHelp':
          await this.handleShowHelp();
          break;
        case 'chat':
          await this.handleChat(result.data.message);
          break;
        default:
          await this.synthesis.speak('دستور شناخته نشد');
      }
    } catch (error) {
      console.error('Command processing error:', error);
      await this.synthesis.speak('متأسفم، نتونستم دستورت رو انجام بدم');
    }
  }

  private async handleShowHelp() {
    const helpText = `می‌تونی بگی: افزودن کار ...، نمایش کارها، فال حافظ، چت جدید`;
    await this.synthesis.speak(helpText);
  }

  private async handleChat(message: string) {
    try {
      const response = await this.aiEngine.generate(message, { tone: 'friendly', maxTokens: 150 });
      await this.synthesis.speak(response.text);
    } catch (error) {
      await this.synthesis.speak('متأسفم، نتونستم جواب بدم');
    }
  }

  start() {
    if (this.isActive) return;
    this.isActive = true;
    this.recognition.start();
  }

  stop() {
    if (!this.isActive) return;
    this.isActive = false;
    this.recognition.stop();
    this.synthesis.cancel();
  }

  toggle() { if (this.isActive) this.stop(); else this.start(); }
  speak(text: string) { return this.synthesis.speak(text); }
  isListening(): boolean { return this.recognition.isActive(); }
  isSpeaking(): boolean { return this.synthesis.isCurrentlySpeaking(); }
}

export default VoiceAssistant;
