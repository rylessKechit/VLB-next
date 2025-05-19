/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Optimisation des images
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // Optimisation automatique des images
    unoptimized: false,
  },
  
  // Optimisations compilateur
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
    optimizePackageImports: [
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-solid-svg-icons',
      '@fortawesome/react-fontawesome',
    ],
  },
  
  // Compression
  compress: true,
  
  // Optimisation des bundles
  webpack: (config, { dev, isServer }) => {
    // Optimisation en production
    if (!dev && !isServer) {
      // Désactiver le source map en production pour réduire la taille
      config.devtool = false;
      
      // Optimiser les modules
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'async',
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    
    return config;
  },
  
  // Headers pour améliorer les performances
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/icons/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Redirections pour améliorer le SEO
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'taxi-verrieres-le-buisson.com',
          },
        ],
        destination: 'https://www.taxi-verrieres-le-buisson.com/:path*',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  // PWA et Service Worker
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  },
  
  // Optimiser les polices
  optimizeFonts: true,
  
  // GZIP/Brotli compression
  output: 'standalone',
  
  // Réduire la taille des pages
  transpilePackages: ['@fortawesome/fontawesome-svg-core', '@fortawesome/free-solid-svg-icons'],
  
  // Préchargement des pages
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: '/api/:path*'
        }
      ]
    };
  },
};

module.exports = nextConfig;