import React, { useState, useEffect } from 'react';
import { loadGhazals, getRandomGhazal } from '../services/hafezService';
import type { Ghazal } from '../types';

const HafezFortune: React.FC = () => {
  const [currentGhazal, setCurrentGhazal] = useState<Ghazal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load the ghazals data from the JSON file
  useEffect(() => {
    const loadGhazalsData = async () => {
      try {
        await loadGhazals();
        const randomGhazal = getRandomGhazal();
        setCurrentGhazal(randomGhazal);
        setLoading(false);
      } catch (err) {
        console.error('Error loading ghazals:', err);
        setError('خطا در بارگذاری اطلاعات غزل‌ها');
        setLoading(false);
      }
    };

    loadGhazalsData();
  }, []);

  const getNewFortune = async () => {
    setLoading(true);
    try {
      // Since data is already loaded, we can get a new random ghazal directly
      const randomGhazal = getRandomGhazal();
      setCurrentGhazal(randomGhazal);
    } catch (err) {
      console.error('Error getting new fortune:', err);
      setError('خطا در دریافت فال جدید');
    }
    setLoading(false);
  };

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-purple-700"> فال حافظ ✨</h1>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-lg">در حال بارگذاری فال...</p>
        </div>
      ) : currentGhazal ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">{currentGhazal.title}</h2>
          
          <div className="space-y-6 mb-8">
            {currentGhazal.verses.map((verse, index) => (
              <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <p className="text-lg leading-relaxed text-right font-serif text-gray-900" dir="rtl">
                  {verse.mesra1}
                </p>
                <p className="text-lg leading-relaxed text-right font-serif text-gray-900 mt-3" dir="rtl">
                  {verse.mesra2}
                </p>
              </div>
            ))}
          </div>
          
          <button
            onClick={getNewFortune}
            disabled={loading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'در حال بارگذاری...' : 'فال جدید بگیر ✨'}
          </button>
        </div>
      ) : (
        <div className="text-center py-8">غزلی یافت نشد</div>
      )}
    </div>
  );
};

export default HafezFortune;