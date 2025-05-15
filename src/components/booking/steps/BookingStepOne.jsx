"use client";

import AddressInput from '../AddressInput';
import DateTimePicker from '../DateTimePicker';
import QuantityCounter from './QuantityCounter';
import { useEffect, useState } from 'react';

const BookingStepOne = ({ 
  formValues, 
  handleInputChange, 
  handleAddressSelect,
  register,
  errors,
  isCalculating,
  onSubmit
}) => {
  const [isAirport, setIsAirport] = useState(false);
  const [isTrainStation, setIsTrainStation] = useState(false);

  useEffect(() => {
    const checkAddressType = (address) => {
      if (!address) return;
      
      const airportKeywords = ['aéroport', 'airport', 'cdg', 'orly', 'beauvais', 'roissy'];
      const trainKeywords = ['gare', 'station', 'sncf', 'tgv', 'train'];
      
      const lowerCaseAddress = address.toLowerCase();
      
      setIsAirport(airportKeywords.some(keyword => lowerCaseAddress.includes(keyword)));
      setIsTrainStation(trainKeywords.some(keyword => lowerCaseAddress.includes(keyword)));
    };
    
    checkAddressType(formValues.pickupAddress);
    checkAddressType(formValues.dropoffAddress);
  }, [formValues.pickupAddress, formValues.dropoffAddress]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6">
        <label htmlFor="pickupAddress" className="block text-sm font-medium text-gray-700 mb-2">
          Adresse de départ <span className="text-red-500">*</span>
        </label>
        <AddressInput 
          id="pickupAddress"
          value={formValues.pickupAddress}
          onChange={value => handleInputChange('pickupAddress', value)}
          onSelect={(address, placeId) => handleAddressSelect('pickupAddress', address, placeId)}
          placeholder="Entrez l'adresse de départ"
        />
        {errors.pickupAddress && <p className="mt-1 text-sm text-red-600">{errors.pickupAddress.message}</p>}
      </div>
      
      <div className="mb-6">
        <label htmlFor="dropoffAddress" className="block text-sm font-medium text-gray-700 mb-2">
          Adresse d'arrivée <span className="text-red-500">*</span>
        </label>
        <AddressInput 
          id="dropoffAddress"
          value={formValues.dropoffAddress}
          onChange={value => handleInputChange('dropoffAddress', value)}
          onSelect={(address, placeId) => handleAddressSelect('dropoffAddress', address, placeId)}
          placeholder="Entrez l'adresse d'arrivée"
        />
        {errors.dropoffAddress && <p className="mt-1 text-sm text-red-600">{errors.dropoffAddress.message}</p>}
      </div>
      
      {isAirport && (
        <div className="mb-6">
          <label htmlFor="flightNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de vol
          </label>
          <div className="relative">
            <input
              type="text"
              id="flightNumber"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              {...register('flightNumber')}
              placeholder="Ex: AF1234"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">Ce numéro nous permettra de suivre votre vol et d'ajuster notre service en cas de retard</p>
        </div>
      )}
      
      {isTrainStation && (
        <div className="mb-6">
          <label htmlFor="trainNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de train
          </label>
          <div className="relative">
            <input
              type="text"
              id="trainNumber"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              {...register('trainNumber')}
              placeholder="Ex: TGV1234"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        <div>
          <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-2">
            Date et heure de départ <span className="text-red-500">*</span>
          </label>
          <DateTimePicker 
            dateId="pickupDate"
            timeId="pickupTime"
            dateValue={formValues.pickupDate}
            timeValue={formValues.pickupTime}
            onDateChange={value => handleInputChange('pickupDate', value)}
            onTimeChange={value => handleInputChange('pickupTime', value)}
          />
          {(errors.pickupDate || errors.pickupTime) && (
            <p className="mt-1 text-sm text-red-600">Ce champ est requis</p>
          )}
        </div>
        
        <div>
          <div className="flex items-center h-10 mb-2">
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox"
                className="sr-only peer"
                checked={formValues.roundTrip}
                onChange={e => handleInputChange('roundTrip', e.target.checked)}
                aria-label="Aller-retour"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              <span className="ms-3 text-sm font-medium text-gray-700">Aller-retour</span>
            </label>
          </div>
          
          <div className={`transition-all duration-300 overflow-hidden ${formValues.roundTrip ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-2">
              Date et heure de retour <span className="text-red-500">*</span>
            </label>
            <DateTimePicker 
              dateId="returnDate"
              timeId="returnTime"
              dateValue={formValues.returnDate}
              timeValue={formValues.returnTime}
              onDateChange={value => handleInputChange('returnDate', value)}
              onTimeChange={value => handleInputChange('returnTime', value)}
              minDate={formValues.pickupDate}
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
        <QuantityCounter
          id="passengers"
          value={formValues.passengers}
          onChange={value => handleInputChange('passengers', value)}
          min={1}
          max={7}
          label="Nombre de passagers"
          helpText="Maximum 7 passagers"
        />
        
        <QuantityCounter
          id="luggage"
          value={formValues.luggage}
          onChange={value => handleInputChange('luggage', value)}
          min={0}
          max={7}
          label="Nombre de bagages"
          helpText="Maximum 7 bagages"
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
          Demandes spéciales
        </label>
        <div className="relative">
          <textarea
            id="specialRequests"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            rows="3"
            {...register('specialRequests')}
            placeholder="Indiquez-nous toute demande particulière pour votre trajet"
          ></textarea>
          <div className="absolute top-3 left-3 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
        </div>
      </div>
      
      <button 
        type="button" 
        className="w-full btn btn-primary flex items-center justify-center"
        onClick={handleSubmit}
        disabled={isCalculating}
      >
        {isCalculating ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="whitespace-nowrap">Calcul du prix en cours...</span>
          </>
        ) : 'Obtenir un devis'}
      </button>
    </div>
  );
};

export default BookingStepOne;