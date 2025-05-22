"use client";

import React from 'react';
import AddressInput from '../AddressInput';

const BookingStepOne = ({
  formValues,
  handleInputChange,
  handleAddressSelect,
  register,
  errors,
  isCalculating,
  onSubmit,
  isAdminContext = false
}) => {

  // Fonction pour détecter si une adresse est un aéroport
  const isAirportAddress = (address) => {
    if (!address || typeof address !== 'string') return false;
    
    const addressLower = address.toLowerCase();
    const airportKeywords = [
      'aéroport', 'airport', 'aeroport',
      'cdg', 'charles de gaulle', 'roissy',
      'orly', 'orly sud', 'orly ouest',
      'beauvais', 'beauvais-tillé',
      'le bourget',
      'terminal', 'aérogare', 'aerogare',
      // Ajout d'autres aéroports français
      'lyon saint-exupéry', 'marseille provence',
      'nice côte d\'azur', 'toulouse blagnac',
      'bordeaux-mérignac', 'nantes atlantique'
    ];
    
    return airportKeywords.some(keyword => addressLower.includes(keyword));
  };

  // Fonction pour détecter si une adresse est une gare
  const isTrainStationAddress = (address) => {
    if (!address || typeof address !== 'string') return false;
    
    const addressLower = address.toLowerCase();
    const stationKeywords = [
      'gare', 'station',
      'sncf', 'tgv', 'train',
      // Gares parisiennes
      'montparnasse', 'lyon', 'saint-lazare', 
      'nord', 'est', 'austerlitz', 'bercy',
      'châtelet les halles',
      // Autres gares importantes
      'part-dieu', 'perrache', // Lyon
      'saint-charles', // Marseille
      'matabiau', // Toulouse
      'saint-jean', // Bordeaux
      // Termes génériques
      'gare de', 'station de'
    ];
    
    return stationKeywords.some(keyword => addressLower.includes(keyword));
  };

  // Fonction pour déterminer le type de transport prioritaire
  const getTransportType = (address) => {
    if (!address) return null;
    
    // Priorité aux aéroports (plus spécifique)
    if (isAirportAddress(address)) return 'airport';
    
    // Ensuite les gares
    if (isTrainStationAddress(address)) return 'train';
    
    return null;
  };

  // Déterminer quel type de transport afficher
  const pickupTransport = getTransportType(formValues.pickupAddress);
  const dropoffTransport = getTransportType(formValues.dropoffAddress);
  
  // Priorité: si un des deux est un aéroport, on affiche vol
  // Sinon si un des deux est une gare, on affiche train
  const shouldShowFlightField = pickupTransport === 'airport' || dropoffTransport === 'airport';
  const shouldShowTrainField = !shouldShowFlightField && (pickupTransport === 'train' || dropoffTransport === 'train');

  return (
    <div className="p-6 md:p-8">
      <div className="space-y-6">
        {/* Adresse de départ */}
        <div>
          <label htmlFor="pickupAddress" className="block text-sm font-medium text-gray-700 mb-2">
            Adresse de départ <span className="text-red-500">*</span>
          </label>
          <AddressInput
            id="pickupAddress"
            value={formValues.pickupAddress}
            onChange={(value) => handleInputChange('pickupAddress', value)}
            onSelect={(address, placeId) => handleAddressSelect('pickupAddress', address, placeId)}
            placeholder="Entrez l'adresse de départ"
            isAdminContext={isAdminContext}
          />
          {errors.pickupAddress && (
            <p className="mt-1 text-sm text-red-600">{errors.pickupAddress.message}</p>
          )}
        </div>
        
        {/* Adresse d'arrivée */}
        <div>
          <label htmlFor="dropoffAddress" className="block text-sm font-medium text-gray-700 mb-2">
            Adresse d'arrivée <span className="text-red-500">*</span>
          </label>
          <AddressInput
            id="dropoffAddress"
            value={formValues.dropoffAddress}
            onChange={(value) => handleInputChange('dropoffAddress', value)}
            onSelect={(address, placeId) => handleAddressSelect('dropoffAddress', address, placeId)}
            placeholder="Entrez l'adresse d'arrivée"
            isAdminContext={isAdminContext}
          />
          {errors.dropoffAddress && (
            <p className="mt-1 text-sm text-red-600">{errors.dropoffAddress.message}</p>
          )}
        </div>
        
        {/* Champs vol et train avec logique de priorité */}
        <div className="space-y-4">
          {/* Champ numéro de vol - Priorité si aéroport détecté */}
          {shouldShowFlightField && (
            <div className="animate-slide-in-up bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <label htmlFor="flightNumber" className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-plane text-blue-500 mr-2"></i>
                Numéro de vol
                <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  Aéroport détecté
                </span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-plane text-gray-400"></i>
                </span>
                <input
                  id="flightNumber"
                  type="text"
                  className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  placeholder="Ex: AF1234, EK073, LH441"
                  value={formValues.flightNumber || ''}
                  onChange={(e) => handleInputChange('flightNumber', e.target.value)}
                />
              </div>
              <p className="mt-1 text-xs text-gray-600">
                <i className="fas fa-info-circle mr-1"></i>
                Ce numéro nous permettra de suivre votre vol et d'ajuster notre service en cas de retard
              </p>
            </div>
          )}
          
          {/* Champ numéro de train - Affiché uniquement si pas d'aéroport ET gare détectée */}
          {shouldShowTrainField && (
            <div className="animate-slide-in-up bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <label htmlFor="trainNumber" className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-train text-green-500 mr-2"></i>
                Numéro de train
                <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Gare détectée
                </span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-train text-gray-400"></i>
                </span>
                <input
                  id="trainNumber"
                  type="text"
                  className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
                  placeholder="Ex: TGV6214, TER4567, ICE123"
                  value={formValues.trainNumber || ''}
                  onChange={(e) => handleInputChange('trainNumber', e.target.value)}
                />
              </div>
              <p className="mt-1 text-xs text-gray-600">
                <i className="fas fa-info-circle mr-1"></i>
                Ce numéro nous permettra de suivre votre train et d'ajuster notre service en cas de retard
              </p>
            </div>
          )}
        </div>
        
        {/* Date et heure de départ - Version mobile améliorée */}
        <div className="p-4 rounded-md">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Date et heure de départ <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                  <i className="fas fa-calendar-alt text-gray-400"></i>
                </span>
                <input
                  type="date"
                  id="pickupDate"
                  value={formValues.pickupDate}
                  onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base appearance-none bg-white"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield'
                  }}
                />
              </div>
            </div>
            
            <div className="relative flex-1">
              <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-2">
                Heure <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                  <i className="fas fa-clock text-gray-400"></i>
                </span>
                <input
                  type="time"
                  id="pickupTime"
                  value={formValues.pickupTime}
                  onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base appearance-none bg-white"
                  required
                  style={{
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Option aller-retour */}
        <div>
          <div className="flex items-center h-10 mb-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={formValues.roundTrip}
                onChange={(e) => handleInputChange('roundTrip', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              <span className="ms-3 text-sm font-medium text-gray-700">Aller-retour</span>
            </label>
          </div>
          
          {/* Afficher la date/heure de retour si aller-retour est coché */}
          {formValues.roundTrip && (
            <div className="p-4 rounded-md animate-slide-in-up">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Date et heure de retour <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                      <i className="fas fa-calendar-alt text-gray-400"></i>
                    </span>
                    <input
                      type="date"
                      id="returnDate"
                      value={formValues.returnDate}
                      onChange={(e) => handleInputChange('returnDate', e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base appearance-none bg-white"
                      required={formValues.roundTrip}
                      min={formValues.pickupDate || new Date().toISOString().split('T')[0]}
                      style={{
                        WebkitAppearance: 'none',
                        MozAppearance: 'textfield'
                      }}
                    />
                  </div>
                </div>
                
                <div className="relative flex-1">
                  <label htmlFor="returnTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Heure <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                      <i className="fas fa-clock text-gray-400"></i>
                    </span>
                    <input
                      type="time"
                      id="returnTime"
                      value={formValues.returnTime}
                      onChange={(e) => handleInputChange('returnTime', e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base appearance-none bg-white"
                      required={formValues.roundTrip}
                      style={{
                        WebkitAppearance: 'none',
                        MozAppearance: 'textfield'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Nombre de passagers et de bagages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de passagers <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center bg-gray-100 rounded-full p-1">
              <button 
                type="button" 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:bg-gray-50 transition-colors duration-150 disabled:opacity-50"
                onClick={() => {
                  if (formValues.passengers > 1) {
                    handleInputChange('passengers', parseInt(formValues.passengers) - 1);
                  }
                }}
                disabled={formValues.passengers <= 1}
                aria-label="Diminuer le nombre de passagers"
              >
                <i className="fas fa-minus text-xs"></i>
              </button>
              <span className="flex-1 text-center font-medium">{formValues.passengers}</span>
              <button 
                type="button" 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:bg-gray-50 transition-colors duration-150 disabled:opacity-50"
                onClick={() => {
                  if (formValues.passengers < 7) {
                    handleInputChange('passengers', parseInt(formValues.passengers) + 1);
                  }
                }}
                disabled={formValues.passengers >= 7}
                aria-label="Augmenter le nombre de passagers"
              >
                <i className="fas fa-plus text-xs"></i>
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Maximum 7 passagers
            </p>
          </div>
          
          <div>
            <label htmlFor="luggage" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de bagages <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center bg-gray-100 rounded-full p-1">
              <button 
                type="button" 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:bg-gray-50 transition-colors duration-150 disabled:opacity-50"
                onClick={() => {
                  if (formValues.luggage > 0) {
                    handleInputChange('luggage', parseInt(formValues.luggage) - 1);
                  }
                }}
                disabled={formValues.luggage <= 0}
                aria-label="Diminuer le nombre de bagages"
              >
                <i className="fas fa-minus text-xs"></i>
              </button>
              <span className="flex-1 text-center font-medium">{formValues.luggage}</span>
              <button 
                type="button" 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:bg-gray-50 transition-colors duration-150"
                onClick={() => {
                  handleInputChange('luggage', parseInt(formValues.luggage) + 1);
                }}
                aria-label="Augmenter le nombre de bagages"
              >
                <i className="fas fa-plus text-xs"></i>
              </button>
            </div>
          </div>
        </div>
        
        {/* Demandes spéciales */}
        <div>
          <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
            Demandes spéciales
          </label>
          <textarea
            id="specialRequests"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            rows="3"
            placeholder="Indiquez-nous toute demande particulière pour votre trajet (siège bébé, assistance, etc.)"
            value={formValues.specialRequests || ''}
            onChange={(e) => handleInputChange('specialRequests', e.target.value)}
          ></textarea>
        </div>
      </div>
      
      <button 
        type="button"
        onClick={onSubmit}
        className="w-full py-3 px-6 bg-primary text-white font-medium rounded-full hover:bg-primary-dark hover:text-white transition-colors duration-300 flex items-center justify-center mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isCalculating}
      >
        {isCalculating ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Recherche des véhicules disponibles...
          </>
        ) : 'Rechercher des véhicules'}
      </button>
    </div>
  );
};

export default BookingStepOne;