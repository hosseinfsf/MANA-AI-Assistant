/* Mock AI service for offline/testing */
export async function* sendMessageStreamMock(prompt: string) {
  const parts = [
    'سلام! این پاسخ شبیه‌سازی‌شده است.',
    'تفسیر کوتاه: امروز روزی مناسب برای شروع پروژه‌های جدید است.',
    'پیشنهاد: ۱) یک قدم کوچک بردار ۲) یک نوشیدنی گرم بخور'
  ];
  for (const p of parts) {
    await new Promise(r => setTimeout(r, 400));
    yield p + ' ';
  }
}

export async function generateSpeechMock(text: string) {
  return null;
}
