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
  
  // ✅ HEADERS CORRIGÉS - Supprimer X-Robots-Tag des pages principales
  async headers() {
    return [
      {
        // Headers généraux SANS X-Robots-Tag
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
      // ✅ SEULEMENT les ressources techniques sont bloquées
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow'
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow'
          },
        ],
      },
      {
        source: '/admin/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow'
          },
        ],
      },
      // Assets avec cache mais SANS blocage d'indexation
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
      {
        source: '/nos-services',
        destination: '/#services',
        permanent: true,
      },
    ];
  },
  
  // ✅ REWRITE CORRIGÉ - Supprimer le robots.txt des rewrites
  async rewrites() {
    return {
      beforeFiles: [
        // ❌ SUPPRIMER CETTE LIGNE qui causait le problème
        // {
        //   source: '/robots.txt',
        //   destination: '/api/robots'
        // },
        {
          source: '/api/:path*',
          destination: '/api/:path*'
        }
      ]
    };
  },
  
  optimizeFonts: true,
  output: 'standalone',
  transpilePackages: ['@fortawesome/fontawesome-svg-core', '@fortawesome/free-solid-svg-icons'],
};

module.exports = nextConfig;