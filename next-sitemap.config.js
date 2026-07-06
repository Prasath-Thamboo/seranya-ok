const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';

async function fetchJson(path) {
  try {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/admin', '/admin/*', '/auth/*', '/loader'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/admin/*', '/auth/*'] },
    ],
  },
  additionalPaths: async () => {
    const [posts, units, classes] = await Promise.all([
      fetchJson('/posts'),
      fetchJson('/units'),
      fetchJson('/classes'),
    ]);

    const toEntry = (loc) => ({ loc, changefreq: 'weekly', priority: 0.6 });

    return [
      ...(Array.isArray(posts) ? posts.map((p) => toEntry(`/posts/${p.id}`)) : []),
      ...(Array.isArray(units) ? units.map((u) => toEntry(`/univers/units/${u.id}`)) : []),
      ...(Array.isArray(classes) ? classes.map((c) => toEntry(`/univers/classes/${c.id}`)) : []),
    ];
  },
};

module.exports = config;
