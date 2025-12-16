import React, { useState } from 'react';
import { Message, Sender } from '../types';
import { Copy, Check, Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === Sender.Bot;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] ${isBot ? 'flex-row' : 'flex-row-reverse'} items-end gap-2`}>
        
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/10 shadow-sm ${
          isBot ? 'bg-primary text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200'
        }`}>
          {isBot ? <Bot size={18} /> : <User size={18} />}
        </div>

        {/* Bubble */}
        <div className={`relative px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-colors ${
          isBot 
            ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-700' 
            : 'bg-primary text-white rounded-br-none shadow-md shadow-primary/20'
        }`}>
          <p className="whitespace-pre-wrap">{message.text}</p>
          
          {/* Copy Button for Bot */}
          {isBot && (
            <button
              onClick={handleCopy}
              className="absolute -top-3 left-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full p-1 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              title="کپی متن"
            >
              {copied ? (
                <Check size={12} className="text-green-500" />
              ) : (
                <Copy size={12} className="text-gray-400 dark:text-gray-300" />
              )}
            </button>
          )}
          
          <span className={`text-[10px] absolute bottom-1 ${
            isBot ? 'right-2 text-gray-400' : 'left-2 text-indigo-200'
          } opacity-70`}>
            {new Date(message.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;