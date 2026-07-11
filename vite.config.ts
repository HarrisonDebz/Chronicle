import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'app-icon.jpg'],
      manifest: {
        name: 'Chronicle',
        short_name: 'Chronicle',
        description: 'Your personal time management and memories app.',
        theme_color: '#0b1326',
        background_color: '#0b1326',
        display: 'standalone',
        icons: [
          {
            src: 'app-icon.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any'
          },
          {
            src: 'app-icon.jpg',
            sizes: '192x192',
            type: 'image/jpeg',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
});