export default function ManaDashboard() {
  return (
    <div className="space-y-4 text-white">

      {/* Greeting */}
      <div className="glass rounded-glass p-4 animate-fadeIn">
        <h2 className="text-lg font-bold">سلام ✨</h2>
        <p className="text-sm opacity-80 mt-1">
          امروز آماده‌ای دنیا رو هوشمندتر کنی؟
        </p>
      </div>

      {/* Morning Mana */}
      <div className="glass rounded-glass p-4 glow-mana animate-float">
        <h3 className="font-semibold mb-2">☀️ صبحانه مانا</h3>
        <p className="text-sm opacity-90">
          امروز هوا آرومه، فال حافظت نوید شروع تازه می‌ده 💜
        </p>
      </div>

      {/* Tasks Preview */}
      <div className="glass rounded-glass p-4">
        <h3 className="font-semibold mb-2">📋 کارهای امروز</h3>
        <ul className="text-sm space-y-1 opacity-85">
          <li>• تمرین کدنویسی</li>
          <li>• جواب دادن به پیام‌ها</li>
          <li>• نوشیدن آب 💧</li>
        </ul>
      </div>

    </div>
  );
}