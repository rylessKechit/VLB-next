/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
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
    unoptimized: false,
    loader: 'default',
    path: '/_next/image',
    domains: [],
  },
  
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
    optimizePackageImports: [
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-solid-svg-icons',
      '@fortawesome/react-fontawesome',
    ],
  },
  
  compress: true,
  
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.devtool = false;
      
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
  
  // ✅ HEADERS COMPLÈTEMENT SUPPRIMÉS - Aucun X-Robots-Tag nulle part
  async headers() {
    return [
      {
        // Headers généraux pour la sécurité SEULEMENT
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
      // Cache pour les assets statiques SANS X-Robots-Tag
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
      {
        source: '/services',
        destination: '/#services',
        permanent: true,
      },
    ];
  },
  
  // ✅ REWRITES COMPLÈTEMENT SUPPRIMÉS
  // async rewrites() {
  //   return {
  //     beforeFiles: []
  //   };
  // },
  
  optimizeFonts: true,
  output: 'standalone',
  transpilePackages: ['@fortawesome/fontawesome-svg-core', '@fortawesome/free-solid-svg-icons'],
};

module.exports = nextConfig;