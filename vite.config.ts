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
      // Bundle the icons used in src/, so none are fetched from the Iconify API at runtime.
      icon: { clientBundle: { scan: { globInclude: ['src/**/*.{vue,ts}'] } } },
      ui: {
        colors: {
          // `primary` is overridden to near-black in src/assets/css/main.css.
          // Blue stays available as `info` for links and data accents.
          primary: 'blue',
          neutral: 'neutral',
        },
        // Center modals with margins: the default translate can land between pixels,
        // which blurs edges and makes buttons shift while their color changes.
        modal: {
          compoundVariants: [
            {
              scrollable: false,
              fullscreen: false,
              class: { content: 'inset-0 m-auto h-fit translate-x-0 translate-y-0' },
            },
          ],
        },
        // Solid buttons stay opaque on hover: the default fades them to 75%, which looks disabled.
        button: {
          compoundVariants: [
            {
              color: 'primary',
              variant: 'solid',
              class: 'hover:bg-(--ui-color-neutral-700) active:bg-(--ui-color-neutral-700)',
            },
            {
              color: 'error',
              variant: 'solid',
              class: 'hover:bg-(--ui-color-error-600) active:bg-(--ui-color-error-700)',
            },
          ],
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
