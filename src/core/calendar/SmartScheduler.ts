import { CalendarEvent, TimeSlot, SmartScheduleSuggestion } from './types';

export class SmartScheduler {
  private aiEngine: any;

  constructor(aiEngine: any) {
    this.aiEngine = aiEngine;
  }

  async findOptimalTimeSlot(
    duration: number,
    events: CalendarEvent[],
    preferences: {
      preferredHours?: { start: number; end: number };
      avoidWeekends?: boolean;
      bufferTime?: number;
    } = {}
  ): Promise<TimeSlot[]> {
    const now = new Date();
    const endOfWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const slots: TimeSlot[] = [];
    const sortedEvents = events.slice().sort((a, b) => a.start.getTime() - b.start.getTime());

    let currentTime = now;

    for (let i = 0; i < sortedEvents.length; i++) {
      const event = sortedEvents[i];
      const nextEventStart = event.start;
      const availableTime = (nextEventStart.getTime() - currentTime.getTime()) / (60 * 1000);

      if (availableTime >= duration + (preferences.bufferTime || 0)) {
        if (this.meetsPreferences(currentTime, preferences)) {
          slots.push({ start: new Date(currentTime), end: new Date(currentTime.getTime() + duration * 60 * 1000), available: true });
        }
      }

      currentTime = new Date(event.end.getTime() + (preferences.bufferTime || 0) * 60 * 1000);
    }

    if (currentTime < endOfWeek) {
      const availableTime = (endOfWeek.getTime() - currentTime.getTime()) / (60 * 1000);
      if (availableTime >= duration) {
        if (this.meetsPreferences(currentTime, preferences)) {
          slots.push({ start: new Date(currentTime), end: new Date(currentTime.getTime() + duration * 60 * 1000), available: true });
        }
      }
    }

    return slots.slice(0, 5);
  }

  private meetsPreferences(time: Date, preferences: any) {
    const hours = time.getHours();
    const day = time.getDay();
    if (preferences.avoidWeekends && (day === 0 || day === 6)) return false;
    if (preferences.preferredHours) {
      if (hours < preferences.preferredHours.start || hours >= preferences.preferredHours.end) return false;
    }
    return true;
  }

  async generateSmartSuggestions(tasks: any[], events: CalendarEvent[], userPreferences: any): Promise<SmartScheduleSuggestion[]> {
    const suggestions: SmartScheduleSuggestion[] = [];
    const highPriorityTasks = tasks.filter((t: any) => t.priority === 'high' && t.status === 'pending');

    for (const task of highPriorityTasks) {
      const estimatedDuration = task.estimatedDuration || 60;
      const slots = await this.findOptimalTimeSlot(estimatedDuration, events, { preferredHours: userPreferences?.productiveHours, avoidWeekends: true, bufferTime: 15 });
      if (slots.length > 0) {
        suggestions.push({ title: task.title, suggestedTime: slots[0].start, duration: estimatedDuration, reason: 'این زمان براساس الگوی کاری شما بهینه است', priority: 'high' });
      }
    }

    const aiSuggestions = await this.getAISuggestions(tasks, events, userPreferences);
    suggestions.push(...aiSuggestions);

    return suggestions.sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.priority] - ({ high: 0, medium: 1, low: 2 }[b.priority])));
  }

  private async getAISuggestions(tasks: any[], events: CalendarEvent[], userPreferences: any) {
    const prompt = `براساس این اطلاعات، چند پیشنهاد هوشمند برای مدیریت زمان بده:\nکارهای باقی مانده: ${tasks.length}\nجلسات امروز: ${events.length}`;
    try {
      const response = await this.aiEngine.generate(prompt, { maxTokens: 300 });
      const jsonMatch = response.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const aiSuggestions = JSON.parse(jsonMatch[0]);
        return aiSuggestions.map((s: any) => ({ ...s, suggestedTime: new Date(), duration: 30 }));
      }
    } catch (e) {
      console.error('AI suggestions failed', e);
    }
    return [];
  }
}

export default SmartScheduler;
