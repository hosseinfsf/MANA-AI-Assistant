export class CommandProcessor {
  private commands: Map<string, (params: string[]) => Promise<any>> = new Map();

  constructor() {
    this.registerDefaultCommands();
  }

  private registerDefaultCommands() {
    this.register('افزودن کار', async (params) => ({ action: 'addTask', data: { title: params.join(' ') } }));
    this.register('نمایش کارها', async () => ({ action: 'showTasks' }));
    this.register('انجام شد', async (params) => ({ action: 'completeTask', data: { taskId: params[0] } }));
    this.register('چت جدید', async () => ({ action: 'newChat' }));
    this.register('تغییر لحن', async (params) => ({ action: 'changeTone', data: { tone: params[0] } }));
    this.register('فال حافظ', async () => ({ action: 'getFortune' }));
    this.register('بستن', async () => ({ action: 'close' }));
    this.register('تنظیمات', async () => ({ action: 'openSettings' }));
    this.register('کمک', async () => ({ action: 'showHelp' }));
  }

  register(command: string, handler: (params: string[]) => Promise<any>) {
    this.commands.set(command.toLowerCase(), handler);
  }

  async process(text: string): Promise<any> {
    const normalized = text.toLowerCase().trim();

    for (const [command, handler] of this.commands) {
      if (normalized.startsWith(command)) {
        const params = normalized
          .substring(command.length)
          .trim()
          .split(/\s+/)
          .filter(Boolean);
        return await handler(params);
      }
    }

    return { action: 'chat', data: { message: text } };
  }

  getAvailableCommands(): string[] { return Array.from(this.commands.keys()); }
}

export default CommandProcessor;
