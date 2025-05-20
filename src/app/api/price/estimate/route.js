// src/app/api/price/estimate/route.js - Version avec course minimum et frais d'approche
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
      
      // FALLBACK : Utiliser une estimation basique
      const estimatedDistance = 20; // 20 km par défaut
      const estimatedDuration = 1800; // 30 minutes par défaut
      
      const priceCalculation = calculatePrice(estimatedDistance, pickupDateTime, roundTrip);
      const priceRanges = calculatePriceRanges(priceCalculation.basePrice, priceCalculation.approachFee);
      
      return NextResponse.json({
        success: true,
        data: {
          estimate: {
            basePrice: priceCalculation.basePrice,
            approachFee: priceCalculation.approachFee,
            totalPrice: priceCalculation.total,
            priceRanges, // Nouveau : fourchettes pour chaque type de véhicule
            currency: 'EUR',
            selectedRate: priceCalculation.selectedRate,
            rateName: getTariffName(priceCalculation.selectedRate),
            breakdown: priceCalculation.breakdown,
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
              isEstimated: true
            }
          }
        }
      });
    }

    // Continuer avec le calcul normal si l'API fonctionne
    const { distanceInMeters, durationInSeconds, distanceText, durationText } = distanceResult;
    const distanceInKm = distanceInMeters / 1000;
    const durationInMinutes = Math.round(durationInSeconds / 60);

    // Calculer le prix de base selon le nouveau système tarifaire
    const priceCalculation = calculatePrice(distanceInKm, pickupDateTime, roundTrip);
    
    // Calculer les fourchettes pour chaque type de véhicule
    const priceRanges = calculatePriceRanges(priceCalculation.basePrice, priceCalculation.approachFee);
    
    // Obtenir le polyline pour la carte (optionnel)
    const polyline = await getRoutePolyline(pickupPlaceId, dropoffPlaceId);

    const estimate = {
      basePrice: priceCalculation.basePrice, // Prix de base sans frais d'approche
      approachFee: priceCalculation.approachFee, // Frais d'approche
      totalPrice: priceCalculation.total, // Prix de base + frais d'approche
      priceRanges, // Fourchettes pour chaque véhicule
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

function calculatePriceRanges(basePrice, approachFee) {
  // Course minimum de 20€ (y compris frais d'approche)
  const minimumTotal = 20;
  
  // Déterminer si le prix de base + frais d'approche est inférieur au minimum
  const priceWithApproach = basePrice + approachFee;
  const isMinimumApplied = priceWithApproach < minimumTotal;
  
  // Si le minimum s'applique, ajuster le prix de base pour que le total soit égal au minimum
  const effectiveBasePrice = isMinimumApplied ? minimumTotal - approachFee : basePrice;
  
  // Pour les véhicules standard (Tesla et Mercedes Classe E)
  // Fourchette : prix effectif → prix effectif + 5€
  const standardMin = effectiveBasePrice + approachFee;
  const standardMax = effectiveBasePrice + approachFee + 5;
  
  // Pour le VAN (Mercedes Classe V)
  // Supplément VAN = 10€
  const vanSupplementMin = 10;
  const vanSupplementMax = 15;
  const vanMin = effectiveBasePrice + approachFee + vanSupplementMin;
  const vanMax = effectiveBasePrice + approachFee + vanSupplementMax;
  
  return {
    standard: {
      min: standardMin,
      max: standardMax
    },
    van: {
      min: vanMin,
      max: vanMax
    }
  };
}

// Système tarifaire VLB (modifié avec frais d'approche)
const TAXI_RATES = {
  baseFare: 0, // Prise en charge
  rates: {
    A: { pricePerKm: 1.00, description: 'Jour avec retour en charge' },
    B: { pricePerKm: 1.50, description: 'Nuit/weekend avec retour en charge' },
    C: { pricePerKm: 2.00, description: 'Jour avec retour à vide' },
    D: { pricePerKm: 3.00, description: 'Nuit/weekend avec retour à vide' }
  },
  // NOUVEAUX : Frais d'approche
  approachFees: {
    day: 10,    // 10€ en journée
    night: 5   // 0€ de nuit
  }
};

// Déterminer les frais d'approche selon l'heure
function getApproachFee(pickupDateTime) {
  const pickupDate = new Date(pickupDateTime);
  const hour = pickupDate.getHours();
  const isNightTime = hour >= 19 || hour < 8;
  
  return isNightTime ? TAXI_RATES.approachFees.night : TAXI_RATES.approachFees.day;
}

// Déterminer le tarif applicable (inchangé)
function determineRate(pickupDateTime, roundTrip) {
  const pickupDate = new Date(pickupDateTime);
  const hour = pickupDate.getHours();
  const dayOfWeek = pickupDate.getDay();
  
  const isNightTime = hour >= 19 || hour < 8;
  const isWeekendOrHoliday = dayOfWeek === 0; // Dimanche
  
  if (roundTrip) {
    return (isNightTime || isWeekendOrHoliday) ? 'B' : 'A';
  } else {
    return (isNightTime || isWeekendOrHoliday) ? 'D' : 'C';
  }
}

// Calculer le prix total (modifié avec course minimum tout compris)
function calculatePrice(distanceInKm, pickupDateTime, roundTrip) {
  const selectedRate = determineRate(pickupDateTime, roundTrip);
  const rateConfig = TAXI_RATES.rates[selectedRate];
  
  // Calculs de base
  const baseFare = TAXI_RATES.baseFare;
  const distanceCharge = distanceInKm * rateConfig.pricePerKm;
  let basePrice = baseFare + distanceCharge;
  
  // Si aller-retour, multiplier par 2
  if (roundTrip) {
    basePrice *= 2;
  }
  
  // Ajouter les frais d'approche
  const approachFee = getApproachFee(pickupDateTime);
  
  // Vérifier si le prix total est supérieur au minimum
  const minimumTotal = 20; // 20€ minimum AVEC frais d'approche
  const totalPrice = basePrice + approachFee;
  
  // Si le prix total est inférieur au minimum, ajuster le prix de base
  let adjustedBasePrice = basePrice;
  if (totalPrice < minimumTotal) {
    adjustedBasePrice = minimumTotal - approachFee;
  }
  
  // Arrondir à 2 décimales
  const roundedBasePrice = Math.round(adjustedBasePrice * 100) / 100;
  const roundedTotal = Math.max(minimumTotal, Math.round(totalPrice * 100) / 100);
  
  const pickupDate = new Date(pickupDateTime);
  const hour = pickupDate.getHours();
  const dayOfWeek = pickupDate.getDay();
  const isNightTime = hour >= 19 || hour < 8;
  const isWeekendOrHoliday = dayOfWeek === 0;
  
  return {
    basePrice: roundedBasePrice,  // Prix sans frais d'approche (ajusté si nécessaire)
    approachFee: approachFee,     // Frais d'approche
    total: roundedTotal,          // Prix total (jamais inférieur à 20€)
    selectedRate,
    breakdown: {
      baseFare,
      distanceCharge: roundTrip ? distanceCharge * 2 : distanceCharge,
      pricePerKm: rateConfig.pricePerKm,
      actualDistance: distanceInKm,
      minimumCourse: totalPrice < minimumTotal ? minimumTotal : null, // Indique si le minimum a été appliqué
      minimumTotal: minimumTotal, // Le montant minimum avec frais d'approche
      approachFee: approachFee,
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

// Obtenir le nom du tarif (inchangé)
function getTariffName(rate) {
  const names = {
    'A': 'Tarif A - Jour avec retour en charge',
    'B': 'Tarif B - Nuit/weekend avec retour en charge',
    'C': 'Tarif C - Jour avec retour à vide',
    'D': 'Tarif D - Nuit/weekend avec retour à vide'
  };
  return names[rate] || 'Tarif standard';
}

// Fonction pour obtenir la distance et le temps de trajet via l'API Google Maps (inchangée)
async function getDistanceMatrix(originPlaceId, destinationPlaceId) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error('ERREUR CRITIQUE: Clé API Google Maps non définie');
      return { success: false, error: 'Clé API Google Maps manquante' };
    }
    
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:${encodeURIComponent(originPlaceId)}&destinations=place_id:${encodeURIComponent(destinationPlaceId)}&mode=driving&language=fr&key=${apiKey}`;
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
      }
    });
    
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
      const errorStatus = data.rows[0]?.elements[0]?.status;
      console.error('Erreur API Distance Matrix - Status global:', data.status);
      console.error('Erreur API Distance Matrix - Status élément:', errorStatus);
      
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

// Fonction pour obtenir le polyline (inchangée)
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