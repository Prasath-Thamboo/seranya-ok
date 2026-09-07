const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const LOCALES = ['fr', 'en'];
const DEFAULT_LOCALE = 'fr';

// Chemins publics statiques (sans préfixe de locale).
const STATIC_PATHS = [
  '/',
  '/about',
  '/posts',
  '/univers',
  '/encyclopedie',
  '/tutoriels',
  '/eveil',
  '/contact',
  '/subscription',
  '/compte',
  '/mentions',
  '/confidentialite',
  '/cookies',
  '/rgpd',
];

async function fetchJson(path) {
  try {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

/** Construit l'URL localisée d'un chemin (`fr` = pas de préfixe). */
function localizedLoc(locale, path) {
  const suffix = path === '/' ? '' : path;
  return locale === DEFAULT_LOCALE
    ? `${SITE_URL}${suffix}`
    : `${SITE_URL}/${locale}${suffix}`;
}

/**
 * alternateRefs hreflang (fr, en, x-default) pour un chemin donné.
 * `hrefIsAbsolute` empêche next-sitemap de re-concaténer le chemin : nos URLs
 * `fr` (sans préfixe) et `en` (`/en`) n'ont pas le même suffixe.
 */
function alternateRefs(path) {
  const refs = LOCALES.map((locale) => ({
    href: localizedLoc(locale, path),
    hreflang: locale,
    hrefIsAbsolute: true,
  }));
  refs.push({
    href: localizedLoc(DEFAULT_LOCALE, path),
    hreflang: 'x-default',
    hrefIsAbsolute: true,
  });
  return refs;
}

/** Deux entrées (fr + en) pour un même chemin logique. */
function localizedEntries(path, { priority = 0.7, changefreq = 'daily' } = {}) {
  const refs = alternateRefs(path);
  return LOCALES.map((locale) => ({
    loc: localizedLoc(locale, path),
    changefreq,
    priority,
    alternateRefs: refs,
  }));
}

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  // Les routes découvertes automatiquement contiennent le segment dynamique
  // `[locale]` non résolu : on les exclut et on régénère tout à la main.
  exclude: ['/*'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/admin/*', '/auth/*', '/en/admin', '/en/admin/*', '/en/auth/*'] },
    ],
  },
  additionalPaths: async () => {
    const [posts, units, classes] = await Promise.all([
      fetchJson('/posts'),
      fetchJson('/units'),
      fetchJson('/classes'),
    ]);

    const entries = [];

    for (const path of STATIC_PATHS) {
      entries.push(
        ...localizedEntries(path, { priority: path === '/' ? 1.0 : 0.7 })
      );
    }

    const dynamic = [
      ...(Array.isArray(posts) ? posts.map((p) => `/posts/${p.id}`) : []),
      ...(Array.isArray(units) ? units.map((u) => `/univers/units/${u.id}`) : []),
      ...(Array.isArray(classes) ? classes.map((c) => `/univers/classes/${c.id}`) : []),
    ];

    for (const path of dynamic) {
      entries.push(...localizedEntries(path, { priority: 0.6, changefreq: 'weekly' }));
    }

    return entries;
  },
};

module.exports = config;
