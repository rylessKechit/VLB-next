"use client";

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faCar, faUsers, faCarSide, faSuitcase, faWifi, faWater, faChargingStation, faCouch, faInfoCircle, faCheckCircle, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';  // ✅ Import correct

const VehicleSelector = ({ vehicles, selectedVehicle, onSelect, passengers, luggage }) => {
  const [showDetails, setShowDetails] = useState(null);

  // Fonction pour formater le prix selon l'identité VLB
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const toggleDetails = (vehicleId) => {
    setShowDetails(showDetails === vehicleId ? null : vehicleId);
  };

  // Configuration des icônes selon le type de véhicule
  const getVehicleIcon = (vehicleId) => {
    switch (vehicleId) {
      case 'green':
        return faLeaf;
      case 'berline':  // ✅ Corrigé
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
      case 'berline':  // ✅ Corrigé
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
        <FontAwesomeIcon icon={faInfoCircle} className="text-gray-400 text-3xl mb-4" />
        <p className="text-gray-500">Aucun véhicule disponible pour {passengers} passagers et {luggage} bagages.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {vehicles.map((vehicle) => {
        const estimate = vehicle.estimate || {};
        const exactPrice = estimate.exactPrice || vehicle.price || 0;
        const breakdown = estimate.breakdown || {};
        const isSelected = selectedVehicle === vehicle.id;

        return (
          <div key={vehicle.id} className="space-y-4">
            <div 
              className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                isSelected 
                  ? 'border-primary bg-primary bg-opacity-5 shadow-lg' 
                  : 'border-gray-200 hover:border-primary hover:shadow-md'
              }`}
              onClick={() => onSelect(vehicle.id, vehicle.estimate)}
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
                        <FontAwesomeIcon icon={faUsers} className="mr-2 text-primary" />
                        {vehicle.capacity}
                      </span>
                      <span className="flex items-center text-gray-600">
                        <FontAwesomeIcon icon={faSuitcase} className="mr-2 text-primary" />
                        {vehicle.luggage}
                      </span>
                    </div>
                  </div>
                  
                  {/* Prix et actions */}
                  <div className="flex-shrink-0 text-center md:text-right mt-4 md:mt-0">
                    <div className="text-2xl font-bold text-primary mb-2">
                      {formatPrice(exactPrice)}
                    </div>
                    
                    <button 
                      type="button" 
                      className="text-sm text-gray-500 hover:text-primary transition-colors duration-300 flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDetails(vehicle.id);
                      }}
                    >
                      <span>Voir les détails</span>
                      <FontAwesomeIcon 
                        icon={showDetails === vehicle.id ? faChevronUp : faChevronDown}  // ✅ Corrigé
                        className="ml-2 text-xs"
                      />
                    </button>
                  </div>
                </div>
                
                {/* Indicateur de sélection */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-primary border-opacity-20">
                    <div className="flex items-center justify-center text-primary font-medium">
                      <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />  {/* ✅ Corrigé */}
                      Véhicule sélectionné
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Détails expandables */}
            {showDetails === vehicle.id && (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 animate-fade-in">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Détails du véhicule</h4>
                
                {/* Breakdown du prix */}
                {breakdown && Object.keys(breakdown).length > 0 && (
                  <div className="mb-6">
                    <h5 className="font-medium text-gray-700 mb-3">Calcul du prix</h5>
                    <div className="space-y-2">
                      {breakdown.baseFare && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tarif de base</span>
                          <span>{formatPrice(breakdown.baseFare)}</span>
                        </div>
                      )}
                      {breakdown.distanceCharge && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Distance ({breakdown.actualDistance?.toFixed(1) || 'N/A'} km)
                          </span>
                          <span>{formatPrice(breakdown.distanceCharge)}</span>
                        </div>
                      )}
                      {breakdown.nightRateApplied && (
                        <div className="flex justify-between text-sm text-orange-600">
                          <span>Tarif de nuit (+15%)</span>
                          <span>Appliqué</span>
                        </div>
                      )}
                      {breakdown.weekendRateApplied && (
                        <div className="flex justify-between text-sm text-blue-600">
                          <span>Tarif weekend (+10%)</span>
                          <span>Appliqué</span>
                        </div>
                      )}
                      {breakdown.roundTrip && (
                        <div className="flex justify-between text-sm text-primary">
                          <span>Aller-retour (réduction 15%)</span>
                          <span>×2</span>
                        </div>
                      )}
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Prix total</span>
                        <span className="text-primary">{formatPrice(exactPrice)}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Caractéristiques du véhicule */}
                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Équipements inclus</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Équipements de base */}
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faWifi} className="text-primary mr-3" />
                      <span className="text-sm">WiFi gratuit</span>
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faWater} className="text-primary mr-3" />
                      <span className="text-sm">Bouteilles d'eau</span>
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faCouch} className="text-primary mr-3" />
                      <span className="text-sm">Sièges confortables</span>
                    </div>
                    
                    {/* Équipements spécifiques selon le véhicule */}
                    {vehicle.id === 'green' && (
                      <>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faChargingStation} className="text-green-600 mr-3" />
                          <span className="text-sm">100% électrique</span>
                        </div>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faLeaf} className="text-green-600 mr-3" />
                          <span className="text-sm">Zéro émission</span>
                        </div>
                      </>
                    )}
                    
                    {vehicle.id === 'berline' && (  /* ✅ Corrigé */
                      <>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faCar} className="text-primary mr-3" />
                          <span className="text-sm">Sièges cuir premium</span>
                        </div>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faCouch} className="text-primary mr-3" />
                          <span className="text-sm">Climatisation multi-zones</span>
                        </div>
                      </>
                    )}
                    
                    {vehicle.id === 'van' && (
                      <>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faUsers} className="text-secondary mr-3" />
                          <span className="text-sm">Espace généreux</span>
                        </div>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faSuitcase} className="text-secondary mr-3" />
                          <span className="text-sm">Grand compartiment bagages</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Bouton de sélection dans les détails */}
                {!isSelected && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      className="w-full py-3 px-6 bg-primary text-white font-medium rounded-md hover:bg-primary-dark transition-colors duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(vehicle.id, vehicle.estimate);
                      }}
                    >
                      Sélectionner ce véhicule
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default VehicleSelector;