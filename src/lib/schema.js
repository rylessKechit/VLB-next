/**
 * Fichier contenant les données structurées schema.org pour le SEO
 * À utiliser dans les différentes pages du site
 */

export const taxiService = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    "name": "Taxi VLB - Service de taxi à Verrières-le-Buisson",
    "image": "https://www.taxi-verrieres-le-buisson.com/images/logo.webp",
    "url": "https://www.taxi-verrieres-le-buisson.com",
    "telephone": "+33600000000",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Verrières-le-Buisson",
      "addressLocality": "Verrières-le-Buisson",
      "addressRegion": "Île-de-France",
      "postalCode": "91370",
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 48.74645,
      "longitude": 2.2539
    },
    "priceRange": "€€",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 48.74645,
        "longitude": 2.2539
      },
      "geoRadius": "100000"
    },
    "availableLanguage": ["fr", "en"],
    "paymentAccepted": "Cash, Credit Card",
    "currenciesAccepted": "EUR",
    "sameAs": [
      "https://www.facebook.com/taxivlb",
      "https://www.instagram.com/taxivlb"
    ],
    "potentialAction": {
      "@type": "ReserveAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.taxi-verrieres-le-buisson.com/#booking",
        "inLanguage": "fr",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      },
      "result": {
        "@type": "Reservation",
        "name": "Réservation de taxi à Verrières-le-Buisson"
      }
    },
    "areaServed": [
      "Verrières-le-Buisson", "Essonne", "Île-de-France", 
      "Antony", "Massy", "Palaiseau", "Igny", "Bièvres", 
      "Sceaux", "Châtenay-Malabry", "Wissous"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Services de taxi à Verrières-le-Buisson",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Transfert aéroport depuis Verrières-le-Buisson",
            "description": "Service de taxi pour l'aéroport d'Orly et Charles de Gaulle depuis Verrières-le-Buisson"
          },
          "priceSpecification": {
            "@type": "PriceSpecification",
            "price": "35.00",
            "priceCurrency": "EUR",
            "minPrice": "35.00",
            "maxPrice": "85.00"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Transport gare depuis Verrières-le-Buisson",
            "description": "Service de taxi pour les gares parisiennes depuis Verrières-le-Buisson"
          },
          "priceSpecification": {
            "@type": "PriceSpecification",
            "price": "40.00",
            "priceCurrency": "EUR",
            "minPrice": "40.00",
            "maxPrice": "65.00"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Taxi longue distance depuis Verrières-le-Buisson",
            "description": "Service de taxi pour trajets longue distance depuis Verrières-le-Buisson"
          },
          "priceSpecification": {
            "@type": "PriceSpecification",
            "priceCurrency": "EUR",
            "minPrice": "400.00",
            "maxPrice": "1000.00"
          }
        }
      ]
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Sophie M."
        },
        "datePublished": "2024-02-15",
        "reviewBody": "Un service de taxi très pratique pour mes transferts à l'aéroport depuis Verrières-le-Buisson. Mon vol a été retardé de 2 heures, mais le chauffeur était là à m'attendre à mon arrivée."
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Martin Dupont"
        },
        "datePublished": "2024-01-20",
        "reviewBody": "Service de taxi de qualité pour mes déplacements professionnels à Verrières-le-Buisson. Le chauffeur était ponctuel, le véhicule propre et confortable."
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "189",
      "bestRating": "5"
    }
  };