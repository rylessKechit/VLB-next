import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faPlaneDeparture, faRoute, faTrain, faCheck, faUserTie, faWater, faWifi, faClock, faQuoteLeft, faLeaf, 
  faUsers, 
  faSuitcase, 
  faChargingStation, 
  faCouch } from '@fortawesome/free-solid-svg-icons';
import BookingForm from '@/components/booking/BookingForm';
import HeroSection from '@/components/home/HeroSection';
import { Suspense } from 'react';
import Script from 'next/script';
import { homeMetadata } from '@/lib/metadata';

// ✅ Utilisation des métadonnées améliorées
export const metadata = homeMetadata;

export default function Home() {
  const testimonials = [
    {
      name: 'Martin Dupont',
      role: 'Cadre commercial',
      text: 'Service de taxi de qualité pour mes déplacements professionnels à Verrières-le-Buisson. Le chauffeur était ponctuel, le véhicule propre et confortable. Je recommande ce service de taxi fiable à tous les voyageurs en Essonne.',
    },
    {
      name: 'Émilie Laurent',
      role: 'Voyageuse régulière',
      text: 'Un service de taxi pratique à Verrières-le-Buisson ! J\'utilise régulièrement cette compagnie pour mes trajets vers l\'aéroport CDG et je suis toujours satisfaite. Le chauffeur suit mon vol et m\'attend à l\'arrivée.',
    },
    {
      name: 'Sophie Bertrand',
      role: 'Organisatrice d\'événements',
      text: 'J\'ai utilisé ce service de taxi pour le transport de nos invités à Verrières-le-Buisson. Le professionnalisme du chauffeur et le confort du véhicule ont été appréciés de tous. Service fiable dans toute l\'Essonne !',
    },
  ];

  return (
    <>
      {/* ✅ Schema.org JSON-LD pour la page d'accueil */}
      <Script
        id="homepage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeMetadata.structuredData)
        }}
      />

      {/* ✅ Google Tag Manager (si applicable) */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
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

      <div className="home-page">
        {/* Hero Section Optimisée avec h1 structuré */}
        <Suspense fallback={
          <div className="w-full h-screen bg-dark flex items-center justify-center">
            <div className="loading-spinner"></div>
          </div>
        }>
          <HeroSection />
        </Suspense>
        
        {/* Services Section avec optimisations SEO */}
        <section id="services" className="py-16 md:py-24 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold uppercase">
                SERVICES DE TAXI À VERRIÈRES-LE-BUISSON (91)
              </h2>
              <p className="text-text-light text-lg mt-4 max-w-3xl mx-auto">
                Des services de taxi adaptés à tous vos besoins de déplacement dans l'Essonne
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              {/* Service Cards avec structured data */}
              <article className="bg-white rounded-lg shadow-custom p-6 text-center transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-custom-dark w-full sm:w-72">
                <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mx-auto mb-6 transition-all duration-300 text-2xl">
                  <FontAwesomeIcon icon={faPlaneDeparture} />
                </div>
                <h3 className="text-xl font-bold mb-4">TRANSFERT AÉROPORT</h3>
                <p className="text-text-light mb-6">
                  Service de taxi aéroport vers CDG, Orly et Beauvais depuis Verrières-le-Buisson. Suivi des vols, aide aux bagages et attente en cas de retard incluse.
                </p>
                <Link href="/services/aeroport-gare" className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors duration-300">
                  Découvrir
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </article>
              
              <article className="bg-white rounded-lg shadow-custom p-6 text-center transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-custom-dark w-full sm:w-72">
                <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mx-auto mb-6 transition-all duration-300 text-2xl">
                  <FontAwesomeIcon icon={faRoute} />
                </div>
                <h3 className="text-xl font-bold mb-4">VOYAGES LONGUE DISTANCE</h3>
                <p className="text-text-light mb-6">
                  Confort assuré pour vos trajets entre villes depuis Verrières-le-Buisson. Tarifs compétitifs pour les longues distances avec un service de taxi professionnel.
                </p>
                <Link href="/services/longue-distance" className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors duration-300">
                  Découvrir
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </article>
              
              <article className="bg-white rounded-lg shadow-custom p-6 text-center transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-custom-dark w-full sm:w-72">
                <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mx-auto mb-6 transition-all duration-300 text-2xl">
                  <FontAwesomeIcon icon={faTrain} />
                </div>
                <h3 className="text-xl font-bold mb-4">TRANSPORT GARE</h3>
                <p className="text-text-light mb-6">
                  Service de taxi depuis Verrières-le-Buisson vers les gares parisiennes (Gare du Nord, Gare de Lyon, Gare Montparnasse). Ponctualité et confort garantis.
                </p>
                <Link href="/services/aeroport-gare" className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors duration-300">
                  Découvrir
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </article>
            </div>
          </div>
        </section>
        
        {/* Fleet Section avec chargement optimisé des images */}
        <section id="fleet" className="py-16 md:py-24 bg-light">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold uppercase">
                NOTRE FLOTTE PREMIUM
              </h2>
              <p className="text-text-light text-lg mt-4 max-w-3xl mx-auto">
                Découvrez nos véhicules d'exception pour tous vos trajets à Verrières-le-Buisson
              </p>
            </div>
            
            {/* Véhicules en grille */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {/* Tesla Model 3 */}
              <article className="bg-white rounded-lg shadow-custom overflow-hidden hover:shadow-custom-dark transition-all duration-300">
                <div className="relative h-48">
                  <Image 
                    src="/images/tesla-model-3.webp" 
                    alt="Tesla Model 3 - Taxi électrique VLB Verrières-le-Buisson" 
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                    <FontAwesomeIcon icon={faLeaf} className="mr-1" />
                    Électrique
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Tesla Model 3</h3>
                  <p className="text-gray-600 mb-4">L'élégance électrique au service de l'environnement</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <FontAwesomeIcon icon={faUsers} className="mr-2 text-primary w-4" />
                      <span>Jusqu'à 4 passagers</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FontAwesomeIcon icon={faSuitcase} className="mr-2 text-primary w-4" />
                      <span>Jusqu'à 3 bagages</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FontAwesomeIcon icon={faChargingStation} className="mr-2 text-green-500 w-4" />
                      <span className="font-medium">100% électrique</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Link href="/flotte#green" className="text-primary hover:text-primary-dark font-medium">
                      En savoir plus →
                    </Link>
                  </div>
                </div>
              </article>

              {/* Mercedes Classe E */}
              <article className="bg-white rounded-lg shadow-custom overflow-hidden hover:shadow-custom-dark transition-all duration-300">
                <div className="relative h-48">
                  <Image 
                    src="/images/mercedes-class-e.webp" 
                    alt="Mercedes Classe E - Taxi premium VLB Verrières-le-Buisson" 
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-primary text-white px-2 py-1 rounded-md text-xs font-medium">
                    Berline
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Mercedes Classe E</h3>
                  <p className="text-gray-600 mb-4">Le raffinement allemand pour vos trajets d'exception</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <FontAwesomeIcon icon={faUsers} className="mr-2 text-primary w-4" />
                      <span>Jusqu'à 4 passagers</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FontAwesomeIcon icon={faSuitcase} className="mr-2 text-primary w-4" />
                      <span>Jusqu'à 4 bagages</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FontAwesomeIcon icon={faCouch} className="mr-2 text-primary w-4" />
                      <span className="font-medium">Sièges cuir chauffants</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Link href="/flotte#berline" className="text-primary hover:text-primary-dark font-medium">
                      En savoir plus →
                    </Link>
                  </div>
                </div>
              </article>

              {/* Mercedes Classe V */}
              <article className="bg-white rounded-lg shadow-custom overflow-hidden hover:shadow-custom-dark transition-all duration-300">
                <div className="relative h-48">
                  <Image 
                    src="/images/mercedes-class-v.webp" 
                    alt="Mercedes Classe V - Van premium VLB Verrières-le-Buisson" 
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-secondary text-white px-2 py-1 rounded-md text-xs font-medium">
                    Van
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Mercedes Classe V</h3>
                  <p className="text-gray-600 mb-4">L'espace et le luxe pour vos groupes et familles</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <FontAwesomeIcon icon={faUsers} className="mr-2 text-secondary w-4" />
                      <span className="font-medium">Jusqu'à 7 passagers</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FontAwesomeIcon icon={faSuitcase} className="mr-2 text-secondary w-4" />
                      <span>Grande capacité bagages</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FontAwesomeIcon icon={faWifi} className="mr-2 text-primary w-4" />
                      <span>Configuration modulable</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Link href="/flotte#van" className="text-primary hover:text-primary-dark font-medium">
                      En savoir plus →
                    </Link>
                  </div>
                </div>
              </article>
            </div>

            {/* CTA vers la page flotte */}
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-6">Découvrez tous les détails de nos véhicules</p>
              <Link 
                href="/flotte" 
                className="inline-flex items-center bg-primary text-white py-3 px-6 rounded-md font-medium hover:bg-primary-dark hover:text-white transition-colors duration-300"
                aria-label="Découvrir toute notre flotte de véhicules"
              >
                Découvrir toute notre flotte
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Afficher une seule section à la fois */}
        <Suspense fallback={<div className="py-16 md:py-24 bg-white flex justify-center"><div className="loading-spinner"></div></div>}>
          {/* Booking Section */}
          <section id="booking" className="py-16 md:py-24 bg-white">
            <div className="container">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold uppercase">
                  RÉSERVATION DE TAXI À VERRIÈRES-LE-BUISSON
                </h2>
                <p className="text-text-light text-lg mt-4 max-w-3xl mx-auto">
                  Un service simple et rapide pour réserver votre taxi en Essonne
                </p>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <BookingForm />
              </div>
            </div>
          </section>
        </Suspense>
        
        {/* Partners Section avec Schema.org */}
        <section id="partners" className="py-16 md:py-24 bg-light">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold uppercase">
                ILS NOUS FONT CONFIANCE
              </h2>
              <p className="text-text-light text-lg mt-4 max-w-3xl mx-auto">
                Des partenaires satisfaits de nos services de taxi à Verrières-le-Buisson
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 mt-12">
              {['air-france', 'cannes-festival', 'louis-vuitton', 'chanel', 'ritz-paris'].map((partner, index) => (
                <div key={index} className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300">
                  <Image 
                    src={`/images/logo-${partner}.webp`} 
                    alt={`Logo ${partner} - Partenaire Taxi VLB à Verrières-le-Buisson`} 
                    width={120} 
                    height={80} 
                    className="max-h-16 w-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Service Areas Section avec structured data locale */}
        <section id="service-areas" className="py-16 md:py-24 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold uppercase">
                ZONES DE SERVICE - TAXI VLB
              </h2>
              <p className="text-text-light text-lg mt-4 max-w-3xl mx-auto">
                Nous desservons Verrières-le-Buisson et ses environs en Essonne
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <article className="bg-white rounded-lg shadow-custom p-6 transition-all duration-300 hover:shadow-custom-dark">
                <h3 className="text-xl font-bold mb-4 pb-3 border-b border-gray-200">Verrières-le-Buisson et proximité</h3>
                <p className="text-text-light mb-4">
                  Notre service de taxi couvre principalement Verrières-le-Buisson et les villes environnantes de l'Essonne, notamment :
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <ul className="space-y-2">
                      <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">Antony</li>
                      <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">Massy</li>
                      <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">Palaiseau</li>
                      <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">Igny</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-2">
                      <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">Bièvres</li>
                      <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">Sceaux</li>
                      <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">Châtenay-Malabry</li>
                      <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">Wissous</li>
                    </ul>
                  </div>
                </div>
              </article>
              
              <article className="bg-white rounded-lg shadow-custom p-6 transition-all duration-300 hover:shadow-custom-dark">
                <h3 className="text-xl font-bold mb-4 pb-3 border-b border-gray-200">Transferts aéroports et gares</h3>
                <p className="text-text-light mb-4">
                  Nous assurons des transferts vers/depuis :
                </p>
                <ul className="grid grid-cols-1 gap-2">
                  <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">Aéroport Paris Charles de Gaulle (CDG)</li>
                  <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">Aéroport Paris Orly (ORY)</li>
                  <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">Aéroport Paris Beauvais (BVA)</li>
                  <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">Gare du Nord</li>
                  <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">Gare de Lyon</li>
                  <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">Gare Montparnasse</li>
                </ul>
              </article>
              
              <article className="bg-white rounded-lg shadow-custom p-6 transition-all duration-300 hover:shadow-custom-dark">
                <h3 className="text-xl font-bold mb-4 pb-3 border-b border-gray-200">Service longue distance</h3>
                <p className="text-text-light mb-4">
                  Nous proposons également des trajets longue distance depuis Verrières-le-Buisson vers les principales villes françaises :
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <ul className="space-y-2">
                      <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">Lyon</li>
                      <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">Bordeaux</li>
                      <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">Marseille</li>
                      <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">Lille</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-2">
                      <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">Strasbourg</li>
                      <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">Nantes</li>
                      <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">Bruxelles</li>
                      <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">Amsterdam</li>
                    </ul>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
        
        {/* FAQ Section avec Schema.org FAQ */}
        <section id="faq" className="py-16 md:py-24 bg-light">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold uppercase">
                QUESTIONS FRÉQUENTES SUR NOTRE SERVICE DE TAXI
              </h2>
              <p className="text-text-light text-lg mt-4 max-w-3xl mx-auto">
                Tout ce que vous devez savoir sur notre service de taxi à Verrières-le-Buisson
              </p>
            </div>
            
            <Script
              id="faq-schema"
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "Comment réserver un taxi à Verrières-le-Buisson ?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Vous pouvez réserver notre service de taxi via notre formulaire en ligne, par téléphone au +33 6 65 11 39 28 ou par email. Nous recommandons de réserver à l'avance pour garantir la disponibilité."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Quel est le prix d'une course de taxi à Verrières-le-Buisson ?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Nos tarifs sont compétitifs et dépendent de plusieurs facteurs : distance, horaire et services additionnels. Utilisez notre calculateur en ligne pour obtenir un devis gratuit pour votre trajet."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Le prix inclut-il l'attente en cas de retard de vol ?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Oui, pour les transferts aéroport, nous suivons votre vol en temps réel et l'attente en cas de retard est incluse dans votre tarif, sans supplément."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Quels modes de paiement acceptez-vous ?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Nous acceptons les paiements en espèces, par carte bancaire directement auprès du chauffeur, ou par virement bancaire pour les réservations professionnelles."
                      }
                    }
                  ]
                })
              }}
            />
            
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: "Comment réserver un taxi à Verrières-le-Buisson ?",
                  answer: "Vous pouvez réserver notre service de taxi via notre formulaire en ligne, par téléphone au +33 6 65 11 39 28 ou par email. Nous recommandons de réserver à l'avance pour garantir la disponibilité."
                },
                {
                  question: "Quel est le prix d'une course de taxi à Verrières-le-Buisson ?",
                  answer: "Nos tarifs sont compétitifs et dépendent de plusieurs facteurs : distance, horaire et services additionnels. Utilisez notre calculateur en ligne pour obtenir un devis gratuit pour votre trajet."
                },
                {
                  question: "Le prix inclut-il l'attente en cas de retard de vol ?",
                  answer: "Oui, pour les transferts aéroport, nous suivons votre vol en temps réel et l'attente en cas de retard est incluse dans votre tarif, sans supplément."
                },
                {
                  question: "Quels modes de paiement acceptez-vous ?",
                  answer: "Nous acceptons les paiements en espèces, par carte bancaire directement auprès du chauffeur, ou par virement bancaire pour les réservations professionnelles."
                }
              ].map((item, index) => (
                <article key={index} className="bg-white rounded-lg shadow-custom p-6 relative pl-8 transition-all duration-300 hover:shadow-custom-dark">
                  <div className="absolute top-0 left-0 w-2 h-full bg-primary rounded-l-lg"></div>
                  <h3 className="text-xl font-bold mb-3 pl-2">{item.question}</h3>
                  <p className="text-text-light pl-2">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section avec Schema.org Reviews */}
        <section id="testimonials" className="py-16 md:py-24 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold uppercase">
                AVIS CLIENTS TAXI VLB VERRIÈRES-LE-BUISSON
              </h2>
              <p className="text-text-light text-lg mt-4 max-w-3xl mx-auto">
                Découvrez ce que nos clients disent de notre service de taxi dans l'Essonne
              </p>
            </div>
            
            <Script
              id="reviews-schema"
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "LocalBusiness",
                  "name": "Taxi VLB",
                  // AJOUT IMPORTANT : aggregateRating
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "5.0",
                    "bestRating": "5",
                    "worstRating": "1",
                    "ratingCount": "3"
                  },
                  // Les avis individuels
                  "review": testimonials.map((testimonial, index) => ({
                    "@type": "Review",
                    "reviewRating": {
                      "@type": "Rating",
                      "ratingValue": "5",
                      "bestRating": "5"
                    },
                    "author": {
                      "@type": "Person",
                      "name": testimonial.name
                    },
                    "datePublished": "2024-11-01",
                    "reviewBody": testimonial.text
                  }))
                })
              }}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {testimonials.map((testimonial, index) => (
                <article key={index} className="bg-white rounded-lg shadow-custom p-6 relative overflow-hidden transition-all duration-300 hover:shadow-custom-dark">
                  <div className="absolute top-4 right-4 text-primary opacity-20">
                    <FontAwesomeIcon icon={faQuoteLeft} className="text-3xl" />
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                      <FontAwesomeIcon icon={faUserTie} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">{testimonial.text}</p>
                  
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action Section optimisé */}
        <section className="py-12 bg-white">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Réservez votre taxi à Verrières-le-Buisson</h2>
              <p className="text-text-light mb-8">Contactez-nous dès maintenant pour réserver votre trajet en Essonne (91).</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/contact" className="btn btn-primary">
                  Nous contacter
                </Link>
                <Link href="tel:+33665113928" className="btn btn-outline flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Appeler directement
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}