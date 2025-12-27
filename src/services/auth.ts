import { setJSON, getJSON, removeKey } from '../utils/storage';

type Provider = 'google' | 'apple';

const USER_KEY = 'mana_user';
const TOKEN_KEY = 'mana_auth_token';

export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
  provider?: Provider;
}

let authListeners: Array<(u: UserProfile | null) => void> = [];

function notify(u: UserProfile | null) {
  authListeners.forEach(cb => cb(u));
}

export async function signInWithProvider(provider: Provider): Promise<UserProfile | null> {
  // NOTE: This is a lightweight client-side OAuth popup flow helper.
  // For production, implement server-side OAuth to keep client secrets secure.

  const redirectOrigin = window.location.origin;
  const popup = window.open(
    `${redirectOrigin}/auth/${provider}`,
    `mana-auth-${provider}`,
    'width=500,height=700'
  );

  return new Promise((resolve, reject) => {
    if (!popup) return reject(new Error('Popup blocked'));

    const handle = (e: MessageEvent) => {
      if (!e.data || e.data.source !== 'mana-oauth') return;
      if (e.data.error) {
        window.removeEventListener('message', handle);
        popup.close();
        return reject(new Error(e.data.error));
      }

      const profile: UserProfile = e.data.profile;
      const token = e.data.token;
      setJSON(USER_KEY, profile);
      setJSON(TOKEN_KEY, { token, provider });
      window.removeEventListener('message', handle);
      try { popup.close(); } catch {}
      notify(profile);
      resolve(profile);
    };

    window.addEventListener('message', handle);

    // fallback: timeout
    setTimeout(() => {
      window.removeEventListener('message', handle);
      try { popup.close(); } catch {}
      reject(new Error('Authentication timeout'));
    }, 5 * 60 * 1000);
  });
}

export function signInWithGoogle() { return signInWithProvider('google'); }
export function signInWithApple() { return signInWithProvider('apple'); }

export function signOut() {
  removeKey(USER_KEY);
  removeKey(TOKEN_KEY);
  notify(null);
}

export function getCurrentUser(): UserProfile | null {
  return getJSON(USER_KEY) as UserProfile | null;
}

export function onAuthChange(cb: (u: UserProfile | null) => void) {
  authListeners.push(cb);
  return () => { authListeners = authListeners.filter(x => x !== cb); };
}

export default {
  signInWithGoogle,
  signInWithApple,
  signOut,
  getCurrentUser,
  onAuthChange,
};
