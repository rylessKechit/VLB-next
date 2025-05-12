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
      returnDateTime,
      vehicleType  // green, berline, van
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
    
    // CORRECTION : Mapper les bons types de véhicules
    const VEHICLE_PRICING = {
      green: {
        baseFare: 5.0,          
        pricePerKm: 2.30,       
        minDistanceKm: 0,       
        name: 'Tesla Model 3',
        category: 'Éco'
      },
      berline: {                // ✅ Corrigé de 'premium' à 'berline'
        baseFare: 5.0,          
        pricePerKm: 1.5,        
        minDistanceKm: 0,       
        name: 'Mercedes Classe E',
        category: 'Berline'     // ✅ Corrigé
      },
      van: {
        baseFare: 10.0,         
        pricePerKm: 2.0,        
        minDistanceKm: 0,       
        name: 'Mercedes Classe V',
        category: 'Van'
      }
    };
    
    // ✅ Utiliser 'berline' par défaut au lieu de 'premium'
    const selectedVehicle = vehicleType && VEHICLE_PRICING[vehicleType] 
      ? vehicleType 
      : 'berline';
    
    const vehicleConfig = VEHICLE_PRICING[selectedVehicle];
    
    // Calcul du prix de base
    let totalPrice = vehicleConfig.baseFare;
    
    // Calcul de la distance facturable
    const chargeableDistance = Math.max(distanceInKm, vehicleConfig.minDistanceKm);
    const distancePrice = chargeableDistance * vehicleConfig.pricePerKm;
    totalPrice += distancePrice;
    
    // Vérifier si c'est la nuit ou le weekend
    const pickupDate = new Date(pickupDateTime);
    const hour = pickupDate.getHours();
    const dayOfWeek = pickupDate.getDay();
    
    // Tarif de nuit (entre 19h et 7h)
    const isNightRate = hour >= 19 || hour < 7;
    
    // Tarif weekend (samedi et dimanche)
    const isWeekendRate = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Appliquer majorations si nécessaire
    let nightWeekendMultiplier = 1;
    if (isNightRate) {
      nightWeekendMultiplier *= 1.15; // 15% de plus la nuit
    }
    if (isWeekendRate) {
      nightWeekendMultiplier *= 1.1; // 10% de plus le weekend
    }
    
    totalPrice *= nightWeekendMultiplier;
    
    // Appliquer la réduction pour aller-retour (15% de réduction)
    if (roundTrip) {
      totalPrice *= 2 * 0.85; // x2 pour l'aller-retour, puis réduction de 15%
    }
    
    // Arrondir à 2 décimales
    totalPrice = Math.round(totalPrice * 100) / 100;
    
    // Calculer min et max estimates (±5%)
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
          vehicleType: selectedVehicle,
          vehicleName: vehicleConfig.name,
          vehicleCategory: vehicleConfig.category,
          breakdown: {
            baseFare: vehicleConfig.baseFare,
            distanceCharge: Math.round(distancePrice * 100) / 100,
            actualDistance: distanceInKm,
            chargeableDistance: chargeableDistance,
            pricePerKm: vehicleConfig.pricePerKm,
            nightRateApplied: isNightRate,
            weekendRateApplied: isWeekendRate,
            roundTrip: roundTrip,
            roundTripDiscountApplied: roundTrip,
            nightWeekendMultiplier: nightWeekendMultiplier
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
            chargeableDistanceInKm: chargeableDistance,
            durationInMinutes: Math.round(durationInSeconds / 60),
            formattedDistance: distanceText,
            formattedDuration: durationText,
            polyline: polyline // ✅ Ajouté le polyline dans details
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
    console.log(`Prix calculé pour ${vehicleConfig.name}: ${totalPrice}€`);
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