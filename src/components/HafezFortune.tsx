import React, { useState, useEffect } from 'react';
import { loadGhazals, getRandomGhazal } from '../services/hafezService';
import type { Ghazal } from '../types';
import { sendMessageStream, checkAndConsumeQuota } from '../../services/aiManager';
import { AssistantMode } from '../../types';

const HafezFortune: React.FC = () => {
  const [currentGhazal, setCurrentGhazal] = useState<Ghazal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load the ghazals data from the JSON file
  useEffect(() => {
    const loadGhazalsData = async () => {
      try {
        await loadGhazals();
        const randomGhazal = getRandomGhazal();
        setCurrentGhazal(randomGhazal);
        setLoading(false);
      } catch (err) {
        console.error('Error loading ghazals:', err);
        setError('خطا در بارگذاری اطلاعات غزل‌ها');
        setLoading(false);
      }
    };

    loadGhazalsData();
  }, []);

  const getNewFortune = async () => {
    setLoading(true);
    try {
      // Since data is already loaded, we can get a new random ghazal directly
      const randomGhazal = getRandomGhazal();
      setCurrentGhazal(randomGhazal);
    } catch (err) {
      console.error('Error getting new fortune:', err);
      setError('خطا در دریافت فال جدید');
    }
    setLoading(false);
  };

  const [interpretation, setInterpretation] = useState<string>('');
  const [isInterpreting, setIsInterpreting] = useState<boolean>(false);

  const interpret = async () => {
    if (!currentGhazal) return;
    setIsInterpreting(true);
    setInterpretation('');

    // load profile from localStorage if available
    let profile = null;
    try { profile = JSON.parse(localStorage.getItem('mana_profile_v1') || 'null'); } catch { profile = null; }

    const versesText = currentGhazal.verses.map(v => `${v.mesra1} / ${v.mesra2}`).join('\n');
    const userSummary = profile ? `نام: ${profile.name || 'ناشناخته'}، سن: ${profile.ageRange || 'نامشخص'}، فعالیت روزانه: ${profile.dailyActivity || '-'}، ماه تولد: ${profile.birthMonth || '-'}، شهر: ${profile.city || '-'}` : 'پروفایل کاربر موجود نیست.';

    const prompt = `این یک فال حافظ است:
${versesText}

شرح: لطفاً یک تفسیر کوتاه، مثبت و عملی برای این فال بنویس که با شخصیت "مانا" (صمیمی، کمی شوخ، حرفه‌ای) سازگار باشد. همچنین یک جمله انگیزشی کوتاه و ۲ پیشنهاد عملی برای امروز اضافه کن. اطلاعات کاربر: ${userSummary}`;

    try {
      const quota = checkAndConsumeQuota();
      if (!quota.allowed) {
        setInterpretation('محدودیت روزانه نسخه رایگان تمام شد. برای ادامه نسخه پرو را خریداری کنید.');
        setIsInterpreting(false);
        return;
      }
      const stream = sendMessageStream(prompt, AssistantMode.Chat, [], { model: 'gemini-3-flash-preview' });
      let full = '';
      for await (const chunk of stream) {
        full += chunk;
        setInterpretation(full);
      }
    } catch (e) {
      setInterpretation('خطا در دریافت تفسیر. لطفا بعدا امتحان کنید.');
    } finally {
      setIsInterpreting(false);
    }
  };

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-purple-700"> فال حافظ ✨</h1>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-lg">در حال بارگذاری فال...</p>
        </div>
      ) : currentGhazal ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">{currentGhazal.title}</h2>
          
          <div className="space-y-6 mb-8">
            {currentGhazal.verses.map((verse, index) => (
              <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <p className="text-lg leading-relaxed text-right font-serif text-gray-900" dir="rtl">
                  {verse.mesra1}
                </p>
                <p className="text-lg leading-relaxed text-right font-serif text-gray-900 mt-3" dir="rtl">
                  {verse.mesra2}
                </p>
              </div>
            ))}
          </div>
          
          <button
            onClick={getNewFortune}
            disabled={loading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'در حال بارگذاری...' : 'فال جدید بگیر ✨'}
          </button>
          <div className="mt-4">
            <button onClick={interpret} disabled={isInterpreting} className="px-6 py-3 ml-2 bg-amber-400 text-black rounded-lg hover:brightness-95 transition-colors duration-200 disabled:opacity-50">
              {isInterpreting ? 'در حال تفسیر...' : 'تفسیر با مانا'}
            </button>
          </div>

          {interpretation && (
            <div className="mt-6 text-right bg-white/5 p-4 rounded-lg text-gray-100" dir="rtl">
              <h3 className="font-bold text-white mb-2">تفسیر مانا</h3>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{interpretation}</div>
              <div className="mt-3 flex gap-2 justify-end">
                <button onClick={() => { navigator.clipboard.writeText(interpretation); alert('کپی شد'); }} className="px-3 py-2 bg-white/5 rounded-lg">کپی</button>
                <button onClick={() => setInterpretation('')} className="px-3 py-2 bg-white/5 rounded-lg">بستن</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">غزلی یافت نشد</div>
      )}
    </div>
  );
};

export default HafezFortune;