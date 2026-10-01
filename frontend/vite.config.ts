import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    {
      name: 'local-api-config',
      transformIndexHtml() {
        if (command !== 'serve') return;
        return [{
          tag: 'script',
          children: `Object.assign(window.env, {
            VITE_API_URL: 'http://localhost:55104/api/Public/',
            VITE_MEDIA_URL: 'http://localhost:55104/'
          });`,
          injectTo: 'head',
        }];
      },
    },
  ],
  server: { host: 'localhost', port: 5173, strictPort: true },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}));
