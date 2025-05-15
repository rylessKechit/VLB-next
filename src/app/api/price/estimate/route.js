// src/app/api/price/estimate/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const data = await request.json();
    const { 
      pickupPlaceId, 
      dropoffPlaceId, 
      pickupDateTime, 
      passengers, 
      luggage, 
      roundTrip,
      returnDateTime
    } = data;

    // Validation des données
    if (!pickupPlaceId || !dropoffPlaceId || !pickupDateTime) {
      return NextResponse.json(
        { error: 'Données manquantes pour l\'estimation' },
        { status: 400 }
      );
    }

    console.log('Calcul du prix pour:', { pickupPlaceId, dropoffPlaceId, roundTrip });

    // Obtenir la distance et le temps de trajet réels via l'API Google Maps
    const distanceResult = await getDistanceMatrix(pickupPlaceId, dropoffPlaceId);
    
    if (!distanceResult.success) {
      console.error('Impossible de calculer la distance:', distanceResult.error);
      
      // FALLBACK : Utiliser une estimation basique si l'API Google Maps échoue
      console.log('Utilisation du mode fallback pour l\'estimation');
      
      // Estimation approximative basée sur des distances communes
      const estimatedDistance = 20; // 20 km par défaut
      const estimatedDuration = 1800; // 30 minutes par défaut
      
      return NextResponse.json({
        success: true,
        data: {
          estimate: {
            exactPrice: calculatePriceFromDistance(estimatedDistance, pickupDateTime, roundTrip),
            minPrice: calculatePriceFromDistance(estimatedDistance * 0.8, pickupDateTime, roundTrip),
            maxPrice: calculatePriceFromDistance(estimatedDistance * 1.2, pickupDateTime, roundTrip),
            currency: 'EUR',
            selectedRate: determineRate(pickupDateTime, roundTrip),
            rateName: getTariffName(determineRate(pickupDateTime, roundTrip)),
            breakdown: createBreakdown(estimatedDistance, pickupDateTime, roundTrip),
            distanceInfo: {
              value: estimatedDistance * 1000,
              text: `${estimatedDistance} km (estimation)`,
            },
            durationInfo: {
              value: estimatedDuration,
              text: `${Math.round(estimatedDuration / 60)} min (estimation)`,
            },
            details: {
              distanceInKm: estimatedDistance,
              durationInMinutes: Math.round(estimatedDuration / 60),
              formattedDistance: `${estimatedDistance} km (estimation)`,
              formattedDuration: `${Math.round(estimatedDuration / 60)} min (estimation)`,
              polyline: null,
              isEstimated: true // Flag pour indiquer que c'est une estimation
            }
          },
          route: {
            distance: {
              value: estimatedDistance * 1000,
              text: `${estimatedDistance} km (estimation)`,
            },
            duration: {
              value: estimatedDuration,
              text: `${Math.round(estimatedDuration / 60)} min (estimation)`,
            },
            polyline: null,
            isEstimated: true
          }
        }
      });
    }

    // Continuer avec le calcul normal si l'API fonctionne
    const { distanceInMeters, durationInSeconds, distanceText, durationText } = distanceResult;
    const distanceInKm = distanceInMeters / 1000;
    const durationInMinutes = Math.round(durationInSeconds / 60);

    console.log(`Distance calculée: ${distanceInKm}km, Durée: ${durationInMinutes}min`);

    // Calculer le prix selon le nouveau système tarifaire
    const priceCalculation = calculatePrice(distanceInKm, pickupDateTime, roundTrip);
    
    // Obtenir le polyline pour la carte (optionnel)
    const polyline = await getRoutePolyline(pickupPlaceId, dropoffPlaceId);

    const estimate = {
      exactPrice: priceCalculation.total,
      minPrice: priceCalculation.total,
      maxPrice: priceCalculation.total,
      currency: 'EUR',
      selectedRate: priceCalculation.selectedRate,
      rateName: getTariffName(priceCalculation.selectedRate),
      breakdown: priceCalculation.breakdown,
      distanceInfo: {
        value: distanceInMeters,
        text: distanceText,
      },
      durationInfo: {
        value: durationInSeconds,
        text: durationText,
      },
      details: {
        distanceInKm,
        durationInMinutes,
        formattedDistance: distanceText,
        formattedDuration: durationText,
        polyline,
        isEstimated: false
      }
    };

    return NextResponse.json({
      success: true,
      data: {
        estimate,
        route: {
          distance: {
            value: distanceInMeters,
            text: distanceText,
          },
          duration: {
            value: durationInSeconds,
            text: durationText,
          },
          polyline,
          isEstimated: false
        }
      }
    });
    
  } catch (error) {
    console.error('Erreur lors du calcul du prix:', error);
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du calcul du prix.' },
      { status: 500 }
    );
  }
}

