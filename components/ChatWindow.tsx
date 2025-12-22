
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Settings, Sparkles, MessageSquare, ListTodo, 
  Languages, FileText, CheckSquare, Plus, Trash2, Mic, Bell, 
  X, Newspaper, Zap, Scissors, Smile, Search, Calendar, Battery, Wifi, 
  Video, Utensils, CheckCircle2, ChevronDown, Clock, MapPin
} from 'lucide-react';
import { Message, Sender, AssistantMode, AppSettings, TodoItem, AIToolType, TodoCategory } from '../types';
import ChatMessage from './ChatMessage';
import { sendMessageStream } from '../services/geminiService';
import SettingsModal from './SettingsModal';

const getPersianDate = () => new Intl.DateTimeFormat('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

const TimelineItem: React.FC<{time: string, title: string, desc: string, icon: any, color: string, isLast?: boolean}> = ({time, title, desc, icon: Icon, color, isLast}) => (
  <div className="flex gap-5">
    <div className="flex flex-col items-center">
      <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center ${color} bg-opacity-10 text-opacity-100 border border-white/5 shadow-inner`}>
        <Icon size={20} />
      </div>
      {!isLast && <div className="w-[1px] flex-1 bg-gradient-to-b from-white/20 via-white/5 to-transparent my-3"></div>}
    </div>
    <div className="flex-1 pb-10">
      <div className="widget-card p-6 group hover:translate-x-2 transition-all cursor-pointer">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-white font-bold text-sm tracking-tight">{title}</h4>
          <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{time}</span>
        </div>
        <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
  </div>
);

const WidgetDashboard: React.FC<{todos: TodoItem[], setTodos: any}> = ({todos, setTodos}) => {
  return (
    <div className="flex-1 overflow-y-auto px-10 py-6 scrollbar-hide animate-in fade-in zoom-in-95 duration-700">
      <div className="grid grid-cols-12 gap-8">
        
        {/* Column 1: Core Stats & Suggestions */}
        <div className="col-span-4 flex flex-col gap-6">
           {/* Progress Circle Widget */}
           <div className="widget-card p-8 bg-gradient-to-br from-primary/20 to-transparent">
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <p className="text-white font-black text-2xl tracking-tighter">امروز</p>
                    <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Efficiency</p>
                 </div>
                 <div className="w-12 h-12 rounded-full border-4 border-primary flex items-center justify-center text-[10px] font-black text-white">85%</div>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between text-[10px] font-bold text-white/40">
                    <span>تکمیل شده</span>
                    <span>۸ از ۱۰</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[80%] shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
                 </div>
              </div>
           </div>

           {/* Suggestion Notification Style */}
           <div className="mana-notif-bar p-6 hover:bg-white/10 transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-3 text-accent">
                 <Sparkles size={16} />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em]">Smart Suggestion</span>
              </div>
              <p className="text-white/80 text-xs font-medium leading-relaxed">۲۰ دقیقه تا جلسه بعدی فرصت داری. مایل به مدیتیشن هستی؟</p>
              <div className="mt-4 flex gap-2">
                 <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black text-white transition-all">رد کردن</button>
                 <button className="flex-1 py-2 bg-primary/20 hover:bg-primary/40 rounded-xl text-[10px] font-black text-primary transition-all">بله، ثبت کن</button>
              </div>
           </div>

           {/* Weather/Status Mini Widget */}
           <div className="grid grid-cols-2 gap-4">
              <div className="widget-card p-5 flex flex-col items-center gap-2">
                 <Clock className="text-white/20" size={20} />
                 <span className="text-white text-sm font-bold">۱۴:۳۰</span>
                 <span className="text-[9px] text-white/30 uppercase tracking-widest">Target</span>
              </div>
              <div className="widget-card p-5 flex flex-col items-center gap-2">
                 <MapPin className="text-white/20" size={20} />
                 <span className="text-white text-sm font-bold">تهران</span>
                 <span className="text-[9px] text-white/30 uppercase tracking-widest">Status</span>
              </div>
           </div>
        </div>

        {/* Column 2: Timeline */}
        <div className="col-span-8">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-white font-black text-xl tracking-tight">جدول زمانی</h3>
              <div className="flex gap-2">
                 <button className="px-5 py-2 rounded-2xl bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">هفتگی</button>
                 <button className="px-5 py-2 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg">امروز</button>
              </div>
           </div>
           
           <div className="space-y-2">
              <TimelineItem time="۱۰:۰۰" title="جلسه اسپرینت" desc="هماهنگی تیم فنی و بررسی موانع موجود در توسعه هسته مانا." icon={Video} color="text-yellow-400 bg-yellow-400" />
              <TimelineItem time="۱۲:۳۰" title="زمان ناهار" desc="توقف فعالیت و تجدید قوای ذهنی." icon={Utensils} color="text-emerald-400 bg-emerald-400" />
              <TimelineItem time="۱۴:۰۰" title="بررسی کدها" desc="بررسی پول‌ریکوئست‌های بخش UI و تم بنفش." icon={CheckCircle2} color="text-primary bg-primary" isLast />
           </div>
        </div>
      </div>
    </div>
  );
};

export default function ChatWindow({ isOpen, appSettings, onUpdateSettings }: any) {
  const [activeMode, setActiveMode] = useState<AssistantMode>(AssistantMode.Chat);
  const [messages, setMessages] = useState<Message[]>([{ id: 'm1', text: 'سلام، مانا در اختیار شماست. چه کمکی از دستم برمی‌آید؟', sender: Sender.Bot, timestamp: Date.now() }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [todos, setTodos] = useState<TodoItem[]>(() => JSON.parse(localStorage.getItem('mana_todos_purple_v1') || '[]'));
  const [isMicOn, setIsMicOn] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const text = input;
    setMessages(prev => [...prev, { id: Date.now().toString(), text, sender: Sender.User, timestamp: Date.now() }]);
    setInput('');
    setIsLoading(true);
    const botId = (Date.now() + 1).toString();
    try {
      setMessages(prev => [...prev, { id: botId, text: '', sender: Sender.Bot, timestamp: Date.now() }]);
      const history = messages.slice(-4).map(m => ({ role: m.sender === Sender.User ? 'user' : 'model', parts: [{ text: m.text }] }));
      let full = '';
      const stream = sendMessageStream(text, activeMode, history, { category: appSettings.newsCategory });
      for await (const chunk of stream) {
        full += chunk;
        setMessages(prev => prev.map(m => m.id === botId ? { ...m, text: full } : m));
      }
    } catch (e) {
      setMessages(prev => prev.map(m => m.id === botId ? { ...m, text: "خطایی رخ داد." } : m));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-10 z-[9999] pointer-events-none" dir="rtl">
      <div className="w-full max-w-5xl h-[780px] mana-glass rounded-ios-lg flex flex-col pointer-events-auto animate-in fade-in slide-in-from-bottom-20 duration-1000">
        
        {/* --- DYNAMIC ISLAND HEADER --- */}
        <div className="h-28 flex items-center justify-between px-12 shrink-0 relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-6">
            <div className="dynamic-island h-10 w-44 flex items-center justify-center px-4 gap-3 overflow-hidden shadow-2xl border border-white/5">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">{time.toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'})}</span>
               <div className="w-3 h-3 bg-primary rounded-full blur-[4px]"></div>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Sparkles size={28} />
             </div>
             <div>
                <h1 className="text-white font-black text-2xl tracking-tighter">مانا</h1>
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">{getPersianDate()}</p>
             </div>
          </div>

          <div className="flex items-center gap-4">
             <button onClick={() => setIsSettingsOpen(true)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"><Settings size={22} /></button>
             <button onClick={() => onUpdateSettings({ ...appSettings, isOpen: false })} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"><X size={22} /></button>
          </div>
        </div>

        {/* --- NAVIGATION TABS --- */}
        <div className="flex justify-center mb-4 px-12">
          <div className="bg-black/40 backdrop-blur-3xl p-1.5 rounded-3xl flex gap-1 border border-white/5">
             {[
               { id: AssistantMode.Chat, icon: MessageSquare, label: 'گفتگو' },
               { id: AssistantMode.ToDo, icon: ListTodo, label: 'داشبورد' },
               { id: AssistantMode.AI, icon: Zap, label: 'هوش' },
               { id: AssistantMode.News, icon: Newspaper, label: 'اخبار' },
             ].map(mode => (
               <button
                 key={mode.id}
                 onClick={() => setActiveMode(mode.id)}
                 className={`flex items-center gap-3 px-8 py-3 rounded-2xl transition-all duration-500 ${activeMode === mode.id ? 'bg-primary text-white shadow-xl' : 'text-white/20 hover:text-white/40'}`}
               >
                 <mode.icon size={18} />
                 <span className="text-[11px] font-black uppercase tracking-widest">{mode.label}</span>
               </button>
             ))}
          </div>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeMode === AssistantMode.ToDo ? (
            <WidgetDashboard todos={todos} setTodos={setTodos} />
          ) : (
            <div className="flex flex-col h-full px-12 pb-10">
              <div ref={scrollRef} className="flex-1 overflow-y-auto pr-4 scrollbar-hide space-y-6 py-6 mask-fade-top">
                {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                {isLoading && (
                  <div className="flex items-center gap-3 px-10">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                )}
              </div>

              {/* Input Area - Floats at the bottom of the window */}
              <div className="bg-black/60 backdrop-blur-3xl p-3 rounded-[2.5rem] border border-white/10 flex items-center gap-4 shadow-2xl focus-within:ring-2 ring-primary/40 transition-all">
                <button 
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-4 rounded-3xl transition-all ${isMicOn ? 'bg-red-500 text-white siri-active' : 'bg-white/5 text-white/20 hover:text-primary'}`}
                >
                  <Mic size={24} />
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter') handleSend(); }}
                  placeholder="از مانا بخواهید..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/10 py-4 text-sm font-medium"
                />
                <button 
                  onClick={handleSend} 
                  disabled={!input.trim() || isLoading} 
                  className="w-14 h-14 bg-primary rounded-3xl flex items-center justify-center text-white shadow-lg hover:scale-105 active:scale-95 disabled:opacity-30 transition-all"
                >
                  <Send size={24} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={appSettings}
        onSave={onUpdateSettings}
        onClearHistory={() => setMessages([{ id: 'm1', text: 'حافظه مانا پاکسازی شد.', sender: Sender.Bot, timestamp: Date.now() }])}
      />
    </div>
  );
}
