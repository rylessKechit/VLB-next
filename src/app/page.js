import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faPlaneDeparture, faRoute, faTrain, faCheck, faUserTie, faWater, faWifi, faClock, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import BookingForm from '@/components/booking/BookingForm';
import HeroSection from '@/components/home/HeroSection';
import { Suspense } from 'react';

export const metadata = {
  title: 'Taxi Verrières-le-Buisson (91) | Réservation Taxi 24/7',
  description: 'Taxi à Verrières-le-Buisson pour tous vos déplacements. Transferts aéroport Orly/CDG, gares et longue distance. Réservation en ligne ou par téléphone.',
  keywords: 'taxi Verrières le Buisson, réservation taxi 91, taxi aéroport Verrières, taxi gare Verrières, taxi Essonne, transport Verrières-le-Buisson',
  alternates: {
    canonical: 'https://www.taxi-verrieres-le-buisson.com',
  },
};

export default function Home() {
  // Testimonials statiques
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
    <div className="home-page">
      {/* Hero Section Optimisée */}
      <Suspense fallback={
        <div className="w-full h-screen bg-dark flex items-center justify-center">
          <div className="loading-spinner"></div>
        </div>
      }>
        <HeroSection />
      </Suspense>
      
      {/* Services Section - Chargement différé */}
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
            <div className="bg-white rounded-lg shadow-custom p-6 text-center transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-custom-dark w-full sm:w-72">
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
            </div>
            
            <div className="bg-white rounded-lg shadow-custom p-6 text-center transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-custom-dark w-full sm:w-72">
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
            </div>
            
            <div className="bg-white rounded-lg shadow-custom p-6 text-center transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-custom-dark w-full sm:w-72">
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
            </div>
          </div>
        </div>
      </section>
      
      {/* Le reste des sections reste inchangé */}
      {/* ... */}
      
      {/* Fleet Section avec chargement optimisé des images */}
      <section id="fleet" className="py-16 md:py-24 bg-light">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold uppercase">
              NOTRE FLOTTE DE TAXIS À VERRIÈRES-LE-BUISSON
            </h2>
            <p className="text-text-light text-lg mt-4 max-w-3xl mx-auto">
              Des véhicules spacieux et confortables pour tous vos trajets en Essonne
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-custom p-6 md:p-10 flex flex-col md:flex-row gap-10 mt-12">
            <div className="w-full md:w-1/2">
              <Image 
                src="/images/mercedes-v-class.webp" 
                alt="Mercedes Classe V Taxi Verrières-le-Buisson" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-custom-light w-full h-auto object-cover"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 600px"
                quality={85}
              />
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-2xl font-bold mb-4">Flotte Haut de Gamme</h3>
              <p className="text-text-light mb-6">
                Notre flotte de véhicules est le choix parfait pour tous vos déplacements à Verrières-le-Buisson et en Île-de-France. Nous disposons de plusieurs modèles pour répondre à vos besoins :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <FontAwesomeIcon icon={faCheck} className="text-primary mr-3" />
                    <span>Jusqu'à 7 passagers</span>
                  </li>
                  <li className="flex items-center">
                    <FontAwesomeIcon icon={faCheck} className="text-primary mr-3" />
                    <span>Grand espace bagages</span>
                  </li>
                  <li className="flex items-center">
                    <FontAwesomeIcon icon={faCheck} className="text-primary mr-3" />
                    <span>Climatisation efficace</span>
                  </li>
                  <li className="flex items-center">
                    <FontAwesomeIcon icon={faCheck} className="text-primary mr-3" />
                    <span>Sièges confortables</span>
                  </li>
                  <li className="flex items-center">
                    <FontAwesomeIcon icon={faCheck} className="text-primary mr-3" />
                    <span>Suspension adaptée</span>
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <FontAwesomeIcon icon={faCheck} className="text-primary mr-3" />
                    <span>WiFi gratuit</span>
                  </li>
                  <li className="flex items-center">
                    <FontAwesomeIcon icon={faCheck} className="text-primary mr-3" />
                    <span>Prises USB pour recharge</span>
                  </li>
                  <li className="flex items-center">
                    <FontAwesomeIcon icon={faCheck} className="text-primary mr-3" />
                    <span>Eau minérale offerte</span>
                  </li>
                  <li className="flex items-center">
                    <FontAwesomeIcon icon={faCheck} className="text-primary mr-3" />
                    <span>Accès facile pour tous</span>
                  </li>
                  <li className="flex items-center">
                    <FontAwesomeIcon icon={faCheck} className="text-primary mr-3" />
                    <span>Options éco-responsables</span>
                  </li>
                </ul>
              </div>
              <Link href="#booking" 
                className="btn btn-primary"
                aria-label="Réserver un taxi à Verrières-le-Buisson"
              >
                Réserver maintenant
              </Link>
            </div>
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
      
      {/* Service Areas Section */}
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
            <div className="bg-white rounded-lg shadow-custom p-6 transition-all duration-300 hover:shadow-custom-dark">
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
            </div>
            
            <div className="bg-white rounded-lg shadow-custom p-6 transition-all duration-300 hover:shadow-custom-dark">
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
            </div>
            
            <div className="bg-white rounded-lg shadow-custom p-6 transition-all duration-300 hover:shadow-custom-dark">
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
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
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
          
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Comment réserver un taxi à Verrières-le-Buisson ?",
                answer: "Vous pouvez réserver notre service de taxi via notre formulaire en ligne, par téléphone au +33 6 00 00 00 00 ou par email. Nous recommandons de réserver à l'avance pour garantir la disponibilité."
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
              <div key={index} className="bg-white rounded-lg shadow-custom p-6 relative pl-8 transition-all duration-300 hover:shadow-custom-dark">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary rounded-l-lg"></div>
                <h3 className="text-xl font-bold mb-3 pl-2">{item.question}</h3>
                <p className="text-text-light pl-2">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Réservez votre taxi à Verrières-le-Buisson</h2>
            <p className="text-text-light mb-8">Contactez-nous dès maintenant pour réserver votre trajet en Essonne (91).</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact" className="btn btn-primary">
                Nous contacter
              </Link>
              <Link href="tel:+33600000000" className="btn btn-outline flex items-center justify-center">
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
  );
}