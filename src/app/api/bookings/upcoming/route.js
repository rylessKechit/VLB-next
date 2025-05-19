// src/app/api/bookings/upcoming/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  try {
    // Vérifier si l'utilisateur est authentifié
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    await dbConnect();
    
    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    
    // Date actuelle
    const now = new Date();
    
    // Trouver les prochaines réservations (celles dont la date est future)
    // et qui sont confirmées ou en cours
    const upcomingBookings = await Booking.find({
      pickupDateTime: { $gte: now },
      status: { $in: ['confirmed', 'in_progress'] }
    })
    .sort({ pickupDateTime: 1 })
    .limit(limit);
    
    return NextResponse.json({
      success: true,
      data: upcomingBookings
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations à venir:', error);
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des réservations à venir.' },
      { status: 500 }
    );
  }
}