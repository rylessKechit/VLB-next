'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button 
        className="flex justify-between items-center w-full text-left font-medium text-gray-900 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <FontAwesomeIcon 
          icon={isOpen ? faChevronUp : faChevronDown} 
          className="text-primary h-5 w-5"
        />
      </button>
      <div className={`mt-2 text-gray-600 ${isOpen ? 'block' : 'hidden'}`}>
        <p className="pb-4">{answer}</p>
      </div>
    </div>
  );
};

export default function FAQPage() {
  // FAQ concernant les services de taxi à Verrières-le-Buisson
  const faqItems = [
    {
      question: "Comment réserver un taxi à Verrières-le-Buisson ?",
      answer: "Vous pouvez réserver notre service de taxi à Verrières-le-Buisson de plusieurs façons: via notre formulaire de réservation en ligne, par téléphone au +33 6 65 11 39 28 disponible 24h/24, ou par email à contact@taxivlb.com. Nous vous confirmerons rapidement votre réservation avec tous les détails nécessaires."
    },
    {
      question: "Quels sont les tarifs pour un taxi à Verrières-le-Buisson ?",
      answer: "Nos tarifs de taxi à Verrières-le-Buisson sont transparents et fixés à l'avance. Le prix dépend de votre destination, de l'heure de la course et du nombre de passagers. Par exemple, un trajet depuis Verrières-le-Buisson vers l'aéroport d'Orly coûte entre 35€ et 45€, et vers l'aéroport Charles de Gaulle entre 70€ et 85€. Vous pouvez obtenir un devis précis via notre formulaire de réservation."
    },
    {
      question: "Votre service de taxi à Verrières-le-Buisson est-il disponible 24h/24 ?",
      answer: "Oui, notre service de taxi à Verrières-le-Buisson est disponible 24h/24 et 7j/7, y compris les jours fériés. Que vous ayez besoin d'un transfert très tôt le matin pour un vol à Orly ou tard dans la nuit depuis la Gare du Nord, nous sommes à votre disposition."
    },
    {
      question: "Puis-je réserver un taxi pour un trajet depuis l'aéroport vers Verrières-le-Buisson ?",
      answer: "Absolument ! Nous assurons des transferts depuis tous les aéroports parisiens (Orly, Charles de Gaulle, Beauvais) vers Verrières-le-Buisson et ses environs. Notre chauffeur vous attendra à la sortie avec une pancarte à votre nom et suivra l'état de votre vol en cas de retard."
    },
    {
      question: "Quels modes de paiement acceptez-vous pour votre service de taxi à Verrières-le-Buisson ?",
      answer: "Nous acceptons plusieurs moyens de paiement pour votre confort : espèces, cartes bancaires (directement auprès du chauffeur), et virements bancaires pour les réservations professionnelles. Le paiement s'effectue à la fin de votre course."
    },
    {
      question: "Proposez-vous des services de taxi pour des trajets longue distance depuis Verrières-le-Buisson ?",
      answer: "Oui, nous proposons des services de taxi pour des trajets longue distance depuis Verrières-le-Buisson vers toutes les villes françaises et certaines destinations européennes. Nos tarifs sont fixes et établis à l'avance pour ces trajets. Par exemple, un trajet vers Lyon coûte entre 650€ et 750€, et vers Bruxelles entre 480€ et 580€."
    },
    {
      question: "Vos taxis à Verrières-le-Buisson sont-ils adaptés pour le transport de plusieurs passagers ?",
      answer: "Oui, notre flotte de taxis à Verrières-le-Buisson comprend des véhicules spacieux pouvant accueillir jusqu'à 7 passagers avec leurs bagages. Nous disposons notamment de berlines confortables et de monospaces adaptés aux groupes ou aux familles."
    },
    {
      question: "Le prix du taxi inclut-il l'attente en cas de retard de vol à l'arrivée à Orly ou CDG ?",
      answer: "Oui, pour nos services de transfert aéroport, nous suivons l'état de votre vol en temps réel. L'attente en cas de retard est incluse dans le tarif, sans supplément. Votre chauffeur sera présent à votre arrivée, quelle que soit l'heure."
    },
    {
      question: "Pouvez-vous fournir une facture pour ma course de taxi à Verrières-le-Buisson ?",
      answer: "Bien sûr, nous fournissons systématiquement une facture détaillée pour toutes vos courses de taxi, que ce soit pour un usage personnel ou professionnel. Vous pouvez la demander directement à votre chauffeur ou par email après votre trajet."
    },
    {
      question: "Quelles sont les zones desservies par votre service de taxi autour de Verrières-le-Buisson ?",
      answer: "Notre service de taxi dessert principalement Verrières-le-Buisson et toutes les communes environnantes dans l'Essonne (91), mais aussi l'ensemble de l'Île-de-France. Nous couvrons notamment Antony, Massy, Palaiseau, Igny, Bièvres, Sceaux, Châtenay-Malabry, et Wissous."
    },
    {
      question: "Est-il possible de réserver un taxi pour des trajets réguliers à Verrières-le-Buisson ?",
      answer: "Absolument ! Nous proposons des forfaits spéciaux pour les trajets réguliers à Verrières-le-Buisson, idéals pour les déplacements professionnels quotidiens ou hebdomadaires. Contactez-nous pour établir un devis personnalisé adapté à vos besoins spécifiques."
    },
    {
      question: "Vos chauffeurs de taxi connaissent-ils bien Verrières-le-Buisson et ses environs ?",
      answer: "Oui, tous nos chauffeurs sont des professionnels expérimentés qui connaissent parfaitement Verrières-le-Buisson et l'ensemble de l'Essonne. Ils maîtrisent les meilleurs itinéraires et les alternatives en cas de circulation difficile pour vous garantir un service optimal."
    }
  ];

  return (
    <div className="min-h-screen content-page">
      {/* Hero Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 animate-fade-in">
            QUESTIONS FRÉQUENTES SUR NOTRE SERVICE DE TAXI À VERRIÈRES-LE-BUISSON
          </h1>
          <p className="text-lg text-center text-gray-600 mb-2">
            Tout ce que vous devez savoir sur notre service de taxi dans l'Essonne (91)
          </p>
          <div className="flex justify-center">
            <div className="w-20 h-1 bg-primary my-4"></div>
          </div>
        </div>
      </div>
      
      {/* FAQ Content */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
            <div className="mb-8">
              <p className="text-gray-700">
                Vous trouverez ci-dessous les réponses aux questions les plus fréquemment posées sur notre service de taxi à Verrières-le-Buisson. 
                Si vous ne trouvez pas l'information que vous recherchez, n'hésitez pas à nous contacter directement.
              </p>
            </div>
            
            <div className="space-y-2">
              {faqItems.map((item, index) => (
                <FAQItem key={index} question={item.question} answer={item.answer} />
              ))}
            </div>
            
            <div className="mt-10 p-6 bg-primary bg-opacity-5 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Vous avez d'autres questions ?</h3>
              <p className="text-gray-700 mb-4">
                Notre équipe est à votre disposition pour répondre à toutes vos questions concernant notre service de taxi à Verrières-le-Buisson.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/contact" 
                  className="bg-primary text-white py-3 px-6 rounded-md font-medium hover:bg-primary-dark hover:text-white transition-colors duration-300 text-center"
                >
                  Contactez-nous
                </Link>
                <Link 
                  href="tel:+33665113928" 
                  className="bg-transparent border-2 border-primary text-primary py-3 px-6 rounded-md font-medium hover:bg-primary hover:text-white transition-colors duration-300 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Appeler maintenant
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* SEO Content Section */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">TAXI VERRIÈRES-LE-BUISSON - SERVICE DE QUALITÉ DANS L'ESSONNE</h2>
            <div className="prose max-w-none text-gray-700">
              <p>
                Taxi VLB est votre service de <strong>taxi à Verrières-le-Buisson</strong> disponible 24h/24 et 7j/7 pour tous vos déplacements dans l'Essonne (91) et au-delà. 
                Que vous ayez besoin d'un <strong>taxi pour l'aéroport d'Orly</strong> depuis Verrières-le-Buisson, d'un <strong>taxi pour Charles de Gaulle</strong> ou d'un 
                <strong>taxi pour la Gare de Lyon</strong>, notre équipe de chauffeurs professionnels est à votre service.
              </p>
              
              <p>
                Notre service de <strong>taxi à Verrières-le-Buisson</strong> se distingue par sa fiabilité, sa ponctualité et son confort. 
                Nos véhicules sont parfaitement entretenus et équipés pour vous offrir une expérience de transport agréable.
                Pour vos <strong>transferts aéroport en taxi</strong> depuis Verrières-le-Buisson, nous assurons un suivi en temps réel de vos vols, 
                vous garantissant ainsi une prise en charge sans stress même en cas de retard.
              </p>
              
              <p>
                <strong>Réserver un taxi à Verrières-le-Buisson</strong> n'a jamais été aussi simple. Vous pouvez effectuer votre réservation en ligne,
                par téléphone, ou par email. Notre système de réservation vous permet d'obtenir un tarif fixe à l'avance, sans surprise.
                Nous proposons également des services de <strong>taxi longue distance</strong> depuis Verrières-le-Buisson vers toutes les villes françaises
                et certaines destinations européennes.
              </p>
              
              <p>
                Notre <strong>compagnie de taxi à Verrières-le-Buisson</strong> dessert également les communes environnantes : 
                Antony, Massy, Palaiseau, Igny, Bièvres, Sceaux, Châtenay-Malabry, et Wissous. Que vous soyez un particulier, 
                un professionnel ou une entreprise, nous vous proposons un service de transport sur mesure et de qualité.
              </p>
              
              <p>
                Pour en savoir plus sur nos services ou pour <strong>réserver un taxi à Verrières-le-Buisson</strong>, 
                n'hésitez pas à nous contacter ou à utiliser notre formulaire de réservation en ligne.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}