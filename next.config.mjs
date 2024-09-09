/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.spectralunivers.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.website-files.com',
      },
      {
        // Ajout pour supporter localhost
        protocol: 'http',
        hostname: 'localhost',
        port: '5000', // Indique le port si nécessaire, ici c'est 5000
      },
    ],
  },
};

export default nextConfig;
