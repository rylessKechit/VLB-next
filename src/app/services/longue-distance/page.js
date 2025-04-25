import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute, faClock, faTag, faInfoCircle, faQuoteLeft, faCheck, faRoad, faCouch, faPlug, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import BookingForm from '@/components/booking/BookingForm';
import RouteMap from '@/components/booking/RouteMap';

export default function LongDistancePage() {
  // Destinations populaires
  const destinations = [
    { name: 'Verrières-le-Buisson → Lyon', distance: '465 km', time: '4h30', estimatedPrice: '650€ - 750€' },
    { name: 'Verrières-le-Buisson → Bordeaux', distance: '585 km', time: '5h45', estimatedPrice: '750€ - 850€' },
    { name: 'Verrières-le-Buisson → Marseille', distance: '775 km', time: '7h30', estimatedPrice: '950€ - 1050€' },
    { name: 'Verrières-le-Buisson → Bruxelles', distance: '315 km', time: '3h15', estimatedPrice: '480€ - 580€' },
    { name: 'Verrières-le-Buisson → Amsterdam', distance: '505 km', time: '5h00', estimatedPrice: '690€ - 790€' },
    { name: 'Verrières-le-Buisson → Londres', distance: '455 km', time: '5h30', estimatedPrice: '800€ - 900€' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - adapté pour le header fixe */}
      <div className="relative hero-section h-80 md:h-96 flex items-center justify-center text-white text-center overflow-hidden" 
           style={{ backgroundImage: "url('/images/long-distance-highway.webp')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 px-4 max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-slide-in-left">TAXI LONGUE DISTANCE</h1>
          <div className="flex items-center justify-center my-3">
            <div className="w-12 h-px bg-white opacity-50"></div>
            <div className="mx-4"><FontAwesomeIcon icon={faRoute} /></div>
            <div className="w-12 h-px bg-white opacity-50"></div>
          </div>
          <p className="text-lg max-w-3xl mx-auto animate-slide-in-right">
            Service de taxi confortable pour vos trajets longue distance depuis Verrières-le-Buisson
          </p>
        </div>
      </div>
      
      {/* Overview Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-4 text-center uppercase">VOYAGEZ À TRAVERS LA FRANCE EN TOUTE SÉRÉNITÉ</h2>
              <p className="text-lg text-center text-gray-600 mb-8">
                Des trajets longue distance en taxi adaptés à tous vos besoins depuis Verrières-le-Buisson
              </p>
              
              <p className="text-gray-700 mb-4">
                Notre service de taxi longue distance vous offre une solution pratique et 
                confortable pour vos déplacements entre Verrières-le-Buisson et d'autres villes françaises ou européennes. 
                Plus besoin de vous soucier des correspondances ou des horaires rigides des transports en commun.
              </p>
              <p className="text-gray-700 mb-4">
                Que ce soit pour des déplacements professionnels, familiaux ou touristiques, 
                nos véhicules confortables et nos chauffeurs expérimentés vous assurent un voyage 
                agréable et sans stress jusqu'à votre destination, avec des tarifs transparents établis à l'avance.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Horaires flexibles</h3>
                <p className="text-gray-600">Départ de Verrières-le-Buisson à l'heure qui vous convient, sans contrainte d'horaire imposé.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faCouch} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Confort assuré</h3>
                <p className="text-gray-600">Véhicule spacieux et bien équipé pour vous garantir un voyage agréable, même sur de longues distances.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faPlug} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Services à bord</h3>
                <p className="text-gray-600">WiFi gratuit et prises de recharge pour rester connecté durant votre trajet depuis Verrières-le-Buisson.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faMapMarkedAlt} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Arrêts possibles</h3>
                <p className="text-gray-600">Possibilité de faire des pauses ou des arrêts intermédiaires selon vos besoins pendant votre voyage.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map visualization */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center uppercase">EXEMPLES DE TRAJETS LONGUE DISTANCE</h2>
          <p className="text-center text-gray-600 mb-8">Visualisez quelques itinéraires depuis Verrières-le-Buisson</p>
          
          <div className="max-w-5xl mx-auto mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Verrières-le-Buisson → Paris → Lyon</h3>
              <RouteMap 
                pickupAddress="Verrières-le-Buisson, France" 
                dropoffAddress="Lyon, France"
              />
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600"><strong>Distance:</strong> ~465 km</p>
                  <p className="text-sm text-gray-600"><strong>Durée:</strong> ~4h30</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-primary">650€ - 750€ <span className="text-sm font-normal text-gray-500">tarif fixe</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Destinations Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center uppercase">DESTINATIONS POPULAIRES</h2>
          <p className="text-lg text-center text-gray-600 mb-12">
            Nos trajets les plus fréquents avec estimation de tarifs depuis Verrières-le-Buisson
          </p>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((destination, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <div className="bg-primary text-white p-4">
                    <h3 className="text-xl font-semibold">{destination.name}</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faRoad} className="text-gray-500 w-5 mr-3" />
                        <span>{destination.distance}</span>
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faClock} className="text-gray-500 w-5 mr-3" />
                        <span>{destination.time}</span>
                      </div>
                      <div className="flex items-center text-primary font-semibold text-lg">
                        <FontAwesomeIcon icon={faTag} className="text-primary w-5 mr-3" />
                        <span>{destination.estimatedPrice}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <Link href="/#booking" className="inline-block bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors duration-300">
                      Demander un devis
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-start bg-primary bg-opacity-5 rounded-lg p-4 mt-8">
              <FontAwesomeIcon icon={faInfoCircle} className="text-primary text-lg mr-3 mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Ces tarifs sont indicatifs pour un taxi au départ de Verrières-le-Buisson et peuvent varier selon la date, l'heure et le nombre de passagers. 
                Contactez-nous pour obtenir un devis précis pour votre trajet longue distance.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonial Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center uppercase">CE QUE DISENT NOS CLIENTS</h2>
          <p className="text-lg text-center text-gray-600 mb-12">
            Témoignages de clients ayant utilisé notre service de taxi longue distance
          </p>
          
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="text-4xl text-primary mb-6">
              <FontAwesomeIcon icon={faQuoteLeft} className="opacity-20" />
            </div>
            <p className="text-lg italic mb-6 text-gray-700 leading-relaxed">
              "J'ai choisi ce service de taxi pour un trajet depuis Verrières-le-Buisson jusqu'à Bordeaux et j'en suis très satisfait. 
              Le chauffeur était ponctuel et professionnel. Le véhicule était propre et confortable, avec WiFi et boissons fraîches. 
              J'ai pu me reposer et travailler tranquillement pendant le voyage. 
              Je recommande ce service pour les longs trajets depuis l'Essonne, c'est vraiment pratique et le prix était fixé à l'avance."
            </p>
            <div className="flex items-center">
              <div>
                <div className="font-semibold">Laurent M.</div>
                <div className="text-sm text-gray-600">Entrepreneur, Verrières-le-Buisson</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center uppercase">AVANTAGES DE NOS TRAJETS LONGUE DISTANCE</h2>
          <p className="text-lg text-center text-gray-600 mb-12">
            Pourquoi choisir notre service de taxi pour vos voyages depuis Verrières-le-Buisson
          </p>
          
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start bg-white p-6 rounded-lg shadow-md">
              <div className="mr-4 w-10 h-10 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faCheck} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Prix fixe garanti</h3>
                <p className="text-gray-600">
                  Pas de mauvaises surprises avec notre tarification claire et transparente, établie à l'avance pour votre trajet depuis Verrières-le-Buisson.
                </p>
              </div>
            </div>
            
            <div className="flex items-start bg-white p-6 rounded-lg shadow-md">
              <div className="mr-4 w-10 h-10 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faCheck} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Trajet direct et personnalisé</h3>
                <p className="text-gray-600">
                  Pas de détours ni d'arrêts multiples. Notre chauffeur vous conduit directement de Verrières-le-Buisson à votre destination.
                </p>
              </div>
            </div>
            
            <div className="flex items-start bg-white p-6 rounded-lg shadow-md">
              <div className="mr-4 w-10 h-10 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faCheck} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Confidentialité assurée</h3>
                <p className="text-gray-600">
                  Idéal pour les voyages d'affaires, nos chauffeurs de taxi garantissent votre tranquillité et votre confidentialité pendant tout le trajet.
                </p>
              </div>
            </div>
            
            <div className="flex items-start bg-white p-6 rounded-lg shadow-md">
              <div className="mr-4 w-10 h-10 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faCheck} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Gain de temps considérable</h3>
                <p className="text-gray-600">
                  Évitez les temps d'attente en gare ou à l'aéroport et optimisez votre temps de trajet depuis Verrières-le-Buisson vers n'importe quelle destination.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Section */}
      <div id="booking" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center uppercase">RÉSERVEZ VOTRE TRAJET LONGUE DISTANCE</h2>
          <p className="text-lg text-center text-gray-600 mb-12">
            Réservation simple et rapide pour votre prochain voyage depuis Verrières-le-Buisson
          </p>
          
          <div className="max-w-4xl mx-auto">
            <BookingForm />
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center uppercase">QUESTIONS FRÉQUENTES</h2>
          <p className="text-lg text-center text-gray-600 mb-12">
            Tout ce que vous devez savoir sur nos services de taxi longue distance
          </p>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
              <h3 className="text-lg font-semibold mb-2 pl-4">Est-il possible de faire des arrêts pendant le trajet longue distance ?</h3>
              <p className="text-gray-600 pl-4">
                Oui, nous pouvons prévoir des arrêts pendant votre trajet longue distance depuis Verrières-le-Buisson. Il suffit de nous en informer lors de votre réservation pour que nous puissions les inclure dans votre itinéraire.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
              <h3 className="text-lg font-semibold mb-2 pl-4">Comment est calculé le prix pour un trajet longue distance ?</h3>
              <p className="text-gray-600 pl-4">
                Le prix est calculé en fonction de la distance depuis Verrières-le-Buisson, de la durée estimée du trajet, du nombre de passagers et de bagages. Nous vous fournissons un devis précis et sans surprise avant votre confirmation.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
              <h3 className="text-lg font-semibold mb-2 pl-4">Peut-on réserver un taxi longue distance le jour même ?</h3>
              <p className="text-gray-600 pl-4">
                Oui, sous réserve de disponibilité. Toutefois, pour les trajets longue distance depuis Verrières-le-Buisson, nous recommandons de réserver au moins 24 heures à l'avance pour garantir la disponibilité de nos véhicules.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
              <h3 className="text-lg font-semibold mb-2 pl-4">Les chauffeurs sont-ils formés pour les longues distances ?</h3>
              <p className="text-gray-600 pl-4">
                Absolument. Nos chauffeurs de taxi sont expérimentés et spécifiquement formés pour les trajets longue distance, connaissant les meilleures routes depuis Verrières-le-Buisson et garantissant votre sécurité et confort tout au long du voyage.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Banner */}
      <div className="py-12 bg-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Besoin d'un trajet vers une autre destination ?</h3>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Contactez-nous pour obtenir un devis personnalisé pour votre itinéraire depuis Verrières-le-Buisson
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" className="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-md font-medium transition-colors duration-300">
              Demander un devis
            </Link>
            <Link href="tel:+33600000000" className="bg-transparent border-2 border-white hover:bg-white hover:text-dark text-white py-3 px-6 rounded-md font-medium transition-colors duration-300 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Appeler directement
            </Link>
          </div>
        </div>
      </div>
    </div>
  )}