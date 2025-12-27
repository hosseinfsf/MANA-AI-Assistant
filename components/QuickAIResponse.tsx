import React, { useEffect, useState } from 'react';
import { sendMessageStream, checkAndConsumeQuota } from '../services/aiManager';
import { AssistantMode } from '../types';

interface Props { isOpen: boolean; prompt?: string; onClose: () => void; }

const QuickAIResponse: React.FC<Props> = ({ isOpen, prompt, onClose }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      setLoading(true);
      setText('');
      const p = prompt || '';
      const quota = checkAndConsumeQuota();
      if (!quota.allowed) {
        setText('محدودیت روزانه نسخه رایگان تمام شد.');
        setLoading(false);
        return;
      }
      try {
        const stream = sendMessageStream(p, AssistantMode.Chat, [], {});
        let full = '';
        for await (const chunk of stream) {
          full += chunk;
          setText(full);
        }
      } catch (e) {
        setText('خطا در دریافت پاسخ AI.');
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen, prompt]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[25000] flex items-end justify-center p-4">
      <div className="w-full max-w-xl bg-[#0b0b0b] rounded-xl p-4 text-right text-white shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-bold">پاسخ سریع مانا</div>
          <div className="flex gap-2">
            <button onClick={() => { navigator.clipboard.writeText(text); alert('کپی شد'); }} className="px-3 py-1 bg-white/5 rounded">کپی</button>
            <button onClick={onClose} className="px-3 py-1 bg-primary rounded">بستن</button>
          </div>
        </div>
        <div className="min-h-[80px] max-h-64 overflow-auto whitespace-pre-wrap text-sm bg-white/5 p-3 rounded">{loading ? 'در حال دریافت...' : text}</div>
      </div>
    </div>
  );
};

export default QuickAIResponse;
