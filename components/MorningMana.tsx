import React, { useEffect, useState } from 'react';
import { sendMessageStream, checkAndConsumeQuota } from '../services/aiManager';
import { loadGhazals, getRandomGhazal } from '../src/services/hafezService';
import { AssistantMode } from '../types';

interface MorningManaProps {
  isOpen: boolean;
  onClose: () => void;
}

const MorningMana: React.FC<MorningManaProps> = ({ isOpen, onClose }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      setLoading(true);
      setText('');
      let profile = null;
      try { profile = JSON.parse(localStorage.getItem('mana_profile_v1') || 'null'); } catch { profile = null; }
      await loadGhazals();
      const random = getRandomGhazal();
      const verses = random ? random.verses.map((v:any)=> v.mesra1 + ' / ' + v.mesra2).slice(0,2).join('\n') : '';
      const prompt = `یک صبحانهٔ کوتاه و انرژی‌بخش بنویس برای کاربر ${profile?.name || ''}. شامل: آب‌وهوا کوتاه، یک فال حافظ کوتاه (با این مصرع‌ها: ${verses}), تعداد تسک‌های امروز (از localStorage mana_tasks)، و یک جمله انگیزشی. لحن: صمیمی و کمی شوخ.`;

      try {
        const quota = checkAndConsumeQuota();
        if (!quota.allowed) {
          setText('محدودیت روزانه نسخه رایگان تمام شد. برای ادامه نسخه پرو را خریداری کنید.');
          setLoading(false);
          return;
        }
        const stream = sendMessageStream(prompt, AssistantMode.Home, [], { model: 'gemini-3-flash-preview' });
        let full = '';
        for await (const chunk of stream) {
          full += chunk;
          setText(full);
        }
      } catch (e) {
        setText('خطا در تولید صبحانه مانا.');
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl bg-[#0b0b0b] rounded-2xl p-6 text-right text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-xl">صبحانهٔ مانا</h3>
          <button onClick={onClose} className="px-3 py-2 bg-white/5 rounded">بستن</button>
        </div>
        <div className="min-h-[160px] p-4 bg-white/5 rounded">
          {loading ? <div>در حال آماده‌سازی...</div> : <div className="whitespace-pre-wrap">{text}</div>}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={() => { navigator.clipboard.writeText(text); alert('کپی شد'); }} className="px-3 py-2 bg-white/5 rounded">کپی</button>
          <button onClick={() => onClose()} className="px-3 py-2 bg-primary rounded">بستن</button>
        </div>
      </div>
    </div>
  );
};

export default MorningMana;
