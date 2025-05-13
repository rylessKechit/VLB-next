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
      return NextResponse.json(
        { error: 'Impossible de calculer la distance pour ce trajet' },
        { status: 400 }
      );
    }

    const { distanceInMeters, durationInSeconds, distanceText, durationText } = distanceResult;
    const distanceInKm = distanceInMeters / 1000;
    
    // NOUVEAU SYSTÈME TARIFAIRE
    const TAXI_RATES = {
      // Prise en charge fixe pour tous les tarifs
      baseFare: 2.60,
      
      // Tarifs kilométriques selon le type de course
      A: { pricePerKm: 1.00, name: 'Jour avec retour en charge' },      // Jour + retour en charge
      B: { pricePerKm: 1.50, name: 'Nuit/weekend avec retour en charge' }, // Nuit/weekend + retour en charge
      C: { pricePerKm: 2.00, name: 'Jour avec retour à vide' },         // Jour + retour à vide
      D: { pricePerKm: 3.00, name: 'Nuit/weekend avec retour à vide' }  // Nuit/weekend + retour à vide
    };
    
    // Déterminer la tarification selon la date/heure et le type de course
    const pickupDate = new Date(pickupDateTime);
    const hour = pickupDate.getHours();
    const dayOfWeek = pickupDate.getDay(); // 0 = Dimanche, 6 = Samedi
    
    // Vérifier si c'est la nuit (19h-8h)
    const isNightTime = hour >= 19 || hour < 8;
    
    // Vérifier si c'est dimanche ou férié (pour simplifier, on considère uniquement dimanche)
    const isWeekendOrHoliday = dayOfWeek === 0; // Dimanche
    
    // Déterminer le tarif à appliquer
    let selectedRate;
    if (roundTrip) {
      // Retour en charge (aller-retour)
      if (isNightTime || isWeekendOrHoliday) {
        selectedRate = 'B'; // Nuit/weekend avec retour en charge
      } else {
        selectedRate = 'A'; // Jour avec retour en charge
      }
    } else {
      // Retour à vide (aller simple)
      if (isNightTime || isWeekendOrHoliday) {
        selectedRate = 'D'; // Nuit/weekend avec retour à vide
      } else {
        selectedRate = 'C'; // Jour avec retour à vide
      }
    }
    
    const rateConfig = TAXI_RATES[selectedRate];
    
    // Calcul du prix
    let totalPrice = TAXI_RATES.baseFare;
    
    // Calcul du prix selon la distance
    const distancePrice = distanceInKm * rateConfig.pricePerKm;
    totalPrice += distancePrice;
    
    // Pour aller-retour, doubler le prix
    if (roundTrip) {
      totalPrice *= 2;
    }
    
    // Arrondir à 2 décimales
    totalPrice = Math.round(totalPrice * 100) / 100;
    
    // Calculer min et max estimates (±5% pour les variations de circulation)
    const minPrice = Math.round((totalPrice * 0.95) * 100) / 100;
    const maxPrice = Math.round((totalPrice * 1.05) * 100) / 100;

    // Obtenir le polyline pour la visualisation du trajet
    const polyline = await getRoutePolyline(pickupPlaceId, dropoffPlaceId);

    // Préparer la réponse détaillée
    const response = {
      success: true,
      data: {
        estimate: {
          exactPrice: totalPrice,
          minPrice,
          maxPrice,
          currency: 'EUR',
          selectedRate,
          rateName: rateConfig.name,
          breakdown: {
            baseFare: TAXI_RATES.baseFare,
            distanceCharge: Math.round(distancePrice * 100) / 100,
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
          },
          distanceInfo: {
            value: distanceInMeters,
            text: distanceText,
          },
          durationInfo: {
            value: durationInSeconds,
            text: durationText,
          },
          details: {
            distanceInKm: distanceInKm,
            durationInMinutes: Math.round(durationInSeconds / 60),
            formattedDistance: distanceText,
            formattedDuration: durationText,
            polyline: polyline
          }
        },
        route: {
          distance: {
            value: distanceInMeters,
            text: distanceText,
          },
          duration: {
            value: durationInSeconds,
            text: durationText,
          },
          polyline: polyline || "encoded_polyline_placeholder"
        }
      }
    };

    // Log pour debug
    console.log(`Tarif ${selectedRate} appliqué: ${totalPrice}€`);
    console.log(`Conditions: ${isNightTime ? 'Nuit' : 'Jour'}, ${isWeekendOrHoliday ? 'Weekend' : 'Semaine'}, ${roundTrip ? 'Aller-retour' : 'Aller simple'}`);
    console.log(`Distance: ${distanceInKm}km, Durée: ${Math.round(durationInSeconds / 60)}min`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors du calcul du prix:', error);
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du calcul du prix.' },
      { status: 500 }
    );
  }
}

// Fonction pour obtenir la distance et le temps de trajet via l'API Google Maps
async function getDistanceMatrix(originPlaceId, destinationPlaceId) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error('Clé API Google Maps non définie');
      return { success: false };
    }
    
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:${encodeURIComponent(originPlaceId)}&destinations=place_id:${encodeURIComponent(destinationPlaceId)}&mode=driving&language=fr&key=${apiKey}`;
    
    const response = await axios.get(url);
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
      console.error('Erreur API Distance Matrix:', data.status, data.error_message);
      return { success: false, errorDetails: data.error_message || data.status };
    }
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API Distance Matrix:', error);
    return { success: false };
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