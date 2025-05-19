// src/components/booking/VehicleSelector.jsx - Version avec course minimum et frais d'approche

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faCar, faUsers, faCarSide, faSuitcase, faWifi, faWater, faChargingStation, faCouch, faInfoCircle, faCheckCircle, faChevronUp, faChevronDown, faClock, faCalendarAlt, faRoute, faFlag } from '@fortawesome/free-solid-svg-icons';

const VehicleSelector = ({ vehicles, selectedVehicle, onSelect, passengers, luggage }) => {
  const [showDetails, setShowDetails] = useState(null);

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

  const toggleDetails = (vehicleId) => {
    setShowDetails(showDetails === vehicleId ? null : vehicleId);
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

  // Fonction pour obtenir le nom du tarif appliqué
  const getTariffName = (selectedRate) => {
    const tariffNames = {
      'A': 'Tarif A - Jour avec retour en charge',
      'B': 'Tarif B - Nuit/weekend avec retour en charge',
      'C': 'Tarif C - Jour avec retour à vide',
      'D': 'Tarif D - Nuit/weekend avec retour à vide'
    };
    return tariffNames[selectedRate] || 'Tarif standard';
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
        const priceRanges = estimate.priceRanges || {};
        
        // Déterminer la fourchette de prix selon le type de véhicule
        let priceRange;
        if (vehicle.id === 'van') {
          priceRange = priceRanges.van || { min: 0, max: 0 };
        } else {
          priceRange = priceRanges.standard || { min: 0, max: 0 };
        }
        
        const breakdown = estimate.breakdown || {};
        const isSelected = selectedVehicle === vehicle.id;
        const selectedRate = estimate.selectedRate;

        return (
          <div key={vehicle.id} className="space-y-4">
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
                    
                    {/* Tarif appliqué */}
                    {selectedRate && (
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-primary bg-opacity-10 text-primary text-sm font-medium rounded-full">
                          {getTariffName(selectedRate)}
                        </span>
                      </div>
                    )}
                    
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
                        icon={showDetails === vehicle.id ? faChevronUp : faChevronDown}
                        className="ml-2 text-xs"
                      />
                    </button>
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
            
            {/* Détails expandables */}
            {showDetails === vehicle.id && (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 animate-fade-in">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Détails du tarif</h4>
                
                {/* Explications sur la fourchette de prix */}
                <div className="mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h5 className="font-medium text-blue-800 mb-2">💡 Composition du prix</h5>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>• Course minimum : {vehicle.id === 'van' ? '25€' : '20€'}</p>
                      <p>• Frais d'approche : {breakdown.isNightTime ? '10€ (nuit)' : '13€ (jour)'}</p>
                      <p>• Marge de négociation : + 10 € maximum</p>
                      {vehicle.id === 'van' && <p>• Supplément pour véhicule spacieux inclus</p>}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h5 className="font-medium text-gray-700 mb-3">Détail du calcul</h5>
                    <div className="space-y-2 text-sm">
                      {breakdown.baseFare && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Prise en charge</span>
                          <span>{breakdown.baseFare.toFixed(2)}€</span>
                        </div>
                      )}
                      {breakdown.distanceCharge && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Distance ({breakdown.actualDistance?.toFixed(1) || 'N/A'} km à {breakdown.pricePerKm || 'N/A'}€/km)
                          </span>
                          <span>{breakdown.distanceCharge.toFixed(2)}€</span>
                        </div>
                      )}
                      {breakdown.roundTrip && (
                        <div className="flex justify-between text-primary">
                          <span>Aller-retour</span>
                          <span>x2</span>
                        </div>
                      )}
                      {breakdown.minimumCourse && (
                        <div className="flex justify-between text-purple-600">
                          <span>Course minimum appliquée</span>
                          <span>{vehicle.id === 'van' ? '25€' : '20€'}</span>
                        </div>
                      )}
                      <div className="border-t pt-2 flex justify-between font-medium">
                        <span>Prix de base (sans frais d'approche)</span>
                        <span>{estimate.basePrice?.toFixed(2) || '0.00'}€</span>
                      </div>
                      <div className="flex justify-between text-blue-600">
                        <span className="flex items-center">
                          <FontAwesomeIcon icon={faFlag} className="mr-2" />
                          Frais d'approche ({breakdown.conditions?.timeOfDay})
                        </span>
                        <span>{breakdown.approachFee}€</span>
                      </div>
                      <div className="font-semibold text-lg border-t pt-2">
                        <div className="flex justify-between">
                          <span>Fourchette finale</span>
                          <span className="text-primary">{formatPriceRange(priceRange.min, priceRange.max)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Informations sur les conditions tarifaires */}
                  {breakdown.conditions && (
                    <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                      <h5 className="font-medium text-gray-700 mb-3">Conditions tarifaires</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faClock} className="text-primary mr-2" />
                          <span>
                            <strong>Horaire :</strong> {breakdown.conditions.timeOfDay || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-primary mr-2" />
                          <span>
                            <strong>Jour :</strong> {breakdown.conditions.dayType || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faRoute} className="text-primary mr-2" />
                          <span>
                            <strong>Retour :</strong> {breakdown.conditions.returnType || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
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
                    
                    {vehicle.id === 'berline' && (
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
                      className="w-full py-3 px-6 bg-primary text-white font-medium rounded-md hover:bg-primary-dark hover:text-white transition-colors duration-300"
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