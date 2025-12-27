import React from 'react';

export type IconKey = 'cat' | 'dog' | 'rabbit' | 'moon' | 'cloud';

export const FloatingIcons: React.FC<{ onSelect?: (k: IconKey) => void }> = ({ onSelect }) => {
  const btnStyle: React.CSSProperties = {
    width: '1cm',
    height: '1cm',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(6px)',
    boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
    border: '2px solid rgba(255,215,100,0.9)',
    position: 'relative',
    overflow: 'visible',
    cursor: 'pointer',
  };

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <style>{`
        @keyframes cat-play { 0%{transform:translateY(0) rotate(0)}25%{transform:translateY(-6px) rotate(-6deg)}50%{transform:translateY(0) rotate(6deg)}75%{transform:translateY(-4px) rotate(-4deg)}100%{transform:translateY(0) rotate(0)} }
        @keyframes dog-wag { 0%{transform:translateX(0)}50%{transform:translateX(3px)}100%{transform:translateX(0)} }
        @keyframes rabbit-hop { 0%{transform:translateY(0)}40%{transform:translateY(-10px)}100%{transform:translateY(0)} }
        @keyframes moon-spin { 0%{transform:rotate(0)}100%{transform:rotate(360deg)} }
        @keyframes cloud-float { 0%{transform:translateX(0)}50%{transform:translateX(6px)}100%{transform:translateX(0)} }
        .icon-svg { width: 70%; height: 70%; }
      `}</style>

      <div style={btnStyle} onClick={() => onSelect?.('cat')} title="گربه">
        <svg className="icon-svg" viewBox="0 0 64 64" style={{ animation: 'cat-play 2.2s infinite ease-in-out' }}>
          <g fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 28c0-6 5-12 16-12s16 6 16 12c0 11-8 18-16 18S16 39 16 28z" fill="#ffd8d8" stroke="#ffd8d8" />
            <path d="M20 18 L14 10" stroke="#FFD18A" />
            <path d="M44 18 L50 10" stroke="#FFD18A" />
            <circle cx="24" cy="28" r="2" fill="#333" />
            <circle cx="40" cy="28" r="2" fill="#333" />
            <path d="M28 36 Q32 40 36 36" stroke="#333" />
          </g>
        </svg>
      </div>

      <div style={btnStyle} onClick={() => onSelect?.('dog')} title="سگ">
        <svg className="icon-svg" viewBox="0 0 64 64" style={{ animation: 'dog-wag 1s infinite linear' }}>
          <g fill="#fff" opacity="0.95">
            <path d="M44 30c0-6-6-10-12-10s-12 4-12 10c0 8 6 14 12 14s12-6 12-14z" fill="#d3f0ff" />
            <path d="M46 26 L54 22" stroke="#FFD18A" strokeWidth="1.6" />
            <circle cx="28" cy="30" r="2" fill="#333" />
            <circle cx="36" cy="30" r="2" fill="#333" />
          </g>
        </svg>
      </div>

      <div style={btnStyle} onClick={() => onSelect?.('rabbit')} title="خرگوش">
        <svg className="icon-svg" viewBox="0 0 64 64" style={{ animation: 'rabbit-hop 1.6s infinite ease' }}>
          <g fill="#fff">
            <path d="M24 30c0-6 6-10 12-10s12 4 12 10c0 8-6 14-12 14S24 38 24 30z" fill="#ffeecf" />
            <path d="M30 12 L30 4" stroke="#FFC" strokeWidth="1.6" />
            <circle cx="30" cy="30" r="2" fill="#333" />
          </g>
        </svg>
      </div>

      <div style={btnStyle} onClick={() => onSelect?.('moon')} title="ماه">
        <svg className="icon-svg" viewBox="0 0 64 64" style={{ animation: 'moon-spin 8s linear infinite' }}>
          <g fill="#fff">
            <path d="M36 12a16 16 0 1 0 0 32 12 12 0 1 1 0-32z" fill="#E8F1FF" opacity="0.95" />
          </g>
        </svg>
      </div>

      <div style={btnStyle} onClick={() => onSelect?.('cloud')} title="ابر">
        <svg className="icon-svg" viewBox="0 0 64 64" style={{ animation: 'cloud-float 3s ease-in-out infinite' }}>
          <g fill="#fff">
            <path d="M20 36h28a8 8 0 0 0 0-16 12 12 0 0 0-22-4 8 8 0 0 0-6 20z" fill="#f1f7ff" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default FloatingIcons;
