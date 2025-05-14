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
            rateName: 'Estimation approximative',
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

    // Continuer avec le code normal si l'API fonctionne
    const { distanceInMeters, durationInSeconds, distanceText, durationText } = distanceResult;
    const distanceInKm = distanceInMeters / 1000;
    
    // ... (rest of your existing code)
    
  } catch (error) {
    console.error('Erreur lors du calcul du prix:', error);
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du calcul du prix.' },
      { status: 500 }
    );
  }
}

// Fonctions helper pour le fallback
function calculatePriceFromDistance(distanceInKm, pickupDateTime, roundTrip) {
  const TAXI_RATES = {
    baseFare: 2.60,
    A: { pricePerKm: 1.00 },
    B: { pricePerKm: 1.50 },
    C: { pricePerKm: 2.00 },
    D: { pricePerKm: 3.00 }
  };
  
  const selectedRate = determineRate(pickupDateTime, roundTrip);
  const rateConfig = TAXI_RATES[selectedRate];
  
  let totalPrice = TAXI_RATES.baseFare;
  totalPrice += distanceInKm * rateConfig.pricePerKm;
  
  if (roundTrip) {
    totalPrice *= 2;
  }
  
  return Math.round(totalPrice * 100) / 100;
}

function determineRate(pickupDateTime, roundTrip) {
  const pickupDate = new Date(pickupDateTime);
  const hour = pickupDate.getHours();
  const dayOfWeek = pickupDate.getDay();
  
  const isNightTime = hour >= 19 || hour < 8;
  const isWeekendOrHoliday = dayOfWeek === 0;
  
  if (roundTrip) {
    return (isNightTime || isWeekendOrHoliday) ? 'B' : 'A';
  } else {
    return (isNightTime || isWeekendOrHoliday) ? 'D' : 'C';
  }
}

function createBreakdown(distanceInKm, pickupDateTime, roundTrip) {
  const TAXI_RATES = {
    baseFare: 2.60,
    A: { pricePerKm: 1.00 },
    B: { pricePerKm: 1.50 },
    C: { pricePerKm: 2.00 },
    D: { pricePerKm: 3.00 }
  };
  
  const selectedRate = determineRate(pickupDateTime, roundTrip);
  const rateConfig = TAXI_RATES[selectedRate];
  const pickupDate = new Date(pickupDateTime);
  const hour = pickupDate.getHours();
  const dayOfWeek = pickupDate.getDay();
  
  const isNightTime = hour >= 19 || hour < 8;
  const isWeekendOrHoliday = dayOfWeek === 0;
  
  return {
    baseFare: TAXI_RATES.baseFare,
    distanceCharge: Math.round(distanceInKm * rateConfig.pricePerKm * 100) / 100,
    actualDistance: distanceInKm,
    pricePerKm: rateConfig.pricePerKm,
    isNightTime,
    isWeekendOrHoliday,
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
    
    // Debug : Log pour vérifier que la clé API existe
    console.log('API Key exists:', !!apiKey);
    console.log('Origin PlaceId:', originPlaceId);
    console.log('Destination PlaceId:', destinationPlaceId);
    
    if (!apiKey) {
      console.error('ERREUR CRITIQUE: Clé API Google Maps non définie');
      throw new Error('Clé API Google Maps manquante');
    }
    
    // URL avec gestion des caractères spéciaux
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:${encodeURIComponent(originPlaceId)}&destinations=place_id:${encodeURIComponent(destinationPlaceId)}&mode=driving&language=fr&key=${apiKey}`;
    
    console.log('URL de l\'API Distance Matrix:', url);
    
    const response = await axios.get(url, {
      timeout: 10000, // Timeout de 10 secondes
      headers: {
        'Accept': 'application/json',
      }
    });
    
    console.log('Réponse Distance Matrix:', response.data);
    
    const data = response.data;
    
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
      console.error('Message d\'erreur:', data.error_message);
      
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
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    
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