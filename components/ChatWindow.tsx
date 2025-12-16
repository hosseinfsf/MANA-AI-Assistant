import React, { useState, useEffect, useRef } from 'react';
import { Send, Settings, Sparkles, MessageSquare, ListTodo, CloudSun, Calendar, Languages, FileText, LayoutGrid, CheckSquare, ShoppingCart, Play, Pause, SkipForward, SkipBack, Volume2, Plus, GripHorizontal, Trash2, ExternalLink } from 'lucide-react';
import { Message, Sender, AssistantMode, AppSettings, TodoItem } from '../types';
import ChatMessage from './ChatMessage';
import { sendMessageToGemini } from '../services/geminiService';
import SettingsModal from './SettingsModal';

interface ChatWindowProps {
  isOpen: boolean;
  initialText?: string;
  onClearInitialText?: () => void;
  appSettings: AppSettings;
  onUpdateSettings: (s: AppSettings) => void;
}

// --- Data ---
const QUOTES = {
  motivational: [
    "موفقیت مجموع تلاش‌های کوچکی است که هر روز تکرار می‌شوند. ✨",
    "رویاهای بزرگ داشته باش و برای رسیدن به آن‌ها سخت تلاش کن. 🚀",
    "شکست خوردن بخشی از مسیر موفقیت است، از آن نترس. 💪",
    "امروز فرصتی است برای ساختن فردایی که همیشه آرزویش را داشتی. 🌅"
  ],
  hafez: [
    "اوقات خوش آن بود که با دوست به سر رفت 🍷\nباقی همه بی‌حاصلی و بی‌خبری بود",
    "هر آن که جانب اهل خدا نگه دارد 🤲\nخداش در همه حال از بلا نگه دارد",
    "ساقیا بده جامی زان شراب روحانی 🍇\nتا دمی برآساییم زین حجاب جسمانی",
    "در دایره قسمت ما نقطه تسلیمیم ⭕\nلطف آنچه تو اندیشی حکم آنچه تو فرمایی"
  ],
  programming: [
    "کد نویسی یعنی فکر کردن، نه فقط تایپ کردن. 💻",
    "سادگی روح کارآیی است. (Austin Freeman) ⚡",
    "اول حلش کن، بعد کدش رو بنویس. 🧠",
    "بهترین راه برای پیش‌بینی آینده، ساختن آن است. 🛠️"
  ],
  great_people: [
    "بزرگترین افتخار در سقوط نکردن نیست، بلکه در برخاستن پس از هر سقوط است. (کنفوسیوس) 🎋",
    "تغییر کن قبل از اینکه مجبور شوی. (جک ولش) 🌪️",
    "تنها راه انجام کار بزرگ، دوست داشتن کاری است که انجام می‌دهید. (استیو جابز) 🍎",
    "زندگی آن چیزی است که برای تو اتفاق می‌افتد در حالی که تو مشغول برنامه‌ریزی‌های دیگر هستی. (جان لنون) 🎸"
  ]
};

const getPersianDate = () => {
  return new Intl.DateTimeFormat('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
};

// --- Sub-Components ---

const AppGridLauncher: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const apps = [
    { icon: MessageSquare, color: 'bg-blue-500', name: 'چت' },
    { icon: ListTodo, color: 'bg-green-500', name: 'کارها' },
    { icon: Languages, color: 'bg-purple-500', name: 'مترجم' },
    { icon: FileText, color: 'bg-orange-500', name: 'نویسنده' },
    { icon: Sparkles, color: 'bg-yellow-500', name: 'خلاقیت' },
    { icon: ShoppingCart, color: 'bg-pink-500', name: 'خرید' },
    { icon: CloudSun, color: 'bg-cyan-500', name: 'هوا' },
    { icon: Calendar, color: 'bg-red-500', name: 'تقویم' },
    { icon: Settings, color: 'bg-gray-500', name: 'تنظیمات' },
  ];

  return (
    <div className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in rounded-[2rem]">
       <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 rounded-full p-2"><Settings size={20}/></button>
       <div className="grid grid-cols-3 gap-6">
         {apps.map((app, idx) => (
           <button key={idx} className="flex flex-col items-center gap-3 group">
             <div className={`w-16 h-16 ${app.color} rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-black/30 group-hover:scale-110 transition-transform duration-300 border border-white/10`}>
               <app.icon size={30} />
             </div>
             <span className="text-white text-xs font-bold shadow-black/50 drop-shadow-md">{app.name}</span>
           </button>
         ))}
       </div>
    </div>
  );
};

