"use client";

import { useState } from 'react';

const BookingConfirmation = ({ bookingData, priceEstimate, onSuccess, onCancel }) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation simple
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Dans un environnement réel, ceci serait remplacé par un appel API
      // Simuler un appel API pour la démo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Préparer les données de réservation
      const bookingResult = {
        ...bookingData,
        customerInfo,
        id: 'BK' + Math.floor(Math.random() * 10000),
        createdAt: new Date().toISOString(),
        status: 'confirmed',
        price: {
          amount: priceEstimate.exactPrice,
          currency: priceEstimate.currency || 'EUR'
        },
        pickupDateTime: `${bookingData.pickupDate}T${bookingData.pickupTime}`,
        returnDateTime: bookingData.roundTrip ? `${bookingData.returnDate}T${bookingData.returnTime}` : null
      };
      
      // Informer le parent du succès
      onSuccess(bookingResult);
      
    } catch (err) {
      console.error("Erreur lors de la création de la réservation:", err);
      setError("Une erreur est survenue lors de la réservation. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-custom p-6">
      <h3 className="text-xl font-semibold mb-6 text-center">Finaliser votre réservation</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nom complet <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={customerInfo.name}
            onChange={handleInputChange}
            placeholder="Entrez votre nom"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={customerInfo.email}
            onChange={handleInputChange}
            placeholder="Entrez votre email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={customerInfo.phone}
            onChange={handleInputChange}
            placeholder="Entrez votre numéro de téléphone"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
            Demandes spéciales
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={customerInfo.specialRequests}
            onChange={handleInputChange}
            placeholder="Informations complémentaires (optionnel)"
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          ></textarea>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 border-l-4 border-red-500 mb-6">
            {error}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button 
            type="button" 
            className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-300"
            onClick={onCancel}
          >
            Annuler
          </button>
          
          <button 
            type="submit" 
            className="py-2 px-4 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Traitement en cours...
              </>
            ) : 'Confirmer la réservation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingConfirmation;