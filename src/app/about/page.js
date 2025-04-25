import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTaxi, faCheck, faClock, faCheckDouble, faFileInvoice, faSprayCan, faHandshake, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

// Optimisations SEO
export const metadata = {
  title: 'À propos de Taxi VLB | Service de taxi à Verrières-le-Buisson (91)',
  description: 'Découvrez l\'histoire et les valeurs de Taxi VLB, service de taxi de qualité à Verrières-le-Buisson dans l\'Essonne (91). Une entreprise locale engagée à offrir un service fiable et personnalisé depuis 2009.',
  keywords: 'taxi Verrières-le-Buisson, taxi Essonne, taxi 91, chauffeur professionnel, histoire taxi VLB, valeurs entreprise, service taxi Essonne',
  alternates: {
    canonical: 'https://www.taxivlb.com/about'
  },
  openGraph: {
    type: 'website',
    url: 'https://www.taxivlb.com/about',
    title: 'À propos de Taxi VLB | Service de taxi à Verrières-le-Buisson',
    description: 'Découvrez l\'histoire et les valeurs de Taxi VLB, service de taxi de qualité à Verrières-le-Buisson et en Essonne depuis 2009.',
    images: [
      {
        url: '/images/about-hero.webp',
        width: 1200,
        height: 630,
        alt: 'Histoire et valeurs de Taxi VLB Verrières-le-Buisson',
      },
    ],
  },
};

