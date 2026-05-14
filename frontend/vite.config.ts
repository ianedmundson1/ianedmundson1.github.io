/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// https://vite.dev/config/
const base = '/';

// Strict CSP, injected only into the production build so dev HMR (inline
// scripts, websockets) keeps working. Inline scripts have been moved to
// public/bootstrap.js and public/spa-redirect.js, so script-src can be 'self'.
const PROD_CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://*.ingest.sentry.io https://*.ingest.us.sentry.io",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ')

const cspPlugin = {
  name: 'inject-csp',
  apply: 'build' as const,
  transformIndexHtml(html: string) {
    return html.replace(
      '<meta charset="UTF-8" />',
      `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${PROD_CSP}" />`,
    )
  },
}

export default defineConfig({
  base,
  plugins: [
    cspPlugin,
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'og-image.jpg'],
      manifest: {
        name: 'Ian Edmundson — Data Scientist & Software Engineer',
        short_name: 'Ian Edmundson',
        description: 'Portfolio of Ian Edmundson: ML systems, forecasting, and analytics infrastructure.',
        theme_color: '#b8451f',
        background_color: '#f7f3ec',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,woff2}'],
        globIgnores: ['**/plotly*'],
        runtimeCaching: [
          {
            urlPattern: /^\/api\//,
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /\/assets\/plotly[^/]*\.js$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'plotly-bundle',
              expiration: { maxEntries: 2, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../backend/static'),
    emptyOutDir: true,
    assetsDir: 'assets'
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['tests/e2e/**', 'node_modules/**'],
  },
})