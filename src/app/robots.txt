export default function robots() {
  const baseUrl = 'https://www.taxi-verrieres-le-buisson.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/.next/', '/_next/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}