export default function AboutPage() {
  // Valeurs de l'entreprise
  const companyValues = [
    {
      title: "Ponctualité",
      description: "Nous respectons votre temps et garantissons des arrivées à l'heure pour tous vos trajets à Verrières-le-Buisson et en Essonne.",
      icon: faClock
    },
    {
      title: "Fiabilité",
      description: "Un service de taxi disponible 24h/24 et 7j/7 à Verrières-le-Buisson, avec des véhicules soigneusement entretenus.",
      icon: faCheckDouble
    },
    {
      title: "Transparence",
      description: "Des tarifs clairs et compétitifs pour vos trajets en taxi dans l'Essonne, sans frais cachés ni surprises désagréables.",
      icon: faFileInvoice
    },
    {
      title: "Propreté",
      description: "Des véhicules propres et bien entretenus pour chaque course de taxi à Verrières-le-Buisson.",
      icon: faSprayCan
    },
    {
      title: "Courtoisie",
      description: "Des chauffeurs professionnels, courtois et à l'écoute de vos besoins pour vos déplacements en Essonne.",
      icon: faHandshake
    },
    {
      title: "Sécurité",
      description: "Votre sécurité est notre priorité absolue sur chaque trajet en taxi dans la région de Verrières-le-Buisson.",
      icon: faShieldAlt
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - adapté pour le header fixe */}
      <div className="relative hero-section h-80 md:h-96 flex items-center justify-center text-white text-center overflow-hidden" 
           style={{ backgroundImage: "url('/images/about-hero.webp')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 px-4 max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-slide-in-left">À PROPOS DE TAXI VLB</h1>
          <div className="flex items-center justify-center my-3">
            <div className="w-12 h-px bg-white opacity-50"></div>
            <div className="mx-4"><FontAwesomeIcon icon={faTaxi} /></div>
            <div className="w-12 h-px bg-white opacity-50"></div>
          </div>
          <p className="text-lg max-w-3xl mx-auto animate-slide-in-right">
            Découvrez l'histoire et les valeurs de notre service de taxi à Verrières-le-Buisson
          </p>
        </div>
      </div>
      
      {/* Our Story Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 text-center uppercase">NOTRE HISTOIRE</h2>
              
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="w-full md:w-1/2">
                  <p className="text-gray-700 mb-4">
                    Fondée en 2009, Taxi VLB est née d'une volonté de proposer un service 
                    de taxi fiable et professionnel à Verrières-le-Buisson et ses environs dans l'Essonne (91).
                  </p>
                  <p className="text-gray-700 mb-4">
                    Nous avons commencé avec un seul véhicule et une idée simple : offrir un service de qualité 
                    à un prix juste aux habitants de Verrières-le-Buisson. Au fil des années, grâce à la satisfaction de nos clients, nous avons 
                    développé notre activité tout en restant fidèles à nos valeurs d'origine.
                  </p>
                  <p className="text-gray-700 mb-4">
                    Notre clientèle variée en Essonne, composée de particuliers, de professionnels et de familles, 
                    nous fait confiance pour leurs déplacements quotidiens, leurs transferts aéroport 
                    et leurs trajets longue distance depuis Verrières-le-Buisson.
                  </p>
                  <p className="text-gray-700">
                    Aujourd'hui, Taxi VLB continue de grandir en maintenant son engagement envers 
                    un service de taxi de qualité, la ponctualité et la satisfaction client à Verrières-le-Buisson et dans toute l'Île-de-France.
                  </p>
                </div>
                
                <div className="w-full md:w-1/2">
                  <Image 
                    src="/images/about-founder.webp" 
                    alt="Notre équipe de taxi à Verrières-le-Buisson" 
                    width={600}
                    height={400}
                    className="rounded-lg shadow-custom object-cover w-full h-auto"
                  />
                </div>
              </div>
              
              {/* Citation du fondateur */}
              <div className="mt-12">
                <div className="bg-gray-50 border-l-4 border-primary p-6 rounded-r-lg italic">
                  <p className="text-xl text-gray-700 mb-3">
                    "Notre objectif est de fournir un service de taxi fiable et de qualité à Verrières-le-Buisson, adapté aux besoins de chacun."
                  </p>
                  <span className="text-right block text-gray-500">— Pierre Guttin, Fondateur de Taxi VLB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Values Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center uppercase">NOS VALEURS</h2>
          <p className="text-lg text-center text-gray-600 mb-12">
            Les principes qui guident notre service de taxi à Verrières-le-Buisson
          </p>
          
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companyValues.map((value, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={value.icon} className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Philosophy Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col-reverse md:flex-row gap-10 items-center">
              <div className="w-full md:w-1/2">
                <Image 
                  src="/images/about-philosophy.webp" 
                  alt="Notre philosophie de service de taxi à Verrières-le-Buisson" 
                  width={600}
                  height={400}
                  className="rounded-lg shadow-custom object-cover w-full h-auto"
                />
              </div>
              
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl font-bold mb-6 uppercase">NOTRE PHILOSOPHIE</h2>
                <p className="text-gray-700 mb-6">
                  Chez Taxi VLB, nous croyons qu'un service de taxi à Verrières-le-Buisson doit être simple, fiable et accessible. 
                  Notre approche consiste à vous offrir un transport confortable et ponctuel, 
                  que ce soit pour vos déplacements quotidiens en Essonne, vos rendez-vous professionnels 
                  ou vos voyages plus longs.
                </p>
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <div className="mr-4 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">01</div>
                    <div>
                      <h4 className="font-semibold mb-1">Service client</h4>
                      <p className="text-gray-600">Nous sommes à l'écoute des besoins de nos clients de Verrières-le-Buisson pour offrir le service le plus adapté.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">02</div>
                    <div>
                      <h4 className="font-semibold mb-1">Simplicité</h4>
                      <p className="text-gray-600">Réservation facile de votre taxi à Verrières-le-Buisson par téléphone, en ligne ou par email pour votre confort.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">03</div>
                    <div>
                      <h4 className="font-semibold mb-1">Qualité constante</h4>
                      <p className="text-gray-600">Nous maintenons un niveau de service élevé sur chaque course de taxi en Essonne.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">04</div>
                    <div>
                      <h4 className="font-semibold mb-1">Amélioration continue</h4>
                      <p className="text-gray-600">Nous écoutons vos retours pour améliorer constamment notre service de taxi à Verrières-le-Buisson.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Fleet Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center uppercase">NOTRE FLOTTE DE TAXIS</h2>
          <p className="text-lg text-center text-gray-600 mb-12">
            Des véhicules adaptés à tous vos besoins de transport à Verrières-le-Buisson
          </p>
          
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2">
                  <Image 
                    src="/images/mercedes-v-class.webp" 
                    alt="Notre flotte de taxis à Verrières-le-Buisson" 
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-full md:w-1/2 p-6 md:p-8">
                  <h3 className="text-2xl font-semibold mb-4">Véhicules de qualité</h3>
                  <p className="text-gray-700 mb-4">
                    Notre flotte de taxis à Verrières-le-Buisson est sélectionnée avec soin pour vous offrir confort et sécurité.
                    Nous proposons plusieurs modèles selon vos besoins :
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    <li className="flex items-center">
                      <FontAwesomeIcon icon={faCheck} className="text-primary mr-2" />
                      <span>Berlines confortables</span>
                    </li>
                    <li className="flex items-center">
                      <FontAwesomeIcon icon={faCheck} className="text-primary mr-2" />
                      <span>Véhicules familiaux</span>
                    </li>
                    <li className="flex items-center">
                      <FontAwesomeIcon icon={faCheck} className="text-primary mr-2" />
                      <span>Options éco-responsables</span>
                    </li>
                    <li className="flex items-center">
                      <FontAwesomeIcon icon={faCheck} className="text-primary mr-2" />
                      <span>Grand espace bagages</span>
                    </li>
                    <li className="flex items-center">
                      <FontAwesomeIcon icon={faCheck} className="text-primary mr-2" />
                      <span>WiFi à bord</span>
                    </li>
                    <li className="flex items-center">
                      <FontAwesomeIcon icon={faCheck} className="text-primary mr-2" />
                      <span>Climatisation efficace</span>
                    </li>
                  </ul>
                  <p className="text-gray-700 mb-4">
                    Tous nos taxis sont régulièrement entretenus pour assurer votre confort et votre sécurité lors de vos trajets à Verrières-le-Buisson et en Essonne.
                  </p>
                  <Link href="/#booking" className="inline-block bg-primary text-white py-2 px-6 rounded-md hover:bg-primary-dark transition-colors duration-300">
                    Réserver votre taxi maintenant
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Banner */}
      <div className="py-12 bg-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Besoin d'un taxi fiable à Verrières-le-Buisson ?</h3>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Contactez-nous pour votre prochain trajet en Essonne
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" className="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-md font-medium transition-colors duration-300">
              Contactez-nous
            </Link>
            <Link href="/#booking" className="bg-transparent border-2 border-white hover:bg-white hover:text-dark text-white py-3 px-6 rounded-md font-medium transition-colors duration-300 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Réserver un taxi maintenant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}