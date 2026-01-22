import { GoogleGenAI } from "@google/genai";
import { Platform } from "../types";

export const generateCoverHtml = async (
  topic: string, 
  platform: Platform
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // 1. Determine which Markdown file to load
  const promptFile = platform === Platform.WeChat 
    ? 'prompts/wechatPrompt.md' 
    : 'prompts/xhsPrompt.md';
  
  let systemPrompt = "";

  try {
    // 2. Fetch the content of the markdown file
    const response = await fetch(promptFile);
    if (!response.ok) {
      throw new Error(`Failed to load prompt file: ${response.statusText}`);
    }
    systemPrompt = await response.text();
  } catch (error) {
    console.error(`Error loading ${platform} prompt:`, error);
    throw new Error(`Could not load system configuration for ${platform}.`);
  }
  
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