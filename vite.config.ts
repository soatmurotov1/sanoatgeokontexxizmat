import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'

// Only what the site actually loads: own scripts/images/fonts and the Google Maps embed
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data:",
  "frame-src https://maps.google.com https://www.google.com",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  'upgrade-insecure-requests',
].join('; ')

// Netlify response headers. Unlike the meta tag, a header CSP can forbid framing (clickjacking)
const HEADERS = [
  '/*',
  `  Content-Security-Policy: ${CSP}; frame-ancestors 'none'`,
  '  X-Frame-Options: DENY',
  '  X-Content-Type-Options: nosniff',
  '  Referrer-Policy: strict-origin-when-cross-origin',
  '  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  '  Cross-Origin-Opener-Policy: same-origin',
  '',
  // Vite puts a content hash in these file names, so they can be cached forever
  '/assets/*',
  '  Cache-Control: public, max-age=31536000, immutable',
  '',
].join('\n')

// Added to the production build only: the dev server injects inline scripts for HMR
function securityMeta(): Plugin {
  return {
    name: 'security-meta',
    apply: 'build',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: '_headers', source: HEADERS })
    },
    transformIndexHtml() {
      return [
        {
          tag: 'meta',
          attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP },
          injectTo: 'head-prepend',
        },
      ]
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), securityMeta()],
  build: {
    // Keep fonts as files: the CSP font-src does not allow data: URIs
    assetsInlineLimit: (filePath) => (/\.woff2?$/.test(filePath) ? false : undefined),
  },
})
