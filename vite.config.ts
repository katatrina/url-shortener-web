import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

export default defineConfig({
  plugins: [
    vue(),
    ui({
      // Light theme only for now (see Notion 03 — UI/UX Design).
      colorMode: false,
      ui: {
        colors: {
          // `primary` is overridden to near-black in src/assets/css/main.css.
          // Blue stays available as `info` for links and data accents.
          primary: 'blue',
          neutral: 'neutral',
        },
      },
    }),
  ],
  server: {
    // The backend only allows CORS from http://localhost:5173 (ALLOWED_ORIGINS).
    // Fail fast instead of silently moving to 5174.
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
