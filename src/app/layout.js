import '../styles/globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import MobileCallButton from '@/components/common/MobileCallButton';
import Breadcrumb from '@/components/common/Breadcrumb';
import { baseMetadata } from '@/lib/metadata';
import Script from 'next/script';

// Configurer les fonts avec display swap pour améliorer le CLS
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Améliore le CLS (Cumulative Layout Shift)
  fallback: ['system-ui', 'Arial', 'sans-serif']
});

export const metadata = {
  ...baseMetadata,
  title: 'Taxi Verrières-le-Buisson (91) | Service 24/7 | Taxi VLB',
  description: 'Service de taxi à Verrières-le-Buisson (91) disponible 24h/24 et 7j/7. Transferts aéroport, gare et longue distance. Réservation simple et rapide. Tél: +33 6 00 00 00 00',
  keywords: 'taxi Verrières-le-Buisson, taxi VLB, taxi 91, taxi Essonne, taxi aéroport Verrières-le-Buisson, taxi gare Verrières-le-Buisson, réservation taxi Verrières-le-Buisson',
  alternates: {
    canonical: 'https://www.taxivlb.com',
  },
  openGraph: {
    title: 'Taxi à Verrières-le-Buisson (91) | Service 24/7 | Taxi VLB',
    description: 'Service de taxi professionnel à Verrières-le-Buisson. Réservez votre taxi pour l\'aéroport, la gare ou vos déplacements longue distance.',
    url: 'https://www.taxivlb.com',
    siteName: 'Taxi VLB',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: 'https://www.taxivlb.com/images/og-image.jpg', 
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
    images: ['https://www.taxivlb.com/images/twitter-card.jpg'],
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#d4af37',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={inter.className}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Préconnexion au serveur d'images pour accélérer le chargement */}
        <link rel="preconnect" href="https://www.taxivlb.com" />
        
        {/* Préchargement de certaines ressources critiques */}
        <link rel="preload" href="/images/logo.webp" as="image" type="image/webp" />
        
        {/* Pour les appareils Apple */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icons/apple-icon-180x180.png" />
        
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <Header />
        
        {/* Fil d'Ariane pour le SEO et la navigation */}
        <Breadcrumb />
        
        <main className="pb-16 md:pb-0"> {/* Padding bottom pour éviter que le contenu soit caché par la bannière mobile */}
          {children}
        </main>
        
        <Footer />
        
        {/* Bouton d'appel mobile */}
        <MobileCallButton />
        
        {/* Scripts analytiques avec chargement différé et respect RGPD */}
        <Script
          id="gtag-script"
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script
          id="gtag-config"
          strategy="lazyOnload"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
              'anonymize_ip': true,
              'cookie_flags': 'SameSite=None;Secure'
            });
          `}
        </Script>
        
        {/* Script pour le rich snippet LocalBusiness */}
        <Script
          id="schema-script"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TaxiService",
              "name": "Taxi VLB - Service de taxi à Verrières-le-Buisson",
              "image": "https://www.taxivlb.com/images/logo.webp",
              "url": "https://www.taxivlb.com",
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
                  "urlTemplate": "https://www.taxivlb.com/#booking",
                  "actionPlatform": [
                    "http://schema.org/DesktopWebPlatform",
                    "http://schema.org/MobileWebPlatform"
                  ]
                }
              }
            })
          }}
        />
        
        {/* Script pour détecter le type d'appareil (mobile/desktop) */}
        <Script
          id="device-detection"
          strategy="afterInteractive"
        >
          {`
            (function() {
              // Ajouter des classes pour détecter le type d'appareil
              const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (window.innerWidth <= 768);
              document.documentElement.classList.add(isMobile ? 'is-mobile' : 'is-desktop');
              
              // Pour les appareils tactiles
              if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
                document.documentElement.classList.add('is-touch');
              }
              
              // Observer la taille de l'écran pour les changements dynamiques
              window.addEventListener('resize', function() {
                const isMobileNow = window.innerWidth <= 768;
                document.documentElement.classList.toggle('is-mobile', isMobileNow);
                document.documentElement.classList.toggle('is-desktop', !isMobileNow);
              });
            })();
          `}
        </Script>
      </body>
    </html>
  );
}