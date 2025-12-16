import React from 'react';
import { X, Moon, Sun, Type, Image as ImageIcon, Quote, Trash2, Music } from 'lucide-react';
import { AppSettings, Theme, QuoteSource, MusicProvider } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
  onClearHistory: () => void;
}

const BACKGROUNDS = [
  { id: 'snow', url: 'https://images.unsplash.com/photo-1477601263568-180e2c6d046e?q=80&w=300&auto=format&fit=crop', label: 'جنگل برفی' },
  { id: 'dandelion', url: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?q=80&w=300&auto=format&fit=crop', label: 'قاصدک' },
  { id: 'lightning', url: 'https://images.unsplash.com/photo-1492552181161-62217fc3076d?q=80&w=300&auto=format&fit=crop', label: 'رعد و برق' },
  { id: 'abstract', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=300&auto=format&fit=crop', label: 'انتزاعی' },
  { id: 'sunset', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=300&auto=format&fit=crop', label: 'غروب نخل' },
  { id: 'blueflower', url: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?q=80&w=300&auto=format&fit=crop', label: 'گل‌های آبی' },
];

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave, onClearHistory }) => {
  const [localSettings, setLocalSettings] = React.useState<AppSettings>(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white/95 dark:bg-gray-900/95 w-[420px] max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700 backdrop-blur-xl">
        
        {/* Header */}
        <div className="p-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-inherit z-10">
          <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-lg">
            تنظیمات پیشرفته
          </h3>
          <button onClick={onClose} className="bg-gray-100 dark:bg-gray-800 rounded-full p-2 hover:bg-gray-200 transition-colors">
            <X size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8">
          
          {/* Theme & Font Size */}
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Sun size={14} /> ظاهر
              </label>
              <div className="grid grid-cols-2 gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                {['light', 'dark'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setLocalSettings({ ...localSettings, theme: t as Theme })}
                    className={`py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      localSettings.theme === t 
                        ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {t === 'light' ? 'روشن' : 'تاریک'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Type size={14} /> اندازه متن
              </label>
              <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 p-3 rounded-xl">
                 <span className="text-xs text-gray-500">A</span>
                 <input 
                   type="range" 
                   min="0" 
                   max="2" 
                   step="1"
                   value={localSettings.fontSize === 'small' ? 0 : localSettings.fontSize === 'medium' ? 1 : 2}
                   onChange={(e) => {
                     const val = parseInt(e.target.value);
                     setLocalSettings({ ...localSettings, fontSize: val === 0 ? 'small' : val === 1 ? 'medium' : 'large' });
                   }}
                   className="flex-1 accent-primary h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                 />
                 <span className="text-lg text-gray-800 dark:text-white">A</span>
              </div>
            </div>
          </div>

          {/* Music Provider */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Music size={14} /> پخش‌کننده موسیقی
            </label>
            <div className="grid grid-cols-2 gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              {([
                { id: 'local', label: 'پخش داخلی' },
                { id: 'spotify', label: 'اسپاتیفای 🟢' }
              ] as const).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setLocalSettings({ ...localSettings, musicProvider: m.id as MusicProvider })}
                  className={`py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    localSettings.musicProvider === m.id
                      ? 'bg-white dark:bg-gray-700 text-green-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quote Source */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Quote size={14} /> منبع جملات
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'motivational', label: 'انگیزشی ✨' },
                { id: 'hafez', label: 'حافظ 📖' },
                { id: 'programming', label: 'تکنولوژی 💻' },
                { id: 'great_people', label: 'سخن بزرگان 🗿' }
              ].map((q) => (
                <button
                  key={q.id}
                  onClick={() => setLocalSettings({ ...localSettings, quoteSource: q.id as QuoteSource })}
                  className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                    localSettings.quoteSource === q.id
                      ? 'bg-primary/10 text-primary border-primary/50' 
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Backgrounds */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon size={14} /> پس‌زمینه
            </label>
            <div className="grid grid-cols-3 gap-3">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setLocalSettings({ ...localSettings, backgroundImage: bg.url.replace('&w=300', '&w=800') })}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    localSettings.backgroundImage.includes(bg.id)
                      ? 'border-primary scale-105 shadow-md' 
                      : 'border-transparent hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={bg.url} alt={bg.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          
          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Actions */}
          <div className="space-y-4">
             <button
              onClick={() => {
                if(window.confirm('آیا مطمئن هستید که می‌خواهید تاریخچه چت را پاک کنید؟')) {
                  onClearHistory();
                  onClose();
                }
              }}
              className="w-full py-3 flex items-center justify-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-2xl transition-colors text-sm font-medium"
            >
              <Trash2 size={16} />
              پاک کردن تاریخچه چت
            </button>

            <button
              onClick={handleSave}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-xl shadow-blue-500/30 font-bold transition-transform active:scale-95"
            >
              ذخیره تغییرات
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsModal;