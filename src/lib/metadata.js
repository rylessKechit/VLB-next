// src/lib/metadata.js amélioré
export const baseMetadata = {
  metadataBase: new URL('https://www.taxi-verrieres-le-buisson.com'),
  // Ajout des meta tags Open Graph essentiels
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Taxi VLB - Service de taxi à Verrières-le-Buisson (91)',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Taxi VLB à Verrières-le-Buisson',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@taxivlb',
    creator: '@taxivlb',
  },
  alternates: {
    canonical: 'https://www.taxi-verrieres-le-buisson.com',
    languages: {
      'fr-FR': 'https://www.taxi-verrieres-le-buisson.com',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Ajout des meta tags pour la géolocalisation
  other: {
    'geo.region': 'FR-91',
    'geo.placename': 'Verrières-le-Buisson',
    'geo.position': '48.74645;2.2539',
    'ICBM': '48.74645, 2.2539',
  },
};

// Page d'accueil avec mots-clés longue traîne
export const homeMetadata = {
  ...baseMetadata,
  title: 'Taxi Verrières-le-Buisson',
  description: 'Taxi à Verrières-le-Buisson (91) : service 24h/24, 7j/7. Transport aéroport CDG, Orly, gares parisiennes, longue distance. Devis gratuit. Chauffeur professionnel.',
  keywords: [
    'taxi Verrières-le-Buisson',
    'taxi VLB',
    'taxi 91',
    'taxi aéroport CDG Verrières',
    'taxi Orly Verrières-le-Buisson',
    'transport gare Paris Verrières',
    'chauffeur privé Essonne',
    'réservation taxi en ligne 91',
    'taxi longue distance Verrières',
    'tarif taxi Verrières-le-Buisson',
    'vtc Verrières-le-Buisson',
    'transport Essonne 24h',
  ].join(', '),
  openGraph: {
    ...baseMetadata.openGraph,
    title: 'Taxi VLB Verrières-le-Buisson | Service 24/7 | Aéroport, Gare, Longue distance',
    description: 'Service de taxi professionnel à Verrières-le-Buisson. Transport aéroport CDG/Orly, gares parisiennes, voyages longue distance. Réservation en ligne. Chauffeur expérimenté.',
    url: 'https://www.taxi-verrieres-le-buisson.com',
  },
  // Structured data JSON-LD corrigé pour la page d'accueil
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': 'https://www.taxi-verrieres-le-buisson.com/#business',
        name: 'Taxi VLB',
        alternateName: 'Taxi Verrières-le-Buisson VLB',
        url: 'https://www.taxi-verrieres-le-buisson.com',
        telephone: '+33665113928',
        email: 'contact@taxivlb.com',
        priceRange: '€€',
        image: 'https://www.taxi-verrieres-le-buisson.com/images/logo.webp',
        sameAs: [
          'https://www.facebook.com/taxivlb',
          'https://maps.google.com/?cid=123456789',
        ],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Verrières-le-Buisson',
          addressLocality: 'Verrières-le-Buisson',
          addressRegion: 'Île-de-France',
          postalCode: '91370',
          addressCountry: 'FR',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '48.74645',
          longitude: '2.2539',
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
          ],
          opens: '00:00',
          closes: '23:59',
        },
        // AJOUT IMPORTANT : aggregateRating manquant
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5.0',
          bestRating: '5',
          worstRating: '1',
          ratingCount: '3'
        },
        // Les avis individuels
        review: [
          {
            '@type': 'Review',
            reviewRating: {
              '@type': 'Rating',
              ratingValue: '5',
              bestRating: '5'
            },
            author: {
              '@type': 'Person',
              name: 'Martin Dupont'
            },
            datePublished: '2024-11-01',
            reviewBody: 'Service de taxi de qualité pour mes déplacements professionnels à Verrières-le-Buisson. Le chauffeur était ponctuel, le véhicule propre et confortable. Je recommande ce service de taxi fiable à tous les voyageurs en Essonne.'
          },
          {
            '@type': 'Review',
            reviewRating: {
              '@type': 'Rating',
              ratingValue: '5',
              bestRating: '5'
            },
            author: {
              '@type': 'Person',
              name: 'Émilie Laurent'
            },
            datePublished: '2024-11-01',
            reviewBody: 'Un service de taxi pratique à Verrières-le-Buisson ! J\'utilise régulièrement cette compagnie pour mes trajets vers l\'aéroport CDG et je suis toujours satisfaite. Le chauffeur suit mon vol et m\'attend à l\'arrivée.'
          },
          {
            '@type': 'Review',
            reviewRating: {
              '@type': 'Rating',
              ratingValue: '5',
              bestRating: '5'
            },
            author: {
              '@type': 'Person',
              name: 'Sophie Bertrand'
            },
            datePublished: '2024-11-01',
            reviewBody: 'J\'ai utilisé ce service de taxi pour le transport de nos invités à Verrières-le-Buisson. Le professionnalisme du chauffeur et le confort du véhicule ont été appréciés de tous. Service fiable dans toute l\'Essonne !'
          }
        ],
        potentialAction: {
          '@type': 'ReserveAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://www.taxi-verrieres-le-buisson.com/#booking',
          },
          result: {
            '@type': 'Reservation',
            name: 'Réservation de taxi',
          },
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.taxi-verrieres-le-buisson.com/#website',
        url: 'https://www.taxi-verrieres-le-buisson.com',
        name: 'Taxi VLB - Verrières-le-Buisson',
        description: 'Service de taxi professionnel à Verrières-le-Buisson (91). Transport 24h/24 pour aéroports, gares et longue distance.',
        publisher: {
          '@id': 'https://www.taxi-verrieres-le-buisson.com/#business',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://www.taxi-verrieres-le-buisson.com/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  },
};

