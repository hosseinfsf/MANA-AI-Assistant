import React, { useState, useEffect } from 'react';
import FloatingBubble from './components/FloatingBubble';
import ChatWindow from './components/ChatWindow';
import DemoBackground from './components/DemoBackground';
import { AppSettings } from './types';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [droppedText, setDroppedText] = useState<string>('');
  
  // App Settings State
  const [settings, setSettings] = useState<AppSettings>(() => {
    // Load from local storage if available
    try {
      const saved = localStorage.getItem('dastyar_settings');
      const defaultBg = 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop';
      
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.backgroundImage) parsed.backgroundImage = defaultBg;
        if (!parsed.quoteSource) parsed.quoteSource = 'motivational';
        if (!parsed.fontSize) parsed.fontSize = 'medium';
        if (!parsed.musicProvider) parsed.musicProvider = 'local';
        return parsed;
      }
      
      return {
        apiKey: '',
        model: 'gemini-2.5-flash',
        theme: 'light',
        backgroundImage: defaultBg,
        quoteSource: 'motivational',
        fontSize: 'medium',
        musicProvider: 'local'
      };
    } catch (e) {
      return {
        apiKey: '',
        model: 'gemini-2.5-flash',
        theme: 'light',
        backgroundImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
        quoteSource: 'motivational',
        fontSize: 'medium',
        musicProvider: 'local'
      };
    }
  });

  // Apply Theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('dastyar_settings', JSON.stringify(settings));
  }, [settings]);

  const toggleAssistant = () => {
    setIsOpen(prev => !prev);
  };

  const handleDropText = (text: string) => {
    setDroppedText(text);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden text-right bg-slate-200 dark:bg-slate-900 transition-colors duration-500" dir="rtl">
      {/* Background content to demonstrate "floating" nature */}
      <DemoBackground />

      {/* The Floating Assistant Interface */}
      <ChatWindow 
        isOpen={isOpen} 
        initialText={droppedText}
        onClearInitialText={() => setDroppedText('')}
        appSettings={settings}
        onUpdateSettings={setSettings}
      />
      
      <FloatingBubble 
        isOpen={isOpen} 
        onClick={toggleAssistant}
        onDropText={handleDropText}
      />
    </div>
  );
}