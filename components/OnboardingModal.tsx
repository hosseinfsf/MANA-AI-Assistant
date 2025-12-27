import React from 'react';
import { X } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: UserProfile) => void;
}

const defaultProfile: UserProfile = {
  name: '',
  nickname: '',
  ageRange: '26-35',
  dailyActivity: 'کار',
  birthMonth: '',
  city: ''
};

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState<UserProfile>(defaultProfile);

  React.useEffect(() => { if (isOpen) { setStep(0); setForm(defaultProfile); } }, [isOpen]);
  if (!isOpen) return null;

  const next = () => setStep(s => Math.min(4, s + 1));
  const prev = () => setStep(s => Math.max(0, s - 1));

  const handleFinish = () => {
    // basic validation: name and city
    if (!form.name.trim()) return alert('لطفاً نام خود را وارد کنید.');
    if (!form.city.trim()) return alert('لطفاً شهر/استان را وارد کنید.');
    localStorage.setItem('mana_profile_v1', JSON.stringify(form));
    localStorage.setItem('mana_onboard_done', '1');
    onComplete(form);
  };

  return (
    <div className="fixed inset-0 z-[30000] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-xl bg-[#0b0b0b] rounded-2xl p-6 text-right text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-xl">خوش‌آمدی به مانا</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center"><X size={18} /></button>
        </div>

        <div className="min-h-[140px]">
          {step === 0 && (
            <div>
              <p className="mb-3 font-bold">اسم کوچیکت چیه؟ چی صدات کنم؟</p>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 rounded-lg bg-white/5" placeholder="مثلاً: علی" />
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="mb-3 font-bold">حدوداً چند سالته؟</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {id: 'under18', label: 'زیر ۱۸'},
                  {id: '18-25', label: '۱۸–۲۵'},
                  {id: '26-35', label: '۲۶–۳۵'},
                  {id: '36-50', label: '۳۶–۵۰'},
                  {id: '50+', label: 'بالای ۵۰'}
                ].map(opt => (
                  <button key={opt.id} onClick={() => setForm({...form, ageRange: opt.id as any})} className={`py-3 rounded-lg ${form.ageRange === opt.id ? 'bg-primary' : 'bg-white/5'}`}>{opt.label}</button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="mb-3 font-bold">روزانه بیشتر چیکار می‌کنی؟</p>
              <div className="grid grid-cols-2 gap-2">
                {['درس','کار','خونه','فریلنس','بازنشسته','سایر'].map(a => (
                  <button key={a} onClick={() => setForm({...form, dailyActivity: a as any})} className={`py-3 rounded-lg ${form.dailyActivity === a ? 'bg-primary' : 'bg-white/5'}`}>{a}</button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="mb-3 font-bold">ماه تولدت چیه؟</p>
              <select value={form.birthMonth} onChange={e => setForm({...form, birthMonth: e.target.value})} className="w-full p-3 rounded-lg bg-white/5">
                <option value="">انتخاب کنید</option>
                {['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          )}

          {step === 4 && (
            <div>
              <p className="mb-3 font-bold">شهر یا استانت چیه؟</p>
              <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full p-3 rounded-lg bg-white/5" placeholder="مثلاً: تهران" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6">
          <div>
            {step > 0 && <button onClick={prev} className="px-3 py-2 bg-white/5 rounded-lg ml-2">برگشت</button>}
            {step < 4 && <button onClick={next} className="px-4 py-2 bg-primary rounded-lg">بعدی</button>}
            {step === 4 && <button onClick={handleFinish} className="px-4 py-2 bg-primary rounded-lg">پایان و ذخیره</button>}
          </div>
          <div className="text-sm text-white/50">مرحله {step+1} از 5</div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
