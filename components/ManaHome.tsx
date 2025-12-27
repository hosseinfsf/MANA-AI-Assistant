import React, { useEffect, useState } from 'react';
import GlassCard from './GlassCard';
import { sendMessageStream, checkAndConsumeQuota } from '../services/aiManager';
import { AssistantMode } from '../types';
import { useState, useEffect } from 'react';
import React from 'react';

const SmartTopTasks: React.FC = () => {
  const [tasksText, setTasksText] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const loadTasks = () => {
    try { return JSON.parse(localStorage.getItem('mana_tasks') || '[]') as string[]; } catch { return []; }
  };

  const generateTop = async () => {
    const items = loadTasks();
    if (items.length === 0) { setTasksText('لیست کارها خالی است.'); return; }
    setLoading(true); setTasksText('');
    const quota = checkAndConsumeQuota();
    if (!quota.allowed) { setTasksText('محدودیت روزانه تمام شد.'); setLoading(false); return; }

    const prompt = `Given the following tasks (in Persian), pick the top 3 most important tasks for today and order them. Tasks:\n${items.join('\n')}`;
    try {
      const stream = sendMessageStream(prompt, AssistantMode.Home, [], { model: 'gemini-3-flash-preview' });
      let full = '';
      for await (const chunk of stream) {
        full += chunk;
        setTasksText(full);
      }
    } catch (e) {
      setTasksText('خطا در تعیین اولویت‌ها.');
    } finally { setLoading(false); }
  };

  React.useEffect(() => { const t = loadTasks(); if (t.length) generateTop(); }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-white font-bold text-lg">۳ کار برتر امروز</div>
          <div className="text-white/80 text-sm">AI انتخاب می‌کند چه کاری مهم‌تر است</div>
        </div>
        <div className="flex gap-2">
          <button onClick={generateTop} className="px-3 py-1 bg-white/5 rounded">بازسازی</button>
        </div>
      </div>
      <div className="mt-2 text-white/90 whitespace-pre-wrap min-h-[60px]">{loading ? 'در حال تحلیل...' : (tasksText || '—')}</div>
    </div>
  );
};

const Clock: React.FC = () => {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60 * 1000);
    return () => clearInterval(t);
  }, []);
  const hours = time.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
  const date = new Intl.DateTimeFormat('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' }).format(time);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-6xl font-semibold text-white tracking-tight">{hours}</div>
      <div className="text-sm text-white/60">{date}</div>
    </div>
  );
};

const ManaHome: React.FC = () => {
  const [mood, setMood] = useState<string | null>(null);
  const [moodLoading, setMoodLoading] = useState(false);

  const loadCachedMood = () => {
    try {
      const key = `mana_mood_${new Date().toISOString().slice(0,10)}`;
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw).text as string;
    } catch { }
    return null;
  };

  const cacheMood = (text: string) => {
    try {
      const key = `mana_mood_${new Date().toISOString().slice(0,10)}`;
      localStorage.setItem(key, JSON.stringify({ text, ts: Date.now() }));
    } catch { }
  };

  const generateMood = async () => {
    setMoodLoading(true);
    setMood(null);
    const quota = checkAndConsumeQuota();
    if (!quota.allowed) {
      setMood('محدودیت روزانه تمام شده. برای ادامه نسخه پرو را فعال کنید.');
      setMoodLoading(false);
      return;
    }

    // build prompt using profile if available
    let profile = null;
    try { profile = JSON.parse(localStorage.getItem('mana_profile_v1') || 'null'); } catch { profile = null; }
    const userSummary = profile ? `${profile.name || ''}، ${profile.dailyActivity || ''}` : '';
    const prompt = `یک جمله کوتاه، شخصی و عملی برای امروز بنویس برای کاربر ${userSummary}. حداکثر 20 کلمه، لحن صمیمی، کمی شوخ.`;

    try {
      const stream = sendMessageStream(prompt, AssistantMode.Home, [], { model: 'gemini-3-flash-preview' });
      let full = '';
      for await (const chunk of stream) {
        full += chunk;
        setMood(full);
      }
      cacheMood(full);
    } catch (e) {
      setMood('امروز حال خوبی داشته باشی — فقط دو کار مهم را انجام بده.');
    } finally {
      setMoodLoading(false);
    }
  };

  useEffect(() => {
    const cached = loadCachedMood();
    if (cached) setMood(cached);
    else generateMood();
  }, []);
  return (
    <div className="fixed inset-0 z-[9000] text-right" dir="rtl">
      {/* Background live layer */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,#5b21b6 0%, #0ea5e9 50%, #030712 100%)', opacity: 0.95 }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.04), transparent 10%), radial-gradient(circle at 90% 80%, rgba(255,200,100,0.03), transparent 15%)' }} />
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.06 }}>
          <defs>
            <filter id="f1" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>
          {[...Array(60)].map((_, i) => (
            <circle key={i} cx={`${Math.random() * 100}%`} cy={`${Math.random() * 100}%`} r={Math.random() * 1.7 + 0.3} fill="#fff" filter="url(#f1)" />
          ))}
        </svg>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          <div className="mb-8 flex justify-center">
            <Clock />
          </div>

          <div className="snap-y snap-mandatory overflow-y-auto max-h-[60vh] space-y-6">
            {/* AI Mood Card */}
            <div className="snap-start">
              <GlassCard className="p-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold text-lg">امروز حالت چطوره؟</div>
                      <div className="text-white/80 text-sm">مانا یک جملهٔ کوتاه و شخصی‌شده برایت می‌سازد.</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => generateMood()} className="px-3 py-1 bg-white/5 rounded">تازه‌سازی</button>
                    </div>
                  </div>
                  <div className="mt-3 text-white/90 min-h-[48px]">{moodLoading ? 'در حال فکر کردن مانا...' : (mood || '—')}</div>
                </div>
              </GlassCard>
            </div>

            {/* Poem Card */}
            <div className="snap-start">
              <GlassCard className="p-6">
                <div className="flex flex-col gap-3">
                  <div className="text-white font-bold text-lg">فال / شعر امروز</div>
                  <div className="text-white/80 text-sm">دو بیت حافظ، یا جمله انگیزشی — قابل تنظیم</div>
                  <div className="mt-3 text-white/90">«دلم ز برگزار ترسید...»</div>
                </div>
              </GlassCard>
            </div>

            {/* Top tasks card */}
            <div className="snap-start">
              <GlassCard className="p-6">
                <div className="flex flex-col gap-3">
                  <div className="text-white font-bold text-lg">مهم‌ترین کارهای امروز</div>
                  <ol className="list-decimal list-inside text-white/85">
                    <li>ارسال گزارش پروژه</li>
                    <li>تمرین ۳۰ دقیقه‌ای</li>
                    <li>خرید مواد لازم</li>
                  </ol>
                </div>
              </GlassCard>
            </div>

            {/* Smart Top-3 Tasks (AI) */}
            <div className="snap-start">
              <GlassCard className="p-6">
                <SmartTopTasks />
              </GlassCard>
            </div>

            {/* Mini Assistant card */}
            <div className="snap-start">
              <GlassCard className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-white font-bold">می‌خوای چیزی بپرسی؟</div>
                  <div className="text-white/70 text-sm">یک سوال سریع یا فرمان صوتی</div>
                </div>
                <button className="bg-primary px-4 py-2 rounded-lg font-bold">باز کن</button>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManaHome;
