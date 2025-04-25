import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faPlaneDeparture, faRoute, faTrain, faCheck, faUserTie, faWater, faWifi, faClock, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import BookingForm from '@/components/booking/BookingForm';

// Optimisations SEO
export const metadata = {
  title: 'Taxi VLB - Service de taxi de qualité à Verrières-le-Buisson',
  description: 'Taxi VLB vous propose un service de transport de qualité à Verrières-le-Buisson. Transferts aéroport, gares, et longue distance. Réservation 24h/24, 7j/7.',
  keywords: 'taxi Verrières-le-Buisson, transfert aéroport, transport gare, chauffeur privé',
};

export default function Home() {
  // Testimonials statiques
  const testimonials = [
    {
      name: 'Martin Dupont',
      role: 'Cadre commercial',
      text: 'Service de qualité pour mes déplacements professionnels. Le chauffeur était ponctuel, le véhicule propre et confortable. Je recommande ce service de taxi fiable.',
    },
    {
      name: 'Émilie Laurent',
      role: 'Voyageuse régulière',
      text: 'Un service de taxi pratique ! J\'utilise régulièrement cette compagnie pour mes trajets vers CDG et je suis toujours satisfaite. Le chauffeur suit mon vol et m\'attend à l\'arrivée.',
    },
    {
      name: 'Sophie Bertrand',
      role: 'Organisatrice d\'événements',
      text: 'J\'ai utilisé ce service pour le transport de nos invités. Le professionnalisme du chauffeur et le confort du véhicule ont été appréciés de tous. Service fiable !',
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section 
        className="relative flex items-center justify-center min-h-screen bg-cover bg-center text-white text-center overflow-hidden"
        style={{ backgroundImage: 'url(/images/header-image.webp)' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        
        <div className="container relative z-10 px-4 max-w-5xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-slide-in-left">
            <span className="text-primary">TAXI VLB</span>
          </h1>
          <p className="text-xl md:text-2xl font-light mb-6 animate-fade-in">
            Service de transport de qualité pour tous vos trajets
          </p>
          <p className="text-lg max-w-3xl mx-auto mb-8 animate-slide-in-right">
            Taxi professionnel à votre service pour vos déplacements quotidiens, transferts aéroport, 
            gare et voyages d'affaires. Disponible 24h/24, 7j/7.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 animate-fade-in">
            <Link href="#fleet" 
              className="btn btn-primary text-center"
              aria-label="Découvrir notre flotte"
            >
              Découvrir notre flotte
            </Link>
            <Link href="#booking" 
              className="btn btn-secondary text-center"
              aria-label="Réserver maintenant"
            >
              Réserver maintenant
            </Link>
          </div>
        </div>
        
        <Link 
          href="#services" 
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-12 h-12 flex items-center justify-center rounded-full border-2 border-white border-opacity-50 text-white hover:bg-white hover:bg-opacity-10 hover:border-white transition-all duration-300 animate-bounce"
          aria-label="Défiler vers les services"
        >
          <FontAwesomeIcon icon={faChevronDown} />
        </Link>
      </section>
      
      {/* Services Section */}
      <section id="services" className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold uppercase">
              SERVICES DE TRANSPORT À VERRIÈRES-LE-BUISSON
            </h2>
            <p className="text-text-light text-lg mt-4 max-w-3xl mx-auto">
              Des services adaptés à tous vos besoins de déplacement
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="bg-white rounded-lg shadow-custom p-6 text-center transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-custom-dark w-full sm:w-72">
              <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mx-auto mb-6 transition-all duration-300 text-2xl">
                <FontAwesomeIcon icon={faPlaneDeparture} />
              </div>
              <h3 className="text-xl font-bold mb-4">TRANSFERT AÉROPORT</h3>
              <p className="text-text-light mb-6">
                Service de taxi aéroport vers CDG, Orly et Beauvais. Suivi des vols, aide aux bagages et attente en cas de retard incluse dans nos prestations.
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
                Confort assuré pour vos trajets entre villes, voyages d'affaires ou touristiques. Tarifs compétitifs pour toutes distances.
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
                Service de taxi vers les gares parisiennes (Gare du Nord, Gare de Lyon, Gare Montparnasse). Ponctualité et confort garantis pour vos voyages en train.
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
      
      {/* Fleet Section */}
      <section id="fleet" className="py-16 md:py-24 bg-light">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold uppercase">
              NOTRE FLOTTE DE VÉHICULES
            </h2>
            <p className="text-text-light text-lg mt-4 max-w-3xl mx-auto">
              Des véhicules spacieux et confortables pour tous vos trajets
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-custom p-6 md:p-10 flex flex-col md:flex-row gap-10 mt-12">
            <div className="w-full md:w-1/2">
              <Image 
                src="/images/mercedes-v-class.webp" 
                alt="Mercedes Classe V Taxi" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-custom-light w-full h-auto object-cover"
                priority
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
                aria-label="Réserver maintenant"
              >
                Réserver maintenant
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Experience Section */}
      <section id="experience" className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2">
              <div className="text-left mb-6">
                <h2 className="text-3xl md:text-4xl font-bold uppercase">
                  L'EXPÉRIENCE TAXI VLB
                </h2>
                <div className="w-20 h-1 bg-primary my-4"></div>
                <p className="text-xl text-text-light">
                  Un service de transport fiable et confortable pour tous
                </p>
              </div>
              <p className="text-text-light mb-6">
                Chaque trajet avec notre service de taxi à Verrières-le-Buisson est une expérience agréable et sécurisée, 
                pensée pour vous offrir le meilleur rapport qualité-prix.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="mr-4 text-primary mt-1">
                    <FontAwesomeIcon icon={faUserTie} size="lg" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Chauffeur professionnel</h4>
                    <p className="text-text-light text-sm">Des chauffeurs expérimentés, courtois et connaissant parfaitement la région</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 text-primary mt-1">
                    <FontAwesomeIcon icon={faWater} size="lg" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Confort à bord</h4>
                    <p className="text-text-light text-sm">Bouteilles d'eau fraîche et autres commodités à disposition</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 text-primary mt-1">
                    <FontAwesomeIcon icon={faWifi} size="lg" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Connectivité</h4>
                    <p className="text-text-light text-sm">Connexion WiFi gratuite pour rester connecté</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 text-primary mt-1">
                    <FontAwesomeIcon icon={faClock} size="lg" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Ponctualité</h4>
                    <p className="text-text-light text-sm">Ponctualité et fiabilité assurées pour tous vos déplacements</p>
                  </div>
                </li>
              </ul>
              <Link href="/services" className="btn btn-primary">
                Découvrir nos services
              </Link>
            </div>
            
            <div className="w-full md:w-1/2">
              <Image 
                src="/images/vip-experience.webp" 
                alt="Expérience taxi à Verrières-le-Buisson" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-custom w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-light">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold uppercase">
              AVIS CLIENTS SUR NOTRE SERVICE DE TAXI
            </h2>
            <p className="text-text-light text-lg mt-4 max-w-3xl mx-auto">
              Ce que disent nos clients sur notre service à Verrières-le-Buisson
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-custom p-8 md:p-10">
              <div className="text-primary text-4xl mb-6">
                <FontAwesomeIcon icon={faQuoteLeft} />
              </div>
              <p className="text-lg text-text-dark italic mb-8 leading-relaxed">
                {testimonials[0].text}
              </p>
              <div className="flex items-center">
                <div className="ml-4">
                  <p className="font-semibold text-lg">{testimonials[0].name}</p>
                  <p className="text-text-light">{testimonials[0].role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Booking Section */}
      <section id="booking" className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold uppercase">
              RÉSERVATION DE TAXI À VERRIÈRES-LE-BUISSON
            </h2>
            <p className="text-text-light text-lg mt-4 max-w-3xl mx-auto">
              Un service simple et rapide pour réserver votre course
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <BookingForm />
          </div>
        </div>
      </section>
      
      {/* Partners Section */}
      <section id="partners" className="py-16 md:py-24 bg-light">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold uppercase">
              ILS NOUS FONT CONFIANCE
            </h2>
            <p className="text-text-light text-lg mt-4 max-w-3xl mx-auto">
              Des partenaires satisfaits de nos services de transport
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 mt-12">
            {['air-france', 'cannes-festival', 'louis-vuitton', 'chanel', 'ritz-paris'].map((partner, index) => (
              <div key={index} className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300">
                <Image 
                  src={`/images/logo-${partner}.webp`} 
                  alt={`Logo ${partner}`} 
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
              Nous desservons Verrières-le-Buisson et ses environs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-lg shadow-custom p-6 transition-all duration-300 hover:shadow-custom-dark">
              <h3 className="text-xl font-bold mb-4 pb-3 border-b border-gray-200">Verrières-le-Buisson et proximité</h3>
              <p className="text-text-light mb-4">
                Notre service de taxi couvre principalement Verrières-le-Buisson et les villes environnantes, notamment :
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
                Nous proposons également des trajets longue distance vers les principales villes françaises :
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
              QUESTIONS FRÉQUENTES
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
                question: "Quel est le prix d'une course de taxi ?",
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
            <p className="text-text-light mb-8">Contactez-nous dès maintenant pour réserver votre trajet.</p>
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