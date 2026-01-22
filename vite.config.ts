import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  // Priority: 
  // 1. process.env (Cloudflare build environment)
  // 2. env file (Local development)
  const apiKey = process.env.API_KEY || process.env.VITE_GOOGLE_AI_API_KEY || env.API_KEY || env.VITE_GOOGLE_AI_API_KEY;

  return {
    plugins: [react()],
    // This injects the key into the client-side code at build time
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey)
    },
    build: {
      outDir: 'dist',
    }
  };
});