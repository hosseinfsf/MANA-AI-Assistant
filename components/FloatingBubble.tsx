
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface FloatingBubbleProps {
  isOpen: boolean;
  onClick: () => void;
}

const FloatingBubble: React.FC<FloatingBubbleProps> = ({ isOpen, onClick }) => {
  const [pos, setPos] = useState<{ right: number; bottom: number }>(() => {
    try { const raw = localStorage.getItem('mana_bubble_pos'); return raw ? JSON.parse(raw) : { right: 40, bottom: 40 }; } catch { return { right: 40, bottom: 40 }; }
  });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{startX:number,startY:number,startRight:number,startBottom:number}|null>(null);
  const [badge, setBadge] = useState<{show:boolean,color?:string}>(() => ({ show: false }));
  const lastTap = useRef<number>(0);
  const longPressTimer = useRef<any>(null);

  useEffect(() => {
    const onCopy = () => {
      setBadge({ show: true, color: 'red' });
      setTimeout(() => setBadge({ show: false }), 1800);
    };
    document.addEventListener('copy', onCopy);
    return () => document.removeEventListener('copy', onCopy);
  }, []);

  useEffect(() => {
    localStorage.setItem('mana_bubble_pos', JSON.stringify(pos));
  }, [pos]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, startRight: pos.right, startBottom: pos.bottom };

    // start long press
    longPressTimer.current = setTimeout(() => {
      // dispatch an event for long-press actions
      window.dispatchEvent(new CustomEvent('mana_bubble_longpress'));
    }, 600);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !dragRef.current) return;
    clearTimeout(longPressTimer.current);
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    // since we store right/bottom, subtract dx/dy
    const newRight = Math.max(8, dragRef.current.startRight - dx);
    const newBottom = Math.max(8, dragRef.current.startBottom - dy);
    setPos({ right: newRight, bottom: newBottom });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    (e.target as Element).releasePointerCapture(e.pointerId);
    setDragging(false);
    clearTimeout(longPressTimer.current);

    // detect tap vs drag
    const now = Date.now();
    if (Math.abs((dragRef.current?.startX || 0) - e.clientX) < 6 && Math.abs((dragRef.current?.startY || 0) - e.clientY) < 6) {
      // tap
      if (now - lastTap.current < 300) {
        // double tap
        window.dispatchEvent(new CustomEvent('mana_bubble_doubletap'));
      } else {
        onClick();
      }
      lastTap.current = now;
    }
    dragRef.current = null;
  };

  return (
    <div style={{ position: 'fixed', right: pos.right, bottom: pos.bottom, zIndex: 10000 }}>
      <button
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { setDragging(false); clearTimeout(longPressTimer.current); }}
        className={
          `relative w-20 h-20 rounded-[2.25rem] flex items-center justify-center transition-all duration-200 ${isOpen ? 'opacity-30 scale-90' : 'hover:scale-105'} mana-glass border-white/20 shadow-[0_20px_60px_rgba(168,85,247,0.35)]`
        }
        aria-label="MANA Floating"
      >
        <div className="absolute inset-1 bg-gradient-to-br from-primary to-secondary rounded-[2rem] opacity-20 blur-xl transition-opacity"></div>
        <div className="relative z-10 crystal-glow">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>
        <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${badge.show ? 'bg-red-500' : 'bg-white/10'} text-white`}> {badge.show ? '!' : ''} </div>
        <div className="absolute inset-0 rounded-[2.25rem] border border-white/10 transition-transform duration-1000"></div>
      </button>
    </div>
  );
};

export default FloatingBubble;
