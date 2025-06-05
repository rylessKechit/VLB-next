// src/app/api/robots/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /
Allow: /services/
Allow: /flotte/
Allow: /about/
Allow: /contact/
Allow: /faq/

# Interdire l'indexation des ressources techniques
Disallow: /_next/
Disallow: /api/
Disallow: /admin/
Disallow: /*.json$
Disallow: /*?*
Disallow: /manifest.json

# Interdire les pages temporaires ou de test
Disallow: /test/
Disallow: /dev/
Disallow: /staging/

# Autoriser spécifiquement les images importantes pour le SEO
Allow: /images/logo.webp
Allow: /images/og-image.jpg
Allow: /images/twitter-card.jpg

# Sitemap
Sitemap: https://www.taxi-verrieres-le-buisson.com/sitemap.xml

# Crawl-delay pour éviter la surcharge du serveur
Crawl-delay: 1`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache 24h
    },
  });
}