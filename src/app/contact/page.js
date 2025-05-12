"use client";

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import RouteMap from '@/components/booking/RouteMap';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState({
    success: false,
    message: '',
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Appel API 
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSubmitResult({
          success: true,
          message: 'Votre message a été envoyé avec succès. Notre équipe de Taxi VLB vous répondra dans les plus brefs délais.',
        });
        
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
      } else {
        throw new Error(result.error || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      
      setSubmitResult({
        success: false,
        message: 'Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer ou contactez-nous directement par téléphone au +33 6 00 00 00 00.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen content-page">
      {/* Contact Header */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-primary mb-4 animate-fade-in">
            CONTACTEZ VOTRE TAXI À VERRIÈRES-LE-BUISSON (91)
          </h1>
          <p className="text-lg text-center text-gray-600 mb-2">
            Réservez votre taxi 24h/24 et 7j/7 en Essonne
          </p>
          <div className="flex justify-center">
            <div className="w-20 h-1 bg-primary my-4"></div>
          </div>
        </div>
      </div>
      
      {/* Contact Content */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
            {/* Contact Information */}
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-bold mb-6 uppercase">CONTACTEZ-NOUS</h2>
              <p className="text-gray-700 mb-8">
                Pour toute réservation de taxi à Verrières-le-Buisson ou demande d'information, n'hésitez pas à nous contacter. 
                Nous sommes à votre disposition 24h/24 et 7j/7 pour répondre à vos questions et vous offrir un service de qualité dans toute l'Essonne.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mr-4 flex-shrink-0">
                    <FontAwesomeIcon icon={faPhone} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">TÉLÉPHONE</h3>
                    <p className="text-gray-700">
                      <a href="tel:+33600000000" className="hover:text-primary transition-colors duration-300">
                        +33 6 00 00 00 00
                      </a>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Disponible 24h/24 pour vos réservations de taxi</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mr-4 flex-shrink-0">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">EMAIL</h3>
                    <p className="text-gray-700">
                      <a href="mailto:contact@taxivlb.com" className="hover:text-primary transition-colors duration-300">
                        contact@taxivlb.com
                      </a>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Nous vous répondrons sous 24 heures</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mr-4 flex-shrink-0">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">ZONE D'INTERVENTION</h3>
                    <p className="text-gray-700">Verrières-le-Buisson et toute l'Essonne (91)</p>
                    <p className="text-sm text-gray-500 mt-1">Services disponibles également pour Paris et Île-de-France</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mr-4 flex-shrink-0">
                    <FontAwesomeIcon icon={faClock} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">DISPONIBILITÉ</h3>
                    <p className="text-gray-700">7j/7 et 24h/24</p>
                    <p className="text-sm text-gray-500 mt-1">Service de taxi sans interruption, jours fériés inclus</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="w-full md:w-1/2">
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h3 className="text-xl font-bold mb-6">Envoyez-nous un message</h3>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Votre email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Votre numéro de téléphone"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Votre message (détails de la course, date, heure, etc.)"
                      rows="5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    ></textarea>
                  </div>
                  
                  {submitResult.message && (
                    <div className={`p-4 rounded-md ${submitResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {submitResult.message}
                    </div>
                  )}
                  
                  <button 
                    type="submit" 
                    className="w-full py-3 px-4 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Envoi en cours...
                      </>
                    ) : 'Envoyer votre message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* WhatsApp CTA */}
      <div className="py-10 bg-[#25D366] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">Contactez notre taxi directement par WhatsApp</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Pour une réponse rapide, envoyez-nous un message via WhatsApp pour réserver votre taxi à Verrières-le-Buisson
          </p>
          <a 
            href="https://wa.me/+33600000000" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center bg-white text-[#25D366] py-3 px-6 rounded-md font-medium hover:bg-gray-100 transition-colors duration-300"
          >
            <svg className="h-6 w-6 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
            Réserver un taxi par WhatsApp
          </a>
        </div>
      </div>
      
      {/* Common routes section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center uppercase">NOS ITINÉRAIRES FRÉQUENTS</h2>
          
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Exemple de trajet en taxi</h3>
              <RouteMap 
                pickupAddress="Verrières-le-Buisson, France" 
                dropoffAddress="Aéroport Charles de Gaulle, France"
              />
              <p className="text-center text-sm text-gray-500 mt-4">
                Itinéraire approximatif pour un trajet en taxi de Verrières-le-Buisson vers l'aéroport Charles de Gaulle
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-2">Verrières-le-Buisson → Orly</h4>
                <p className="text-sm text-gray-600 mb-1">Distance: ~15 km</p>
                <p className="text-sm text-gray-600 mb-1">Durée: ~25 min</p>
                <p className="text-sm text-gray-600">Prix estimé: 35-45€</p>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-2">Verrières-le-Buisson → CDG</h4>
                <p className="text-sm text-gray-600 mb-1">Distance: ~45 km</p>
                <p className="text-sm text-gray-600 mb-1">Durée: ~50 min</p>
                <p className="text-sm text-gray-600">Prix estimé: 70-85€</p>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-2">Verrières-le-Buisson → Paris</h4>
                <p className="text-sm text-gray-600 mb-1">Distance: ~18 km</p>
                <p className="text-sm text-gray-600 mb-1">Durée: ~30 min</p>
                <p className="text-sm text-gray-600">Prix estimé: 45-55€</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}