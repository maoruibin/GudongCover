import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');

  // 1. Gemini Key Logic
  // Support multiple naming conventions for backward compatibility
  const geminiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.VITE_GOOGLE_AI_API_KEY || env.GEMINI_API_KEY || env.API_KEY || env.VITE_GOOGLE_AI_API_KEY || '';

  // 2. DeepSeek Key Logic
  const deepseekKey = process.env.DEEPSEEK_API_KEY || process.env.VITE_DEEPSEEK_API_KEY || env.DEEPSEEK_API_KEY || env.VITE_DEEPSEEK_API_KEY || '';

  return {
    plugins: [react()],
    // This injects the keys into the client-side code at build time
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(geminiKey),
      'process.env.DEEPSEEK_API_KEY': JSON.stringify(deepseekKey),
      // Keep generic API_KEY for backward compatibility if needed elsewhere
      'process.env.API_KEY': JSON.stringify(geminiKey)
    },
    build: {
      outDir: 'dist',
    }
  };
});