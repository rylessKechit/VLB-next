import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      pickupAddress,
      pickupPlaceId,
      dropoffAddress,
      dropoffPlaceId,
      pickupDateTime,
      passengers,
      luggage,
      roundTrip,
      returnDateTime,
      price,
      customerInfo,
    } = data;

    // Validation
    if (!pickupAddress || !dropoffAddress || !pickupDateTime || !price || !customerInfo) {
      return NextResponse.json(
        { error: 'Données manquantes pour la réservation' },
        { status: 400 }
      );
    }

    // Dans une implémentation réelle, vous enregistreriez ceci dans une base de données
    // Simulons un ID de réservation
    const bookingId = 'BK' + Math.floor(Math.random() * 10000);

    // Format date et heure pour les notifications
    const formattedPickupDate = new Date(pickupDateTime).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    
    const formattedPickupTime = new Date(pickupDateTime).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Configuration de Nodemailer (à remplacer par vos informations)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email pour le chauffeur/propriétaire
    const driverMailOptions = {
      from: `"Réservation Taxi VLB" <${process.env.EMAIL_USER}>`,
      to: process.env.DRIVER_EMAIL || 'driver@taxivlb.com',
      subject: 'Nouvelle réservation de course',
      html: `
        <h1>Nouvelle réservation de course</h1>
        <p><strong>Référence:</strong> ${bookingId}</p>
        <p><strong>Client:</strong> ${customerInfo.name}</p>
        <p><strong>Téléphone:</strong> ${customerInfo.phone}</p>
        <p><strong>Email:</strong> ${customerInfo.email}</p>
        <h2>Détails de la course</h2>
        <p><strong>Adresse de départ:</strong> ${pickupAddress}</p>
        <p><strong>Adresse d'arrivée:</strong> ${dropoffAddress}</p>
        <p><strong>Date:</strong> ${formattedPickupDate}</p>
        <p><strong>Heure:</strong> ${formattedPickupTime}</p>
        <p><strong>Passagers:</strong> ${passengers || 1}</p>
        <p><strong>Bagages:</strong> ${luggage || 0}</p>
        <p><strong>Aller-retour:</strong> ${roundTrip ? 'Oui' : 'Non'}</p>
        ${roundTrip && returnDateTime ? `<p><strong>Date de retour:</strong> ${new Date(returnDateTime).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>` : ''}
        ${roundTrip && returnDateTime ? `<p><strong>Heure de retour:</strong> ${new Date(returnDateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>` : ''}
        <p><strong>Prix:</strong> ${price.amount} ${price.currency}</p>
        ${customerInfo.specialRequests ? `<p><strong>Demandes spéciales:</strong> ${customerInfo.specialRequests}</p>` : ''}
      `,
    };

    // Email pour le client
    const customerMailOptions = {
      from: `"Taxi VLB" <${process.env.EMAIL_USER}>`,
      to: customerInfo.email,
      subject: 'Confirmation de votre réservation - Taxi VLB',
      html: `
        <h1>Confirmation de votre réservation</h1>
        <p>Bonjour ${customerInfo.name},</p>
        <p>Nous vous confirmons la réservation de votre course avec Taxi VLB.</p>
        <h2>Détails de votre course</h2>
        <p><strong>Référence:</strong> ${bookingId}</p>
        <p><strong>Adresse de départ:</strong> ${pickupAddress}</p>
        <p><strong>Adresse d'arrivée:</strong> ${dropoffAddress}</p>
        <p><strong>Date:</strong> ${formattedPickupDate}</p>
        <p><strong>Heure:</strong> ${formattedPickupTime}</p>
        <p><strong>Passagers:</strong> ${passengers || 1}</p>
        <p><strong>Bagages:</strong> ${luggage || 0}</p>
        <p><strong>Aller-retour:</strong> ${roundTrip ? 'Oui' : 'Non'}</p>
        ${roundTrip && returnDateTime ? `<p><strong>Date de retour:</strong> ${new Date(returnDateTime).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>` : ''}
        ${roundTrip && returnDateTime ? `<p><strong>Heure de retour:</strong> ${new Date(returnDateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>` : ''}
        <p><strong>Prix estimé:</strong> ${price.amount} ${price.currency}</p>
        <p>Votre chauffeur sera à l'adresse indiquée à l'heure prévue. Vous recevrez un SMS de confirmation avant la course.</p>
        <p>Pour toute modification ou annulation, veuillez nous contacter au plus tôt au <a href="tel:+33600000000">+33 6 00 00 00 00</a>.</p>
        <p>Merci de votre confiance et à bientôt,</p>
        <p>L'équipe Taxi VLB</p>
      `,
    };

    // Envoi d'emails
    await transporter.sendMail(driverMailOptions);
    await transporter.sendMail(customerMailOptions);

    // Préparer la réponse avec les données de réservation
    const bookingData = {
      id: bookingId,
      pickupAddress,
      dropoffAddress,
      pickupDateTime,
      passengers,
      luggage,
      roundTrip,
      returnDateTime,
      price,
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
      },
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: bookingData,
      message: 'Votre réservation a été enregistrée avec succès. Vous recevrez un email de confirmation.',
    });
    
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création de la réservation.' },
      { status: 500 }
    );
  }
}