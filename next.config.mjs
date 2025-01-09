import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'https://back.seranya.fr/',
      'seranya.s3.amazonaws.com', // Ajout de l'hôte manquant
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.website-files.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000', // Indique le port si nécessaire, ici c'est 5000
      },
    ],
  },
};

// Activation de l’analyse de bundle lorsque la variable d’environnement ANALYZE est définie
const bundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);

export default bundleAnalyzerConfig;