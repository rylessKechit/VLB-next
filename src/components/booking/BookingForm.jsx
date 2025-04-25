"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import AddressInput from './AddressInput';
import DateTimePicker from './DateTimePicker';
import PriceCalculator from './PriceCalculator';
import BookingConfirmation from './BookingConfirmation';
import BookingSuccess from './BookingSuccess';

const BookingForm = () => {
  // États pour les étapes du formulaire
  const [currentStep, setCurrentStep] = useState(1);
  const [priceEstimate, setPriceEstimate] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  
  // Utilisation de react-hook-form pour la gestion du formulaire
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      pickupAddress: '',
      dropoffAddress: '',
      pickupDate: '',
      pickupTime: '',
      passengers: 2,
      luggage: 1,
      roundTrip: false,
      returnDate: '',
      returnTime: '',
      pickupAddressPlaceId: '',
      dropoffAddressPlaceId: '',
      flightNumber: '',
      trainNumber: '',
      specialRequests: '',
    }
  });
  
  const formValues = watch();
  
  // Initialiser les champs de date et heure
  useEffect(() => {
    // Date de demain
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = formatDate(tomorrow);
    
    // Heure actuelle + 2 heures
    const defaultTime = new Date();
    defaultTime.setHours(defaultTime.getHours() + 2);
    const formattedTime = formatTime(defaultTime);
    
    setValue('pickupDate', formattedDate);
    setValue('pickupTime', formattedTime);
  }, [setValue]);

  // Vérifier si l'adresse contient un aéroport ou une gare
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
  
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  const handleInputChange = (name, value) => {
    setValue(name, value);
    
    // Si roundTrip est toggled à false, clear return date/time
    if (name === 'roundTrip' && value === false) {
      setValue('returnDate', '');
      setValue('returnTime', '');
    }
    
    // Si roundTrip est toggled à true, set default return date/time
    if (name === 'roundTrip' && value === true && !formValues.returnDate) {
      // Default return date is pickup date + 3 days
      const returnDate = new Date(formValues.pickupDate);
      returnDate.setDate(returnDate.getDate() + 3);
      
      setValue('returnDate', formatDate(returnDate));
      setValue('returnTime', formValues.pickupTime);
    }
    
    // Reset price estimate when key values change
    if (['pickupAddress', 'dropoffAddress', 'pickupDate', 'pickupTime', 'passengers', 'luggage', 'roundTrip'].includes(name)) {
      setPriceEstimate(null);
    }
  };
  
  const handleAddressSelect = (name, address, placeId) => {
    setValue(name, address);
    setValue(`${name}PlaceId`, placeId);
    setPriceEstimate(null);
  };
  
  const calculatePrice = async (data) => {
    // Validation du formulaire
    if (!data.pickupAddress || !data.dropoffAddress || !data.pickupDate || !data.pickupTime) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    if (!data.pickupAddressPlaceId || !data.dropoffAddressPlaceId) {
      setError('Veuillez sélectionner des adresses valides dans les suggestions');
      return;
    }
    
    setError('');
    setIsCalculating(true);
    
    try {
      // Simuler un appel API (à remplacer par un vrai appel API)
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            data: {
              success: true,
              data: {
                estimate: {
                  exactPrice: Math.round((50 + Math.random() * 100) * 100) / 100,
                  minPrice: Math.round((45 + Math.random() * 90) * 100) / 100,
                  maxPrice: Math.round((55 + Math.random() * 110) * 100) / 100,
                  currency: 'EUR',
                  breakdown: {
                    baseFare: 5.0,
                    distanceCharge: Math.round((20 + Math.random() * 40) * 100) / 100,
                    timeCharge: Math.round((10 + Math.random() * 20) * 100) / 100,
                    luggageCharge: data.luggage > 0 ? data.luggage * 2.0 : 0,
                    nightRate: false,
                    weekendRate: false,
                    roundTripDiscount: data.roundTrip,
                  },
                  distanceInfo: {
                    value: Math.round(10000 + Math.random() * 30000),
                    text: `${Math.round(10 + Math.random() * 30)} km`,
                  },
                  durationInfo: {
                    value: Math.round(1200 + Math.random() * 3600),
                    text: `${Math.round(20 + Math.random() * 60)} mins`,
                  }
                }
              }
            }
          });
        }, 1500);
      });
      
      if (response.data && response.data.success) {
        setPriceEstimate(response.data.data.estimate);
        setCurrentStep(2); // Passer directement à l'étape des informations client
      } else {
        setError(response.data?.error || "Erreur lors du calcul du prix.");
      }
    } catch (err) {
      console.error('Erreur lors du calcul du prix:', err);
      setError("Une erreur est survenue lors du calcul du prix. Veuillez réessayer.");
    } finally {
      setIsCalculating(false);
    }
  };
  
  const onFirstStepSubmit = (data) => {
    calculatePrice(data);
  };
  
  const onFinalSubmit = (data) => {
    // Simuler une réservation réussie pour la démo
    const bookingData = {
      ...data,
      id: 'BK' + Math.floor(Math.random() * 10000),
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      vehicleType: 'sedan',
      price: {
        amount: priceEstimate.exactPrice,
        currency: 'EUR'
      },
      pickupDateTime: `${data.pickupDate}T${data.pickupTime}`,
      returnDateTime: data.roundTrip ? `${data.returnDate}T${data.returnTime}` : null
    };
    
    setBookingResult(bookingData);
    setBookingSuccess(true);
  };
  
  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Afficher le composant de confirmation de réservation
  if (bookingSuccess && bookingResult) {
    return <BookingSuccess bookingData={bookingResult} />;
  }
  
  return (
    <div className="w-full bg-white rounded-lg shadow-custom overflow-hidden">
      <div className="flex border-b border-gray-200">
        {[
          { step: 1, label: "Détails du trajet" },
          { step: 2, label: "Confirmation" }
        ].map((item) => (
          <div 
            key={item.step} 
            className={`flex-1 flex flex-col items-center justify-center py-4 relative ${currentStep >= item.step ? 'text-primary' : 'text-gray-400'}`}
          >
            <div className={`w-9 h-9 flex items-center justify-center rounded-full mb-2 z-10 ${currentStep >= item.step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
              {item.step}
            </div>
            <span className="text-sm font-medium hidden sm:block">{item.label}</span>
            
            {item.step < 2 && (
              <div className={`absolute top-7 left-1/2 w-full h-0.5 ${currentStep > item.step ? 'bg-primary' : 'bg-gray-200'}`} style={{ width: 'calc(100% - 4rem)', left: 'calc(50% + 2rem)' }}></div>
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 border-l-4 border-red-500 m-4 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      <form>
        {/* Étape 1: Détails du trajet */}
        {currentStep === 1 && (
          <div className="p-6 md:p-8">
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
            
            {/* Champ conditionnel pour le numéro de vol */}
            {isAirport && (
              <div className="mb-6">
                <label htmlFor="flightNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de vol
                </label>
                <input
                  type="text"
                  id="flightNumber"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  {...register('flightNumber')}
                  placeholder="Ex: AF1234"
                />
                <p className="mt-1 text-xs text-gray-500">Ce numéro nous permettra de suivre votre vol et d'ajuster notre service en cas de retard</p>
              </div>
            )}
            
            {/* Champ conditionnel pour le numéro de train */}
            {isTrainStation && (
              <div className="mb-6">
                <label htmlFor="trainNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de train
                </label>
                <input
                  type="text"
                  id="trainNumber"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  {...register('trainNumber')}
                  placeholder="Ex: TGV6214"
                />
                <p className="mt-1 text-xs text-gray-500">Ce numéro nous permettra de suivre votre train et d'ajuster notre service en cas de retard</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    <span className="ms-3 text-sm font-medium text-gray-700">Aller-retour</span>
                  </label>
                </div>
                
                {formValues.roundTrip && (
                  <div className="mt-4">
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
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de passagers <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <button 
                    type="button" 
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={() => formValues.passengers > 1 && handleInputChange('passengers', formValues.passengers - 1)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <span className="flex-1 text-center py-2">{formValues.passengers}</span>
                  <button 
                    type="button" 
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={() => formValues.passengers < 7 && handleInputChange('passengers', formValues.passengers + 1)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">Maximum 7 passagers</p>
              </div>
              
              <div>
                <label htmlFor="luggage" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de bagages <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <button 
                    type="button" 
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={() => formValues.luggage > 0 && handleInputChange('luggage', formValues.luggage - 1)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <span className="flex-1 text-center py-2">{formValues.luggage}</span>
                  <button 
                    type="button" 
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={() => formValues.luggage < 7 && handleInputChange('luggage', formValues.luggage + 1)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">Maximum 7 bagages</p>
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
                Demandes spéciales
              </label>
              <textarea
                id="specialRequests"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                rows="3"
                {...register('specialRequests')}
                placeholder="Indiquez-nous toute demande particulière pour votre trajet"
              ></textarea>
            </div>
            
            <button 
              type="button" 
              className="w-full btn btn-primary flex items-center justify-center"
              onClick={handleSubmit(onFirstStepSubmit)}
              disabled={isCalculating}
            >
              {isCalculating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calcul du prix en cours...
                </>
              ) : 'Obtenir un devis'}
            </button>

            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Notre flotte</h3>
              <div className="flex flex-col md:flex-row items-center">
                <div className="mb-4 md:mb-0 md:mr-6 w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2a2 2 0 00.5-3.932l-1.144-4.57a2 2 0 00-1.942-1.498H5.372a2 2 0 00-1.928 1.584l-.857 4.287A1 1 0 002 6h1v9z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Une flotte adaptée à vos besoins</h4>
                  <p className="text-sm text-gray-600">Véhicules spacieux et confortables, berlines, modèles éco-responsables.</p>
                  <ul className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
                    <li className="text-xs flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Jusqu'à 7 passagers
                    </li>
                    <li className="text-xs flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      WiFi gratuit
                    </li>
                    <li className="text-xs flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Boissons offertes
                    </li>
                    <li className="text-xs flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Options éco
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Étape 2: Informations client et confirmation */}
        {currentStep === 2 && (
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
            {priceEstimate && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-lg mb-4">Résumé de votre réservation</h4>
                
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
                    <span className="text-sm text-gray-500">Prix total:</span>
                    <p className="font-semibold text-lg text-primary">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                      }).format(priceEstimate?.exactPrice || 0)}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <button 
                type="button" 
                className="btn btn-outline flex items-center justify-center"
                onClick={goBack}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Retour
              </button>
              
              <button 
                type="button" 
                className="btn btn-primary flex items-center justify-center"
                onClick={handleSubmit(onFinalSubmit)}
              >
                Confirmer la réservation
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default BookingForm;