// Système tarifaire VLB
const TAXI_RATES = {
  baseFare: 2.60, // Prise en charge
  rates: {
    A: { pricePerKm: 1.00, description: 'Jour avec retour en charge' },
    B: { pricePerKm: 1.50, description: 'Nuit/weekend avec retour en charge' },
    C: { pricePerKm: 2.00, description: 'Jour avec retour à vide' },
    D: { pricePerKm: 3.00, description: 'Nuit/weekend avec retour à vide' }
  }
};

// Déterminer le tarif applicable
function determineRate(pickupDateTime, roundTrip) {
  const pickupDate = new Date(pickupDateTime);
  const hour = pickupDate.getHours();
  const dayOfWeek = pickupDate.getDay();
  
  // Vérification des conditions
  const isNightTime = hour >= 19 || hour < 8;
  const isWeekendOrHoliday = dayOfWeek === 0; // Dimanche
  
  // Logique de détermination du tarif
  if (roundTrip) {
    // Aller-retour = retour en charge
    return (isNightTime || isWeekendOrHoliday) ? 'B' : 'A';
  } else {
    // Aller simple = retour à vide
    return (isNightTime || isWeekendOrHoliday) ? 'D' : 'C';
  }
}

// Calculer le prix total
function calculatePrice(distanceInKm, pickupDateTime, roundTrip) {
  const selectedRate = determineRate(pickupDateTime, roundTrip);
  const rateConfig = TAXI_RATES.rates[selectedRate];
  
  // Calculs
  const baseFare = TAXI_RATES.baseFare;
  const distanceCharge = distanceInKm * rateConfig.pricePerKm;
  let total = baseFare + distanceCharge;
  
  // Si aller-retour, multiplier par 2
  if (roundTrip) {
    total *= 2;
  }
  
  // Arrondir à 2 décimales
  total = Math.round(total * 100) / 100;
  
  const pickupDate = new Date(pickupDateTime);
  const hour = pickupDate.getHours();
  const dayOfWeek = pickupDate.getDay();
  const isNightTime = hour >= 19 || hour < 8;
  const isWeekendOrHoliday = dayOfWeek === 0;
  
  return {
    total,
    selectedRate,
    breakdown: {
      baseFare,
      distanceCharge: roundTrip ? distanceCharge * 2 : distanceCharge,
      pricePerKm: rateConfig.pricePerKm,
      actualDistance: distanceInKm,
      isNightTime,
      isWeekendOrHoliday,
      roundTrip,
      selectedTariff: selectedRate,
      conditions: {
        timeOfDay: isNightTime ? 'nuit' : 'jour',
        dayType: isWeekendOrHoliday ? 'weekend/férié' : 'semaine',
        returnType: roundTrip ? 'en charge' : 'à vide'
      }
    }
  };
}

// Obtenir le nom du tarif
function getTariffName(rate) {
  const names = {
    'A': 'Tarif A - Jour avec retour en charge',
    'B': 'Tarif B - Nuit/weekend avec retour en charge',
    'C': 'Tarif C - Jour avec retour à vide',
    'D': 'Tarif D - Nuit/weekend avec retour à vide'
  };
  return names[rate] || 'Tarif standard';
}

// Fonctions helper pour le fallback
function calculatePriceFromDistance(distanceInKm, pickupDateTime, roundTrip) {
  const selectedRate = determineRate(pickupDateTime, roundTrip);
  const rateConfig = TAXI_RATES.rates[selectedRate];
  
  let totalPrice = TAXI_RATES.baseFare;
  totalPrice += distanceInKm * rateConfig.pricePerKm;
  
  if (roundTrip) {
    totalPrice *= 2;
  }
  
  return Math.round(totalPrice * 100) / 100;
}

