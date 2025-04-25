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
    
    // Paramètres de base pour le calcul
    const BASE_FARE = 5.0;
    const PRICE_PER_KM = 1.5;
    const PRICE_PER_MINUTE = 0.5;
    const LUGGAGE_PRICE = 2.0;
    const ROUND_TRIP_DISCOUNT = 0.9;
    
    // Calcul du prix
    const distancePrice = distanceInKm * PRICE_PER_KM;
    const timePrice = (durationInSeconds / 60) * PRICE_PER_MINUTE;
    let totalPrice = BASE_FARE + distancePrice + timePrice;
    
    // Ajout du prix pour les bagages
    if (luggage > 0) {
      totalPrice += luggage * LUGGAGE_PRICE;
    }
    
    // Vérifier si c'est la nuit ou le weekend
    const pickupDate = new Date(pickupDateTime);
    const hour = pickupDate.getHours();
    const dayOfWeek = pickupDate.getDay();
    
    // Tarif de nuit (entre 22h et 6h)
    const isNightRate = hour >= 22 || hour < 6;
    if (isNightRate) {
      totalPrice *= 1.3; // 30% de plus
    }
    
    // Tarif weekend (samedi et dimanche)
    const isWeekendRate = dayOfWeek === 0 || dayOfWeek === 6;
    if (isWeekendRate) {
      totalPrice *= 1.2; // 20% de plus
    }
    
    // Appliquer la réduction pour aller-retour
    if (roundTrip) {
      totalPrice *= 2 * ROUND_TRIP_DISCOUNT; // Multiplier par 2 pour l'aller-retour, puis appliquer la réduction
    }
    
    // Arrondir à 2 décimales
    totalPrice = Math.round(totalPrice * 100) / 100;
    
    // Calculer min et max estimates (±10%)
    const minPrice = Math.round((totalPrice * 0.9) * 100) / 100;
    const maxPrice = Math.round((totalPrice * 1.1) * 100) / 100;

    // Obtenir le polyline pour la visualisation du trajet (optionnel)
    const polyline = await getRoutePolyline(pickupPlaceId, dropoffPlaceId);

    return NextResponse.json({
      success: true,
      data: {
        estimate: {
          exactPrice: totalPrice,
          minPrice,
          maxPrice,
          currency: 'EUR',
          breakdown: {
            baseFare: BASE_FARE,
            distanceCharge: Math.round(distancePrice * 100) / 100,
            timeCharge: Math.round(timePrice * 100) / 100,
            luggageCharge: luggage > 0 ? Math.round((luggage * LUGGAGE_PRICE) * 100) / 100 : 0,
            nightRate: isNightRate,
            weekendRate: isWeekendRate,
            roundTripDiscount: roundTrip,
          },
          distanceInfo: {
            value: distanceInMeters,
            text: distanceText,
          },
          durationInfo: {
            value: durationInSeconds,
            text: durationText,
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
    });
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
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    // Vérifiez si la clé API est définie
    if (!apiKey) {
      console.error('Clé API Google Maps non définie');
      return { success: false };
    }
    
    // URL avec encodage correct
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:${encodeURIComponent(originPlaceId)}&destinations=place_id:${encodeURIComponent(destinationPlaceId)}&mode=driving&language=fr&key=${apiKey}`;
    
    // Utiliser le serveur backend pour faire la requête (éviter les CORS et protéger la clé)
    const response = await axios.get(url);
    const data = response.data;
    
    console.log('Réponse Distance Matrix API:', data);
    
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

// Fonction pour obtenir le polyline (facultatif)
async function getRoutePolyline(originPlaceId, destinationPlaceId) {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
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