
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import { AssistantMode, AIToolType, ToneType, AIModel } from '../types';

export const sendMessageStream = async function* (
  text: string,
  mode: AssistantMode,
  history: { role: string; parts: { text: string }[] }[],
  options: { 
    tool?: AIToolType; 
    tone?: ToneType; 
    category?: string;
    apiKey?: string;
    model?: AIModel;
  } = {}
) {
  // Use custom key if provided and valid, otherwise fallback to env (demo mode)
  const finalApiKey = (options.apiKey && options.apiKey.length > 10) ? options.apiKey : process.env.API_KEY;
  const ai = new GoogleGenAI({ apiKey: finalApiKey });
  
  // Use selected model or default to flash
  const modelName = options.model || (mode === AssistantMode.News ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview');
  
  let systemInstruction = "";
  if (mode === AssistantMode.News) {
    systemInstruction = `شما یک واحد خبری پیشرفته هستید. بر اساس دسته "${options.category || 'تکنولوژی'}"، آخرین اخبار داغ امروز را از وب جستجو کرده و به صورت یک لیست خطی (هر خبر در یک خط مجزا)، کوتاه و بسیار جذاب با ذکر منبع گزارش دهید. از ایموجی‌های مرتبط استفاده کنید. در انتهای پاسخ، ۳ پیشنهاد کوتاه برای ادامه جستجو را دقیقاً با فرمت [[SUGGESTIONS: ["گزینه ۱", "گزینه ۲", "گزینه ۳"]]] ارائه دهید.`;
  } else {
    systemInstruction = "شما 'مانا' هستید. یک دستیار هوشمند، فوق‌العاده مودب، دقیق و با شخصیت کاریزماتیک. پاسخ‌های شما باید کوتاه، مفید و با لحنی حرفه‌ای اما صمیمی باشد. در انتهای پاسخ، ۳ پیشنهاد کوتاه (حداکثر ۴ کلمه) برای ادامه گفتگو را دقیقاً با فرمت [[SUGGESTIONS: [\"گزینه ۱\", \"گزینه ۲\", \"گزینه ۳\"]]] ارائه دهید.";
  }

  try {
    const config: any = {
      systemInstruction,
      temperature: 0.7,
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
    yield "متاسفانه در برقراری ارتباط با سرور خطایی رخ داد. لطفا اتصال اینترنت یا کلید API خود را بررسی کنید.";
  }
};

export const generateSpeech = async (text: string, apiKey?: string) => {
  const finalApiKey = (apiKey && apiKey.length > 10) ? apiKey : process.env.API_KEY;
  const ai = new GoogleGenAI({ apiKey: finalApiKey });
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
