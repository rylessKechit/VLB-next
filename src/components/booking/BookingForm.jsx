"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import AddressInput from './AddressInput';
import DateTimePicker from './DateTimePicker';
import BookingSuccess from './BookingSuccess';
import RouteMap from './RouteMap';

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
  
  const calculatePrice = async () => {
  // Validation des champs obligatoires
  if (!formValues.pickupAddress || !formValues.dropoffAddress || !formValues.pickupDate || !formValues.pickupTime) {
    setError('Veuillez remplir tous les champs obligatoires')
    return
  }
  
  if (!formValues.pickupAddressPlaceId || !formValues.dropoffAddressPlaceId) {
    setError('Veuillez sélectionner des adresses valides dans les suggestions')
    return
  }
  
  setError('')
  setIsCalculating(true)
  
  try {
    // Calculer pour les 3 types de véhicules VLB
    const vehicleTypes = ['green', 'berline', 'van']
    const vehicleEstimates = []
    
    for (const vehicleType of vehicleTypes) {
      try {
        const response = await api.post('/price/estimate', {
          pickupPlaceId: formValues.pickupAddressPlaceId,
          dropoffPlaceId: formValues.dropoffAddressPlaceId,
          pickupDateTime: `${formValues.pickupDate}T${formValues.pickupTime}`,
          passengers: parseInt(formValues.passengers),
          luggage: parseInt(formValues.luggage),
          roundTrip: formValues.roundTrip,
          returnDateTime: formValues.roundTrip && formValues.returnDate ? `${formValues.returnDate}T${formValues.returnTime}` : null,
          vehicleType: vehicleType
        })
        
        if (response.data && response.data.success) {
          vehicleEstimates.push({
            vehicleType,
            estimate: response.data.data.estimate
          })
        }
      } catch (err) {
        // Continuer avec les autres véhicules même si un calcul échoue
        continue
      }
    }
    
    if (vehicleEstimates.length === 0) {
      throw new Error('Impossible de calculer le prix pour aucun véhicule')
    }
    
    // Créer les options de véhicules VLB avec les prix réels
    const vehicleOptions = [
      {
        id: 'green',
        name: 'Tesla Model 3',
        desc: 'Élégance et technologie - 100% électrique',
        capacity: 'Jusqu\'à 4 passagers',
        luggage: 'Jusqu\'à 3 bagages',
        estimate: vehicleEstimates.find(v => v.vehicleType === 'green')?.estimate || null,
        price: vehicleEstimates.find(v => v.vehicleType === 'green')?.estimate?.exactPrice || 0
      },
      {
        id: 'berline',
        name: 'Mercedes Classe E',
        desc: 'Confort et prestige au quotidien',
        capacity: 'Jusqu\'à 4 passagers',
        luggage: 'Jusqu\'à 4 bagages',
        estimate: vehicleEstimates.find(v => v.vehicleType === 'berline')?.estimate || null,
        price: vehicleEstimates.find(v => v.vehicleType === 'berline')?.estimate?.exactPrice || 0
      },
      {
        id: 'van',
        name: 'Mercedes Classe V',
        desc: 'Espace et luxe pour vos groupes',
        capacity: 'Jusqu\'à 7 passagers',
        luggage: 'Grande capacité bagages',
        estimate: vehicleEstimates.find(v => v.vehicleType === 'van')?.estimate || null,
        price: vehicleEstimates.find(v => v.vehicleType === 'van')?.estimate?.exactPrice || 0
      }
    ]
    
    // Filtrer les véhicules qui ont pu être calculés
    const validVehicles = vehicleOptions.filter(v => v.estimate !== null)
    
    setAvailableVehicles(validVehicles)
    setCurrentStep(2)
  } catch (err) {
    setError(err.message || 'Erreur lors du calcul du prix')
  } finally {
    setIsCalculating(false)
  }
}

