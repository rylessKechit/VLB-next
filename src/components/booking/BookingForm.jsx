// src/components/booking/BookingForm.jsx - Version modifiée pour les fourchettes de prix

"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import BookingSuccess from './BookingSuccess';
import BookingStepOne from './steps/BookingStepOne';
import BookingStepTwo from './steps/BookingStepTwo';
import BookingStepThree from './steps/BookingStepThree';

const BookingForm = () => {
  // États pour les étapes du formulaire
  const [currentStep, setCurrentStep] = useState(1);
  const [priceEstimate, setPriceEstimate] = useState(null);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
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
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = formatDate(tomorrow);
    
    const defaultTime = new Date();
    defaultTime.setHours(defaultTime.getHours() + 2);
    const formattedTime = formatTime(defaultTime);
    
    setValue('pickupDate', formattedDate);
    setValue('pickupTime', formattedTime);
  }, [setValue]);

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
    
    if (name === 'roundTrip' && value === false) {
      setValue('returnDate', '');
      setValue('returnTime', '');
    }
    
    if (name === 'roundTrip' && value === true && !formValues.returnDate) {
      const returnDate = new Date(formValues.pickupDate);
      returnDate.setDate(returnDate.getDate() + 3);
      
      setValue('returnDate', formatDate(returnDate));
      setValue('returnTime', formValues.pickupTime);
    }
    
    if (['pickupAddress', 'dropoffAddress', 'pickupDate', 'pickupTime', 'passengers', 'luggage', 'roundTrip'].includes(name)) {
      setPriceEstimate(null);
      setAvailableVehicles([]);
      setSelectedVehicle(null);
    }
  };
  
  const handleAddressSelect = (name, address, placeId) => {
    setValue(name, address);
    setValue(`${name}PlaceId`, placeId);
    setPriceEstimate(null);
    setAvailableVehicles([]);
    setSelectedVehicle(null);
  };
  
  // Fonction pour calculer le prix
  const calculatePrice = async () => {
    // Validation des champs requis
    if (!formValues.pickupAddress || !formValues.dropoffAddress || !formValues.pickupDate || !formValues.pickupTime) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    if (!formValues.pickupAddressPlaceId || !formValues.dropoffAddressPlaceId) {
      setError('Veuillez sélectionner des adresses valides dans les suggestions');
      return;
    }
    
    setError('');
    setIsCalculating(true);
    
    try {
      console.log('Envoi de la requête de prix avec:', {
        pickupPlaceId: formValues.pickupAddressPlaceId,
        dropoffPlaceId: formValues.dropoffAddressPlaceId,
        pickupDateTime: `${formValues.pickupDate}T${formValues.pickupTime}`,
        passengers: parseInt(formValues.passengers),
        luggage: parseInt(formValues.luggage),
        roundTrip: formValues.roundTrip,
        returnDateTime: formValues.roundTrip && formValues.returnDate ? `${formValues.returnDate}T${formValues.returnTime}` : null
      });

      const response = await fetch('/api/price/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pickupPlaceId: formValues.pickupAddressPlaceId,
          dropoffPlaceId: formValues.dropoffAddressPlaceId,
          pickupDateTime: `${formValues.pickupDate}T${formValues.pickupTime}`,
          passengers: parseInt(formValues.passengers),
          luggage: parseInt(formValues.luggage),
          roundTrip: formValues.roundTrip,
          returnDateTime: formValues.roundTrip && formValues.returnDate ? `${formValues.returnDate}T${formValues.returnTime}` : null
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Réponse de l\'API price/estimate:', data);
        
        if (data.success && data.data && data.data.estimate) {
          const estimate = data.data.estimate;
          
          // Vérifier que l'estimate contient les données nécessaires
          if (!estimate.priceRanges || typeof estimate.basePrice === 'undefined') {
            throw new Error('Données de prix incomplètes dans la réponse de l\'API');
          }
          
          console.log('Estimate reçu:', estimate);
          console.log('Price ranges:', estimate.priceRanges);
          
          // Créer les options de véhicules avec les fourchettes de prix
          const vehicleOptions = [
            {
              id: 'green',
              name: 'Tesla Model 3',
              desc: 'Élégance et technologie - 100% électrique',
              capacity: 'Jusqu\'à 4 passagers',
              luggage: 'Jusqu\'à 3 bagages',
              estimate: estimate,
              priceRange: estimate.priceRanges.standard
            },
            {
              id: 'berline',
              name: 'Mercedes Classe E',
              desc: 'Confort et prestige au quotidien',
              capacity: 'Jusqu\'à 4 passagers',
              luggage: 'Jusqu\'à 4 bagages',
              estimate: estimate,
              priceRange: estimate.priceRanges.standard
            },
            {
              id: 'van',
              name: 'Mercedes Classe V',
              desc: 'Espace et luxe pour vos groupes',
              capacity: 'Jusqu\'à 7 passagers',
              luggage: 'Grande capacité bagages',
              estimate: estimate,
              priceRange: estimate.priceRanges.van
            }
          ];
          
          console.log('VehicleOptions créées avec fourchettes:', vehicleOptions);
          
          // Filtrer les véhicules selon le nombre de passagers
          const validVehicles = vehicleOptions.filter(vehicle => {
            if (vehicle.id === 'van' && formValues.passengers <= 7) {
              return true;
            }
            if (vehicle.id !== 'van' && formValues.passengers <= 4) {
              return true;
            }
            return false;
          });
          
          console.log('Valid vehicles:', validVehicles);
          console.log('Passage à l\'étape 2');
          
          setAvailableVehicles(validVehicles);
          setCurrentStep(2);
        } else {
          console.error('Données manquantes dans la réponse:', data);
          throw new Error(data.error || 'Données incomplètes reçues de l\'API');
        }
      } else {
        const errorData = await response.json();
        console.error('Erreur HTTP:', response.status, errorData);
        throw new Error(errorData.error || 'Erreur lors du calcul du prix');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur lors du calcul du prix');
    } finally {
      setIsCalculating(false);
    }
  };
  
  const onVehicleSelect = (vehicleId, estimate) => {
    setSelectedVehicle(vehicleId);
    setPriceEstimate(estimate);
    setCurrentStep(3);
  };
  
  const onFinalSubmit = async (data) => {
    if (!selectedVehicle || !priceEstimate) {
      setError('Veuillez sélectionner un véhicule');
      return;
    }
    
    // Récupérer la fourchette de prix pour le véhicule sélectionné
    const selectedVehicleData = availableVehicles.find(v => v.id === selectedVehicle);
    const priceRange = selectedVehicleData ? selectedVehicleData.priceRange : null;
    
    if (!priceRange) {
      setError('Erreur lors de la récupération du prix');
      return;
    }
    
    try {
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
        // MODIFICATION : Utiliser le prix maximum de la fourchette pour la réservation
        price: {
          amount: priceRange.max, // Prix maximum de la fourchette
          currency: 'EUR',
          breakdown: priceEstimate.breakdown,
          priceRange: priceRange // Ajouter la fourchette de prix
        },
        vehicleType: selectedVehicle,
        pickupAddressPlaceId: data.pickupAddressPlaceId,
        dropoffAddressPlaceId: data.dropoffAddressPlaceId,
        tariffApplied: priceEstimate.selectedRate,
        routeDetails: priceEstimate.details ? {
          distance: {
            value: priceEstimate.details.distanceInKm * 1000,
            text: priceEstimate.details.formattedDistance,
          },
          duration: {
            value: priceEstimate.details.durationInMinutes * 60,
            text: priceEstimate.details.formattedDuration,
          },
          polyline: priceEstimate.details.polyline,
        } : null
      };

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
  
  if (bookingSuccess && bookingResult) {
    return <BookingSuccess bookingData={bookingResult} />;
  }
  
  return (
    <div className="w-full bg-white rounded-lg shadow-custom overflow-hidden">
      {/* Stepper */}
      <div className="flex border-b border-gray-200">
        {[
          { step: 1, label: "Détails du trajet" },
          { step: 2, label: "Sélection véhicule" },
          { step: 3, label: "Confirmation" }
        ].map((item) => (
          <div 
            key={item.step} 
            className={`flex-1 flex flex-col items-center justify-center py-4 relative ${currentStep >= item.step ? 'text-primary' : 'text-gray-400'}`}
          >
            <div className={`w-9 h-9 flex items-center justify-center rounded-full mb-2 z-10 ${currentStep >= item.step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
              {item.step}
            </div>
            <span className="text-sm font-medium hidden sm:block">{item.label}</span>
            
            {item.step < 3 && (
              <div className={`absolute top-7 left-1/2 w-full h-0.5 ${currentStep > item.step ? 'bg-primary' : 'bg-gray-200'}`} style={{ width: 'calc(100% - 4rem)', left: 'calc(50% + 2rem)' }}></div>
            )}
          </div>
        ))}
      </div>

      {/* Error message */}
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
          <BookingStepOne
            formValues={formValues}
            handleInputChange={handleInputChange}
            handleAddressSelect={handleAddressSelect}
            register={register}
            errors={errors}
            isCalculating={isCalculating}
            onSubmit={calculatePrice}
          />
        )}
        
        {/* Étape 2: Sélection de véhicule */}
        {currentStep === 2 && (
          <BookingStepTwo
            formValues={formValues}
            availableVehicles={availableVehicles}
            selectedVehicle={selectedVehicle}
            onVehicleSelect={onVehicleSelect}
            onBack={goBack}
          />
        )}
        
        {/* Étape 3: Informations client et confirmation */}
        {currentStep === 3 && (
          <BookingStepThree
            formValues={formValues}
            priceEstimate={priceEstimate}
            selectedVehicle={selectedVehicle}
            availableVehicles={availableVehicles}
            register={register}
            errors={errors}
            onSubmit={handleSubmit(onFinalSubmit)}
            onBack={goBack}
          />
        )}
      </form>
    </div>
  );
};

export default BookingForm;