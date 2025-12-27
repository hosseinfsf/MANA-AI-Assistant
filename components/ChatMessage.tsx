
import React, { useState } from 'react';
import { Message, Sender } from '../types';
import { Copy, Check, Bot, User, Play, Pause, Volume2, Sparkles, MessageCircle } from 'lucide-react';
import { playAudioBase64 } from '../services/aiManager';

interface ChatMessageProps {
  message: Message;
  onSuggestionClick?: (text: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSuggestionClick }) => {
  const isBot = message.sender === Sender.Bot;
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlayAudio = async () => {
    if (message.audioData) {
      setIsPlaying(true);
      const source = await playAudioBase64(message.audioData);
      source.onended = () => setIsPlaying(false);
    }
  };

  return (
    <div className={`flex w-full mb-4 sm:mb-6 ${isBot ? 'justify-start' : 'justify-end'} group`}>
      <div className={`flex max-w-[90%] sm:max-w-[85%] ${isBot ? 'flex-row' : 'flex-row-reverse'} items-start gap-3 sm:gap-4`}>
        
        {/* Avatar */}
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-110 ${
          isBot ? 'bg-primary text-white purple-glow' : 'bg-white/10 text-white/60 border border-white/5'
        }`}>
          {isBot ? <Sparkles size={16} className="sm:w-5 sm:h-5" /> : <User size={16} className="sm:w-5 sm:h-5" />}
        </div>

        {/* Content Wrapper */}
        <div className="flex flex-col gap-2 w-full min-w-0">
          
          {/* Bubble */}
          <div className={`relative px-4 sm:px-6 py-3 sm:py-4 rounded-[1.5rem] sm:rounded-[1.8rem] text-sm leading-relaxed shadow-xl transition-all border min-w-0 ${
            isBot 
              ? 'bg-white/5 backdrop-blur-md text-gray-100 rounded-tr-none border-white/10' 
              : 'bg-primary text-white rounded-tl-none border-white/20 shadow-[0_10px_30px_rgba(168,85,247,0.2)]'
          }`}>
            <p className="whitespace-pre-wrap break-words font-medium">{message.text}</p>

            {message.audioData && (
              <button 
                onClick={handlePlayAudio}
                disabled={isPlaying}
                className="mt-4 flex items-center gap-2 bg-white/10 text-white py-2 px-4 rounded-xl text-xs font-black hover:bg-white/20 transition-all disabled:opacity-50"
              >
                {isPlaying ? <Volume2 size={14} className="animate-pulse" /> : <Play size={14} />}
                {isPlaying ? 'در حال واکاوی صوتی...' : 'شنیدن پاسخ'}
              </button>
            )}
            
            {/* Copy Button */}
            {isBot && !message.audioData && (
              <button
                onClick={handleCopy}
                className="absolute -top-3 left-3 bg-[#1c1c1e] border border-white/10 rounded-full p-1.5 sm:p-2 shadow-xl hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                title="کپی"
              >
                {copied ? <Check size={12} className="text-green-500 sm:w-3.5 sm:h-3.5" /> : <Copy size={12} className="text-primary sm:w-3.5 sm:h-3.5" />}
              </button>
            )}
            
            <span className={`text-[9px] font-black absolute -bottom-5 opacity-30 uppercase tracking-widest ${
              isBot ? 'right-2' : 'left-2'
            }`}>
              {new Date(message.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Quick Replies / Suggestions */}
          {message.suggestions && message.suggestions.length > 0 && (
             <div className="flex flex-wrap gap-2 mt-1 animate-in fade-in slide-in-from-left-4 duration-700">
               {message.suggestions.map((suggestion, idx) => (
                 <button 
                   key={idx}
                   onClick={() => onSuggestionClick && onSuggestionClick(suggestion)}
                   className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl px-3 py-2 text-[11px] sm:text-xs text-white/70 hover:text-white transition-all shadow-sm flex items-center gap-2 active:scale-95"
                 >
                   <MessageCircle size={12} className="text-primary opacity-70" />
                   {suggestion}
                 </button>
               ))}
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
