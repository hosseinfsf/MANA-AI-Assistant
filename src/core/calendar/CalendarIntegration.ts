import GoogleCalendarAPI from './GoogleCalendarAPI';
import SmartScheduler from './SmartScheduler';
import { CalendarEvent, SmartScheduleSuggestion } from './types';

export class CalendarIntegration {
  private googleCalendar: GoogleCalendarAPI;
  private smartScheduler: SmartScheduler;
  private localEvents: Map<string, CalendarEvent> = new Map();

  constructor(googleClientId: string, googleApiKey: string, aiEngine: any) {
    this.googleCalendar = new GoogleCalendarAPI(googleClientId, googleApiKey);
    this.smartScheduler = new SmartScheduler(aiEngine);
    this.loadLocalEvents();
  }

  async authenticate() {
    await this.googleCalendar.authenticate();
    await this.syncWithGoogle();
  }

  async syncWithGoogle(): Promise<void> {
    if (!this.googleCalendar.isAuthenticated()) throw new Error('Not authenticated');
    const now = new Date();
    const future = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const events = await this.googleCalendar.getEvents(now, future);
    events.forEach(e => this.localEvents.set(e.id, e));
    this.saveLocalEvents();
  }

  async createEvent(event: Omit<CalendarEvent, 'id' | 'source'>): Promise<CalendarEvent> {
    if (this.googleCalendar.isAuthenticated()) {
      const created = await this.googleCalendar.createEvent(event);
      this.localEvents.set(created.id, created);
      this.saveLocalEvents();
      return created;
    }
    const localEvent: CalendarEvent = { ...event, id: this.generateId(), source: 'local', status: 'confirmed' };
    this.localEvents.set(localEvent.id, localEvent);
    this.saveLocalEvents();
    return localEvent;
  }

  async updateEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const event = this.localEvents.get(eventId);
    if (!event) throw new Error('Event not found');
    if (event.source === 'google' && this.googleCalendar.isAuthenticated()) {
      const updated = await this.googleCalendar.updateEvent(eventId, updates);
      this.localEvents.set(eventId, updated);
      this.saveLocalEvents();
      return updated;
    }
    const updated = { ...event, ...updates } as CalendarEvent;
    this.localEvents.set(eventId, updated);
    this.saveLocalEvents();
    return updated;
  }

  async deleteEvent(eventId: string): Promise<void> {
    const event = this.localEvents.get(eventId);
    if (!event) return;
    if (event.source === 'google' && this.googleCalendar.isAuthenticated()) await this.googleCalendar.deleteEvent(eventId);
    this.localEvents.delete(eventId);
    this.saveLocalEvents();
  }

  getEvents(filter?: { startDate?: Date; endDate?: Date; source?: 'google'|'local' }): CalendarEvent[] {
    let events = Array.from(this.localEvents.values());
    if (filter) {
      if (filter.startDate) events = events.filter(e => e.start >= filter.startDate!);
      if (filter.endDate) events = events.filter(e => e.end <= filter.endDate!);
      if (filter.source) events = events.filter(e => e.source === filter.source);
    }
    return events.sort((a,b) => a.start.getTime() - b.start.getTime());
  }

  async getSmartSuggestions(tasks: any[], userPreferences: any): Promise<SmartScheduleSuggestion[]> {
    const events = this.getEvents({ startDate: new Date(), endDate: new Date(Date.now() + 7*24*60*60*1000) });
    return await this.smartScheduler.generateSmartSuggestions(tasks, events, userPreferences);
  }

  async findOptimalTimeSlot(duration: number, preferences?: any) {
    const events = this.getEvents({ startDate: new Date(), endDate: new Date(Date.now() + 7*24*60*60*1000) });
    return await this.smartScheduler.findOptimalTimeSlot(duration, events, preferences);
  }

  private generateId() { return `event_${Date.now()}_${Math.random().toString(36).slice(2,9)}`; }

  private loadLocalEvents() {
    try {
      const stored = localStorage.getItem('mana_calendar_events');
      if (!stored) return;
      const arr: any[] = JSON.parse(stored);
      arr.forEach(item => {
        item.start = new Date(item.start);
        item.end = new Date(item.end);
        this.localEvents.set(item.id, item);
      });
    } catch {}
  }

  private saveLocalEvents() {
    try { localStorage.setItem('mana_calendar_events', JSON.stringify(Array.from(this.localEvents.values()))); } catch {}
  }
}

export default CalendarIntegration;
