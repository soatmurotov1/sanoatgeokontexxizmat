// Writes a ready-made HTML page per language into dist/, plus sitemap.xml and robots.txt,
// so search engines (Yandex especially) see the content and meta tags without running JavaScript.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const serverDir = path.join(root, 'dist-ssr')

const { LANGS, LANG_PATHS, headTags, langDir, render, robotsTxt, sitemapXml } = await import(
  pathToFileURL(path.join(serverDir, 'entry-server.js')).href
)

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf-8')
for (const placeholder of ['<html lang="uz">', '<!--app-head-->', '<!--app-html-->']) {
  if (!template.includes(placeholder)) throw new Error(`index.html is missing ${placeholder}`)
}

for (const lang of LANGS) {
  const html = template
    .replace('<html lang="uz">', `<html lang="${lang}" dir="${langDir(lang)}">`)
    .replace('<!--app-head-->', headTags(lang))
    .replace('<!--app-html-->', render(lang))
  const outDir = path.join(dist, LANG_PATHS[lang])
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'index.html'), html)
}

fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemapXml(new Date().toISOString().slice(0, 10)))
fs.writeFileSync(path.join(dist, 'robots.txt'), robotsTxt())
fs.rmSync(serverDir, { recursive: true, force: true })

console.log(`Prerendered ${LANGS.length} pages, sitemap.xml and robots.txt`)
