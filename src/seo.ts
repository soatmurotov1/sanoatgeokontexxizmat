import { translations } from './translations'
import type { Lang } from './translations'

export const SITE_URL = 'https://sanoatgeokontexxizmat.uz'

export const DEFAULT_LANG: Lang = 'uz'

export const LANGS: Lang[] = ['uz', 'uz-Cyrl', 'ru', 'en', 'ar', 'zh']

// Every language has its own URL so search engines can index each one separately
export const LANG_PATHS: Record<Lang, string> = {
  uz: '/',
  'uz-Cyrl': '/uz-cyrl/',
  ru: '/ru/',
  en: '/en/',
  ar: '/ar/',
  zh: '/zh/',
}

const OG_LOCALES: Record<Lang, string> = {
  uz: 'uz_UZ',
  'uz-Cyrl': 'uz_UZ',
  ru: 'ru_RU',
  en: 'en_US',
  ar: 'ar_AR',
  zh: 'zh_CN',
}

export function isLang(value: string | null): value is Lang {
  return value !== null && (LANGS as string[]).includes(value)
}

export function langFromPath(pathname: string): Lang {
  const segment = pathname.split('/').filter(Boolean)[0]?.toLowerCase()
  return LANGS.find((lang) => lang !== DEFAULT_LANG && LANG_PATHS[lang] === `/${segment}/`) ?? DEFAULT_LANG
}

export function langDir(lang: Lang) {
  return lang === 'ar' ? 'rtl' : 'ltr'
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function structuredData(lang: Lang) {
  const t = translations[lang]
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'SANOATGEOKONTEXXIZMAT',
    alternateName: t.pageTitle,
    url: SITE_URL + LANG_PATHS[lang],
    logo: `${SITE_URL}/sanoatgeokontexxizmat_logo.png`,
    image: `${SITE_URL}/og-image.jpg`,
    description: t.seoDescription,
    telephone: ['+998998502401', '+998977212609'],
    email: 'sanoatgeokontexxizmat@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: "Mustaqillik shoh ko'chasi, 107",
      addressLocality: 'Tashkent',
      addressRegion: "Mirzo Ulug'bek tumani",
      addressCountry: 'UZ',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 41.325833, longitude: 69.323056 },
    areaServed: { '@type': 'Country', name: 'Uzbekistan' },
    knowsLanguage: ['uz', 'ru', 'en', 'ar', 'zh'],
    sameAs: ['https://t.me/sanoatgeokontex_xizmat'],
  }
}

// <head> contents for the prerendered page of one language
export function headTags(lang: Lang) {
  const t = translations[lang]
  const url = SITE_URL + LANG_PATHS[lang]
  const title = escapeHtml(t.seoTitle)
  const description = escapeHtml(t.seoDescription)
  const alternates = LANGS.map(
    (code) => `<link rel="alternate" hreflang="${code}" href="${SITE_URL + LANG_PATHS[code]}" />`,
  )
  const jsonLd = JSON.stringify(structuredData(lang)).replace(/</g, '\\u003c')

  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    ...alternates,
    `<link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="SANOATGEOKONTEXXIZMAT" />',
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE_URL}/og-image.jpg" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:locale" content="${OG_LOCALES[lang]}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<script type="application/ld+json">${jsonLd}</script>`,
  ].join('\n    ')
}

export function sitemapXml(lastmod: string) {
  const alternates = LANGS.map(
    (code) =>
      `    <xhtml:link rel="alternate" hreflang="${code}" href="${SITE_URL + LANG_PATHS[code]}" />`,
  ).join('\n')
  const urls = LANGS.map(
    (lang) => `  <url>
    <loc>${SITE_URL + LANG_PATHS[lang]}</loc>
    <lastmod>${lastmod}</lastmod>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />
  </url>`,
  ).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`
}

export function robotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
}