// Page Contact améliorée
export const contactMetadata = {
  ...baseMetadata,
  title: 'Contact Taxi VLB | Réservation 24/7 | Numéro Taxi Verrières-le-Buisson (91)',
  description: 'Contactez Taxi VLB à Verrières-le-Buisson : ☎️ +33 6 65 11 39 28 (24h/24). Réservation taxi en ligne. Service aéroport CDG, Orly, gares. Devis gratuit immédiat.',
  keywords: [
    'contact taxi Verrières-le-Buisson',
    'numéro taxi VLB',
    'réservation taxi 91',
    'téléphone taxi Essonne',
    'taxi 24h Verrières',
    'réserver taxi en ligne',
    'devis taxi Verrières-le-Buisson',
  ].join(', '),
  alternates: {
    canonical: 'https://www.taxi-verrieres-le-buisson.com/contact',
  },
  openGraph: {
    ...baseMetadata.openGraph,
    title: 'Contact Taxi VLB Verrières-le-Buisson | Réservation 24/7',
    description: 'Réservez votre taxi à Verrières-le-Buisson : téléphone, email, WhatsApp. Service 24h/24. Transport aéroport, gare, longue distance.',
    url: 'https://www.taxi-verrieres-le-buisson.com/contact',
  },
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    mainEntity: {
      '@type': 'LocalBusiness',
      name: 'Taxi VLB',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+33665113928',
        contactType: 'customer service',
        areaServed: 'FR',
        availableLanguage: 'French',
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
          ],
          opens: '00:00',
          closes: '23:59',
        },
      },
    },
  },
};

