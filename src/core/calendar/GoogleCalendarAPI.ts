import { CalendarEvent } from './types';

export class GoogleCalendarAPI {
  private accessToken: string | null = null;
  private clientId: string;
  private apiKey: string;

  constructor(clientId: string, apiKey: string) {
    this.clientId = clientId;
    this.apiKey = apiKey;
  }

  async authenticate(): Promise<void> {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: window.location.origin + '/auth/callback',
      response_type: 'token',
      scope: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events',
    })}`;

    const popup = window.open(authUrl, 'Google Auth', 'width=500,height=700');
    return new Promise((resolve, reject) => {
      if (!popup) return reject(new Error('Popup blocked'));

      const checkInterval = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(checkInterval);
            if (this.accessToken) resolve(); else reject(new Error('Authentication cancelled'));
          }
        } catch {}
      }, 500);

      const handler = (event: MessageEvent) => {
        if (event.data?.type === 'google-auth-token') {
          this.accessToken = event.data.token;
          window.removeEventListener('message', handler);
          try { popup.close(); } catch {}
          clearInterval(checkInterval);
          resolve();
        }
      };

      window.addEventListener('message', handler);

      setTimeout(() => {
        clearInterval(checkInterval);
        window.removeEventListener('message', handler);
        try { popup.close(); } catch {}
        reject(new Error('Authentication timeout'));
      }, 5 * 60 * 1000);
    });
  }

  isAuthenticated(): boolean { return !!this.accessToken; }

  signOut() { this.accessToken = null; }

  private async fetchJson(url: string) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${this.accessToken}` } });
    if (!res.ok) throw new Error(`Google API error: ${res.statusText}`);
    return res.json();
  }

  async getEvents(timeMin: Date, timeMax: Date, maxResults: number = 250): Promise<CalendarEvent[]> {
    if (!this.accessToken) throw new Error('Not authenticated');
    const params = new URLSearchParams({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      maxResults: String(maxResults),
      singleEvents: 'true',
      orderBy: 'startTime',
    });

    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params.toString()}`;
    const data = await this.fetchJson(url);
    return (data.items || []).map((item: any) => this.parseGoogleEvent(item));
  }

  async createEvent(event: Omit<CalendarEvent, 'id' | 'source'>): Promise<CalendarEvent> {
    if (!this.accessToken) throw new Error('Not authenticated');
    const googleEvent: any = {
      summary: event.title,
      description: event.description,
      location: event.location,
      start: { dateTime: event.start.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
      end: { dateTime: event.end.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
      attendees: event.attendees?.map(email => ({ email })),
    };

    const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(googleEvent),
    });

    if (!res.ok) throw new Error(`Create event failed: ${res.statusText}`);
    const data = await res.json();
    return this.parseGoogleEvent(data);
  }

  async updateEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    if (!this.accessToken) throw new Error('Not authenticated');
    const googleEvent: any = {};
    if (updates.title) googleEvent.summary = updates.title;
    if (updates.description) googleEvent.description = updates.description;
    if (updates.location) googleEvent.location = updates.location;
    if (updates.start) googleEvent.start = { dateTime: updates.start.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
    if (updates.end) googleEvent.end = { dateTime: updates.end.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };

    const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${this.accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(googleEvent),
    });

    if (!res.ok) throw new Error(`Update event failed: ${res.statusText}`);
    const data = await res.json();
    return this.parseGoogleEvent(data);
  }

  async deleteEvent(eventId: string): Promise<void> {
    if (!this.accessToken) throw new Error('Not authenticated');
    const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${this.accessToken}` } });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  }

  private parseGoogleEvent(item: any): CalendarEvent {
    return {
      id: item.id,
      title: item.summary || 'Untitled',
      description: item.description,
      start: new Date(item.start?.dateTime || item.start?.date),
      end: new Date(item.end?.dateTime || item.end?.date),
      location: item.location,
      attendees: item.attendees?.map((a: any) => a.email) || [],
      color: item.colorId,
      source: 'google',
      status: item.status || 'confirmed',
    };
  }
}

export default GoogleCalendarAPI;
