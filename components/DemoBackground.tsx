import React from 'react';

const DemoBackground: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-slate-100 p-8 flex flex-col gap-8 opacity-50 pointer-events-none select-none overflow-hidden" aria-hidden="true">
      {/* Mock Header */}
      <div className="w-full h-16 bg-white rounded-xl shadow-sm flex items-center px-6 gap-4">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>

      {/* Mock Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm h-64 flex flex-col gap-4">
            <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-100 rounded"></div>
              <div className="h-4 w-full bg-gray-100 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
            </div>
            <div className="mt-auto h-10 w-full bg-indigo-50 rounded"></div>
          </div>
        ))}
      </div>
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">نمونه نمایشی</h1>
        <p className="text-gray-600 text-lg max-w-md mx-auto">
          این صفحه شبیه‌سازی محیط سیستم عامل است.
          <br/>
          دکمه شناور در پایین صفحه را امتحان کنید.
        </p>
      </div>
    </div>
  );
};

export default DemoBackground;