export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  attendees?: string[];
  reminder?: number; // minutes before
  color?: string;
  recurring?: RecurringPattern | null;
  source: 'google' | 'local' | 'outlook';
  status: 'confirmed' | 'tentative' | 'cancelled';
}

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: Date;
  daysOfWeek?: number[]; // 0-6
}

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

export interface SmartScheduleSuggestion {
  title: string;
  suggestedTime: Date;
  duration: number;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}
