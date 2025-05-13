import '../styles/critical.css'; // Charger d'abord les styles critiques
import '../styles/globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import MobileCallButton from '@/components/common/MobileCallButton';
import Breadcrumb from '@/components/common/Breadcrumb';
import FontLoader from '@/components/common/FontLoader';
import CriticalCssLoader from '@/components/common/CriticalCssLoader';
import { baseMetadata } from '@/lib/metadata';
import Script from 'next/script';
import dynamic from 'next/dynamic';

// Lazy loading pour les composants non critiques
const DynamicFooter = dynamic(() => import('@/components/common/Footer'), {
  ssr: true,
  loading: () => <div className="h-32 bg-dark" />
});

const DynamicMobileCallButton = dynamic(() => import('@/components/common/MobileCallButton'), {
  ssr: false,
  loading: () => null
});

// Configurer les fonts avec display swap pour améliorer le CLS
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
  preload: true,
  adjustFontFallback: false, // Désactiver pour améliorer les performances
});

export const metadata = {
  ...baseMetadata,
  title: 'Taxi Verrières-le-Buisson',
  description: 'Service de taxi à Verrières-le-Buisson (91) disponible 24h/24 et 7j/7. Transferts aéroport, gare et longue distance. Réservation simple et rapide.',
  keywords: 'taxi Verrières-le-Buisson, taxi VLB, taxi 91, taxi Essonne, taxi aéroport Verrières-le-Buisson, taxi gare Verrières-le-Buisson, réservation taxi Verrières-le-Buisson',
  alternates: {
    canonical: 'https://www.taxi-verrieres-le-buisson.com',
  },
  openGraph: {
    title: 'Taxi à Verrières-le-Buisson (91) | Service 24/7 | Taxi VLB',
    description: 'Service de taxi professionnel à Verrières-le-Buisson. Réservez votre taxi pour l\'aéroport, la gare ou vos déplacements longue distance.',
    url: 'https://www.taxi-verrieres-le-buisson.com',
    siteName: 'Taxi VLB',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: 'https://www.taxi-verrieres-le-buisson.com/images/og-image.jpg', 
        width: 1200,
        height: 630,
        alt: 'Taxi VLB à Verrières-le-Buisson',
      },
    ],
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
  twitter: {
    card: 'summary_large_image',
    title: 'Taxi à Verrières-le-Buisson (91) | Taxi VLB',
    description: 'Service de taxi professionnel à Verrières-le-Buisson disponible 24h/24 et 7j/7.',
    images: ['https://www.taxi-verrieres-le-buisson.com/images/twitter-card.jpg'],
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  // Ajout de plus de métadonnées pour améliorer les performances
  manifest: '/manifest.json',
  authors: [{ name: 'Taxi VLB', url: 'https://www.taxi-verrieres-le-buisson.com' }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={inter.className}>
      <head>
        {/* Préconnexion et DNS prefetch pour améliorer les performances */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        
        {/* Préchargement des ressources critiques */}
        <link
          rel="preload"
          href="/images/logo.webp" 
          as="image" 
          type="image/webp"
          fetchPriority="high"
        />
        
        <link
          rel="preload"
          href="/images/header-image.webp" 
          as="image" 
          type="image/webp"
          fetchPriority="high"
        />
        
        {/* Favicon et icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#d4af37" />
        <meta name="theme-color" content="#d4af37" />
        
        {/* Pour les appareils Apple */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Taxi VLB" />
        
        {/* Optimisations pour les performances */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <meta name="format-detection" content="telephone=yes, email=yes, address=yes" />
        
        {/* Resource hints pour améliorer les performances */}
        <link rel="prefetch" href="/images/mercedes-class-e.webp" />
        <link rel="prefetch" href="/images/mercedes-class-v.webp" />
        <link rel="prefetch" href="/images/tesla-model-3.webp" />
      </head>
      <body className={inter.className}>
        <FontLoader />
        <CriticalCssLoader />

        <Header />
        
        {/* Fil d'Ariane pour le SEO et la navigation */}
        <Breadcrumb />
        
        <main className="pb-16 md:pb-0"> 
          {children}
        </main>
        
        <DynamicFooter />
        
        {/* Bouton d'appel mobile avec lazy loading */}
        <DynamicMobileCallButton />
        
        {/* Scripts analytiques avec chargement différé */}
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-XXXXXXX');
            `
          }}
        />
        
        {/* Script pour le rich snippet LocalBusiness */}
        <Script
          id="schema-script"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
              "potentialAction": {
                "@type": "ReserveAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://www.taxi-verrieres-le-buisson.com/#booking",
                  "actionPlatform": [
                    "http://schema.org/DesktopWebPlatform",
                    "http://schema.org/MobileWebPlatform"
                  ]
                }
              }
            })
          }}
        />
        
        {/* Script pour détecter le type d'appareil - version simplifiée */}
        <Script
          id="device-detection"
          strategy="afterInteractive"
        >
          {`
            (function() {
              const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (window.innerWidth <= 768);
              document.documentElement.classList.add(isMobile ? 'is-mobile' : 'is-desktop');
              
              if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
                document.documentElement.classList.add('is-touch');
              }
            })();
          `}
        </Script>
        
        {/* Noindex pour GTM */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      </body>
    </html>
  );
}