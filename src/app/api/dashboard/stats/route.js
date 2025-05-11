// src/app/api/dashboard/stats/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import User from '@/models/User';
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
    
    // Récupérer les statistiques des réservations
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const inProgressBookings = await Booking.countDocuments({ status: 'in_progress' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    
    // Réservations du jour
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const todayBookings = await Booking.countDocuments({
      pickupDateTime: { $gte: startOfDay, $lte: endOfDay }
    });
    
    let totalUsers = 0;
    let totalRevenue = 0;
    
    // Statistiques supplémentaires pour les administrateurs
    if (session.user.role === 'admin') {
      // Compter le nombre d'utilisateurs
      totalUsers = await User.countDocuments();
      
      // Calculer le revenu total (somme des prix des réservations confirmées, en cours et terminées)
      const revenueAggregation = await Booking.aggregate([
        { $match: { status: { $in: ['confirmed', 'in_progress', 'completed'] } } },
        { $group: { _id: null, total: { $sum: '$price.amount' } } }
      ]);
      
      totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;
    }
    
    return NextResponse.json({
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        inProgressBookings,
        completedBookings,
        cancelledBookings,
        todayBookings,
        totalUsers,
        totalRevenue
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des statistiques.' },
      { status: 500 }
    );
  }
}