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
  const { provider, apiKey: customKey } = settings;
  
  const systemPrompt = platform === Platform.WeChat ? wechatPrompt : xhsPrompt;

  // Common User Prompt
  const userPrompt = `
    Based on the System Instructions provided above, generate the HTML for the following topic:
    "${topic}"

    CRITICAL REQUIREMENTS:
    1. **Output Format**: Return ONLY the raw HTML string. NO markdown blocks (e.g., no \`\`\`html).
    2. **Styling**: Use **INLINE STYLES** (style="...") for ALL styling. Do NOT use Tailwind CSS classes.
    3. **Structure**: The root element MUST have explicit width and height in inline styles.
    4. **Content**: Do NOT include <html>, <head>, <body> tags or any scripts.
    5. **Language**: All text MUST be in Simplified Chinese (简体中文).
    6. **Colors**: Use standard hex colors (#ffffff, #0f172a, etc.) or rgba(). Avoid oklab or other modern color formats.
  `;

  try {
    if (provider === AIProvider.DeepSeek) {
      // Logic: Prioritize Custom Key -> Env Key -> Fail
      const apiKey = customKey?.trim() || process.env.DEEPSEEK_API_KEY || "";
      
      if (!apiKey) {
        throw new Error("DeepSeek API Key 未配置。请在设置中输入您的 Key，或配置环境变量。");
      }
      return await callDeepSeek(apiKey, systemPrompt, userPrompt);
    } else {
      // Gemini
      // Logic: Prioritize Custom Key -> Env Key -> Fail
      const apiKey = customKey?.trim() || process.env.API_KEY || "";

      if (!apiKey) {
         throw new Error("Gemini API Key 未配置。请在设置中输入您的 Key，或配置环境变量。");
      }
      return await callGemini(apiKey, systemPrompt, userPrompt);
    }
  } catch (error: any) {
    console.error(`${provider} API Error:`, error);
    throw new Error(error.message || "生成封面失败，请检查 API Key 或网络连接。");
  }
};

// --- Gemini Implementation ---
async function callGemini(apiKey: string, systemPrompt: string, userPrompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
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