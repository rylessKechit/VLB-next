import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, phone, message } = data;

    // Validation simple
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

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

    // Email pour le propriétaire du site
    const mailOptions = {
      from: `"Formulaire de contact" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || 'contact@taxivlb.com',
      subject: 'Nouveau message de contact - Taxi VLB',
      html: `
        <h1>Nouveau message de contact</h1>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Téléphone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // Envoi d'email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Votre message a été envoyé avec succès.',
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'envoi du message.' },
      { status: 500 }
    );
  }
}