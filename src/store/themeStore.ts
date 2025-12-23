import { create } from 'zustand';

type Theme = 'dark-glass' | 'amoled-black' | 'light-minimal' | 'persian-night' | 'neon-tech';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'dark-glass', // تم پیش‌فرض
  setTheme: (theme) => set({ theme }),
}));