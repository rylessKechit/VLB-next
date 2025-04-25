"use client";

import { useState } from 'react';
import BookingConfirmation from './BookingConfirmation';
import BookingSuccess from './BookingSuccess';

const PriceCalculator = ({ estimate, bookingData, onBookNow }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  
  // Vérifier si estimate existe avant d'accéder à ses propriétés
  if (!estimate) {
    return (
      <div className="bg-white rounded-lg shadow-custom overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-center">Estimation de prix</h3>
          <p className="text-center text-gray-500">Les données d'estimation ne sont pas disponibles.</p>
        </div>
      </div>
    );
  }
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };
  
  const formatTime = (seconds) => {
    if (!seconds) return 'Non disponible';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes} minutes`;
  };

  // Vérifier la présence des propriétés nécessaires
  const hasDistanceInfo = estimate.distanceInfo && estimate.distanceInfo.text;
  const hasDurationInfo = estimate.durationInfo && estimate.durationInfo.value;
  
  const handleBookNowClick = () => {
    setShowBookingForm(true);
  };
  
  const handleBookingSuccess = (result) => {
    setBookingResult(result);
    setShowBookingForm(false);
  };
  
  const handleBookingCancel = () => {
    setShowBookingForm(false);
  };
  
  // Afficher le formulaire de réservation si l'utilisateur a cliqué sur "Réserver maintenant"
  if (showBookingForm) {
    return (
      <BookingConfirmation 
        bookingData={bookingData}
        priceEstimate={estimate}
        onSuccess={handleBookingSuccess}
        onCancel={handleBookingCancel}
      />
    );
  }
  
  // Afficher le message de succès si la réservation a été confirmée
  if (bookingResult) {
    return (
      <BookingSuccess bookingData={bookingResult} />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-custom overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-semibold mb-6 text-center">Estimation de prix</h3>
        
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          {hasDistanceInfo && (
            <div className="flex items-center px-4 py-2 bg-gray-50 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <span>{estimate.distanceInfo.text}</span>
            </div>
          )}
          {hasDurationInfo && (
            <div className="flex items-center px-4 py-2 bg-gray-50 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{formatTime(estimate.durationInfo.value)}</span>
            </div>
          )}
        </div>
        
        <div className="text-center mb-6">
          <span className="text-gray-600 mr-2">Prix estimé:</span>
          <span className="text-2xl font-bold text-primary">
            {formatPrice(estimate.minPrice)} - {formatPrice(estimate.maxPrice)}
          </span>
        </div>
        
        <button 
          className="w-full py-2 text-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-300"
          onClick={() => setShowBreakdown(!showBreakdown)}
        >
          {showBreakdown ? 'Masquer le détail' : 'Voir le détail'}
        </button>
      </div>
      
      {showBreakdown && estimate.breakdown && (
        <div className="bg-gray-50 p-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Tarif de base</span>
              <span>{formatPrice(estimate.breakdown.baseFare)}</span>
            </div>
            
            {hasDistanceInfo && (
              <div className="flex justify-between">
                <span>Distance ({estimate.distanceInfo.text})</span>
                <span>{formatPrice(estimate.breakdown.distanceCharge)}</span>
              </div>
            )}
            
            {hasDurationInfo && (
              <div className="flex justify-between">
                <span>Durée ({formatTime(estimate.durationInfo.value)})</span>
                <span>{formatPrice(estimate.breakdown.timeCharge)}</span>
              </div>
            )}
            
            {estimate.breakdown.luggageCharge > 0 && (
              <div className="flex justify-between">
                <span>Supplément bagages ({bookingData.luggage})</span>
                <span>{formatPrice(estimate.breakdown.luggageCharge)}</span>
              </div>
            )}
            
            {estimate.breakdown.nightRate && (
              <div className="flex justify-between text-amber-600 font-medium">
                <span>Tarif de nuit (22h-6h)</span>
                <span>+30%</span>
              </div>
            )}
            
            {estimate.breakdown.weekendRate && (
              <div className="flex justify-between text-amber-600 font-medium">
                <span>Tarif weekend</span>
                <span>+20%</span>
              </div>
            )}
            
            {estimate.breakdown.roundTripDiscount && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Réduction aller-retour</span>
                <span>-10%</span>
              </div>
            )}
            
            <div className="flex justify-between font-semibold pt-3 mt-2 border-t border-gray-300">
              <span>Total</span>
              <span>{formatPrice(estimate.exactPrice)}</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 italic mt-4">
            * Les prix sont estimatifs et peuvent varier en fonction du trafic et d'autres facteurs.
          </p>
        </div>
      )}
      
      <div className="p-6 flex flex-col sm:flex-row gap-4">
        <button 
          className="flex-1 py-3 px-4 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors duration-300"
          onClick={handleBookNowClick}
        >
          Réserver maintenant
        </button>
        <a 
          href={`https://wa.me/+33600000000?text=Bonjour, je souhaite réserver un taxi de ${bookingData.pickupAddress} à ${bookingData.dropoffAddress} le ${bookingData.pickupDate} à ${bookingData.pickupTime}. Prix estimé: ${estimate.exactPrice}€.`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex-1 py-3 px-4 bg-[#25D366] text-white rounded-md font-medium hover:bg-[#128C7E] transition-colors duration-300 flex items-center justify-center"
        >
          <svg className="h-5 w-5 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
          Contacter le chauffeur
        </a>
      </div>
    </div>
  );
};

export default PriceCalculator;