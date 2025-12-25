export default function ManaOrb() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center space-y-2">

      {/* Notification Bubble */}
      <div className="glass px-3 py-1 rounded-full text-xs text-white animate-fadeIn">
        فال جدید آماده‌ست ✨
      </div>

      {/* Orb */}
      <button
        className="
          w-10 h-10 rounded-full
          glass glow-mana
          animate-pulseSlow animate-float
          flex items-center justify-center
          text-white font-bold
        "
      >
        ✦
      </button>

    </div>
  );
}