// src/app/api/bookings/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      pickupAddress,
      dropoffAddress,
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

    // Générer un ID de réservation
    const bookingId = 'BK' + Math.floor(Math.random() * 10000);

    // Formater les dates pour l'affichage
    const formattedPickupDate = new Date(pickupDateTime).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    
    const formattedPickupTime = new Date(pickupDateTime).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Configuration de Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // 1. Email pour vous (propriétaire)
    const ownerMailOptions = {
      from: `"Réservation Taxi VLB" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL || 'votre-email@example.com', // Votre email ici
      subject: `Nouvelle réservation de course - ${bookingId}`,
      html: `
        <h1 style="color: #d4af37;">Nouvelle réservation de course</h1>
        <p><strong>Référence:</strong> ${bookingId}</p>
        <p><strong>Client:</strong> ${customerInfo.name}</p>
        <p><strong>Téléphone:</strong> ${customerInfo.phone}</p>
        <p><strong>Email:</strong> ${customerInfo.email}</p>
        
        <h2 style="color: #2a5a9e;">Détails de la course</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Adresse de départ:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${pickupAddress}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Adresse d'arrivée:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${dropoffAddress}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${formattedPickupDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Heure:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${formattedPickupTime}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Passagers:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${passengers || 1}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Bagages:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${luggage || 0}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Aller-retour:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${roundTrip ? 'Oui' : 'Non'}</td>
          </tr>
          ${roundTrip && returnDateTime ? `
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date de retour:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${new Date(returnDateTime).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Heure de retour:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${new Date(returnDateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Prix:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${price.amount} ${price.currency}</td>
          </tr>
        </table>
        
        ${customerInfo.specialRequests ? `
        <h3 style="color: #2a5a9e;">Demandes spéciales:</h3>
        <p>${customerInfo.specialRequests}</p>
        ` : ''}
        
        <p style="margin-top: 20px; padding: 10px; background-color: #f8f9fa; border-left: 4px solid #d4af37;">
          Cette réservation requiert une confirmation de votre part au client.
        </p>
      `,
    };

    // 2. Email pour le client
    const customerMailOptions = {
      from: `"Taxi VLB" <${process.env.EMAIL_USER}>`,
      to: customerInfo.email,
      subject: `Confirmation de votre réservation - Taxi VLB ${bookingId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://taxivlb.com/images/logo.webp" alt="Taxi VLB Logo" style="max-width: 150px; height: auto;" />
          </div>
          
          <h1 style="color: #d4af37; text-align: center;">Confirmation de votre réservation</h1>
          
          <p>Bonjour ${customerInfo.name},</p>
          
          <p>Nous vous confirmons la réservation de votre course avec Taxi VLB.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #2a5a9e; margin-top: 0;">Détails de votre course</h2>
            <p><strong>Référence:</strong> ${bookingId}</p>
            <p><strong>Adresse de départ:</strong> ${pickupAddress}</p>
            <p><strong>Adresse d'arrivée:</strong> ${dropoffAddress}</p>
            <p><strong>Date:</strong> ${formattedPickupDate}</p>
            <p><strong>Heure:</strong> ${formattedPickupTime}</p>
            <p><strong>Passagers:</strong> ${passengers || 1}</p>
            <p><strong>Bagages:</strong> ${luggage || 0}</p>
            <p><strong>Aller-retour:</strong> ${roundTrip ? 'Oui' : 'Non'}</p>
            ${roundTrip && returnDateTime ? `
            <p><strong>Date de retour:</strong> ${new Date(returnDateTime).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
            <p><strong>Heure de retour:</strong> ${new Date(returnDateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
            ` : ''}
            <p><strong>Prix estimé:</strong> ${price.amount} ${price.currency}</p>
          </div>
          
          <p>Votre chauffeur sera à l'adresse indiquée à l'heure prévue. Vous recevrez un SMS de confirmation avant la course.</p>
          
          <p style="background-color: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 15px 0;">
            Pour toute modification ou annulation, veuillez nous contacter au plus tôt au <a href="tel:+33600000000">+33 6 00 00 00 00</a>.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
            <p>Merci de votre confiance et à bientôt,</p>
            <p><strong>L'équipe Taxi VLB</strong></p>
            <div style="margin-top: 15px;">
              <a href="https://taxivlb.com" style="color: #d4af37; text-decoration: none;">www.taxivlb.com</a> | 
              <a href="tel:+33600000000" style="color: #d4af37; text-decoration: none;">+33 6 00 00 00 00</a> | 
              <a href="mailto:contact@taxivlb.com" style="color: #d4af37; text-decoration: none;">contact@taxivlb.com</a>
            </div>
          </div>
        </div>
      `,
    };

    // Envoi des emails
    try {
      await transporter.sendMail(ownerMailOptions);
      console.log('Email de notification envoyé au propriétaire');
      
      await transporter.sendMail(customerMailOptions);
      console.log('Email de confirmation envoyé au client');
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi des emails:', emailError);
      // On continue le processus même si l'envoi d'email échoue
    }

    // Préparer la réponse
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