// Page Services Aéroport améliorée
export const airportTrainMetadata = {
  ...baseMetadata,
  title: 'Taxi Aéroport CDG Orly | Transport Gare Paris | Verrières-le-Buisson (91)',
  description: 'Transport taxi CDG, Orly, Beauvais depuis Verrières-le-Buisson. Tarif fixe. Suivi des vols. Gares Paris (Nord, Lyon, Montparnasse). Réservation 24h/24. ✈️🚄',
  keywords: [
    'taxi aéroport CDG Verrières',
    'taxi Orly Verrières-le-Buisson',
    'transport aéroport 91',
    'taxi gare du Nord Verrières',
    'transfert aéroport Essonne',
    'navette aéroport Verrières',
    'prix taxi CDG Verrières',
    'taxi gare Lyon Verrières',
    'suivi vol taxi',
    'transport Beauvais 91',
  ].join(', '),
  alternates: {
    canonical: 'https://www.taxi-verrieres-le-buisson.com/services/aeroport-gare',
  },
  openGraph: {
    ...baseMetadata.openGraph,
    title: 'Taxi Aéroport CDG/Orly depuis Verrières-le-Buisson | Prix Fixe',
    description: 'Service taxi professionnel vers CDG (70-85€), Orly (35-45€), gares parisiennes. Suivi des vols. Réservation en ligne. Chauffeur ponctuel.',
    url: 'https://www.taxi-verrieres-le-buisson.com/services/aeroport-gare',
  },
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Transport Taxi Aéroport et Gare',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Taxi VLB',
    },
    areaServed: {
      '@type': 'Place',
      name: 'Verrières-le-Buisson',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services de Transport Aéroport',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Transport CDG',
            description: 'Taxi vers aéroport Charles de Gaulle',
          },
          price: '70-85',
          priceCurrency: 'EUR',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Transport Orly',
            description: 'Taxi vers aéroport Orly',
          },
          price: '35-45',
          priceCurrency: 'EUR',
        },
      ],
    },
  },
};

// Page Longue Distance améliorée
export const longDistanceMetadata = {
  ...baseMetadata,
  title: 'Taxi Longue Distance | Verrières-le-Buisson → Lyon, Bordeaux, Marseille (91)',
  description: 'Taxi longue distance depuis Verrières-le-Buisson. Lyon (650€), Bordeaux (750€), Marseille (950€). Confort garanti. Prix fixé à l\'avance. Réservation simple.',
  keywords: [
    'taxi longue distance Verrières',
    'taxi Lyon Verrières-le-Buisson',
    'transport Bordeaux 91',
    'taxi Marseille Essonne',
    'prix taxi longue distance',
    'voyage interurbain taxi',
    'taxi France Europe',
    'trajet ville à ville',
    'devis taxi longue distance',
  ].join(', '),
  alternates: {
    canonical: 'https://www.taxi-verrieres-le-buisson.com/services/longue-distance',
  },
  openGraph: {
    ...baseMetadata.openGraph,
    title: 'Taxi Longue Distance | Verrières-le-Buisson vers toute la France',
    description: 'Voyages confortables en taxi vers Lyon, Bordeaux, Marseille et toute la France. Prix fixes. Réservation en ligne depuis Verrières-le-Buisson.',
    url: 'https://www.taxi-verrieres-le-buisson.com/services/longue-distance',
  },
};

// Page À Propos améliorée
export const aboutMetadata = {
  ...baseMetadata,
  title: 'À Propos Taxi VLB | Histoire & Équipe | Chauffeur Professionnel Verrières (91)',
  description: 'Découvrez Taxi VLB : 15 ans d\'expérience à Verrières-le-Buisson. Chauffeur professionnel, service 24h/24. Notre histoire, valeurs et engagement qualité en Essonne.',
  keywords: [
    'taxi VLB histoire',
    'chauffeur professionnel Verrières',
    'entreprise taxi 91',
    'équipe taxi Essonne',
    'valeurs taxi VLB',
    'expérience taxi',
    'service qualité Verrières',
  ].join(', '),
  alternates: {
    canonical: 'https://www.taxi-verrieres-le-buisson.com/about',
  },
  openGraph: {
    ...baseMetadata.openGraph,
    title: 'À Propos de Taxi VLB | Service de confiance à Verrières-le-Buisson',
    description: 'Apprenez-en plus sur Taxi VLB : notre histoire, notre équipe de chauffeurs professionnels et notre engagement pour un service de qualité.',
    url: 'https://www.taxi-verrieres-le-buisson.com/about',
  },
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    mainEntity: {
      '@type': 'LocalBusiness',
      name: 'Taxi VLB',
      foundingDate: '2009',
      founder: {
        '@type': 'Person',
        name: 'Pierre G.',
      },
      description: 'Service de taxi professionnel à Verrières-le-Buisson depuis 2009. Spécialisé dans les transferts aéroport, gare et longue distance.',
    },
  },
};