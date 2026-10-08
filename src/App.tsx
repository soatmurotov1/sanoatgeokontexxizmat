import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { translations } from './translations'
import type { Lang, TranslationKey } from './translations'

const LANGS: Lang[] = ['ru', 'uz', 'uz-Cyrl', 'en']

const LANG_LABELS: Record<Lang, string> = {
  ru: 'Русский',
  uz: "O'zbekcha",
  'uz-Cyrl': 'Ўзбекча',
  en: 'English',
}

const SERVICE_ITEM_COUNTS = [5, 3, 6, 9, 3, 5, 4]

const GALLERY_IMAGES = ['/Image_12.jpg', '/Unknown_1.jpg', '/Yerqari.jpg']

const MAP_COORDS = '41.325833,69.323056'

function isLang(value: string | null): value is Lang {
  return value !== null && (LANGS as string[]).includes(value)
}

function getInitialLang(): Lang {
  const langParam = new URLSearchParams(window.location.search).get('lang')
  if (isLang(langParam)) return langParam
  try {
    const savedLang = localStorage.getItem('selected_language')
    if (isLang(savedLang)) return savedLang
  } catch {
    // localStorage unavailable
  }
  return 'ru'
}

function UzFlag() {
  return (
    <svg className="flag-icon" viewBox="0 0 500 250">
      <rect width="500" height="80" fill="#0099b5" />
      <rect y="80" width="500" height="5" fill="#ce1126" />
      <rect y="85" width="500" height="80" fill="#ffffff" />
      <rect y="165" width="500" height="5" fill="#ce1126" />
      <rect y="170" width="500" height="80" fill="#1eb53a" />
      <circle cx="35" cy="40" r="18" fill="#ffffff" />
      <circle cx="41" cy="40" r="15" fill="#0099b5" />
      <g fill="#ffffff">
        {[75, 95, 115, 135, 155].map((cx) => (
          <circle key={`a${cx}`} cx={cx} cy="20" r="2.5" />
        ))}
        {[95, 115, 135, 155].map((cx) => (
          <circle key={`b${cx}`} cx={cx} cy="40" r="2.5" />
        ))}
        {[115, 135, 155].map((cx) => (
          <circle key={`c${cx}`} cx={cx} cy="60" r="2.5" />
        ))}
      </g>
    </svg>
  )
}

function Flag({ lang, idPrefix }: { lang: Lang; idPrefix: string }) {
  if (lang === 'ru') {
    return (
      <svg className="flag-icon" viewBox="0 0 640 480">
        <rect width="640" height="160" fill="#fff" />
        <rect y="160" width="640" height="160" fill="#0039a6" />
        <rect y="320" width="640" height="160" fill="#d52b1e" />
      </svg>
    )
  }
  if (lang === 'en') {
    return (
      <svg className="flag-icon" viewBox="0 0 60 30">
        <clipPath id={`${idPrefix}-s`}>
          <path d="M0,0 v30 h60 v-30 z" />
        </clipPath>
        <clipPath id={`${idPrefix}-t`}>
          <path d="M30,15 h30 v15 z v-15 h-30 z h-30 v-15 z v15 h30 z" />
        </clipPath>
        <g clipPath={`url(#${idPrefix}-s)`}>
          <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
          <path
            d="M0,0 L60,30 M60,0 L0,30"
            clipPath={`url(#${idPrefix}-t)`}
            stroke="#C8102E"
            strokeWidth="4"
          />
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
        </g>
      </svg>
    )
  }
  return <UzFlag />
}

function PhoneIcon() {
  return (
    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg className="btn-icon" viewBox="0 0 24 24" fill="#0088cc">
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-2.02 9.51c-.15.68-.55.85-1.12.53l-3.08-2.27-1.48 1.43c-.16.16-.3.3-.62.3l.22-3.15 5.73-5.18c.25-.22-.05-.34-.38-.12l-7.08 4.46-3.06-.96c-.66-.21-.67-.66.14-.98l11.96-4.61c.55-.2 1.04.14.81 1.04z" />
    </svg>
  )
}

function PinIcon({ fill }: { fill: string }) {
  return (
    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
        fill={fill}
      />
    </svg>
  )
}

function ContactGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="contact-group">
      <div className="contact-group-title">{title}</div>
      <div className="buttons-container">{children}</div>
    </div>
  )
}

