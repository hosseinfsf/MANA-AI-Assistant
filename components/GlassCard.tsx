import React from 'react';

const GlassCard: React.FC<{ children?: React.ReactNode; className?: string; blur?: number }> = ({ children, className = '', blur = 18 }) => {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 overflow-hidden ${className}`} style={{ backdropFilter: `blur(${blur}px)` }}>
      {children}
    </div>
  );
};

export default GlassCard;
