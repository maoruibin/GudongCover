import { GoogleGenAI } from "@google/genai";
import { Platform } from "../types";
import { wechatPrompt } from "../prompts/wechatPrompt";
import { xhsPrompt } from "../prompts/xhsPrompt";

export const generateCoverHtml = async (
  topic: string, 
  platform: Platform
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemPrompt = platform === Platform.WeChat ? wechatPrompt : xhsPrompt;
  
  // 3. Construct the user prompt
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
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }
      ]
    });

    let text = response.text || "";
    
    // Clean up markdown code blocks if present
    text = text.replace(/```html/g, '').replace(/```/g, '').trim();

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate cover. Please try again.");
  }
};