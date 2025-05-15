// src/app/api/bookings/route.js - Version corrigée

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { getServerSession } from 'next-auth';
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
      vehicleType,
      pickupAddressPlaceId,
      dropoffAddressPlaceId,
      // Nouvelles données du système tarifaire
      tariffApplied,
      routeDetails
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

    // Vérifier que les informations du tarif sont présentes
    if (!tariffApplied || !price || !price.breakdown) {
      return NextResponse.json({ error: 'Informations tarifaires manquantes' }, { status: 400 });
    }

    // Générer un ID de réservation
    const bookingId = 'BK' + Math.floor(Math.random() * 10000);
    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
    let returnDateTime = null;
    
    if (roundTrip && returnDate && returnTime) {
      returnDateTime = new Date(`${returnDate}T${returnTime}`);
    }

    // Créer un nouvel objet de réservation pour MongoDB avec le nouveau système tarifaire
    const newBooking = new Booking({
      bookingId,
      status: 'confirmed',
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
      price: {
        amount: price.amount,
        currency: price.currency,
        tariffApplied: tariffApplied,
        tariffName: price.breakdown.selectedTariff || tariffApplied,
        breakdown: {
          baseFare: price.breakdown.baseFare,
          distanceCharge: price.breakdown.distanceCharge,
          pricePerKm: price.breakdown.pricePerKm,
          actualDistance: price.breakdown.actualDistance,
          isNightTime: price.breakdown.isNightTime,
          isWeekendOrHoliday: price.breakdown.isWeekendOrHoliday,
          conditions: price.breakdown.conditions,
        },
      },
      customerInfo,
      vehicleType,
      pickupAddressPlaceId,
      dropoffAddressPlaceId,
      routeDetails: routeDetails || null,
    });

    // Sauvegarder dans la base de données
    await newBooking.save();
    console.log('Réservation enregistrée avec l\'ID:', bookingId);

    // Fonction d'envoi d'email avec la méthode correcte
    const sendEmails = async () => {
      try {
        // Configuration de Nodemailer avec la méthode correcte
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.EMAIL_PORT || '587'),
          secure: process.env.EMAIL_SECURE === 'true',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        // Obtenir le nom du tarif pour l'email
        const tariffNames = {
          'A': 'Jour avec retour en charge',
          'B': 'Nuit/weekend avec retour en charge',
          'C': 'Jour avec retour à vide',
          'D': 'Nuit/weekend avec retour à vide'
        };
        const tariffName = tariffNames[tariffApplied] || 'Tarif standard';

        // Email pour le propriétaire du site avec les détails du tarif
        const mailOptions = {
          from: `"Taxi VLB Réservation" <${process.env.EMAIL_USER}>`,
          to: process.env.CONTACT_EMAIL || 'contact@taxivlb.com',
          subject: `Nouvelle réservation Taxi VLB [${bookingId}] - Tarif ${tariffApplied}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
              <div style="text-align: center; margin-bottom: 20px; background-color: #2a5a9e; padding: 20px; border-radius: 10px 10px 0 0;">
                <img src="https://www.taxi-verrieres-le-buisson.com/images/logo.webp" alt="Taxi VLB" style="max-width: 150px; height: auto;" />
              </div>
              
              <h1 style="color: #d4af37; text-align: center;">Nouvelle réservation</h1>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h2 style="color: #2a5a9e; margin-top: 0;">Détails de la course</h2>
                <p><strong>Référence:</strong> ${bookingId}</p>
                <p><strong>Client:</strong> ${customerInfo.name}</p>
                <p><strong>Téléphone:</strong> ${customerInfo.phone}</p>
                <p><strong>Email:</strong> ${customerInfo.email}</p>
              </div>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h2 style="color: #2a5a9e; margin-top: 0;">Itinéraire</h2>
                <p><strong>Départ:</strong> ${pickupAddress}</p>
                <p><strong>Destination:</strong> ${dropoffAddress}</p>
                <p><strong>Date:</strong> ${pickupDateTime.toLocaleDateString('fr-FR')}</p>
                <p><strong>Heure:</strong> ${pickupDateTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                <p><strong>Passagers:</strong> ${passengers}</p>
                <p><strong>Bagages:</strong> ${luggage}</p>
                ${roundTrip ? `<p><strong>Retour:</strong> ${returnDateTime.toLocaleDateString('fr-FR')} à ${returnDateTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>` : ''}
              </div>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h2 style="color: #2a5a9e; margin-top: 0;">Tarification</h2>
                <p><strong>Tarif appliqué:</strong> ${tariffApplied} - ${tariffName}</p>
                <p><strong>Conditions:</strong> ${price.breakdown.conditions.timeOfDay}, ${price.breakdown.conditions.dayType}, retour ${price.breakdown.conditions.returnType}</p>
                <p><strong>Prise en charge:</strong> ${price.breakdown.baseFare.toFixed(2)}€</p>
                <p><strong>Distance:</strong> ${price.breakdown.actualDistance?.toFixed(1)}km à ${price.breakdown.pricePerKm}€/km = ${price.breakdown.distanceCharge?.toFixed(2)}€</p>
                ${roundTrip ? '<p><strong>Aller-retour:</strong> x2</p>' : ''}
                <p style="font-size: 18px; margin-top: 10px;"><strong>Prix total: ${price.amount.toFixed(2)}€</strong></p>
              </div>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h2 style="color: #2a5a9e; margin-top: 0;">Véhicule</h2>
                <p><strong>Type de véhicule:</strong> ${vehicleType === 'green' ? 'Tesla Model 3' : vehicleType === 'berline' ? 'Mercedes Classe E' : 'Mercedes Classe V'}</p>
                ${flightNumber ? `<p><strong>Numéro de vol:</strong> ${flightNumber}</p>` : ''}
                ${trainNumber ? `<p><strong>Numéro de train:</strong> ${trainNumber}</p>` : ''}
                ${specialRequests ? `<p><strong>Demandes spéciales:</strong> ${specialRequests}</p>` : ''}
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
                <p>Réservation effectuée depuis www.taxi-verrieres-le-buisson.com</p>
              </div>
            </div>
          `,
        };

        // Envoyer l'email
        await transporter.sendMail(mailOptions);

        // Email de confirmation pour le client avec les détails du tarif
        const customerMailOptions = {
          from: `"Taxi VLB" <${process.env.EMAIL_USER}>`,
          to: customerInfo.email,
          subject: `Confirmation de réservation Taxi VLB [${bookingId}]`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
              <div style="text-align: center; margin-bottom: 20px; background-color: #2a5a9e; padding: 20px; border-radius: 10px 10px 0 0;">
                <img src="https://www.taxi-verrieres-le-buisson.com/images/logo.webp" alt="Taxi VLB" style="max-width: 150px; height: auto;" />
              </div>
              
              <h1 style="color: #d4af37; text-align: center;">Réservation confirmée</h1>
              
              <p>Bonjour ${customerInfo.name},</p>
              
              <p>Nous avons bien reçu votre demande de réservation. Votre course est confirmée et notre chauffeur vous contactera prochainement.</p>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h2 style="color: #2a5a9e; margin-top: 0;">Résumé de votre réservation</h2>
                <p><strong>Référence:</strong> ${bookingId}</p>
                <p><strong>Départ:</strong> ${pickupAddress}</p>
                <p><strong>Destination:</strong> ${dropoffAddress}</p>
                <p><strong>Date et heure:</strong> ${pickupDateTime.toLocaleDateString('fr-FR')} à ${pickupDateTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                <p><strong>Passagers:</strong> ${passengers}</p>
                <p><strong>Véhicule:</strong> ${vehicleType === 'green' ? 'Tesla Model 3' : vehicleType === 'berline' ? 'Mercedes Classe E' : 'Mercedes Classe V'}</p>
                <p style="font-size: 18px; margin-top: 10px;"><strong>Prix total: ${price.amount.toFixed(2)}€</strong></p>
                <p style="font-size: 14px; color: #666;">(Tarif ${tariffApplied} - ${tariffName})</p>
              </div>
              
              <p style="background-color: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 15px 0;">
                Notre chauffeur vous contactera environ 15 minutes avant votre prise en charge.
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
                <p>Merci de votre confiance,</p>
                <p><strong>L'équipe Taxi VLB</strong></p>
                <p>📞 +33 6 00 00 00 00</p>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(customerMailOptions);
        console.log('Emails envoyés avec succès');
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi des emails:', emailError);
        // Ne pas faire échouer la réservation même si l'email échoue
      }
    };

    // Envoyer les emails de manière asynchrone
    sendEmails();

    // Données de réservation à retourner au client
    const bookingResult = {
      id: bookingId,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
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
      price: {
        amount: price.amount,
        currency: price.currency,
        tariffApplied,
        tariffName: price.breakdown.selectedTariff || tariffApplied,
        breakdown: price.breakdown,
      },
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone
      },
      vehicleType,
      routeDetails
    };

    return NextResponse.json({
      success: true,
      data: bookingResult,
      message: `Votre réservation a été confirmée avec le tarif ${tariffApplied}. Vous recevrez prochainement les coordonnées de votre chauffeur.`
    });

  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création de la réservation.' },
      { status: 500 }
    );
  }
}