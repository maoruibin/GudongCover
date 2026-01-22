import { GoogleGenAI } from "@google/genai";
import { Platform, AIProvider, AppSettings } from "../types";
import { wechatPrompt } from "../prompts/wechatPrompt";
import { xhsPrompt } from "../prompts/xhsPrompt";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

export const generateCoverHtml = async (
  topic: string, 
  platform: Platform,
  settings: AppSettings
): Promise<string> => {
  const { provider, apiKey } = settings;
  
  // 1. Validate API Key
  // If using Gemini and no custom key is provided, try to use the env var
  const effectiveApiKey = apiKey || (provider === AIProvider.Gemini ? process.env.API_KEY : "");

  if (!effectiveApiKey) {
    throw new Error(`请在设置中配置 ${provider === AIProvider.DeepSeek ? 'DeepSeek' : 'Gemini'} 的 API Key`);
  }

  const systemPrompt = platform === Platform.WeChat ? wechatPrompt : xhsPrompt;

  // 2. Common User Prompt
  const userPrompt = `
    Based on the System Instructions provided above, generate the HTML/Tailwind code for the following topic:
    "${topic}"
    
    STRICT REQUIREMENTS:
    1. **Output Format**: Return ONLY the raw HTML string for the component. NO markdown blocks (e.g., no \`\`\`html).
    2. **Structure**: The root element MUST be a single <div> with classes \`w-full h-full\`. 
    3. **Content**: Do NOT include <html>, <head>, <body> tags or any scripts.
    4. **Language**: All text MUST be in Simplified Chinese (简体中文).
    5. **Styling**: Use ONLY Tailwind CSS classes. Ensure high contrast and good readability.
  `;

  try {
    if (provider === AIProvider.DeepSeek) {
      return await callDeepSeek(effectiveApiKey, systemPrompt, userPrompt);
    } else {
      return await callGemini(effectiveApiKey, systemPrompt, userPrompt);
    }
  } catch (error: any) {
    console.error(`${provider} API Error:`, error);
    throw new Error(error.message || "生成封面失败，请检查 API Key 或网络连接。");
  }
};

// --- Gemini Implementation ---
async function callGemini(apiKey: string, systemPrompt: string, userPrompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", // Or gemini-2.0-flash
    contents: [
      { role: "user", parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }
    ]
  });

  let text = response.text || "";
  return cleanOutput(text);
}

// --- DeepSeek Implementation ---
async function callDeepSeek(apiKey: string, systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-chat", // V3
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      stream: false,
      temperature: 1.3 // DeepSeek V3 often benefits from slightly higher temp for creativity
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`DeepSeek API Error: ${response.status} ${errorData.error?.message || ''}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";
  return cleanOutput(text);
}

// --- Helper ---
function cleanOutput(text: string): string {
  // Remove markdown code blocks if present
  return text.replace(/```html/g, '').replace(/```/g, '').trim();
}