// Ajouter également cette fonction pour créer des estimations par défaut si nécessaire :
const createVehicleOptions = (baseEstimate, formValues) => {
  // Configuration des tarifs VLB pour les 3 véhicules
  const BASE_FARES = { 
    green: 5,      // Tesla Model 3
    berline: 8,    // Classe E
    van: 12        // Classe V
  };
  
  const PER_KM_RATES = { 
    green: 1.5,    // Tesla Model 3
    berline: 1.8,  // Classe E
    van: 2.2       // Classe V
  };
  
  const MIN_DISTANCE_KM = { 
    green: 0, 
    berline: 0, 
    van: 0 
  };
  
  // Fonction pour calculer le prix d'un véhicule
  function calculateVehiclePrice(vehicleType) {
    const baseFare = BASE_FARES[vehicleType];
    const perKmRate = PER_KM_RATES[vehicleType];
    const minDistance = MIN_DISTANCE_KM[vehicleType];
    
    const distanceInKm = baseEstimate.details?.distanceInKm || 25;
    const chargeableDistance = Math.max(distanceInKm, minDistance);
    const distanceCharge = chargeableDistance * perKmRate;
    
    let exactPrice = baseFare + distanceCharge;
    if (formValues.roundTrip) exactPrice *= 2;
    
    exactPrice = Math.round(exactPrice * 100) / 100;
    
    return {
      exactPrice,
      minPrice: Math.round(exactPrice * 0.95 * 100) / 100,
      maxPrice: Math.round(exactPrice * 1.05 * 100) / 100,
      currency: 'EUR',
      breakdown: {
        baseFare,
        distanceCharge,
        actualDistance: distanceInKm,
        chargeableDistance,
        pricePerKm: perKmRate,
        roundTrip: formValues.roundTrip,
        vehicleType
      },
      details: {
        distanceInKm,
        chargeableDistanceInKm: chargeableDistance,
        durationInMinutes: baseEstimate.details?.durationInMinutes || 30,
        formattedDistance: baseEstimate.details?.formattedDistance || `${distanceInKm} km`,
        formattedDuration: baseEstimate.details?.formattedDuration || "30 min"
      }
    };
  }
  
  // Créer les options pour les 3 véhicules
  return [
    {
      id: 'green',
      name: 'Tesla Model 3',
      desc: 'Élégance et technologie - 100% électrique',
      capacity: 'Jusqu\'à 4 passagers',
      luggage: 'Jusqu\'à 3 bagages',
      price: calculateVehiclePrice('green').exactPrice,
      estimate: calculateVehiclePrice('green')
    },
    {
      id: 'berline',
      name: 'Mercedes Classe E',
      desc: 'Confort et prestige au quotidien',
      capacity: 'Jusqu\'à 4 passagers',
      luggage: 'Jusqu\'à 4 bagages',
      price: calculateVehiclePrice('berline').exactPrice,
      estimate: calculateVehiclePrice('berline')
    },
    {
      id: 'van',
      name: 'Mercedes Classe V',
      desc: 'Espace et luxe pour vos groupes',
      capacity: 'Jusqu\'à 7 passagers',
      luggage: 'Grande capacité bagages',
      price: calculateVehiclePrice('van').exactPrice,
      estimate: calculateVehiclePrice('van')
    }
  ];
};
  
  const onFirstStepSubmit = (data) => {
    calculatePrice(data);
  };
  
  const onFinalSubmit = async (data) => {
    try {
      // Préparer les données dans le format attendu par l'API
      const bookingData = {
        pickupAddress: data.pickupAddress,
        dropoffAddress: data.dropoffAddress,
        pickupDate: data.pickupDate,
        pickupTime: data.pickupTime,
        passengers: data.passengers,
        luggage: data.luggage,
        roundTrip: data.roundTrip,
        returnDate: data.roundTrip ? data.returnDate : null,
        returnTime: data.roundTrip ? data.returnTime : null,
        flightNumber: data.flightNumber || null,
        trainNumber: data.trainNumber || null,
        specialRequests: data.specialRequests || '',
        customerInfo: {
          name: data.customerName,
          email: data.customerEmail,
          phone: data.customerPhone
        },
        price: {
          amount: priceEstimate.exactPrice,
          currency: 'EUR'
        }
      };
  
      // Appeler l'API
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
  
      const result = await response.json();
      
      if (response.ok && result.success) {
        setBookingResult(result.data);
        setBookingSuccess(true);
      } else {
        setError(result.error || "Une erreur est survenue lors de la réservation.");
      }
    } catch (err) {
      console.error('Erreur lors de la création de la réservation:', err);
      setError("Une erreur est survenue lors de la réservation. Veuillez réessayer.");
    }
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
  
  // Fonction pour créer un composant de compteur accessible
  const QuantityCounter = ({ id, value, onChange, min, max, label, helpText }) => {
    return (
      <div>
        <label htmlFor={`${id}-display`} className="block text-sm font-medium text-gray-700 mb-2">
          {label} <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden shadow-sm">
          <button 
            type="button" 
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors text-gray-700"
            onClick={() => value > min && onChange(value - 1)}
            aria-label={`Diminuer le nombre de ${label.toLowerCase()}`}
            aria-controls={`${id}-display`}
            disabled={value <= min}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <span 
            id={`${id}-display`} 
            className="flex-1 text-center py-2 font-medium text-lg" 
            aria-live="polite" 
            role="status"
          >
            {value}
          </span>
          <button 
            type="button" 
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors text-gray-700"
            onClick={() => value < max && onChange(value + 1)}
            aria-label={`Augmenter le nombre de ${label.toLowerCase()}`}
            aria-controls={`${id}-display`}
            disabled={value >= max}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        {helpText && (
          <p id={`${id}-help`} className="mt-1 text-xs text-gray-500">
            {helpText}
          </p>
        )}
      </div>
    );
  };
  
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
            
            {/* Champs conditionnels adaptés au responsive */}
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
            
            {/* Grille responsive améliorée */}
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
                
                {/* Affichage conditionnel avec animation fluide */}
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
            
            {/* Compteurs plus adaptés aux écrans mobiles */}
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
            
            {/* Bouton adaptatif qui prend toute la largeur sur mobile */}
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
                  <span className="whitespace-nowrap">Calcul du prix en cours...</span>
                </>
              ) : 'Obtenir un devis'}
            </button>
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

                <div className="mb-6">
                  <h5 className="font-medium mb-3">Itinéraire</h5>
                  <RouteMap 
                    pickupAddress={formValues.pickupAddress}
                    dropoffAddress={formValues.dropoffAddress}
                    pickupPlaceId={formValues.pickupAddressPlaceId}
                    dropoffPlaceId={formValues.dropoffAddressPlaceId}
                    polyline={priceEstimate.route?.polyline}
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
                onClick={handleSubmit(onFinalSubmit)}
                aria-label="Confirmer la réservation"
              >
                Confirmer la réservation
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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