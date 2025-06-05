export default function sitemap() {
  const baseUrl = 'https://www.taxi-verrieres-le-buisson.com';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date('2025-06-05'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/services/aeroport-gare`,
      lastModified: new Date('2025-06-05'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/longue-distance`,
      lastModified: new Date('2025-06-05'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/flotte`,
      lastModified: new Date('2025-06-05'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2025-06-05'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2025-06-05'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date('2025-06-05'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}