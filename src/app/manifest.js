// src/app/manifest.js
export default function manifest() {
  return {
    name: 'Taxi VLB - Service de taxi à Verrières-le-Buisson',
    short_name: 'Taxi VLB',
    description: 'Service de taxi à Verrières-le-Buisson (91) disponible 24h/24 et 7j/7. Transferts aéroport, gare et longue distance.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#d4af37',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'fr',
    categories: ['transport', 'taxi'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ],
    shortcuts: [
      {
        name: 'Réserver un taxi',
        url: '/#booking',
        description: 'Réservation rapide d\'un taxi',
        icons: [
          {
            src: '/icons/icon-96x96.png',
            sizes: '96x96'
          }
        ]
      },
      {
        name: 'Appeler',
        url: 'tel:+33665113928',
        description: 'Appeler directement Taxi VLB',
        icons: [
          {
            src: '/icons/icon-96x96.png',
            sizes: '96x96'
          }
        ]
      }
    ]
  }
}