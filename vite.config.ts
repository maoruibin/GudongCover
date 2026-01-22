import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // This allows using process.env.API_KEY in the client-side code
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_GOOGLE_AI_API_KEY)
    },
    build: {
      outDir: 'dist',
    }
  };
});