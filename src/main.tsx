import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/700.css'
import '@fontsource/montserrat/800.css'
import '@fontsource/lato/300.css'
import '@fontsource/lato/400.css'
import '@fontsource/lato/700.css'
import './index.css'
import App from './App.tsx'
import { LANG_PATHS, isLang, langFromPath } from './seo'

// Old links used ?lang=ru; send them to that language's own page
const langParam = new URLSearchParams(window.location.search).get('lang')
if (isLang(langParam)) {
  window.location.replace(LANG_PATHS[langParam] + window.location.hash)
}

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App lang={langFromPath(window.location.pathname)} />
  </StrictMode>
)

// Production pages are prerendered (see scripts/prerender.mjs); the dev server serves an empty root
if (root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
