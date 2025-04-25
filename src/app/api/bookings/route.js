// src/app/api/bookings/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('Données reçues dans l\'API:', data); // Pour le debug
    
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
      price
    } = data;

    // Validation plus précise
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
    const pickupDateTime = `${pickupDate}T${pickupTime}`;

    // Créer une instance du transporteur d'email
    let transporter;
    
    try {
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      
      // Vérifier la connexion
      await transporter.verify();
      console.log('Connexion SMTP établie');
    } catch (emailSetupError) {
      console.error('Erreur de configuration email:', emailSetupError);
      // Continuez même en cas d'erreur d'email
    }

    // Préparer les emails
    if (transporter) {
      try {
        // Email pour le propriétaire du service
        const ownerMailOptions = {
          from: `"Réservation Taxi VLB" <${process.env.EMAIL_USER}>`,
          to: process.env.OWNER_EMAIL || 'contact@taxivlb.com',
          subject: `Nouvelle réservation - ${bookingId}`,
          html: `
            <h1 style="color: #d4af37;">Nouvelle réservation de taxi</h1>
            <p><strong>Référence:</strong> ${bookingId}</p>
            <p><strong>Client:</strong> ${customerInfo.name}</p>
            <p><strong>Téléphone:</strong> ${customerInfo.phone}</p>
            <p><strong>Email:</strong> ${customerInfo.email}</p>
            
            <h2 style="color: #2a5a9e;">Détails de la course</h2>
            <p><strong>Départ:</strong> ${pickupAddress}</p>
            <p><strong>Destination:</strong> ${dropoffAddress}</p>
            <p><strong>Date:</strong> ${new Date(pickupDateTime).toLocaleDateString('fr-FR')}</p>
            <p><strong>Heure:</strong> ${new Date(pickupDateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
            <p><strong>Passagers:</strong> ${passengers}</p>
            <p><strong>Bagages:</strong> ${luggage}</p>
            
            ${flightNumber ? `<p><strong>Numéro de vol:</strong> ${flightNumber}</p>` : ''}
            ${trainNumber ? `<p><strong>Numéro de train:</strong> ${trainNumber}</p>` : ''}
            
            ${roundTrip ? `
            <p><strong>Aller-retour:</strong> Oui</p>
            <p><strong>Date de retour:</strong> ${new Date(`${returnDate}T${returnTime}`).toLocaleDateString('fr-FR')}</p>
            <p><strong>Heure de retour:</strong> ${new Date(`${returnDate}T${returnTime}`).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
            ` : '<p><strong>Aller-retour:</strong> Non</p>'}
            
            <p><strong>Prix:</strong> ${price.amount} ${price.currency}</p>
            
            ${specialRequests ? `
            <h3 style="color: #2a5a9e;">Demandes spéciales:</h3>
            <p>${specialRequests}</p>
            ` : ''}
          `,
        };
        
        // Email pour le client
        const clientMailOptions = {
          from: `"Taxi VLB" <${process.env.EMAIL_USER}>`,
          to: customerInfo.email,
          subject: `Confirmation de réservation - Taxi VLB [${bookingId}]`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://www.taxivlb.com/images/logo.webp" alt="Taxi VLB" style="max-width: 150px; height: auto;" />
              </div>
              
              <h1 style="color: #d4af37; text-align: center;">Confirmation de réservation</h1>
              
              <p>Bonjour ${customerInfo.name},</p>
              
              <p>Nous vous confirmons la réservation de votre taxi avec la référence <strong>${bookingId}</strong>.</p>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h2 style="color: #2a5a9e; margin-top: 0;">Détails de votre course</h2>
                <p><strong>Départ:</strong> ${pickupAddress}</p>
                <p><strong>Destination:</strong> ${dropoffAddress}</p>
                <p><strong>Date:</strong> ${new Date(pickupDateTime).toLocaleDateString('fr-FR')}</p>
                <p><strong>Heure:</strong> ${new Date(pickupDateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                <p><strong>Passagers:</strong> ${passengers}</p>
                <p><strong>Bagages:</strong> ${luggage}</p>
                
                ${flightNumber ? `<p><strong>Numéro de vol:</strong> ${flightNumber}</p>` : ''}
                ${trainNumber ? `<p><strong>Numéro de train:</strong> ${trainNumber}</p>` : ''}
                
                ${roundTrip ? `
                <p><strong>Aller-retour:</strong> Oui</p>
                <p><strong>Date de retour:</strong> ${new Date(`${returnDate}T${returnTime}`).toLocaleDateString('fr-FR')}</p>
                <p><strong>Heure de retour:</strong> ${new Date(`${returnDate}T${returnTime}`).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                ` : ''}
                
                <p><strong>Prix estimé:</strong> ${price.amount} ${price.currency}</p>
              </div>
              
              <p>Votre chauffeur sera à l'adresse indiquée à l'heure prévue. Vous recevrez un SMS avant votre prise en charge.</p>
              
              <p style="background-color: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 15px 0;">
                Pour toute modification ou annulation, veuillez nous contacter au <a href="tel:+33600000000">+33 6 00 00 00 00</a>.
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
                <p>Merci de votre confiance,</p>
                <p><strong>L'équipe Taxi VLB</strong></p>
                <div style="margin-top: 15px;">
                  <a href="https://www.taxivlb.com" style="color: #d4af37; text-decoration: none;">www.taxivlb.com</a> | 
                  <a href="tel:+33600000000" style="color: #d4af37; text-decoration: none;">+33 6 00 00 00 00</a> | 
                  <a href="mailto:contact@taxivlb.com" style="color: #d4af37; text-decoration: none;">contact@taxivlb.com</a>
                </div>
              </div>
            </div>
          `,
        };

        // Envoi des emails
        const ownerMailResult = await transporter.sendMail(ownerMailOptions);
        console.log('Email envoyé au propriétaire:', ownerMailResult.messageId);
        
        const clientMailResult = await transporter.sendMail(clientMailOptions);
        console.log('Email envoyé au client:', clientMailResult.messageId);
      } catch (emailSendError) {
        console.error('Erreur lors de l\'envoi des emails:', emailSendError);
        // On continue même en cas d'erreur d'envoi d'email
      }
    }

    // Données de réservation à retourner au client
    const bookingResult = {
      id: bookingId,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      pickupAddress,
      dropoffAddress,
      pickupDateTime,
      passengers,
      luggage,
      roundTrip,
      returnDateTime: roundTrip ? `${returnDate}T${returnTime}` : null,
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
      message: 'Votre réservation a été confirmée. Vous recevrez un email de confirmation.'
    });

  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création de la réservation.' },
      { status: 500 }
    );
  }
}