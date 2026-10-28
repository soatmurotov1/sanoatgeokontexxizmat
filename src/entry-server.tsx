/* eslint-disable react-refresh/only-export-components -- build-time server entry, never hot-reloaded */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'
import type { Lang } from './translations'

export { LANGS, LANG_PATHS, headTags, langDir, robotsTxt, sitemapXml } from './seo'

export function render(lang: Lang) {
  return renderToString(
    <StrictMode>
      <App lang={lang} />
    </StrictMode>,
  )
}
