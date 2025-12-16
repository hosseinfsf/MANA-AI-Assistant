import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AssistantMode } from '../types';

const SYSTEM_INSTRUCTION = `
شما "دستیار هوشمند" هستید، یک هوش مصنوعی مفید، مودب و دقیق که به زبان فارسی صحبت می‌کند.
هدف شما کمک به کاربر در کارهای روزمره مثل چت کردن، اصلاح متن، ترجمه و خلاصه سازی است.
پاسخ‌های شما باید کوتاه، کاربردی و بدون توضیحات اضافه باشد تا کاربر بتواند سریعاً از آن‌ها استفاده کند.
در حالت "اصلاح متن"، فقط متن اصلاح شده را برگردانید.
در حالت "ترجمه"، فقط متن ترجمه شده (به فارسی یا انگلیسی بسته به ورودی) را برگردانید.
`;

export const sendMessageToGemini = async (
  text: string,
  mode: AssistantMode,
  history: { role: string; parts: { text: string }[] }[],
  config: { apiKey?: string; model?: string }
): Promise<string> => {
  try {
    // Prioritize custom key if provided (though mostly we use env)
    // Note: In this strict environment, we primarily rely on process.env.API_KEY.
    // However, to support the user request for "Settings", we allow a custom key fallback logic
    // if the architecture permitted. Here we re-initialize per request if a custom key is technically passed,
    // otherwise default to the standard init.
    
    const apiKey = config.apiKey && config.apiKey.length > 10 ? config.apiKey : process.env.API_KEY;
    const modelName = config.model || 'gemini-2.5-flash';

    const ai = new GoogleGenAI({ apiKey: apiKey });

    let prompt = text;
    
    // Adjust prompt based on mode
    switch (mode) {
      case AssistantMode.FixGrammar:
        prompt = `لطفاً متن زیر را از نظر نگارشی و دستوری اصلاح کن و لحن آن را رسمی و مودبانه کن. فقط متن اصلاح شده را بنویس:\n\n${text}`;
        break;
      case AssistantMode.Summarize:
        prompt = `متن زیر را در یک پاراگراف کوتاه خلاصه کن:\n\n${text}`;
        break;
      case AssistantMode.Translate:
        prompt = `متن زیر را ترجمه کن (اگر فارسی است به انگلیسی، و اگر انگلیسی است به فارسی). فقط ترجمه را بنویس:\n\n${text}`;
        break;
      case AssistantMode.Chat:
      default:
        prompt = text;
        break;
    }

    const chat = ai.chats.create({
      model: modelName,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const response: GenerateContentResponse = await chat.sendMessage({ message: prompt });
    return response.text || "متاسفم، مشکلی در دریافت پاسخ پیش آمد.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "خطا در برقراری ارتباط با هوش مصنوعی. لطفاً کلید API یا اینترنت خود را بررسی کنید.";
  }
};