"use client";

import VehicleSelector from '../VehicleSelector';

const BookingStepTwo = ({ 
  formValues, 
  availableVehicles, 
  selectedVehicle, 
  onVehicleSelect,
  onBack
}) => {
  return (
    <div className="p-6 md:p-8">
      <h3 className="text-xl font-semibold mb-6 text-center">Choisissez votre véhicule</h3>
      
      <div className="mb-6">
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium mb-2">Résumé du trajet</h4>
          <div className="text-sm text-gray-600">
            <p><strong>De:</strong> {formValues.pickupAddress}</p>
            <p><strong>À:</strong> {formValues.dropoffAddress}</p>
            <p><strong>Quand:</strong> {new Date(`${formValues.pickupDate}T${formValues.pickupTime}`).toLocaleString('fr-FR')}</p>
            <p><strong>Passagers:</strong> {formValues.passengers} | <strong>Bagages:</strong> {formValues.luggage}</p>
          </div>
        </div>
      </div>
      
      <VehicleSelector
        vehicles={availableVehicles}
        selectedVehicle={selectedVehicle}
        onSelect={onVehicleSelect}
        passengers={formValues.passengers}
        luggage={formValues.luggage}
      />
      
      <div className="flex justify-between mt-6">
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
        
        {!selectedVehicle && (
          <p className="text-gray-500 flex items-center">Sélectionnez un véhicule pour continuer</p>
        )}
      </div>
    </div>
  );
};

export default BookingStepTwo;