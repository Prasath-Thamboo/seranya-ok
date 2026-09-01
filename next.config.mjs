import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['antd', 'react-icons'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.website-files.com',
      },
      {
        protocol: 'https',
        hostname: 'seranya-back.onrender.com',
      },
      {
        protocol: 'https',
        hostname: 'seranya.s3.amazonaws.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async headers() {
    // En dev, Next sert les chunks /_next/static/* sur des URL stables (sans
    // hash) : un Cache-Control "immutable" les fige dans le cache du
    // navigateur → le code modifié ne se recharge jamais, même après
    // redémarrage. On ne pose donc ce header qu'en production.
    const longCache =
      process.env.NODE_ENV === 'production'
        ? [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
        : [];

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: longCache,
      },
      {
        source: '/logos/:path*',
        headers: longCache,
      },
    ];
  },
};

// Activation de l’analyse de bundle lorsque la variable d’environnement ANALYZE est définie
const bundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);

export default bundleAnalyzerConfig;