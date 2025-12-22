
import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface FloatingBubbleProps {
  isOpen: boolean;
  onClick: () => void;
}

const FloatingBubble: React.FC<FloatingBubbleProps> = ({ isOpen, onClick }) => {
  return (
    <div className="fixed bottom-10 right-10 z-[10000]">
      <button
        onClick={onClick}
        className={`
          relative w-24 h-24 rounded-[2.5rem] flex items-center justify-center 
          transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)
          ${isOpen ? 'rotate-[360deg] scale-75 opacity-0 pointer-events-none' : 'scale-100 hover:scale-110 active:scale-95'}
          mana-glass border-white/20 shadow-[0_20px_60px_rgba(168,85,247,0.4)] group
        `}
      >
        {/* Inner core glow */}
        <div className="absolute inset-2 bg-gradient-to-br from-primary to-secondary rounded-[2.2rem] opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
        
        <div className="relative z-10 crystal-glow">
          <Sparkles className="w-10 h-10 text-white animate-pulse" />
        </div>
        
        {/* Decorative orbit */}
        <div className="absolute inset-0 rounded-[2.5rem] border border-white/10 group-hover:rotate-45 transition-transform duration-1000"></div>
      </button>
    </div>
  );
};

export default FloatingBubble;
