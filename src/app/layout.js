import '../styles/globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

// Configurer les fonts
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
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
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="canonical" href="https://www.taxivlb.com" />
      </head>
      <body className={inter.className}>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}