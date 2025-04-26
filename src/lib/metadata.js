/**
 * Fichier centralisé pour toutes les métadonnées du site Taxi VLB
 * Permet de définir les métadonnées pour les pages utilisant "use client"
 */

// Métadonnées de base pour l'ensemble du site
export const baseMetadata = {
    metadataBase: new URL('https://vlb-next.vercel.app'),
    alternates: {
      canonical: 'https://vlb-next.vercel.app',
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
    verification: {
      google: 'à-remplir-avec-votre-code-de-vérification',
    },
  };
  
  // Métadonnées pour la page d'accueil
  export const homeMetadata = {
    ...baseMetadata,
    title: 'Taxi Verrières-le-Buisson (91) | Réservation Taxi 24/7',
    description: 'Taxi à Verrières-le-Buisson pour tous vos déplacements. Transferts aéroport Orly/CDG, gares et longue distance. Réservation en ligne ou par téléphone.',
    keywords: 'taxi Verrières le Buisson, réservation taxi 91, taxi aéroport Verrières, taxi gare Verrières, taxi Essonne, transport Verrières-le-Buisson',
    openGraph: {
      title: 'Taxi à Verrières-le-Buisson (91) | Service 24/7 | Taxi VLB',
      description: 'Service de taxi professionnel à Verrières-le-Buisson. Réservez votre taxi pour l\'aéroport, la gare ou vos déplacements longue distance.',
      url: 'https://vlb-next.vercel.app',
      siteName: 'Taxi VLB',
      locale: 'fr_FR',
      type: 'website',
      images: [
        {
          url: 'https://vlb-next.vercel.app/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Taxi VLB à Verrières-le-Buisson',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Taxi à Verrières-le-Buisson (91) | Taxi VLB',
      description: 'Service de taxi professionnel à Verrières-le-Buisson disponible 24h/24 et 7j/7.',
      images: ['https://vlb-next.vercel.app/images/twitter-card.jpg'],
    },
  };
  
  // Métadonnées pour la page Contact
  export const contactMetadata = {
    ...baseMetadata,
    title: 'Contact | Taxi Verrières-le-Buisson (91) | Réservation 24/7',
    description: 'Contactez notre service de taxi à Verrières-le-Buisson (91). Disponible 24h/24 et 7j/7 pour tous vos trajets en Essonne. Réservation rapide par téléphone ou en ligne.',
    keywords: 'contact taxi Verrières-le-Buisson, réservation taxi 91, numéro taxi Essonne, réserver taxi Verrières',
    alternates: {
      canonical: 'https://vlb-next.vercel.app/contact',
    },
    openGraph: {
      title: 'Contact Taxi VLB | Réservation taxi à Verrières-le-Buisson',
      description: 'Réservez facilement votre taxi à Verrières-le-Buisson. Service disponible 24h/24 pour vos transferts aéroport et longue distance.',
      url: 'https://vlb-next.vercel.app/contact',
      siteName: 'Taxi VLB',
      locale: 'fr_FR',
      type: 'website',
    },
  };
  
  // Métadonnées pour la page FAQ
  export const faqMetadata = {
    ...baseMetadata,
    title: 'FAQ | Taxi Verrières-le-Buisson (91) | Questions fréquentes',
    description: 'Réponses aux questions fréquentes sur notre service de taxi à Verrières-le-Buisson. Tarifs, réservations, zones desservies dans l\'Essonne (91).',
    keywords: 'faq taxi Verrières-le-Buisson, questions taxi 91, tarifs taxi Essonne, réserver taxi Verrières',
    alternates: {
      canonical: 'https://vlb-next.vercel.app/faq',
    },
    openGraph: {
      title: 'FAQ Taxi VLB | Questions fréquentes sur nos services de taxi',
      description: 'Trouvez des réponses à toutes vos questions sur notre service de taxi à Verrières-le-Buisson. Tarifs, zone de service, réservations.',
      url: 'https://vlb-next.vercel.app/faq',
      siteName: 'Taxi VLB',
      locale: 'fr_FR',
      type: 'website',
    },
  };
  
  // Métadonnées pour la page Services Aéroport-Gare
  export const airportTrainMetadata = {
    ...baseMetadata,
    title: 'Transport Aéroport & Gare | Taxi Verrières-le-Buisson (91)',
    description: 'Service de taxi depuis Verrières-le-Buisson vers les aéroports Orly, Charles de Gaulle et les gares parisiennes. Tarif fixe, suivi des vols, ponctualité garantie.',
    keywords: 'taxi aéroport Verrières, taxi gare Verrières-le-Buisson, transfert Orly Verrières, transfert CDG 91, taxi gare Essonne',
    alternates: {
      canonical: 'https://vlb-next.vercel.app/services/aeroport-gare',
    },
    openGraph: {
      title: 'Taxi Aéroport & Gare depuis Verrières-le-Buisson',
      description: 'Transferts aéroport et gare en taxi depuis Verrières-le-Buisson. Service fiable avec suivi des vols et tarifs transparents.',
      url: 'https://vlb-next.vercel.app/services/aeroport-gare',
    },
  };
  
  // Métadonnées pour la page Services Longue Distance
  export const longDistanceMetadata = {
    ...baseMetadata,
    title: 'Taxi Longue Distance | Verrières-le-Buisson (91) | Tarifs fixés',
    description: 'Service de taxi pour vos voyages longue distance depuis Verrières-le-Buisson. Tarifs compétitifs vers toutes les villes françaises et européennes. Confort et ponctualité.',
    keywords: 'taxi longue distance Verrières, taxi interurbain 91, voyage taxi Essonne, taxi ville à ville',
    alternates: {
      canonical: 'https://vlb-next.vercel.app/services/longue-distance',
    },
    openGraph: {
      title: 'Taxi Longue Distance depuis Verrières-le-Buisson',
      description: 'Voyagez confortablement sur de longues distances avec notre service de taxi au départ de Verrières-le-Buisson. Prix fixés à l\'avance.',
      url: 'https://vlb-next.vercel.app/services/longue-distance',
    },
  };
  
  // Métadonnées pour la page À propos
  export const aboutMetadata = {
    ...baseMetadata,
    title: 'À propos | Taxi Verrières-le-Buisson (91) | Notre histoire',
    description: 'Découvrez l\'histoire de Taxi VLB, service de taxi professionnel à Verrières-le-Buisson. Notre philosophie, notre équipe et nos valeurs au service de votre mobilité en Essonne.',
    keywords: 'taxi Verrières-le-Buisson histoire, équipe taxi 91, valeurs taxi Essonne, taxi VLB à propos',
    alternates: {
      canonical: 'https://vlb-next.vercel.app/about',
    },
    openGraph: {
      title: 'À propos de Taxi VLB | Service de taxi à Verrières-le-Buisson',
      description: 'Apprenez-en plus sur notre service de taxi à Verrières-le-Buisson. Notre histoire, notre philosophie de service et notre engagement pour la qualité.',
      url: 'https://vlb-next.vercel.app/about',
    },
  };