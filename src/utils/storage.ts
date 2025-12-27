export function setJSON(key: string, value: any) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

export function getJSON<T = any>(key: string): T | null {
  try {
    const v = localStorage.getItem(key);
    if (!v) return null;
    return JSON.parse(v) as T;
  } catch { return null; }
}

export function removeKey(key: string) {
  try { localStorage.removeItem(key); } catch { /* ignore */ }
}

export default { setJSON, getJSON, removeKey };
