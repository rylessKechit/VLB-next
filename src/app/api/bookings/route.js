// src/app/api/bookings/route.js - Version corrigée

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { getServerSession } from 'next-auth';  // Importation correcte
import { authOptions } from '@/lib/auth';
import nodemailer from 'nodemailer';

// Récupérer toutes les réservations - utilisé par le tableau de bord admin
export async function GET(request) {
  try {
    await dbConnect();
    
    console.log("Requête reçue pour obtenir toutes les réservations");
    
    // Vérifiez si l'utilisateur est authentifié (pour l'admin dashboard)
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');
    
    console.log("Paramètres de recherche:", { status, startDate, endDate, search, limit, skip });
    
    // Construire le filtre de recherche
    const query = {};
    
    // Filtrer par statut
    if (status) {
      query.status = status;
    }
    
    // Filtrer par date
    if (startDate || endDate) {
      query.pickupDateTime = {};
      
      if (startDate) {
        query.pickupDateTime.$gte = new Date(startDate);
      }
      
      if (endDate) {
        query.pickupDateTime.$lte = new Date(endDate);
      }
    }
    
    // Recherche par texte
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { 'customerInfo.name': searchRegex },
        { 'customerInfo.email': searchRegex },
        { 'customerInfo.phone': searchRegex },
        { pickupAddress: searchRegex },
        { dropoffAddress: searchRegex },
        { bookingId: searchRegex },
        { flightNumber: searchRegex },
        { trainNumber: searchRegex }
      ];
    }
    
    console.log("Requête MongoDB:", JSON.stringify(query));
    
    try {
      // Récupérer les réservations
      const bookings = await Booking.find(query)
        .sort({ pickupDateTime: 1 })
        .skip(skip)
        .limit(limit);
      
      console.log(`Nombre de réservations trouvées: ${bookings.length}`);
      
      // Compter le nombre total de réservations correspondant au filtre
      const total = await Booking.countDocuments(query);
      
      return NextResponse.json({
        success: true,
        data: bookings,
        meta: {
          total,
          limit,
          skip
        }
      });
    } catch (dbError) {
      console.error("Erreur lors de la requête MongoDB:", dbError);
      throw dbError;
    }
    
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des réservations.' },
      { status: 500 }
    );
  }
}

// Route POST pour créer une nouvelle réservation
export async function POST(request) {
  try {
    // Connecter à la base de données
    await dbConnect();
    
    // Récupérer les données de la requête
    const data = await request.json();
    console.log('Données reçues dans l\'API:', data);
    
    // Extraire les données
    const {
      pickupAddress,
      dropoffAddress,
      pickupDate,
      pickupTime,
      passengers,
      luggage,
      roundTrip,
      returnDate,
      returnTime,
      flightNumber,
      trainNumber,
      specialRequests,
      customerInfo,
      price,
      pickupAddressPlaceId,
      dropoffAddressPlaceId
    } = data;

    // Validation des données
    if (!pickupAddress) {
      return NextResponse.json({ error: 'Adresse de départ manquante' }, { status: 400 });
    }
    
    if (!dropoffAddress) {
      return NextResponse.json({ error: 'Adresse d\'arrivée manquante' }, { status: 400 });
    }
    
    if (!pickupDate || !pickupTime) {
      return NextResponse.json({ error: 'Date ou heure de départ manquante' }, { status: 400 });
    }
    
    if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      return NextResponse.json({ error: 'Informations client incomplètes' }, { status: 400 });
    }

    // Générer un ID de réservation
    const bookingId = 'BK' + Math.floor(Math.random() * 10000);
    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
    let returnDateTime = null;
    
    if (roundTrip && returnDate && returnTime) {
      returnDateTime = new Date(`${returnDate}T${returnTime}`);
    }

    // Créer un nouvel objet de réservation pour MongoDB
    const newBooking = new Booking({
      bookingId,
      status: 'pending',
      pickupAddress,
      dropoffAddress,
      pickupDateTime,
      passengers,
      luggage,
      roundTrip,
      returnDateTime,
      flightNumber,
      trainNumber,
      specialRequests,
      price,
      customerInfo,
      pickupAddressPlaceId,
      dropoffAddressPlaceId
    });

    // Sauvegarder dans la base de données
    await newBooking.save();
    console.log('Réservation enregistrée avec l\'ID:', bookingId);

    // Configuration de Nodemailer et envoi des emails...
    // (code pour l'email omis pour plus de clarté)

    // Données de réservation à retourner au client
    const bookingResult = {
      id: bookingId,
      createdAt: new Date().toISOString(),
      status: 'pending',
      pickupAddress,
      dropoffAddress,
      pickupDateTime: pickupDateTime.toISOString(),
      passengers,
      luggage,
      roundTrip,
      returnDateTime: returnDateTime ? returnDateTime.toISOString() : null,
      flightNumber,
      trainNumber,
      specialRequests,
      price,
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone
      }
    };

    return NextResponse.json({
      success: true,
      data: bookingResult,
      message: 'Votre demande de réservation a été enregistrée. Vous recevrez un email de confirmation une fois validée.'
    });

  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création de la réservation.' },
      { status: 500 }
    );
  }
}