function createBreakdown(distanceInKm, pickupDateTime, roundTrip) {
  const selectedRate = determineRate(pickupDateTime, roundTrip);
  const rateConfig = TAXI_RATES.rates[selectedRate];
  const pickupDate = new Date(pickupDateTime);
  const hour = pickupDate.getHours();
  const dayOfWeek = pickupDate.getDay();
  
  const isNightTime = hour >= 19 || hour < 8;
  const isWeekendOrHoliday = dayOfWeek === 0;
  
  return {
    baseFare: TAXI_RATES.baseFare,
    distanceCharge: Math.round(distanceInKm * rateConfig.pricePerKm * (roundTrip ? 2 : 1) * 100) / 100,
    actualDistance: distanceInKm,
    pricePerKm: rateConfig.pricePerKm,
    isNightTime,
    isWeekendOrHoliday,
    roundTrip,
    selectedTariff: selectedRate,
    conditions: {
      timeOfDay: isNightTime ? 'nuit' : 'jour',
      dayType: isWeekendOrHoliday ? 'weekend/férié' : 'semaine',
      returnType: roundTrip ? 'en charge' : 'à vide'
    }
  };
}

// Fonction pour obtenir la distance et le temps de trajet via l'API Google Maps
async function getDistanceMatrix(originPlaceId, destinationPlaceId) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    console.log('API Key exists:', !!apiKey);
    
    if (!apiKey) {
      console.error('ERREUR CRITIQUE: Clé API Google Maps non définie');
      return { success: false, error: 'Clé API Google Maps manquante' };
    }
    
    // URL avec gestion des caractères spéciaux
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:${encodeURIComponent(originPlaceId)}&destinations=place_id:${encodeURIComponent(destinationPlaceId)}&mode=driving&language=fr&key=${apiKey}`;
    
    console.log('Appel API Distance Matrix...');
    
    const response = await axios.get(url, {
      timeout: 10000, // Timeout de 10 secondes
      headers: {
        'Accept': 'application/json',
      }
    });
    
    const data = response.data;
    console.log('Réponse Distance Matrix Status:', data.status);
    
    if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
      const element = data.rows[0].elements[0];
      
      return {
        success: true,
        distanceInMeters: element.distance.value,
        durationInSeconds: element.duration.value,
        distanceText: element.distance.text,
        durationText: element.duration.text
      };
    } else {
      // Gestion spécifique des différentes erreurs
      const errorStatus = data.rows[0]?.elements[0]?.status;
      console.error('Erreur API Distance Matrix - Status global:', data.status);
      console.error('Erreur API Distance Matrix - Status élément:', errorStatus);
      
      // Messages d'erreur plus explicites
      let errorMessage = 'Impossible de calculer l\'itinéraire';
      
      switch(errorStatus) {
        case 'NOT_FOUND':
          errorMessage = 'Une des adresses n\'a pas pu être trouvée';
          break;
        case 'ZERO_RESULTS':
          errorMessage = 'Aucun itinéraire trouvé entre ces deux points';
          break;
        case 'MAX_ROUTE_LENGTH_EXCEEDED':
          errorMessage = 'L\'itinéraire demandé est trop long';
          break;
        default:
          if (data.status === 'REQUEST_DENIED') {
            errorMessage = 'Accès refusé à l\'API Google Maps. Vérifiez votre clé API.';
          } else if (data.status === 'OVER_QUERY_LIMIT') {
            errorMessage = 'Quota de l\'API dépassé. Veuillez réessayer plus tard.';
          }
      }
      
      return { 
        success: false, 
        error: errorMessage,
        errorDetails: data.error_message || data.status 
      };
    }
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API Distance Matrix:', error);
    
    return { 
      success: false, 
      error: error.response?.data?.error_message || error.message || 'Erreur de connexion à l\'API' 
    };
  }
}

// Fonction pour obtenir le polyline
async function getRoutePolyline(originPlaceId, destinationPlaceId) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${originPlaceId}&destination=place_id:${destinationPlaceId}&mode=driving&key=${apiKey}`;
    
    const response = await axios.get(url);
    const data = response.data;
    
    if (data.status === 'OK' && data.routes.length > 0) {
      return data.routes[0].overview_polyline.points;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API Directions:', error);
    return null;
  }
}