const KEY_DATE = 'mana_ai_limits_date';
const KEY_COUNT = 'mana_ai_limits_count';

export function canAsk(isPro: boolean, freeDailyLimit = 20) {
  if (isPro) return true;
  const today = new Date().toISOString().slice(0,10);
  const stored = localStorage.getItem(KEY_DATE);
  let count = Number(localStorage.getItem(KEY_COUNT) || '0');
  if (stored !== today) {
    localStorage.setItem(KEY_DATE, today);
    localStorage.setItem(KEY_COUNT, '0');
    count = 0;
  }
  return count < freeDailyLimit;
}

export function registerAsk(isPro: boolean) {
  if (isPro) return;
  const today = new Date().toISOString().slice(0,10);
  const stored = localStorage.getItem(KEY_DATE);
  let count = Number(localStorage.getItem(KEY_COUNT) || '0');
  if (stored !== today) {
    localStorage.setItem(KEY_DATE, today);
    count = 0;
  }
  count += 1;
  localStorage.setItem(KEY_COUNT, String(count));
}

export function getRemaining(isPro: boolean, freeDailyLimit = 20) {
  if (isPro) return Infinity;
  const stored = localStorage.getItem(KEY_COUNT);
  const count = Number(stored || '0');
  return Math.max(0, freeDailyLimit - count);
}