const MusicPlayer: React.FC<{ provider: 'local' | 'spotify' }> = ({ provider }) => {
  const [playing, setPlaying] = useState(false);

  if (provider === 'spotify') {
    return (
      <div className="w-full bg-[#1DB954]/10 dark:bg-[#1DB954]/20 rounded-2xl p-3 flex items-center gap-3 border border-[#1DB954]/30">
        <div className="w-12 h-12 rounded-xl bg-[#1DB954] flex items-center justify-center shadow-lg shrink-0">
          <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.018.6-1.141 4.38-1.379 9.901-.719 13.74 1.62.42.18.6.719.3 1.14zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
        </div>
        <div className="flex-1 overflow-hidden">
           <div className="text-sm font-bold text-gray-100 truncate">Spotify Connected</div>
           <div className="text-[10px] text-gray-400">Tap to open app</div>
        </div>
        <button className="p-2 bg-[#1DB954] text-black rounded-full hover:scale-105 transition-transform">
           <ExternalLink size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white/5 dark:bg-black/20 rounded-2xl p-3 flex items-center gap-3 border border-white/5">
       <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shrink-0">
         <Volume2 size={20} className="text-white" />
       </div>
       <div className="flex-1 overflow-hidden">
         <div className="text-sm font-bold text-gray-100 truncate">آهنگ ملایم (بی‌کلام)</div>
         <div className="flex items-center gap-2 mt-1">
            <div className="h-1 flex-1 bg-gray-600 rounded-full overflow-hidden">
               <div className="h-full w-1/3 bg-white rounded-full"></div>
            </div>
            <span className="text-[10px] text-gray-400">1:20</span>
         </div>
       </div>
       <div className="flex items-center gap-1 text-white">
          <button className="p-1.5 hover:bg-white/10 rounded-full"><SkipBack size={16} fill="currentColor"/></button>
          <button onClick={() => setPlaying(!playing)} className="p-2 bg-white text-black rounded-full hover:scale-105 transition-transform">
             {playing ? <Pause size={14} fill="currentColor"/> : <Play size={14} fill="currentColor" className="ml-0.5"/>}
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded-full"><SkipForward size={16} fill="currentColor"/></button>
       </div>
    </div>
  );
};

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: '1', text: 'خرید قهوه ☕', completed: false, category: 'shopping' },
    { id: '2', text: 'تماس با تیم 📞', completed: true, category: 'daily' },
  ]);
  const [filter, setFilter] = useState<'daily' | 'shopping'>('daily');
  const [newTodo, setNewTodo] = useState('');

  const handleAdd = () => {
    if (!newTodo.trim()) return;
    setTodos([...todos, { id: Date.now().toString(), text: newTodo, completed: false, category: filter }]);
    setNewTodo('');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex p-1 bg-black/20 rounded-xl mb-3 mx-4 mt-2">
        <button onClick={() => setFilter('daily')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${filter === 'daily' ? 'bg-white/20 text-white shadow-sm' : 'text-gray-400'}`}>
          <CheckSquare size={14} /> وظایف
        </button>
        <button onClick={() => setFilter('shopping')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${filter === 'shopping' ? 'bg-white/20 text-white shadow-sm' : 'text-gray-400'}`}>
          <ShoppingCart size={14} /> خرید
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 px-4 scrollbar-hide">
        {todos.filter(t => t.category === filter).map(t => (
          <div key={t.id} className="group flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
            <button onClick={() => setTodos(todos.map(x => x.id === t.id ? {...x, completed: !x.completed} : x))} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${t.completed ? 'bg-green-500 border-green-500' : 'border-gray-500'}`}>
              {t.completed && <CheckSquare size={12} className="text-white" />}
            </button>
            <span className={`flex-1 text-sm ${t.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>{t.text}</span>
            <button onClick={() => setTodos(todos.filter(x => x.id !== t.id))} className="text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
      <div className="p-3 mt-auto">
        <div className="flex items-center gap-2 bg-white/10 rounded-xl p-1 pr-3">
          <input value={newTodo} onChange={e => setNewTodo(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} placeholder="مورد جدید..." className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-gray-500"/>
          <button onClick={handleAdd} className="p-2 bg-primary rounded-lg text-white"><Plus size={16}/></button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export default function ChatWindow({ isOpen, initialText, onClearInitialText, appSettings, onUpdateSettings }: ChatWindowProps) {
  const [size, setSize] = useState({ w: 380, h: 500 }); // Main content height
  const [messages, setMessages] = useState<Message[]>([{ id: 'welcome', text: 'سلام! چطور می‌تونم کمکت کنم؟ 👋', sender: Sender.Bot, timestamp: Date.now() }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAppLauncherOpen, setIsAppLauncherOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [dailyQuote, setDailyQuote] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<{ startX: number, startY: number, startW: number, startH: number } | null>(null);

  useEffect(() => {
    const quotes = QUOTES[appSettings.quoteSource] || QUOTES.motivational;
    setDailyQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [appSettings.quoteSource]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, activeTab]);
  useEffect(() => { if (initialText) { setInput(initialText); onClearInitialText?.(); } }, [initialText]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { id: Date.now().toString(), text: input, sender: Sender.User, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    try {
      const history = messages.map(m => ({ role: m.sender === Sender.User ? 'user' : 'model', parts: [{ text: m.text }] }));
      const responseText = await sendMessageToGemini(userMsg.text, AssistantMode.Chat, history, { apiKey: appSettings.apiKey, model: appSettings.model });
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: responseText, sender: Sender.Bot, timestamp: Date.now() }]);
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  const startResize = (e: React.MouseEvent) => {
    resizeRef.current = { startX: e.clientX, startY: e.clientY, startW: size.w, startH: size.h };
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
  };

  const handleResize = (e: MouseEvent) => {
    if (!resizeRef.current) return;
    const deltaX = resizeRef.current.startX - e.clientX; 
    const deltaY = e.clientY - resizeRef.current.startY; 
    setSize({
      w: Math.max(340, Math.min(600, resizeRef.current.startW + deltaX)),
      h: Math.max(300, Math.min(800, resizeRef.current.startH + deltaY))
    });
  };

  const stopResize = () => {
    resizeRef.current = null;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
  };

  const fontSizeClass = appSettings.fontSize === 'small' ? 'text-xs' : appSettings.fontSize === 'medium' ? 'text-sm' : 'text-base';

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed bottom-28 right-8 z-50 flex flex-col gap-3 items-end animate-in fade-in slide-in-from-bottom-10"
        style={{ width: size.w }}
      >
        
        {/* --- ISLAND 1: HEADER (Centered Clock, Weather, Settings, Quote) --- */}
        <div className="w-full bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-4 border border-white/10 shadow-xl flex flex-col gap-3 relative overflow-hidden">
           {/* Top Row: Weather Left - Clock Center - Settings Right */}
           <div className="flex items-center justify-between relative h-20">
              
              {/* Settings (Absolute Right) */}
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-300 hover:bg-white/20 hover:text-white transition-all z-20"
              >
                <Settings size={20} />
              </button>

              {/* Weather (Absolute Left) */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-20">
                 <CloudSun size={28} className="text-orange-400 drop-shadow-md" />
                 <span className="text-sm font-bold text-gray-300">۲۴°</span>
              </div>

              {/* Center: Clock & Date */}
              <div className="w-full flex flex-col items-center justify-center z-10">
                <h1 className="text-6xl font-black text-white leading-none tracking-tighter drop-shadow-2xl" style={{ fontFamily: 'Vazirmatn' }}>
                  {time.toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'})}
                </h1>
                <div className="text-sm text-gold mt-1 font-bold tracking-wide">
                  {getPersianDate()}
                </div>
              </div>
           </div>
           
           {/* Bottom Row: Quote */}
           <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-center gap-2 mt-1">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-purple-500 rounded-full shrink-0"></div>
              <p className="text-xs text-gray-300 leading-6 italic line-clamp-2 w-full text-center">
                {dailyQuote}
              </p>
           </div>
        </div>

        {/* --- ISLAND 2: CONTENT (Chat/Todo) --- */}
        <div 
          className="w-full relative bg-slate-800/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col"
          style={{ height: size.h, backgroundImage: `url(${appSettings.backgroundImage})`, backgroundSize: 'cover', backgroundBlendMode: 'overlay' }}
        >
           <div className="absolute inset-0 bg-slate-900/70 z-0"></div>
           
           <div className={`relative z-10 flex-1 flex flex-col min-h-0 ${fontSizeClass}`}>
             {activeTab === 0 ? (
               <>
                 <div className="flex-1 overflow-y-auto p-4 scrollbar-hide space-y-4">
                    {messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
                    {isLoading && <div className="text-xs text-white/50 animate-pulse px-4">درحال نوشتن...</div>}
                    <div ref={messagesEndRef} />
                 </div>
                 <div className="p-3 bg-black/20 backdrop-blur-sm border-t border-white/5">
                   <div className="flex items-center bg-white/10 rounded-2xl p-1">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                        placeholder="پیام خود را بنویسید..."
                        className="flex-1 bg-transparent border-none outline-none resize-none max-h-24 text-white placeholder-white/30 py-3 px-3 scrollbar-hide"
                        rows={1}
                      />
                      <button onClick={handleSend} disabled={!input.trim()} className="p-3 bg-primary rounded-xl text-white hover:bg-secondary transition-colors shadow-lg">
                        <Send size={18} />
                      </button>
                   </div>
                 </div>
               </>
             ) : (
               <TodoList />
             )}
           </div>
           <div 
              onMouseDown={startResize}
              className="absolute bottom-0 left-0 w-8 h-8 z-50 cursor-sw-resize flex items-end justify-start p-2 text-white/30 hover:text-white transition-colors"
           >
              <GripHorizontal size={20} />
           </div>
        </div>

        {/* --- ISLAND 3: BOTTOM (Music & Compact Tabs) --- */}
        <div className="w-full bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-3 border border-white/10 shadow-xl flex flex-col gap-3">
           <MusicPlayer provider={appSettings.musicProvider || 'local'} />
           
           {/* Compact Dock in Corner (Right/Start) */}
           <div className="flex items-center justify-between px-1">
              {/* Corner Tabs (Right side in RTL) */}
              <div className="flex bg-white/5 p-1 rounded-2xl gap-1">
                <button onClick={() => setActiveTab(0)} className={`p-2.5 rounded-xl transition-all ${activeTab === 0 ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                   <MessageSquare size={18} />
                </button>
                <button onClick={() => setActiveTab(1)} className={`p-2.5 rounded-xl transition-all ${activeTab === 1 ? 'bg-green-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                   <ListTodo size={18} />
                </button>
              </div>

              {/* App Menu Launcher (Left side) */}
              <button 
                onClick={() => setIsAppLauncherOpen(true)}
                className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
              >
                <LayoutGrid size={18} />
              </button>
           </div>
        </div>

        <AppGridLauncher isOpen={isAppLauncherOpen} onClose={() => setIsAppLauncherOpen(false)} />

      </div>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={appSettings}
        onSave={onUpdateSettings}
        onClearHistory={() => setMessages([{ id: 'welcome', text: 'تاریخچه پاک شد. چطور می‌تونم کمکت کنم؟ 👋', sender: Sender.Bot, timestamp: Date.now() }])}
      />
    </>
  );
}