
import React from 'react';
import { X, Moon, Sun, Bell, Volume2, Newspaper, Trash2, Palette, ShieldCheck, Check } from 'lucide-react';
import { AppSettings, NewsCategory, ThemeType } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
  onClearHistory: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave, onClearHistory }) => {
  const [ls, setLs] = React.useState<AppSettings>(settings);

  React.useEffect(() => { setLs(settings); }, [settings, isOpen]);

  if (!isOpen) return null;

  const cats: NewsCategory[] = ['سیاسی', 'اجتماعی', 'ورزشی', 'تکنولوژی', 'اقتصادی', 'هنری'];
  
  const themes: {id: ThemeType, label: string, color: string}[] = [
    { id: 'macos', label: 'Classic macOS', color: 'bg-blue-500' },
    { id: 'purple', label: 'Amethyst Purple', color: 'bg-fuchsia-500' },
    { id: 'ocean', label: 'Ocean Deep', color: 'bg-sky-600' },
    { id: 'nature', label: 'Spring Nature', color: 'bg-emerald-500' }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-3xl animate-in fade-in duration-500 p-8">
      <div className="bg-white/95 dark:bg-[#1C1C1E]/95 w-full max-w-[680px] max-h-[90vh] overflow-y-auto rounded-[4rem] shadow-[0_100px_200px_rgba(0,0,0,1)] border border-white/10 scrollbar-hide">
        
        <div className="p-12 flex justify-between items-center border-b border-white/5 sticky top-0 bg-inherit z-10 backdrop-blur-3xl">
          <div>
            <h3 className="font-black text-gray-900 dark:text-white text-4xl tracking-tighter">System Preferences</h3>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mt-1">مرکز شخصی‌سازی مانا</p>
          </div>
          <button onClick={onClose} className="p-5 bg-gray-100 dark:bg-white/5 rounded-full hover:scale-110 active:scale-90 transition-all shadow-inner border border-white/10"><X size={30} className="text-gray-500 dark:text-gray-400" /></button>
        </div>

        <div className="p-12 space-y-16">
          
          {/* Visual Themes Selection */}
          <div className="space-y-6">
             <label className="text-[12px] font-black text-gray-400 uppercase tracking-[0.6em] px-2 flex items-center gap-2">
                <Palette size={18} /> Visual Styles
             </label>
             <div className="grid grid-cols-2 gap-4">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setLs({...ls, activeTheme: t.id})}
                    className={`flex items-center gap-4 p-5 rounded-[2.5rem] border transition-all ${ls.activeTheme === t.id ? 'bg-primary/10 border-primary ring-2 ring-primary/20' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                  >
                    <div className={`w-10 h-10 rounded-2xl ${t.color} flex items-center justify-center text-white shadow-lg`}>
                      {ls.activeTheme === t.id && <Check size={20} />}
                    </div>
                    <div className="text-right">
                       <p className={`text-lg font-black ${ls.activeTheme === t.id ? 'text-primary' : 'text-white/60'}`}>{t.label}</p>
                    </div>
                  </button>
                ))}
             </div>
          </div>

          {/* Notifications */}
          <div className="space-y-6">
             <label className="text-[12px] font-black text-gray-400 uppercase tracking-[0.6em] px-2 flex items-center gap-2">
                <Bell size={18} /> Notifications
             </label>
             <div className="bg-gray-100 dark:bg-white/5 p-8 rounded-[3rem] flex items-center justify-between border border-white/5 hover:bg-white/10 transition-all">
                <div className="flex flex-col gap-1">
                   <span className="text-2xl font-black text-gray-800 dark:text-white">نمایش هوشمند</span>
                   <span className="text-sm opacity-30 font-bold">نمایش متمرکز اعلان‌های شبکه‌های اجتماعی</span>
                </div>
                <button 
                   onClick={() => setLs({...ls, showSingleNotification: !ls.showSingleNotification})}
                   className={`w-20 h-10 rounded-full relative transition-all duration-500 ${ls.showSingleNotification ? 'bg-[#34C759] shadow-[0_0_20px_rgba(52,199,89,0.3)]' : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                   <div className={`absolute top-1 w-8 h-8 bg-white rounded-full transition-all shadow-md ${ls.showSingleNotification ? 'right-11' : 'right-1'}`}></div>
                </button>
             </div>
          </div>

          {/* News Feed Category */}
          <div className="space-y-6">
            <label className="text-[12px] font-black text-gray-400 uppercase tracking-[0.6em] px-2 flex items-center gap-2">
                <Newspaper size={18} /> News Engine
             </label>
            <div className="grid grid-cols-3 gap-3">
              {cats.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setLs({ ...ls, newsCategory: cat })}
                  className={`py-4 rounded-[2.2rem] text-xs font-black transition-all border ${
                    ls.newsCategory === cat 
                      ? 'bg-primary border-primary text-white shadow-2xl scale-105' 
                      : 'bg-white/5 border-white/10 text-gray-500 dark:text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-primary/10 p-8 rounded-[3.5rem] flex items-center justify-between border border-primary/20 shadow-xl">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-white shadow-lg"><Volume2 size={32} /></div>
               <div className="flex flex-col">
                  <span className="text-2xl font-black text-gray-800 dark:text-white">Siri Voice Engine</span>
                  <span className="text-[10px] text-primary/60 uppercase tracking-widest font-black">Neural Text-to-Speech active</span>
               </div>
            </div>
            <button 
              onClick={() => setLs({...ls, autoSpeech: !ls.autoSpeech})}
              className={`w-20 h-10 rounded-full relative transition-all duration-500 ${ls.autoSpeech ? 'bg-primary shadow-2xl' : 'bg-gray-300 dark:bg-gray-700'}`}
            >
               <div className={`absolute top-1 w-8 h-8 bg-white rounded-full transition-all shadow-md ${ls.autoSpeech ? 'right-11' : 'right-1'}`}></div>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="pt-12 flex flex-col gap-6">
            <button onClick={() => { if(confirm('کل حافظه مانا پاکسازی شود؟')) onClearHistory(); }} className="w-full py-8 text-red-500 font-bold bg-red-50 dark:bg-red-500/5 rounded-[3rem] hover:bg-red-500/10 transition-all text-xl flex items-center justify-center gap-4 border border-red-500/10">
               <Trash2 size={26} /> پاکسازی حافظه دستیار
            </button>
            <button onClick={() => { onSave(ls); onClose(); }} className="w-full py-10 bg-primary text-white font-black rounded-[3rem] shadow-[0_30px_60px_rgba(var(--theme-primary-rgb),0.4)] transition-all hover:scale-[1.02] active:scale-95 text-3xl tracking-tighter border border-white/20">Apply & Sync Environment</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
