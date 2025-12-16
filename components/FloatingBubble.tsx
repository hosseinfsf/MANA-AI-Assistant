import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowDownToLine } from 'lucide-react';

interface FloatingBubbleProps {
  isOpen: boolean;
  onClick: () => void;
  onDropText: (text: string) => void;
}

const FloatingBubble: React.FC<FloatingBubbleProps> = ({ isOpen, onClick, onDropText }) => {
  const [position, setPosition] = useState({ x: -1, y: -1 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (position.x === -1) {
      setPosition({ x: window.innerWidth - 100, y: window.innerHeight - 120 });
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      dragStartPos.current = {
        x: e.clientX - rect.left + (rect.left - position.x), 
        y: e.clientY - rect.top + (rect.top - position.y)
      };
    }
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovered(true);
  };

  const handleDragLeave = () => {
    setIsHovered(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovered(false);
    const text = e.dataTransfer.getData("text");
    if (text) {
      onDropText(text);
    }
  };

  if (position.x === -1) return null;

  return (
    <div
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        touchAction: 'none'
      }}
      className="fixed z-[9999] cursor-grab active:cursor-grabbing"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <button
        ref={buttonRef}
        onMouseDown={handleMouseDown}
        onClick={() => !isDragging && onClick()}
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300
          ${isOpen ? 'rotate-90 scale-90' : 'hover:scale-105'}
          ${isHovered ? 'scale-110 ring-4 ring-gold shadow-[0_0_30px_rgba(255,215,0,0.6)]' : 'shadow-[0_8px_32px_rgba(0,0,0,0.3)]'}
          backdrop-blur-xl border border-white/40 relative overflow-hidden group
          bg-white/20 dark:bg-black/30
        `}
        aria-label="دستیار هوشمند"
      >
        {/* Glass reflection effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none"></div>

        {isHovered ? (
          <ArrowDownToLine className="w-8 h-8 text-white animate-bounce z-20 relative drop-shadow-lg" />
        ) : isOpen ? (
          <div className="w-full h-full rounded-full flex items-center justify-center z-20">
             <X className="w-8 h-8 text-white drop-shadow-md" />
          </div>
        ) : (
          <div className="relative w-full h-full p-4 z-20 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
             {/* Fingerprint SVG */}
             <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
               <defs>
                 <linearGradient id="glass-fingerprint" x1="0%" y1="0%" x2="100%" y2="100%">
                   <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                   <stop offset="100%" stopColor="#ddd" stopOpacity="0.6" />
                 </linearGradient>
               </defs>
               <path d="M50 20 C35 20 25 35 25 50 C25 65 35 80 50 80 C65 80 75 65 75 50" stroke="url(#glass-fingerprint)" />
               <path d="M50 30 C40 30 35 40 35 50 C35 60 40 70 50 70 C60 70 65 60 65 50" stroke="url(#glass-fingerprint)"/>
               <path d="M50 40 C45 40 42 45 42 50 C42 55 45 60 50 60 C55 60 58 55 58 50" stroke="url(#glass-fingerprint)"/>
               <path d="M30 50 C30 25 70 25 70 50" strokeDasharray="8 6" opacity="0.8" stroke="white" />
             </svg>
          </div>
        )}
      </button>
    </div>
  );
};

export default FloatingBubble;