import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// For GitHub Pages: https://<user>.github.io/<repo>/
const repoName = 'startup-survival-20s'

export default defineConfig({
  base: `/${repoName}/`,
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: '創業求生 20 秒',
        short_name: 'SS20',
        description: '手機網頁小遊戲：每回合 20 秒做決策，撐越久越強。',
        theme_color: '#0f172a',
        background_color: '#0b1220',
        display: 'standalone',
        scope: `/${repoName}/`,
        start_url: `/${repoName}/`,
        icons: [
          {
            src: `/${repoName}/icons/icon-192.png`,
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: `/${repoName}/icons/icon-512.png`,
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
