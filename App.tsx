
import React, { useState, useEffect } from 'react';
import FloatingBubble from './components/FloatingBubble';
import ChatWindow from './components/ChatWindow';
import { AppSettings } from './types';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const defaultBg = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop';
    try {
      const saved = localStorage.getItem('mana_settings_v2');
      return saved ? JSON.parse(saved) : {
        apiKey: '',
        model: 'gemini-3-flash-preview',
        theme: 'dark',
        activeTheme: 'purple',
        backgroundImage: defaultBg,
        fontSize: 'medium',
        autoSpeech: false,
        showSingleNotification: false,
        newsCategory: 'تکنولوژی'
      };
    } catch (e) {
      return { activeTheme: 'purple', backgroundImage: defaultBg };
    }
  });

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

      <ChatWindow 
        isOpen={isOpen} 
        appSettings={settings}
        onUpdateSettings={setSettings}
      />
      
      <FloatingBubble 
        isOpen={isOpen} 
        onClick={() => setIsOpen(!isOpen)} 
      />

      {/* Screen background texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
}
