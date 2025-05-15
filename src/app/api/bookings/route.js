// src/app/api/bookings/route.js - Version modifiée pour les fourchettes de prix

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
    
    // Construire le filtre de recherche
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.pickupDateTime = {};
      
      if (startDate) {
        query.pickupDateTime.$gte = new Date(startDate);
      }
      
      if (endDate) {
        query.pickupDateTime.$lte = new Date(endDate);
      }
    }
    
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
    
    try {
      const bookings = await Booking.find(query)
        .sort({ pickupDateTime: 1 })
        .skip(skip)
        .limit(limit);
      
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

    // Créer un nouvel objet de réservation pour MongoDB avec les fourchettes de prix
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
        amount: price.amount, // Prix maximum de la fourchette
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
        // NOUVEAU : Ajouter la fourchette de prix
        priceRange: price.priceRange || null,
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

    // Fonction d'envoi d'email avec la fourchette de prix
    const sendEmails = async () => {
      console.log('=== DÉBUT ENVOI EMAILS ===');
      
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
          connectionTimeout: 10000,
          greetingTimeout: 5000,
          socketTimeout: 10000,
        });

        console.log('Test de connexion SMTP...');
        await transporter.verify();
        console.log('✅ Connexion SMTP vérifiée');

        // Fonction pour formater la fourchette de prix
        const formatPriceRange = (priceRange) => {
          if (!priceRange) return 'Prix non défini';
          
          const min = new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(priceRange.min);
          
          const max = new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(priceRange.max);
          
          return `${min} - ${max}`;
        };

        // Obtenir le nom du tarif pour l'email
        const tariffNames = {
          'A': 'Jour avec retour en charge',
          'B': 'Nuit/weekend avec retour en charge',
          'C': 'Jour avec retour à vide',
          'D': 'Nuit/weekend avec retour à vide'
        };
        const tariffName = tariffNames[tariffApplied] || 'Tarif standard';

        // Email pour le propriétaire avec les fourchettes
        const mailOptions = {
          from: `"Taxi VLB" <${process.env.EMAIL_USER}>`,
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
                <p style="font-size: 18px; margin-top: 10px;"><strong>Prix estimé: ${formatPriceRange(price.priceRange)}</strong></p>
                <p style="font-size: 14px; color: #666;">Le prix final sera défini avec le client dans cette fourchette</p>
              </div>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h2 style="color: #2a5a9e; margin-top: 0;">Véhicule</h2>
                <p><strong>Type de véhicule:</strong> ${vehicleType === 'green' ? 'Tesla Model 3' : vehicleType === 'berline' ? 'Mercedes Classe E' : 'Mercedes Classe V'}</p>
                ${flightNumber ? `<p><strong>Numéro de vol:</strong> ${flightNumber}</p>` : ''}
                ${trainNumber ? `<p><strong>Numéro de train:</strong> ${trainNumber}</p>` : ''}
                ${specialRequests ? `<p><strong>Demandes spéciales:</strong> ${specialRequests}</p>` : ''}
              </div>
            </div>
          `,
        };

        console.log('Envoi email propriétaire vers:', mailOptions.to);
        const info1 = await transporter.sendMail(mailOptions);
        console.log('✅ Email propriétaire envoyé:', info1.messageId);

        // Email client avec la fourchette de prix
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
                <p style="font-size: 18px; margin-top: 10px;"><strong>Prix estimé: ${formatPriceRange(price.priceRange)}</strong></p>
                <p style="font-size: 14px; color: #666;">(Tarif ${tariffApplied} - ${tariffName})</p>
              </div>
              
              <div style="background-color: #fffbf0; border: 1px solid #ffd93d; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #805500; margin-top: 0;">💡 À propos du prix</h3>
                <p style="color: #805500; margin: 0;">
                  Cette fourchette de prix tient compte des conditions de circulation et autres facteurs du trajet. 
                  Le prix final sera convenu avec votre chauffeur et restera dans cette fourchette.
                </p>
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

        console.log('Envoi email client vers:', customerInfo.email);
        const info2 = await transporter.sendMail(customerMailOptions);
        console.log('✅ Email client envoyé:', info2.messageId);

        console.log('=== EMAILS ENVOYÉS AVEC SUCCÈS ===');

      } catch (emailError) {
        console.error('=== ERREUR EMAIL DÉTAILLÉE ===');
        console.error('Message:', emailError.message);
        throw emailError;
      }
    };

    // Appeler l'envoi d'emails
    try {
      await sendEmails();
      console.log('Emails traités avec succès');
    } catch (emailError) {
      console.error('Erreur finale lors de l\'envoi des emails:', emailError);
    }

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
        priceRange: price.priceRange, // Inclure la fourchette dans la réponse
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