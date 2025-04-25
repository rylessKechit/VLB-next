import '../styles/globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

// Configurer les fonts
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Taxi VLB - Service de taxi de qualité à Verrières-le-Buisson',
  description: 'Taxi VLB vous propose un service de transport de qualité à Verrières-le-Buisson. Transferts aéroport, gares, et longue distance. Réservation 24h/24, 7j/7.',
  keywords: 'taxi Verrières-le-Buisson, transfert aéroport, transport gare, chauffeur privé',
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
        <main className="pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}