function App() {
  const [lang, setLang] = useState<Lang>(getInitialLang)
  const [langOpen, setLangOpen] = useState(false)
  const [zoom, setZoom] = useState(15)

  const t = translations[lang]

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t.pageTitle
    try {
      localStorage.setItem('selected_language', lang)
      const url = new URL(window.location.href)
      url.searchParams.set('lang', lang)
      window.history.replaceState({}, '', url)
    } catch {
      // language state could not be persisted
    }
  }, [lang, t])

  useEffect(() => {
    const close = () => setLangOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  const zoomMap = (change: number) => {
    setZoom((current) => Math.min(Math.max(current + change, 3), 21))
  }

  return (
    <>
      <header>
        <a
          href="#"
          className="brand"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          <img src="/sanoatgeokontexxizmat_logo.jpg" alt="Logo" className="brand-logo" />
          <span>SANOATGEOKONTEXXIZMAT</span>
        </a>

        <ul className="nav-menu">
          <li><a href="#services">{t.navServices}</a></li>
          <li><a href="#gallery">{t.navGallery}</a></li>
          <li><a href="#about">{t.navAbout}</a></li>
        </ul>

        <div className="nav-actions">
          <div className={`lang-dropdown-wrapper${langOpen ? ' open' : ''}`}>
            <button
              className="lang-dropdown-btn"
              aria-expanded={langOpen}
              aria-haspopup="true"
              onClick={(e) => {
                e.stopPropagation()
                setLangOpen((open) => !open)
              }}
            >
              <span className="lang-btn-left">
                <span>
                  <Flag lang={lang} idPrefix="current" />
                </span>
                <span id="currentLangLabel">{LANG_LABELS[lang]}</span>
              </span>
              <svg className="dropdown-arrow" viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            <ul className="lang-dropdown-menu">
              {LANGS.map((code) => (
                <li key={code}>
                  <button
                    type="button"
                    className={`lang-dropdown-option${code === lang ? ' active' : ''}`}
                    onClick={() => setLang(code)}
                  >
                    <Flag lang={code} idPrefix="option" />
                    <span>{LANG_LABELS[code]}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="nav-contacts">
            <a href="tel:+998998502401"><span>{t.callUs}</span></a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <h1>{t.heroTitle}</h1>
          <p>{t.heroDesc}</p>
          <a href="#services" className="cta-btn">{t.heroCta}</a>
        </section>

        <section className="services-section" id="services">
          <h2 className="section-title">{t.servicesTitle}</h2>
          <div className="services-grid">
            {SERVICE_ITEM_COUNTS.map((itemCount, index) => {
              const n = index + 1
              return (
                <div className="service-card" key={n}>
                  <div className="service-number">{String(n).padStart(2, '0')}</div>
                  <h3>{t[`s${n}Title` as TranslationKey]}</h3>
                  <ul>
                    {Array.from({ length: itemCount }, (_, i) => (
                      <li key={i}>{t[`s${n}Item${i + 1}` as TranslationKey]}</li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </section>

        <section className="gallery-section" id="gallery">
          <h2 className="section-title">{t.galleryTitle}</h2>
          <div className="gallery-grid">
            {GALLERY_IMAGES.map((src) => (
              <div className="gallery-item" key={src}>
                <img src={src} alt="Sanoatgeokontex Xizmat Photo" />
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer id="about">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>{t.footerAboutTitle}</h4>
            <p>{t.footerAboutDesc}</p>
          </div>

          <div className="footer-col">
            <h4>{t.footerContactsTitle}</h4>
            <p style={{ marginBottom: '0.8rem' }}>
              <strong>{t.footerDirector}</strong> <span>{t.directorName}</span>
            </p>

            <ContactGroup title={t.footerPhones}>
              <a href="tel:+998998502401" className="btn-link">
                <PhoneIcon />
                +998 99 850 24 01
              </a>
              <a href="tel:+998977212609" className="btn-link">
                <PhoneIcon />
                +998 97 721 26 09
              </a>
            </ContactGroup>

            <ContactGroup title="Email:">
              <a href="mailto:sanoatgeokontexxizmat@gmail.com" className="btn-link">
                <MailIcon />
                sanoatgeokontexxizmat@gmail.com
              </a>
            </ContactGroup>

            <ContactGroup title="Telegram:">
              <a
                href="https://t.me/sanoatgeokontex_xizmat"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link"
              >
                <TelegramIcon />
                @sanoatgeokontex_xizmat
              </a>
            </ContactGroup>

            <ContactGroup title={t.footerTelegramGroup}>
              <a
                href="https://t.me/Sanoatgeokontexxizmat_klubi"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link"
              >
                <TelegramIcon />
                @Sanoatgeokontexxizmat_klubi
              </a>
            </ContactGroup>
          </div>

          <div className="footer-col">
            <h4>{t.footerAddressesTitle}</h4>
            <p>
              <strong>{t.footerLegalLabel}</strong> <span>{t.footerLegalAddr}</span>
            </p>
            <p>
              <strong>{t.footerPostalLabel}</strong> <span>{t.footerPostalAddr}</span>
            </p>

            <p style={{ marginTop: '1.2rem' }}>
              <strong>{t.footerLocationLabel}</strong>
            </p>
            <div className="map-links-container">
              <a
                href="https://maps.app.goo.gl/KzWm3fjxkAsEqQb46"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link"
              >
                <PinIcon fill="#EA4335" />
                Google Maps
              </a>
              <a
                href="https://yandex.uz/maps/-/CTXzqO50"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link"
              >
                <PinIcon fill="#FC3F1D" />
                Yandex Maps
              </a>
            </div>
            <div className="map-wrapper">
              <div className="map-container">
                <iframe
                  title="Office location"
                  src={`https://maps.google.com/maps?q=${MAP_COORDS}&z=${zoom}&output=embed`}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
              <div className="map-controls">
                <button type="button" onClick={() => zoomMap(1)} title="Zoom in">+</button>
                <button type="button" onClick={() => zoomMap(-1)} title="Zoom out">−</button>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">{t.footerCopyright}</div>
      </footer>
    </>
  )
}

export default App
