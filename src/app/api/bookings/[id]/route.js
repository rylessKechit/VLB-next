// src/app/api/bookings/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import nodemailer from 'nodemailer';

// Récupérer une réservation spécifique
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    // Vérifiez si l'utilisateur est authentifié (pour l'admin dashboard)
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    // Chercher par bookingId ou par _id MongoDB
    const booking = await Booking.findOne({
      $or: [
        { bookingId: id },
        { _id: id }
      ]
    }).populate('assignedDriver', 'name email phone');
    
    if (!booking) {
      return NextResponse.json({ error: 'Réservation non trouvée' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: booking
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération de la réservation:', error);
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération de la réservation.' },
      { status: 500 }
    );
  }
}

// Mettre à jour une réservation
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    const data = await request.json();
    
    // Vérifiez si l'utilisateur est authentifié (admin ou chauffeur)
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    // Récupérer la réservation
    const booking = await Booking.findOne({
      $or: [
        { bookingId: id },
        { _id: id }
      ]
    });
    
    if (!booking) {
      return NextResponse.json({ error: 'Réservation non trouvée' }, { status: 404 });
    }
    
    // Sauvegarder l'ancien statut pour vérifier les changements
    const oldStatus = booking.status;
    
    // Mettre à jour les champs de la réservation
    Object.keys(data).forEach(key => {
      if (key !== '_id' && key !== 'bookingId') { // Éviter la modification de l'identifiant
        booking[key] = data[key];
      }
    });
    
    // Sauvegarder les modifications
    await booking.save();
    
    // Envoyer un email au client si le statut a changé
    if (oldStatus !== booking.status) {
      try {
        // Configurer Nodemailer
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.EMAIL_PORT || '587'),
          secure: process.env.EMAIL_SECURE === 'true',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
        
        // Créer un message différent selon le nouveau statut
        let statusMessage = '';
        switch(booking.status) {
          case 'confirmed':
            statusMessage = 'Votre réservation a été confirmée par notre équipe.';
            break;
          case 'cancelled':
            statusMessage = 'Votre réservation a été annulée.';
            break;
          case 'completed':
            statusMessage = 'Votre course a été marquée comme terminée. Merci d\'avoir utilisé nos services.';
            break;
          default:
            statusMessage = `Le statut de votre réservation a été mis à jour vers: ${booking.status}`;
        }
        
        // Email au client
        const mailOptions = {
          from: `"Taxi VLB" <${process.env.EMAIL_USER}>`,
          to: booking.customerInfo.email,
          subject: `Mise à jour de votre réservation - Taxi VLB [${booking.bookingId}]`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://www.taxi-verrieres-le-buisson.com/images/logo.webp" alt="Taxi VLB" style="max-width: 150px; height: auto;" />
              </div>
              
              <h1 style="color: #d4af37; text-align: center;">Mise à jour de réservation</h1>
              
              <p>Bonjour ${booking.customerInfo.name},</p>
              
              <p>${statusMessage}</p>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h2 style="color: #2a5a9e; margin-top: 0;">Détails de votre course</h2>
                <p><strong>Référence:</strong> ${booking.bookingId}</p>
                <p><strong>Départ:</strong> ${booking.pickupAddress}</p>
                <p><strong>Destination:</strong> ${booking.dropoffAddress}</p>
                <p><strong>Date:</strong> ${new Date(booking.pickupDateTime).toLocaleDateString('fr-FR')}</p>
                <p><strong>Heure:</strong> ${new Date(booking.pickupDateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              
              <p style="background-color: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 15px 0;">
                Pour toute question, veuillez nous contacter au <a href="tel:+33600000000">+33 6 00 00 00 00</a>.
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
                <p>Merci de votre confiance,</p>
                <p><strong>L'équipe Taxi VLB</strong></p>
              </div>
            </div>
            `,
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`Email de mise à jour de statut envoyé à ${booking.customerInfo.email}`);
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email de mise à jour:', emailError);
        // Continuer même en cas d'erreur d'envoi d'email
      }
    }
    
    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Réservation mise à jour avec succès'
    });
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réservation:', error);
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la mise à jour de la réservation.' },
      { status: 500 }
    );
  }
}

// Supprimer une réservation
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    // Vérifiez si l'utilisateur est authentifié (admin uniquement)
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    // Récupérer la réservation pour vérifier qu'elle existe
    const booking = await Booking.findOne({
      $or: [
        { bookingId: id },
        { _id: id }
      ]
    });
    
    if (!booking) {
      return NextResponse.json({ error: 'Réservation non trouvée' }, { status: 404 });
    }
    
    // Supprimer la réservation
    await Booking.deleteOne({ _id: booking._id });
    
    return NextResponse.json({
      success: true,
      message: 'Réservation supprimée avec succès'
    });
    
  } catch (error) {
    console.error('Erreur lors de la suppression de la réservation:', error);
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la suppression de la réservation.' },
      { status: 500 }
    );
  }
}