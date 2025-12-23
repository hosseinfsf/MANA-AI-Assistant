import { useThemeStore } from './store/themeStore';

function App() {
  const { theme, setTheme } = useThemeStore();

  const themes = [
    { id: 'dark-glass', name: 'Dark Glass' },
    { id: 'amoled-black', name: 'AMOLED Black' },
    { id: 'light-minimal', name: 'Light Minimal' },
    { id: 'persian-night', name: 'Persian Night 🌙' },
    { id: 'neon-tech', name: 'Neon Tech' },
  ];

  return (
    <div className={`min-h-screen transition-all duration-500 ${theme}`}>
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-8">MANA AI Assistant</h1>
        
        <div className="glass p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">انتخاب تم</h2>
          <div className="grid grid-cols-1 gap-4">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={`p-4 rounded-xl transition-all ${
                  theme === t.id
                    ? 'bg-white/30 border-2 border-white'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {t.name} {theme === t.id && '✅'}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center mt-12 text-lg opacity-80">
          مانا زنده شد! 💙 حالا تم‌ها کار می‌کنن
        </p>
      </div>
    </div>
  );
}

export default App;