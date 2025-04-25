import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    const { 
      pickupPlaceId, 
      dropoffPlaceId, 
      pickupDateTime, 
      passengers, 
      luggage, 
      roundTrip 
    } = data;

    // Validation des données
    if (!pickupPlaceId || !dropoffPlaceId || !pickupDateTime) {
      return NextResponse.json(
        { error: 'Données manquantes pour l\'estimation' },
        { status: 400 }
      );
    }

    // Dans une implémentation réelle, vous feriez un appel à l'API Google Maps ici
    // et calculeriez le prix en fonction de la distance et du temps

    // Simulation d'un calcul de prix
    const distanceInMeters = Math.floor(Math.random() * 50000) + 5000; // 5-55 km
    const durationInSeconds = Math.floor(distanceInMeters / 13.9); // ~50 km/h en moyenne

    const distanceInKm = distanceInMeters / 1000;
    const durationInMinutes = durationInSeconds / 60;
    
    // Paramètres de base pour le calcul
    const BASE_FARE = 5.0;
    const PRICE_PER_KM = 1.5;
    const PRICE_PER_MINUTE = 0.5;
    const LUGGAGE_PRICE = 2.0;
    const ROUND_TRIP_DISCOUNT = 0.9;
    
    // Calcul du prix
    const distancePrice = distanceInKm * PRICE_PER_KM;
    const timePrice = durationInMinutes * PRICE_PER_MINUTE;
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
            text: `${Math.round(distanceInKm)} km`,
          },
          durationInfo: {
            value: durationInSeconds,
            text: `${Math.round(durationInMinutes)} mins`,
          }
        },
        route: {
          distance: {
            value: distanceInMeters,
            text: `${Math.round(distanceInKm)} km`,
          },
          duration: {
            value: durationInSeconds,
            text: `${Math.round(durationInMinutes)} mins`,
          },
          polyline: "encoded_polyline_placeholder" // À remplacer par une vraie polyline
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