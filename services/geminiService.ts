
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import { AssistantMode, AIToolType, ToneType } from '../types';

const getAIToolInstruction = (tool?: AIToolType, tone?: ToneType) => {
  switch (tool) {
    case 'summarize': return "متن را بسیار دقیق و در قالب چند نکته کلیدی خلاصه کن. لحن را حفظ کن.";
    case 'translate': return "متن را شناسایی کن و به زبان مقصد (فارسی/انگلیسی) ترجمه کن. فقط ترجمه نهایی را برگردان.";
    case 'shorten': return "بدون حذف پیام اصلی، متن را تا حد امکان کوتاه و موجز کن.";
    case 'lengthen': return "با استفاده از کلمات غنی‌تر و جزئیات بیشتر، متن را بسط بده.";
    case 'change_tone': 
      const tones = { formal: 'رسمی و اداری', slang: 'عامیانه', friendly: 'صمیمی', humorous: 'طنزآمیز' };
      return `بدون تغییر معنا، لحن متن را به ${tones[tone || 'formal']} تغییر بده.`;
    default: return "به عنوان یک دستیار هوشمند با استایل اپل پاسخ بده.";
  }
};

export const sendMessageStream = async function* (
  text: string,
  mode: AssistantMode,
  history: { role: string; parts: { text: string }[] }[],
  options: { tool?: AIToolType; tone?: ToneType; category?: string } = {}
) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = mode === AssistantMode.News ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  
  let systemInstruction = "";
  if (mode === AssistantMode.AI) {
    systemInstruction = getAIToolInstruction(options.tool, options.tone);
  } else if (mode === AssistantMode.News) {
    systemInstruction = `شما یک واحد خبری پیشرفته هستید. بر اساس دسته "${options.category}"، آخرین اخبار داغ امروز را از وب جستجو کرده و به صورت یک لیست خطی (هر خبر در یک خط مجزا)، کوتاه و بسیار جذاب با ذکر منبع گزارش دهید. از ایموجی‌های مرتبط استفاده کنید.`;
  } else {
    systemInstruction = "شما 'مانا' هستید. یک دستیار هوشمند با طراحی مک‌او‌اس و استایل اپل. پاسخ‌های شما باید بسیار شیک، دقیق، کوتاه و به زبان فارسی باشد.";
  }

  try {
    const config: any = {
      systemInstruction,
      temperature: 0.6,
    };

    if (mode === AssistantMode.News) {
      config.tools = [{ googleSearch: {} }];
    }

    const responseStream = await ai.models.generateContentStream({
      model: modelName,
      contents: [...history, { role: 'user', parts: [{ text }] }],
      config,
    });

    for await (const chunk of responseStream) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    yield "خطایی در سیستم مانا رخ داد. لطفا دوباره تلاش کنید.";
  }
};

export const generateSpeech = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    return null;
  }
};

export async function playAudioBase64(base64: string) {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  
  const dataInt16 = new Int16Array(bytes.buffer);
  const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
  return source;
}
