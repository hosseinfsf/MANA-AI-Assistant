
import React, { useState, useEffect } from 'react';
import FloatingBubble from './components/FloatingBubble';
import ChatWindow from './components/ChatWindow';
import SettingsModal from './components/SettingsModal';
import OnboardingModal from './components/OnboardingModal';
import ClipboardQuickActions from './components/ClipboardQuickActions';
import MorningMana from './components/MorningMana';
import QuickAIResponse from './components/QuickAIResponse';
import MockCheckout from './components/MockCheckout';
import { AppSettings, UserProfile } from './types';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const defaultBg = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop';
    try {
      const saved = localStorage.getItem('mana_settings_v2');
      return saved ? JSON.parse(saved) : {
        apiKey: '',
        useCustomKey: false,
        model: 'gemini-3-flash-preview',
        aiProvider: 'gemini',
        freeDailyLimit: 20,
        isPro: false,
        assistantEnabled: true,
        activeTheme: 'purple',
        backgroundImage: defaultBg,
        fontSize: 'medium',
        autoSpeech: false,
        newsCategory: 'تکنولوژی',
        widgets: []
      } as AppSettings;
    } catch (e) {
      return { isPro: false, assistantEnabled: true, activeTheme: 'purple', backgroundImage: defaultBg } as AppSettings;
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [appActive, setAppActive] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try { const p = localStorage.getItem('mana_profile_v1'); return p ? JSON.parse(p) : null; } catch { return null; }
  });
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(() => !Boolean(localStorage.getItem('mana_onboard_done')));
  const [initialInputText, setInitialInputText] = useState<string | undefined>(undefined);
  const [morningOpen, setMorningOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [quickPrompt, setQuickPrompt] = useState<string | undefined>(undefined);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    const dbl = async () => {
      // quick AI action: summarize clipboard or send a short prompt without opening full app
      try {
        const clip = await navigator.clipboard.readText().catch(() => '');
        const p = clip && clip.length > 10 ? `خلاصه کن:\n${clip}` : 'سلام مانا! یک پیام کوتاه انگیزشی بده.';
        setQuickPrompt(p);
        setQuickOpen(true);
      } catch (e) {
        setQuickPrompt('سلام مانا! یک پیام کوتاه انگیزشی بده.');
        setQuickOpen(true);
      }
    };
    const longpress = () => setIsSettingsOpen(true);
    const openWithText = (e: any) => {
      const t = e?.detail?.text || '';
      setInitialInputText(t);
      setIsOpen(true);
      setTimeout(() => setInitialInputText(undefined), 2000);
    };
    window.addEventListener('mana_bubble_doubletap', dbl as EventListener);
    window.addEventListener('mana_bubble_longpress', longpress as EventListener);
    window.addEventListener('mana_open_with_text', openWithText as EventListener);
    return () => {
      window.removeEventListener('mana_bubble_doubletap', dbl as EventListener);
      window.removeEventListener('mana_bubble_longpress', longpress as EventListener);
      window.removeEventListener('mana_open_with_text', openWithText as EventListener);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('mana_settings_v2', JSON.stringify(settings));
    document.body.style.backgroundImage = `url('${settings.backgroundImage}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
  }, [settings]);

  return (
    <div className="relative w-full h-screen overflow-hidden text-right" dir="rtl">
      
      {/* Decorative environment objects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none animate-bounce duration-[8s]"></div>

      {isOpen ? (
        <ChatWindow 
          isOpen={isOpen} 
          appSettings={settings}
          onUpdateSettings={setSettings}
          onOpenSettings={() => setIsSettingsOpen(true)}
          initialInputText={initialInputText}
        />
      ) : (
        <ManaHome />
      )}

      <FloatingBubble 
        isOpen={isOpen} 
        onClick={() => setIsOpen(!isOpen)} 
      />

      {/* Small control panel when app is open: toggle active + quick settings */}
      {isOpen && (
        <div className="fixed bottom-36 right-10 z-[10001] flex flex-col items-end gap-3">
          <button
            onClick={() => setAppActive(a => !a)}
            className={`px-4 py-2 rounded-xl font-bold text-sm ${appActive ? 'bg-primary text-white' : 'bg-white/5 text-white/60'} transition-all`}
          >
            {appActive ? 'فعال' : 'غیرفعال'}
          </button>
          <button onClick={() => setIsSettingsOpen(true)} className="px-4 py-2 rounded-xl bg-white/5 text-white/80 font-bold">تنظیمات</button>
        </div>
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={(newS) => { setSettings(newS); setIsSettingsOpen(false); }}
        onRequestPurchase={() => setCheckoutOpen(true)}
        onClearHistory={() => window.dispatchEvent(new Event('mana_clear_history'))}
      />

      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onComplete={(p) => { setProfile(p); setOnboardingOpen(false); }}
      />

      <ClipboardQuickActions />
      <MorningMana isOpen={morningOpen} onClose={() => setMorningOpen(false)} />
      <MockCheckout isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} onComplete={() => {
        setSettings(prev => ({ ...prev, isPro: true }));
        setCheckoutOpen(false);
      }} />
      <QuickAIResponse isOpen={quickOpen} prompt={quickPrompt} onClose={() => setQuickOpen(false)} />

      {/* Screen background texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
}
