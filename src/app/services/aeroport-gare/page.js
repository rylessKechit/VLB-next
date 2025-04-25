import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faRoute, faClock, faTerminal, faTrain, faSubway, faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';
import BookingForm from '@/components/booking/BookingForm';

// Optimisations SEO
export const metadata = {
  title: 'Services de transfert aéroport et gare | Taxi VLB',
  description: 'Service de taxi fiable et ponctuel pour vos transferts vers les aéroports parisiens (CDG, Orly, Beauvais) et les gares (Gare du Nord, Gare de Lyon, Montparnasse).',
  keywords: 'taxi aéroport, transfert CDG, transfert Orly, taxi gare, Verrières-le-Buisson',
};

export default function AirportTransferPage() {
  // Aéroports desservis
  const airports = [
    { name: 'Paris Charles de Gaulle (CDG)', distance: '25 km', time: '30 min', services: ['Terminal 1', 'Terminal 2', 'Terminal 3'] },
    { name: 'Paris Orly (ORY)', distance: '18 km', time: '25 min', services: ['Orly Sud', 'Orly Ouest'] },
    { name: 'Paris Le Bourget', distance: '20 km', time: '28 min', services: ['Aviation privée'] },
    { name: 'Aéroport de Beauvais-Tillé', distance: '85 km', time: '75 min', services: ['Terminal unique'] }
  ];

  // Gares desservies
  const stations = [
    { name: 'Gare du Nord', services: ['Eurostar', 'Thalys', 'TGV Nord'] },
    { name: 'Gare de Lyon', services: ['TGV Sud-Est', 'Lyria', 'TGV Méditerranée'] },
    { name: 'Gare Montparnasse', services: ['TGV Atlantique', 'TGV Ouest', 'TGV Sud-Ouest'] },
    { name: 'Gare de l\'Est', services: ['TGV Est', 'ICE Allemagne', 'TGV Suisse'] }
  ];

  // Services proposés
  const transferServices = [
    {
      title: 'Accueil en zone d\'arrivée',
      description: 'Votre chauffeur vous attend avec une pancarte à votre nom',
      icon: 'id-card'
    },
    {
      title: 'Suivi des vols',
      description: 'Surveillance des horaires et adaptation en cas de retard',
      icon: 'plane-arrival'
    },
    {
      title: 'Aide aux bagages',
      description: 'Assistance pour le transport de vos valises',
      icon: 'luggage-cart'
    },
    {
      title: 'Dépose pratique',
      description: 'Dépose au plus près des terminaux et des gares',
      icon: 'ticket-alt'
    },
    {
      title: 'Véhicule confortable',
      description: 'Véhicules spacieux et bien équipés',
      icon: 'car'
    },
    {
      title: 'Service 24/7',
      description: 'Disponible tous les jours, à toute heure',
      icon: 'clock'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-80 md:h-96 flex items-center justify-center text-white text-center overflow-hidden" 
           style={{ backgroundImage: "url('/images/airport-transfer-hero.webp')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 px-4 max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-slide-in-left">TRANSFERTS AÉROPORT & GARE</h1>
          <div className="flex items-center justify-center my-3">
            <div className="w-12 h-px bg-white opacity-50"></div>
            <div className="mx-4"><FontAwesomeIcon icon={faPlane} /></div>
            <div className="w-12 h-px bg-white opacity-50"></div>
          </div>
          <p className="text-lg max-w-3xl mx-auto animate-slide-in-right">
            Service de taxi fiable pour vos trajets vers et depuis les aéroports et gares
          </p>
        </div>
      </div>
      
      {/* Overview Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-4 text-center uppercase">UN SERVICE DE TRANSFERT PRATIQUE ET FIABLE</h2>
              <p className="text-lg text-center text-gray-600 mb-8">
                La solution simple pour vos déplacements vers les aéroports et gares
              </p>
              
              <p className="text-gray-700 mb-4">
                Notre service de taxi assure vos transferts entre votre domicile, bureau ou hôtel et tous les 
                aéroports et gares d'Île-de-France. Nous vous proposons une solution pratique et ponctuelle 
                pour vos déplacements professionnels ou personnels.
              </p>
              <p className="text-gray-700 mb-4">
                Que vous partiez en voyage ou que vous arriviez à destination, notre objectif est 
                de vous offrir un service ponctuel et confortable, adapté à vos horaires et à vos besoins.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {transferServices.map((service, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mb-4">
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Destinations Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center uppercase">AÉROPORTS ET GARES DESSERVIS</h2>
          <p className="text-lg text-center text-gray-600 mb-12">
            Nous assurons les transferts vers tous les points d'accès importants
          </p>
          
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row border-b border-gray-300 mb-8">
              <button className="px-6 py-3 text-center font-medium border-b-2 border-primary text-primary">
                <FontAwesomeIcon icon={faPlane} className="mr-2" />
                Aéroports
              </button>
              <button className="px-6 py-3 text-center font-medium text-gray-500 hover:text-gray-700 transition-colors duration-300">
                <FontAwesomeIcon icon={faTrain} className="mr-2" />
                Gares
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {airports.map((airport, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mb-4">
                    <FontAwesomeIcon icon={faPlane} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{airport.name}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faRoute} className="text-gray-500 w-5 mr-3" />
                      <span>Distance: {airport.distance}</span>
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faClock} className="text-gray-500 w-5 mr-3" />
                      <span>Temps moyen: {airport.time}</span>
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faTerminal} className="text-gray-500 w-5 mr-3" />
                      <span>Terminaux: {airport.services.join(', ')}</span>
                    </div>
                  </div>
                  <Link href="/contact" className="inline-block bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors duration-300">
                    Réserver un transfert
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Process Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center uppercase">COMMENT ÇA FONCTIONNE</h2>
          <p className="text-lg text-center text-gray-600 mb-12">
            Un processus simple pour vos transferts
          </p>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
              
              {[
                { step: 1, title: "Réservation", description: "Réservez votre taxi en ligne, par téléphone ou par email" },
                { step: 2, title: "Confirmation", description: "Recevez une confirmation avec tous les détails de votre transfert" },
                { step: 3, title: "Suivi", description: "Nous suivons votre vol ou train et adaptons notre service" },
                { step: 4, title: "Prise en charge", description: "Votre chauffeur vous attend à l'arrivée" },
                { step: 5, title: "Transfert", description: "Profitez d'un trajet confortable jusqu'à votre destination" }
              ].map((step) => (
                <div key={step.step} className="text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold mb-4 z-10">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonial Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center uppercase">TÉMOIGNAGES DE NOS CLIENTS</h2>
          <p className="text-lg text-center text-gray-600 mb-12">
            Ce que disent nos clients sur nos services de transfert
          </p>
          
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="text-4xl text-primary mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary opacity-20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-lg italic mb-6 text-gray-700 leading-relaxed">
              "Un service de taxi très pratique pour mes transferts à l'aéroport. Mon vol a été retardé de 2 heures,
              mais le chauffeur était là à m'attendre à mon arrivée. Le véhicule était propre et confortable.
              Le chauffeur m'a aidé avec mes bagages et m'a déposé directement devant mon domicile.
              Je recommande ce service pour ceux qui cherchent un transfert fiable."
            </p>
            <div className="flex items-center">
              <div className="ml-4">
                <div className="font-semibold">Sophie M.</div>
                <div className="text-sm text-gray-600">Voyageuse régulière</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Section */}
      <div id="booking" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center uppercase">RÉSERVEZ VOTRE TRANSFERT</h2>
          <p className="text-lg text-center text-gray-600 mb-12">
            Réservation simple et rapide pour votre prochain voyage
          </p>
          
          <div className="max-w-4xl mx-auto">
            <BookingForm />
          </div>
        </div>
      </div>
      
      {/* CTA Banner */}
      <div className="py-12 bg-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Besoin d'informations supplémentaires ?</h3>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Notre équipe est à votre disposition pour répondre à vos questions
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" className="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-md font-medium transition-colors duration-300">
              Contactez-nous
            </Link>
            <Link href="tel:+33600000000" className="bg-transparent border-2 border-white hover:bg-white hover:text-dark text-white py-3 px-6 rounded-md font-medium transition-colors duration-300 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Appeler maintenant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}