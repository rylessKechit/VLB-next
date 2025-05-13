import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLeaf, 
  faCar, 
  faUsers, 
  faChargingStation, 
  faWifi, 
  faCloud, 
  faShieldAlt,
  faCheckCircle,
  faCalendar,
  faArrowRight,
  faCouch,
  faPhone
} from '@fortawesome/free-solid-svg-icons';

export const metadata = {
  title: 'Notre Flotte de Taxis | Taxi VLB Verrières-le-Buisson',
  description: 'Découvrez notre flotte de véhicules premium : Tesla Model 3 électrique, Mercedes Classe E et Classe V. Service de taxi de qualité à Verrières-le-Buisson (91).',
  keywords: 'flotte taxi VLB, Tesla taxi, Mercedes taxi, véhicules premium Verrières-le-Buisson, taxi électrique Essonne',
  alternates: {
    canonical: 'https://www.taxi-verrieres-le-buisson.com/flotte',
  },
};

export default function FlottePage() {
  // Configuration des véhicules
  const vehicles = [
    {
      id: 'green',
      name: 'Tesla Model 3',
      desc: 'L\'élégance électrique',
      longDesc: 'Notre Tesla Model 3 incarne l\'innovation et le respect de l\'environnement. Avec son design épuré et ses performances exceptionnelles, elle offre une expérience de voyage silencieuse et fluide.',
      image: '/images/tesla-model-3.webp',
      category: 'Véhicule Électrique',
      capacity: 'Idéale pour 4 passagers',
      luggage: 'Espace bagages optimisé',
      features: [
        { icon: faChargingStation, text: '100% électrique', highlight: true },
        { icon: faLeaf, text: 'Zéro émission', highlight: true },
        { icon: faWifi, text: 'WiFi gratuit' },
        { icon: faShieldAlt, text: 'Bouteilles d\'eau' },
        { icon: faCloud, text: 'Climatisation automatique' },
        { icon: faShieldAlt, text: 'Conduite assistée' }
      ],
      advantages: [
        'Conduite silencieuse',
        'Accélération instantanée',
        'Interface tactile intuitive',
        'Système de navigation intégré',
        'Recharge ultra-rapide',
        'Entretien minimal'
      ],
      perfectFor: [
        'Trajets urbains',
        'Voyages d\'affaires',
        'Clients soucieux de l\'environnement',
        'Amateurs de technologie'
      ]
    },
    {
      id: 'berline',
      name: 'Mercedes Classe E',
      desc: 'Le raffinement allemand',
      longDesc: 'La Mercedes Classe E allie tradition et innovation. Son habitacle spacieux en cuir véritable et ses finitions premium garantissent un voyage dans le plus grand confort.',
      image: '/images/mercedes-classe-e.webp',
      category: 'Berline Premium',
      capacity: 'Confort pour 4 passagers',
      luggage: 'Grand coffre disponible',
      features: [
        { icon: faCar, text: 'Moteur essence performant' },
        { icon: faUsers, text: 'Sièges cuir chauffants' },
        { icon: faWifi, text: 'WiFi gratuit' },
        { icon: faShieldAlt, text: 'Bouteilles d\'eau' },
        { icon: faCloud, text: 'Climatisation 4 zones' },
        { icon: faShieldAlt, text: 'Systèmes de sécurité avancés' }
      ],
      advantages: [
        'Confort de conduite exceptionnel',
        'Isolation phonique premium',
        'Suspension adaptative',
        'Sièges massants (option)',
        'Système audio Burmester',
        'Éclairage d\'ambiance'
      ],
      perfectFor: [
        'Trajets d\'affaires',
        'Transferts aéroport premium',
        'Occasions spéciales',
        'Clients VIP'
      ]
    },
    {
      id: 'van',
      name: 'Mercedes Classe V',
      desc: 'L\'espace et le luxe',
      longDesc: 'Notre Mercedes Classe V est parfaite pour les groupes et les familles. Avec son espace généreux et ses équipements haut de gamme, elle transforme chaque trajet en expérience mémorable.',
      image: '/images/mercedes-class-v.webp',
      category: 'Van Premium',
      capacity: 'Espace pour toute la famille',
      luggage: 'Très grande capacité',
      features: [
        { icon: faUsers, text: 'Idéal pour les groupes', highlight: true },
        { icon: faCar, text: 'Moteur diesel économique' },
        { icon: faWifi, text: 'WiFi gratuit' },
        { icon: faShieldAlt, text: 'Mini-bar à disposition' },
        { icon: faCloud, text: 'Climatisation zones multiples' },
        { icon: faShieldAlt, text: 'Assistance au stationnement' }
      ],
      advantages: [
        'Espace généreux pour tous',
        'Configuration modulable',
        'Sièges capitaine pivotants',
        'Tables de travail rétractables',
        'Prises USB individuelles',
        'Grand coffre à bagages'
      ],
      perfectFor: [
        'Groupes d\'amis/famille',
        'Transferts d\'équipes',
        'Voyages avec beaucoup de bagages',
        'Événements spéciaux'
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative hero-section h-80 md:h-96 flex items-center justify-center text-white text-center overflow-hidden" 
           style={{ backgroundImage: "url('/images/fleet-hero.webp')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 px-4 max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-slide-in-left">NOTRE FLOTTE PREMIUM</h1>
          <div className="flex items-center justify-center my-3">
            <div className="w-12 h-px bg-white opacity-50"></div>
            <div className="mx-4"><FontAwesomeIcon icon={faCar} /></div>
            <div className="w-12 h-px bg-white opacity-50"></div>
          </div>
          <p className="text-lg max-w-3xl mx-auto animate-slide-in-right">
            Des véhicules d'exception pour vos déplacements à Verrières-le-Buisson
          </p>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 uppercase">Des véhicules choisis avec soin</h2>
            <p className="text-lg text-gray-600 mb-8">
              Chez Taxi VLB, nous mettons un point d'honneur à proposer une flotte diversifiée et moderne. 
              Chaque véhicule est sélectionné pour offrir le meilleur compromis entre confort, technologie et respect de l'environnement.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Sécurité Maximale</h3>
                <p className="text-gray-600">Tous nos véhicules sont équipés des derniers systèmes de sécurité</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={faLeaf} className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Éco-responsable</h3>
                <p className="text-gray-600">Notre flotte inclut des véhicules électriques dernière génération</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={faUsers} className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Confort Premium</h3>
                <p className="text-gray-600">Intérieurs soignés et équipements haut de gamme pour votre bien-être</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicles Detail Section */}
      <div className="py-16 bg-gray-50" id="vehicles">
        <div className="container mx-auto px-4">
          <div className="space-y-24">
            {vehicles.map((vehicle, index) => (
              <div key={vehicle.id} className="max-w-7xl mx-auto">
                <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}>
                  {/* Image */}
                  <div className="w-full lg:w-1/2">
                    <div className="relative h-80 lg:h-[500px] rounded-lg overflow-hidden shadow-lg">
                      <Image 
                        src={vehicle.image}
                        alt={vehicle.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-md text-sm font-medium">
                        {vehicle.category}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full lg:w-1/2">
                    <h2 className="text-3xl font-medium mb-4">{vehicle.name}</h2>
                    <p className="text-xl text-primary font-medium mb-4">{vehicle.desc}</p>
                    <p className="text-gray-600 mb-8 leading-relaxed text-lg">{vehicle.longDesc}</p>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-medium text-primary mb-1">Capacité</h4>
                        <p className="text-gray-600">{vehicle.capacity}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-medium text-primary mb-1">Bagages</h4>
                        <p className="text-gray-600">{vehicle.luggage}</p>
                      </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                      {vehicle.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className={`flex items-center p-3 rounded-lg ${feature.highlight ? 'bg-green-50 text-green-700' : 'bg-white'}`}>
                          <FontAwesomeIcon icon={feature.icon} className={`mr-3 ${feature.highlight ? 'text-green-500' : 'text-primary'}`} />
                          <span className="font-medium">{feature.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link 
                      href="/#booking" 
                      className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary-dark transition-colors duration-300"
                    >
                      Réserver ce véhicule
                      <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                    </Link>
                  </div>
                </div>

                {/* Detailed Features Sections */}
                <div className="mt-16 bg-white rounded-lg p-8 shadow-sm">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Advantages */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-primary">Avantages</h3>
                      <ul className="space-y-2">
                        {vehicle.advantages.map((advantage, idx) => (
                          <li key={idx} className="flex items-center">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-3 text-sm" />
                            <span className="text-sm">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Perfect For */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-primary">Idéal pour</h3>
                      <ul className="space-y-2">
                        {vehicle.perfectFor.map((use, idx) => (
                          <li key={idx} className="flex items-center">
                            <FontAwesomeIcon icon={faUsers} className="text-primary mr-3 text-sm" />
                            <span className="text-sm">{use}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* All Features */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-primary">Équipements</h3>
                      <ul className="space-y-2">
                        {vehicle.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <FontAwesomeIcon icon={feature.icon} className={`mr-3 text-sm ${feature.highlight ? 'text-green-500' : 'text-primary'}`} />
                            <span className="text-sm">{feature.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Maintenance & Safety Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 uppercase">Entretien et Sécurité</h2>
            <p className="text-lg text-gray-600 mb-8">
              La sécurité et le confort de nos passagers sont nos priorités absolues.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-3xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Contrôles Réguliers</h3>
                <p className="text-gray-600">Maintenance préventive régulière pour garantir la fiabilité</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-3xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Certifications</h3>
                <p className="text-gray-600">Tous nos véhicules respectent les normes françaises et européennes</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={faCalendar} className="text-3xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Renouvellement</h3>
                <p className="text-gray-600">Notre flotte est renouvelée régulièrement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 bg-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Prêt à découvrir nos véhicules ?</h3>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Contactez-nous pour plus d'informations ou réservez directement le véhicule de votre choix
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/#booking" className="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-md font-medium transition-colors duration-300">
              Réserver maintenant
            </Link>
            <Link href="/contact" className="bg-transparent border-2 border-white hover:bg-white hover:text-dark text-white py-3 px-6 rounded-md font-medium transition-colors duration-300">
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}