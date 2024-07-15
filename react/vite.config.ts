import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite'

import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
    },
    plugins: [react()],
    build: {
      outDir: resolve(__dirname, "..", "extension"),
      lib: {
        entry: resolve(__dirname, 'src/main.tsx'),
        formats: ['es'],
        name: 'content.js'
      }
    }
  }
})
