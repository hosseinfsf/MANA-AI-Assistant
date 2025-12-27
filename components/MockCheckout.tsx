import React, { useState } from 'react';

interface MockCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  price?: string;
}

const MockCheckout: React.FC<MockCheckoutProps> = ({ isOpen, onClose, onComplete, price = '9.99' }) => {
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePay = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1500));
    // simulate success
    onComplete();
    setProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-[30000] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md bg-[#0b0b0b] rounded-2xl p-6 text-white">
        <h3 className="font-black text-xl mb-2">خرید نسخه پرو</h3>
        <p className="text-white/70 mb-4">دسترسی نامحدود به مدل‌های پیشرفته و ویژگی‌های ویژه مانا.</p>
        <div className="bg-white/5 p-4 rounded mb-4">
          <div className="flex justify-between">
            <div className="font-bold">نسخه پرو</div>
            <div className="font-bold">${price} / ماه</div>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-white/5 rounded">لغو</button>
          <button onClick={handlePay} className="px-4 py-2 bg-primary rounded" disabled={processing}>{processing ? 'در حال پردازش...' : 'پرداخت'}</button>
        </div>
      </div>
    </div>
  );
};

export default MockCheckout;
