import React, { useEffect, useState } from 'react';
import { Copy, FilePlus, RefreshCcw } from 'lucide-react';

const ClipboardQuickActions: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState<string>('');

  useEffect(() => {
    const handler = async (e: ClipboardEvent) => {
      // try to read from clipboard API as fallback
      let t = '';
      try { t = (e && (e.clipboardData as any)?.getData('text')) || await navigator.clipboard.readText(); } catch { t = '' }
      if (!t) return;
      setText(t);
      setVisible(true);
      setTimeout(() => setVisible(false), 6000);
    };

    document.addEventListener('copy', handler as any);
    return () => document.removeEventListener('copy', handler as any);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-40 right-8 z-[20000] w-[320px] bg-[#0b0b0b] p-3 rounded-xl shadow-lg text-right text-white">
      <div className="text-sm text-white/70 mb-2">متنی کپی شد:</div>
      <div className="text-xs max-h-24 overflow-auto whitespace-pre-wrap mb-3 text-white/80 p-2 bg-white/5 rounded">{text}</div>
      <div className="flex justify-end gap-2">
        <button onClick={() => { window.dispatchEvent(new CustomEvent('mana_open_with_text', { detail: { text } })); setVisible(false); }} className="px-3 py-2 bg-primary rounded">باز کردن در چت</button>
        <button onClick={() => { window.dispatchEvent(new CustomEvent('mana_open_with_text', { detail: { text: 'خلاصه کن:\n' + text } })); setVisible(false); }} className="px-3 py-2 bg-white/5 rounded">خلاصه کن</button>
        <button onClick={() => { const saves = JSON.parse(localStorage.getItem('mana_clip_saves') || '[]'); saves.unshift({ text, time: Date.now() }); localStorage.setItem('mana_clip_saves', JSON.stringify(saves)); alert('ذخیره شد'); setVisible(false); }} className="px-3 py-2 bg-white/5 rounded">ذخیره</button>
      </div>
    </div>
  );
};

export default ClipboardQuickActions;
