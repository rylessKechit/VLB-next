// src/components/booking/VehicleSelector.jsx - Version simplifiée sans détails de calcul

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faCar, faUsers, faCarSide, faSuitcase, faWifi, faWater, faChargingStation, faCouch, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const VehicleSelector = ({ vehicles, selectedVehicle, onSelect, passengers, luggage }) => {
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

  // Configuration des icônes selon le type de véhicule
  const getVehicleIcon = (vehicleId) => {
    switch (vehicleId) {
      case 'green':
        return faLeaf;
      case 'berline':
        return faCar;
      case 'van':
        return faUsers;
      default:
        return faCar;
    }
  };

  // Couleur selon le type pour VLB
  const getVehicleColor = (vehicleId) => {
    switch (vehicleId) {
      case 'green':
        return 'text-green-600';
      case 'berline':
        return 'text-primary';
      case 'van':
        return 'text-secondary';
      default:
        return 'text-primary';
    }
  };

  if (vehicles.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">Aucun véhicule disponible pour {passengers} passagers et {luggage} bagages.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {vehicles.map((vehicle) => {
        const estimate = vehicle.estimate || {};
        const priceRanges = estimate.priceRanges || {};
        
        // Déterminer la fourchette de prix selon le type de véhicule
        let priceRange;
        if (vehicle.id === 'van') {
          priceRange = priceRanges.van || { min: 0, max: 0 };
        } else {
          priceRange = priceRanges.standard || { min: 0, max: 0 };
        }
        
        const isSelected = selectedVehicle === vehicle.id;
        const selectedRate = estimate.selectedRate;

        return (
          <div key={vehicle.id}>
            <div 
              className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                isSelected 
                  ? 'border-primary bg-primary bg-opacity-5 shadow-lg' 
                  : 'border-gray-200 hover:border-primary hover:shadow-md'
              }`}
              onClick={() => onSelect(vehicle.id, estimate)}
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-center">
                  {/* Icône du véhicule */}
                  <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                    <div className={`w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center ${isSelected ? 'bg-primary bg-opacity-10' : ''}`}>
                      <FontAwesomeIcon 
                        icon={getVehicleIcon(vehicle.id)} 
                        className={`text-3xl ${getVehicleColor(vehicle.id)} ${isSelected ? 'text-primary' : ''}`} 
                      />
                    </div>
                  </div>
                  
                  {/* Informations du véhicule */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{vehicle.name}</h3>
                    <p className="text-gray-600 mb-3">{vehicle.desc}</p>
                    
                    {/* Spécifications */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                      <span className="flex items-center text-gray-600">
                        <FontAwesomeIcon icon={faUsers} className="mr-2 text-primary w-4" />
                        {vehicle.capacity}
                      </span>
                      <span className="flex items-center text-gray-600">
                        <FontAwesomeIcon icon={faSuitcase} className="mr-2 text-primary w-4" />
                        {vehicle.luggage}
                      </span>
                    </div>
                  </div>
                  
                  {/* Fourchette de prix */}
                  <div className="flex-shrink-0 text-center md:text-right mt-4 md:mt-0">
                    <div className="text-2xl font-bold text-primary mb-2">
                      {formatPriceRange(priceRange.min, priceRange.max)}
                    </div>
                  </div>
                </div>
                
                {/* Indicateur de sélection */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-primary border-opacity-20">
                    <div className="flex items-center justify-center text-primary font-medium">
                      <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                      Véhicule sélectionné
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VehicleSelector;