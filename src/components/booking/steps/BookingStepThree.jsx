// src/components/booking/steps/BookingStepThree.jsx - Version avec fourchettes de prix

"use client";

import RouteMap from '../RouteMap';

const BookingStepThree = ({ 
  formValues, 
  priceEstimate, 
  selectedVehicle, 
  availableVehicles,
  register,
  errors,
  onSubmit,
  onBack
}) => {
  // Fonction pour formater une fourchette de prix
  const formatPriceRange = (minPrice, maxPrice) => {
    const min = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(minPrice);
    
    const max = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(maxPrice);
    
    return `${min} - ${max}`;
  };

  // Obtenir la fourchette de prix pour le véhicule sélectionné
  const selectedVehicleData = availableVehicles.find(v => v.id === selectedVehicle);
  const priceRange = selectedVehicleData ? selectedVehicleData.priceRange : null;

  return (
    <div className="p-6 md:p-8">
      <h3 className="text-xl font-semibold mb-6 text-center">Vos informations</h3>
      
      <div className="mb-6">
        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
          Nom complet <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="customerName"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          {...register('customerName', { required: 'Ce champ est requis' })}
          placeholder="Entrez votre nom complet"
        />
        {errors.customerName && <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="customerEmail"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            {...register('customerEmail', { 
              required: 'Ce champ est requis',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Adresse email invalide'
              } 
            })}
            placeholder="Entrez votre adresse email"
          />
          {errors.customerEmail && <p className="mt-1 text-sm text-red-600">{errors.customerEmail.message}</p>}
        </div>
        
        <div>
          <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="customerPhone"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            {...register('customerPhone', { required: 'Ce champ est requis' })}
            placeholder="Entrez votre numéro de téléphone"
          />
          {errors.customerPhone && <p className="mt-1 text-sm text-red-600">{errors.customerPhone.message}</p>}
        </div>
      </div>
      
      {/* Résumé de la réservation */}
      {priceEstimate && selectedVehicle && priceRange && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h4 className="font-semibold text-lg mb-4">Résumé de votre réservation</h4>

          <div className="mb-6">
            <h5 className="font-medium mb-3">Itinéraire</h5>
            <RouteMap 
              pickupAddress={formValues.pickupAddress}
              dropoffAddress={formValues.dropoffAddress}
              pickupPlaceId={formValues.pickupAddressPlaceId}
              dropoffPlaceId={formValues.dropoffAddressPlaceId}
              polyline={priceEstimate.details?.polyline}
            />
            <p className="text-xs text-gray-500 mt-2">
              Itinéraire approximatif. Le chauffeur pourra prendre un chemin différent selon les conditions de circulation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <span className="text-sm text-gray-500">Départ:</span>
              <p className="font-medium">{formValues.pickupAddress}</p>
            </div>
            
            <div>
              <span className="text-sm text-gray-500">Arrivée:</span>
              <p className="font-medium">{formValues.dropoffAddress}</p>
            </div>
            
            <div>
              <span className="text-sm text-gray-500">Date et heure:</span>
              <p className="font-medium">
                {new Date(`${formValues.pickupDate}T${formValues.pickupTime}`).toLocaleString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            
            {formValues.roundTrip && (
              <div>
                <span className="text-sm text-gray-500">Retour:</span>
                <p className="font-medium">
                  {new Date(`${formValues.returnDate}T${formValues.returnTime}`).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}
            
            <div>
              <span className="text-sm text-gray-500">Véhicule:</span>
              <p className="font-medium">
                {availableVehicles.find(v => v.id === selectedVehicle)?.name || selectedVehicle}
              </p>
            </div>
            
            <div>
              <span className="text-sm text-gray-500">Passagers:</span>
              <p className="font-medium">{formValues.passengers}</p>
            </div>
            
            <div>
              <span className="text-sm text-gray-500">Bagages:</span>
              <p className="font-medium">{formValues.luggage}</p>
            </div>
            
            {formValues.flightNumber && (
              <div>
                <span className="text-sm text-gray-500">N° de vol:</span>
                <p className="font-medium">{formValues.flightNumber}</p>
              </div>
            )}
            
            {formValues.trainNumber && (
              <div>
                <span className="text-sm text-gray-500">N° de train:</span>
                <p className="font-medium">{formValues.trainNumber}</p>
              </div>
            )}
            
            <div className="col-span-full mt-2 pt-3 border-t border-gray-200">
              <span className="text-sm text-gray-500">Prix estimé:</span>
              <p className="font-semibold text-lg text-primary">
                {formatPriceRange(priceRange.min, priceRange.max)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Prix final défini selon les conditions de trajet
              </p>
            </div>
          </div>
          
          {/* Explication de la fourchette de prix */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">À propos du prix</p>
                <p>
                  Cette fourchette de prix tient compte des conditions de circulation, des détours éventuels et autres facteurs du trajet. 
                  {selectedVehicle === 'van' && ' Un supplément de 15€ est inclus pour ce véhicule spacieux.'}
                  Le prix final sera convenu avec le chauffeur et restera dans cette fourchette.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <button 
          type="button" 
          className="btn btn-outline flex items-center justify-center"
          onClick={onBack}
          aria-label="Retourner à l'étape précédente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Retour
        </button>
        
        <button 
          type="button" 
          className="btn btn-primary flex items-center justify-center"
          onClick={onSubmit}
          aria-label="Confirmer la réservation"
        >
          Confirmer la réservation
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BookingStepThree;