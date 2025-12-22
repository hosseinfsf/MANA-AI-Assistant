
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Settings, Sparkles, MessageSquare, LayoutGrid, 
  Newspaper, Mic, X, Zap, Search, Clock, MapPin, 
  Calendar, Battery, Wifi, Cloud, CheckCircle2, 
  TrendingUp, StickyNote, BatteryCharging, Power, Plus
} from 'lucide-react';
import { Message, Sender, AssistantMode, AppSettings, TodoItem, WidgetConfig } from '../types';
import ChatMessage from './ChatMessage';
import { sendMessageStream } from '../services/geminiService';
import SettingsModal from './SettingsModal';

const getPersianDate = () => new Intl.DateTimeFormat('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

// --- SUB-COMPONENTS ---

const HomeDashboard = ({ todos, time }: { todos: TodoItem[], time: Date }) => (
  <div className="h-full flex flex-col p-5 sm:p-8 animate-in fade-in slide-in-from-bottom-8 duration-700 overflow-y-auto scrollbar-hide">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 h-auto md:h-full">
      
      {/* LEFT COL: STATUS & WEATHER */}
      <div className="col-span-1 md:col-span-5 flex flex-col gap-5">
        <div className="widget-card p-6 sm:p-8 bg-gradient-to-br from-primary/30 to-transparent border-primary/20 flex flex-col justify-between h-56 sm:h-64 relative overflow-hidden group shadow-lg">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/40 blur-[50px] rounded-full group-hover:bg-primary/60 transition-all duration-1000"></div>
           <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter mb-2">{time.toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'})}</h2>
              <p className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs">{getPersianDate()}</p>
           </div>
           <div className="flex items-end justify-between">
              <div className="flex flex-col">
                 <span className="text-4xl sm:text-5xl font-thin text-white">24°</span>
                 <span className="text-white/50 text-[10px] sm:text-xs mt-1">تهران، صاف</span>
              </div>
              <Cloud size={40} className="text-white/80 sm:w-12 sm:h-12" />
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4 flex-none sm:flex-1">
           <div className="widget-card p-4 sm:p-5 flex flex-col justify-center items-center gap-2 sm:gap-3 hover:bg-white/5 transition-colors">
              <BatteryCharging size={24} className="text-green-400" />
              <div className="text-center">
                 <span className="block text-lg sm:text-xl font-bold text-white">100%</span>
                 <span className="text-[9px] text-white/30 uppercase tracking-widest">Power</span>
              </div>
           </div>
           <div className="widget-card p-4 sm:p-5 flex flex-col justify-center items-center gap-2 sm:gap-3 hover:bg-white/5 transition-colors">
              <Wifi size={24} className="text-blue-400" />
              <div className="text-center">
                 <span className="block text-lg sm:text-xl font-bold text-white">5G</span>
                 <span className="text-[9px] text-white/30 uppercase tracking-widest">Network</span>
              </div>
           </div>
        </div>
      </div>

      {/* RIGHT COL: TIMELINE & SUGGESTIONS */}
      <div className="col-span-1 md:col-span-7 flex flex-col gap-5">
         <div className="widget-card p-5 sm:p-6 flex-1 min-h-[200px]">
            <div className="flex justify-between items-center mb-5 sm:mb-6">
               <h3 className="text-white font-bold text-base sm:text-lg">برنامه امروز</h3>
               <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            </div>
            <div className="space-y-3 sm:space-y-4">
               {[
                 { time: '۱۰:۰۰', title: 'جلسه تیم فنی', color: 'bg-yellow-500' },
                 { time: '۱۲:۳۰', title: 'ناهار و استراحت', color: 'bg-green-500' },
                 { time: '۱۶:۰۰', title: 'تحویل پروژه', color: 'bg-blue-500' }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-3 sm:gap-4 group cursor-pointer">
                    <div className="w-10 sm:w-12 text-right text-white/30 text-[10px] sm:text-xs font-bold font-mono">{item.time}</div>
                    <div className={`w-1 h-8 rounded-full ${item.color} group-hover:scale-y-125 transition-transform`}></div>
                    <div className="flex-1 p-2.5 sm:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                       <span className="text-white text-xs sm:text-sm font-medium">{item.title}</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>
         
         <div className="widget-card p-4 sm:p-5 bg-white/5 border-dashed border-white/10 flex items-center justify-center gap-3 text-white/40 hover:text-white hover:border-solid hover:border-white/20 transition-all cursor-pointer">
            <Plus size={18} />
            <span className="text-xs font-bold">افزودن یادداشت جدید</span>
         </div>
      </div>
    </div>
  </div>
);

const WidgetCenter = ({ widgets, toggleWidget }: { widgets: WidgetConfig[], toggleWidget: (id: string) => void }) => (
  <div className="h-full p-5 sm:p-8 animate-in fade-in zoom-in-95 duration-500 overflow-y-auto scrollbar-hide">
     <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 sm:mb-8 px-2">مرکز ویجت‌ها</h2>
     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-20">
        {widgets.map(w => (
           <div 
             key={w.id} 
             onClick={() => toggleWidget(w.id)}
             className={`aspect-square rounded-[1.8rem] sm:rounded-[2rem] p-4 sm:p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 border ${w.enabled ? 'bg-primary text-white border-primary shadow-[0_10px_30px_-5px_var(--color-primary)]' : 'bg-white/5 text-white/30 border-white/5 hover:bg-white/10'}`}
           >
              <div className="flex justify-between items-start">
                 {w.type === 'weather' && <Cloud size={24} />}
                 {w.type === 'calendar' && <Calendar size={24} />}
                 {w.type === 'stocks' && <TrendingUp size={24} />}
                 {w.type === 'notes' && <StickyNote size={24} />}
                 <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${w.enabled ? 'bg-white' : 'bg-white/10'}`}></div>
              </div>
              <div>
                 <p className="font-bold text-base sm:text-lg">{w.title}</p>
                 <p className="text-[9px] sm:text-[10px] opacity-60 uppercase tracking-wider mt-1">{w.enabled ? 'Active' : 'Off'}</p>
              </div>
           </div>
        ))}
        {/* Add New Placeholder */}
        <div className="aspect-square rounded-[1.8rem] sm:rounded-[2rem] p-4 sm:p-5 flex flex-col justify-center items-center border border-dashed border-white/10 text-white/20 hover:text-white/50 hover:border-white/30 transition-all cursor-pointer">
           <Plus size={32} />
           <span className="text-xs font-bold mt-2">Add Widget</span>
        </div>
     </div>
  </div>
);

// --- MAIN CONTROLLER ---

export default function ChatWindow({ isOpen, appSettings, onUpdateSettings }: any) {
  const [activeMode, setActiveMode] = useState<AssistantMode>(AssistantMode.Home);
  const [messages, setMessages] = useState<Message[]>([{ id: 'm1', text: 'سلام! من آماده‌ام.', sender: Sender.Bot, timestamp: Date.now() }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  
  // Widget State
  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    { id: '1', title: 'آب و هوا', type: 'weather', enabled: true },
    { id: '2', title: 'تقویم', type: 'calendar', enabled: true },
    { id: '3', title: 'بورس', type: 'stocks', enabled: false },
    { id: '4', title: 'نوت‌ها', type: 'notes', enabled: true },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    // Apply theme
    document.body.setAttribute('data-theme', appSettings.activeTheme);
    return () => clearInterval(timer);
  }, [appSettings.activeTheme]);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, isLoading, activeMode]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;
    
    setMessages(prev => [...prev, { id: Date.now().toString(), text: textToSend, sender: Sender.User, timestamp: Date.now() }]);
    setInput('');
    setIsLoading(true);

    const botId = (Date.now() + 1).toString();
    try {
      setMessages(prev => [...prev, { id: botId, text: '', sender: Sender.Bot, timestamp: Date.now() }]);
      const history = messages.slice(-6).map(m => ({ role: m.sender === Sender.User ? 'user' : 'model', parts: [{ text: m.text }] }));
      
      const stream = sendMessageStream(textToSend, activeMode, history, { 
        apiKey: appSettings.useCustomKey ? appSettings.apiKey : undefined,
        model: appSettings.model
      });
      
      let full = '';
      for await (const chunk of stream) {
        full += chunk;
        
        // Check for suggestions in the stream
        const suggestionRegex = /\[\[SUGGESTIONS: (.*?)\]\]/;
        const match = full.match(suggestionRegex);
        let displayText = full;
        let suggestions: string[] = [];

        if (match) {
            displayText = full.replace(match[0], '').trim();
            try {
                suggestions = JSON.parse(match[1]);
            } catch (e) { 
                // In case json is incomplete during stream, we ignore it until it's valid
            }
        }
        
        setMessages(prev => prev.map(m => m.id === botId ? { 
          ...m, 
          text: displayText, 
          suggestions: suggestions.length > 0 ? suggestions : m.suggestions 
        } : m));
      }
    } catch (e) {
      setMessages(prev => prev.map(m => m.id === botId ? { ...m, text: "Error connecting to MANA Core." } : m));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWidget = (id: string) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-8 z-[9999] pointer-events-none" dir="rtl">
      <div className="w-full max-w-[1100px] h-[92vh] sm:h-[85vh] mana-glass rounded-[2rem] sm:rounded-ios-lg flex flex-col pointer-events-auto animate-in fade-in zoom-in-95 duration-500 overflow-hidden shadow-2xl relative transition-all">
        
        {/* --- DYNAMIC ISLAND HEADER --- */}
        <div className="h-20 sm:h-24 flex items-center justify-between px-6 sm:px-12 shrink-0 z-50">
           {/* Left: Branding */}
           <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg crystal-glow transition-all">
                 <Sparkles size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div className="block">
                 <h1 className="text-white font-black text-lg sm:text-xl tracking-tight">MANA OS</h1>
                 <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500"></span>
                    <span className="text-white/40 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">Online</span>
                 </div>
              </div>
           </div>

           {/* Center: Island */}
           <div className="absolute left-1/2 -translate-x-1/2 top-5 sm:top-6 hidden md:block">
             <div className="dynamic-island h-9 px-6 flex items-center justify-center gap-4 shadow-xl border border-white/10 group hover:w-64 hover:h-12 transition-all cursor-default">
                <Clock size={14} className="text-white/50" />
                <span className="text-white text-xs font-bold font-mono tracking-widest">{time.toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'})}</span>
             </div>
           </div>

           {/* Right: Actions */}
           <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={() => setIsSettingsOpen(true)} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"><Settings size={18} className="sm:w-5 sm:h-5" /></button>
              <button onClick={() => onUpdateSettings({ ...appSettings, isOpen: false })} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all"><Power size={18} className="sm:w-5 sm:h-5" /></button>
           </div>
        </div>

        {/* --- MAIN NAVIGATION BAR --- */}
        <div className="px-4 sm:px-12 mb-2 flex justify-center shrink-0">
           <div className="bg-black/20 backdrop-blur-xl p-1 sm:p-1.5 rounded-[1.5rem] sm:rounded-[2rem] flex border border-white/5 shadow-inner w-full sm:w-auto justify-between sm:justify-center overflow-x-auto scrollbar-hide">
              {[
                { id: AssistantMode.Home, icon: Zap, label: 'داشبورد' },
                { id: AssistantMode.Chat, icon: MessageSquare, label: 'گفتگو' },
                { id: AssistantMode.Widgets, icon: LayoutGrid, label: 'ویجت' },
                { id: AssistantMode.News, icon: Newspaper, label: 'اخبار' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMode(m.id)}
                  className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-[1.2rem] sm:rounded-[1.6rem] transition-all duration-300 flex-1 sm:flex-none whitespace-nowrap ${activeMode === m.id ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                >
                  <m.icon size={16} className="sm:w-[18px]" />
                  <span className="text-[10px] sm:text-xs font-bold">{m.label}</span>
                </button>
              ))}
           </div>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="flex-1 overflow-hidden relative">
           
           {activeMode === AssistantMode.Home && <HomeDashboard todos={[]} time={time} />}
           {activeMode === AssistantMode.Widgets && <WidgetCenter widgets={widgets} toggleWidget={toggleWidget} />}
           
           {(activeMode === AssistantMode.Chat || activeMode === AssistantMode.News) && (
             <div className="flex flex-col h-full px-3 sm:px-12 pb-4 sm:pb-6">
               <div ref={scrollRef} className="flex-1 overflow-y-auto px-1 sm:pr-2 scrollbar-hide space-y-4 sm:space-y-6 py-4 mask-fade-top">
                 {messages.map(msg => (
                    <ChatMessage 
                      key={msg.id} 
                      message={msg} 
                      onSuggestionClick={(text) => handleSend(text)} 
                    />
                 ))}
                 {isLoading && (
                   <div className="flex justify-start px-4">
                     <div className="bg-white/5 rounded-2xl px-6 py-4 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce"></span>
                       <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                       <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                     </div>
                   </div>
                 )}
               </div>

               {/* CHAT INPUT */}
               <div className="mt-auto bg-surface backdrop-blur-3xl p-1.5 sm:p-2 rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 flex items-center gap-2 sm:gap-3 shadow-2xl shrink-0">
                  <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"><Mic size={20} className="sm:w-[22px]" /></button>
                  <input 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder={activeMode === AssistantMode.News ? "موضوع خبر..." : "فرمان دهید..."}
                    className="flex-1 bg-transparent border-none outline-none text-white px-2 placeholder-white/20 font-medium text-sm sm:text-base h-full"
                  />
                  <button 
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                  >
                    {activeMode === AssistantMode.News ? <Search size={20} className="sm:w-[22px]" /> : <Send size={20} className="sm:w-[22px]" />}
                  </button>
               </div>
             </div>
           )}

        </div>

        <SettingsModal 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={appSettings}
          onSave={onUpdateSettings}
          onClearHistory={() => setMessages([{ id: 'm1', text: 'حافظه پاکسازی شد.', sender: Sender.Bot, timestamp: Date.now() }])}
        />
      </div>
    </div>
  );
}
