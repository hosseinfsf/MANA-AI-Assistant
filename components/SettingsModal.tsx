
import React from 'react';
import { X, Moon, Sun, Bell, Volume2, Newspaper, Trash2, Palette, ShieldCheck, Check, Key, Cpu, LayoutGrid } from 'lucide-react';
import { AppSettings, NewsCategory, ThemeType, AIModel } from '../types';

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

  const themes: {id: ThemeType, label: string, color: string}[] = [
    { id: 'purple', label: 'Amethyst', color: 'bg-purple-500' },
    { id: 'midnight', label: 'Midnight', color: 'bg-rose-600' },
    { id: 'ocean', label: 'Ocean', color: 'bg-sky-500' },
    { id: 'nature', label: 'Nature', color: 'bg-emerald-500' },
    { id: 'macos', label: 'Silver', color: 'bg-slate-400' }
  ];

  const models: {id: AIModel, label: string, desc: string}[] = [
    { id: 'gemini-3-flash-preview', label: 'Gemini 3 Flash', desc: 'Fastest • Efficient' },
    { id: 'gemini-3-pro-preview', label: 'Gemini 3 Pro', desc: 'Smartest • Reasoning' }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-3xl animate-in fade-in duration-500 p-4 sm:p-8">
      <div className="bg-[#101010] w-full max-w-[680px] max-h-[90vh] overflow-y-auto rounded-[2.5rem] sm:rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,1)] border border-white/10 scrollbar-hide relative flex flex-col">
        
        {/* Header */}
        <div className="p-6 sm:p-10 flex justify-between items-center border-b border-white/5 sticky top-0 bg-[#101010]/95 backdrop-blur-xl z-20 shrink-0">
          <div>
            <h3 className="font-black text-white text-2xl sm:text-3xl tracking-tighter">تنظیمات مانا</h3>
            <p className="text-[9px] sm:text-[10px] font-bold text-primary opacity-80 uppercase tracking-[0.3em] mt-1">Control Center</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-all border border-white/5 text-white/50 hover:text-white">
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-6 sm:p-10 space-y-8 sm:space-y-12 pb-20">
          
          {/* THEMES */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-[0.2em] px-2">
                <Palette size={14} /> <span>Visual Theme</span>
             </div>
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setLs({...ls, activeTheme: t.id})}
                    className={`relative p-4 rounded-[1.5rem] sm:rounded-[2rem] border transition-all duration-300 overflow-hidden group ${ls.activeTheme === t.id ? 'bg-primary/20 border-primary' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                  >
                    <div className={`w-8 h-8 rounded-full ${t.color} mb-3 shadow-lg flex items-center justify-center`}>
                      {ls.activeTheme === t.id && <Check size={14} className="text-white" />}
                    </div>
                    <p className={`text-sm font-bold text-right ${ls.activeTheme === t.id ? 'text-white' : 'text-white/50'}`}>{t.label}</p>
                  </button>
                ))}
             </div>
          </section>

          {/* AI MODEL & API */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-[0.2em] px-2">
                <Cpu size={14} /> <span>Intelligence Core</span>
             </div>
             
             {/* Model Selector */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
               {models.map(m => (
                 <button 
                  key={m.id} 
                  onClick={() => setLs({...ls, model: m.id})}
                  className={`p-4 rounded-[1.5rem] sm:rounded-[2rem] border text-right transition-all ${ls.model === m.id ? 'bg-white text-black border-white' : 'bg-black border-white/10 text-white/50 hover:border-white/30'}`}
                 >
                   <div className="font-bold text-sm">{m.label}</div>
                   <div className="text-[10px] opacity-60 mt-1 font-medium tracking-wide">{m.desc}</div>
                 </button>
               ))}
             </div>

             {/* API Key Input */}
             <div className="bg-white/5 border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-5 focus-within:border-primary/50 transition-all">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-xs font-bold text-white flex items-center gap-2"><Key size={14}/> کلید API اختصاصی</span>
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={ls.useCustomKey} onChange={e => setLs({...ls, useCustomKey: e.target.checked})} className="sr-only peer"/>
                    <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                 </label>
               </div>
               {ls.useCustomKey && (
                 <input 
                   type="password" 
                   value={ls.apiKey} 
                   onChange={e => setLs({...ls, apiKey: e.target.value})}
                   placeholder="sk-..." 
                   className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 font-mono tracking-wider"
                 />
               )}
               <p className="text-[10px] text-white/30 mt-2 leading-relaxed">در صورت غیرفعال بودن، از کلید پیش‌فرض نسخه دمو استفاده می‌شود.</p>
             </div>
          </section>

          {/* VOICE */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-[0.2em] px-2">
                <Volume2 size={14} /> <span>Voice Feedback</span>
             </div>
             <div className="bg-gradient-to-r from-primary/20 to-secondary/10 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border border-primary/20 flex items-center justify-between">
                <div>
                   <h4 className="text-white font-bold text-base sm:text-lg">خواندن پاسخ‌ها</h4>
                   <p className="text-white/40 text-[10px] mt-1">تبدیل متن به گفتار (TTS)</p>
                </div>
                <button 
                  onClick={() => setLs({...ls, autoSpeech: !ls.autoSpeech})}
                  className={`w-14 h-8 rounded-full relative transition-all duration-300 ${ls.autoSpeech ? 'bg-primary' : 'bg-white/10'}`}
                >
                   <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${ls.autoSpeech ? 'right-7' : 'right-1'}`}></div>
                </button>
             </div>
          </section>

          {/* DANGER ZONE */}
          <div className="pt-4 sm:pt-8">
            <button onClick={() => { if(confirm('آیا مطمئن هستید؟')) onClearHistory(); }} className="w-full py-4 text-red-400 text-sm font-bold bg-red-500/5 rounded-2xl hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 border border-red-500/10 mb-4">
               <Trash2 size={16} /> پاکسازی تاریخچه گفتگو
            </button>
            <button onClick={() => { onSave(ls); onClose(); }} className="w-full py-4 sm:py-5 bg-white text-black font-black rounded-[1.5rem] sm:rounded-[2rem] shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-base sm:text-lg">
              ذخیره تغییرات
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
