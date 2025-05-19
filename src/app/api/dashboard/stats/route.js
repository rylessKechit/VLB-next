// src/app/api/dashboard/stats/route.js - Version mise à jour
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
    
    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url);
    const timeFilter = searchParams.get('timeFilter') || 'all'; // Nouveau paramètre pour le filtre temporel
    
    // Définir les filtres de date en fonction du timeFilter
    let dateStart, dateEnd;
    let filterLabel = "Toutes périodes";
    let dateRangeText = "Toutes les dates";
    
    const now = new Date();
    
    switch(timeFilter) {
      case 'today':
        dateStart = new Date(now);
        dateStart.setHours(0, 0, 0, 0);
        dateEnd = new Date(now);
        dateEnd.setHours(23, 59, 59, 999);
        filterLabel = "Aujourd'hui";
        dateRangeText = dateStart.toLocaleDateString('fr-FR');
        break;
      case 'thisWeek':
        // Calculer le début de la semaine (lundi)
        dateStart = new Date(now);
        const dayOfWeek = dateStart.getDay(); // 0 = dimanche, 1 = lundi, ...
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        dateStart.setDate(dateStart.getDate() - diff);
        dateStart.setHours(0, 0, 0, 0);
        
        dateEnd = new Date(now);
        dateEnd.setHours(23, 59, 59, 999);
        filterLabel = "Cette semaine";
        dateRangeText = `${dateStart.toLocaleDateString('fr-FR')} - ${dateEnd.toLocaleDateString('fr-FR')}`;
        break;
      case 'thisMonth':
        dateStart = new Date(now.getFullYear(), now.getMonth(), 1);
        dateEnd = new Date(now);
        dateEnd.setHours(23, 59, 59, 999);
        filterLabel = "Ce mois-ci";
        dateRangeText = `${dateStart.toLocaleDateString('fr-FR')} - ${dateEnd.toLocaleDateString('fr-FR')}`;
        break;
      case 'lastMonth':
        dateStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        dateEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        dateEnd.setHours(23, 59, 59, 999);
        filterLabel = "Mois précédent";
        dateRangeText = `${dateStart.toLocaleDateString('fr-FR')} - ${dateEnd.toLocaleDateString('fr-FR')}`;
        break;
      default: // 'all'
        dateStart = null;
        dateEnd = null;
        break;
    }
    
    // Construire la requête avec les filtres de date
    const dateFilter = {};
    if (dateStart && dateEnd) {
      dateFilter.pickupDateTime = { $gte: dateStart, $lte: dateEnd };
    }
    
    // Récupérer les statistiques des réservations
    const totalBookings = await Booking.countDocuments(dateFilter);
    const confirmedBookings = await Booking.countDocuments({ ...dateFilter, status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ ...dateFilter, status: 'cancelled' });
    
    // Réservations du jour (toujours basé sur aujourd'hui, indépendamment du filtre)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const todayBookings = await Booking.countDocuments({
      pickupDateTime: { $gte: startOfDay, $lte: endOfDay }
    });
    
    let totalUsers = 0;
    let totalRevenue = 0;
    let completedRevenue = 0;
    
    // Statistiques supplémentaires pour les administrateurs
    if (session.user.role === 'admin') {
      // Compter le nombre d'utilisateurs
      totalUsers = await User.countDocuments();
      
      // Calculer le revenu total (somme des prix des réservations confirmées, en cours et terminées)
      const revenueAggregation = await Booking.aggregate([
        { $match: { 
          status: { $in: ['confirmed', 'in_progress', 'completed'] },
          ...(dateFilter.pickupDateTime ? { pickupDateTime: dateFilter.pickupDateTime } : {})
        }},
        { $group: { _id: null, total: { $sum: '$price.amount' } } }
      ]);
      
      totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;
      
      // Calculer le revenu des courses terminées uniquement
      const completedRevenueAggregation = await Booking.aggregate([
        { $match: { 
          status: 'completed',
          ...(dateFilter.pickupDateTime ? { pickupDateTime: dateFilter.pickupDateTime } : {})
        }},
        { $group: { _id: null, total: { $sum: '$price.amount' } } }
      ]);
      
      completedRevenue = completedRevenueAggregation.length > 0 ? completedRevenueAggregation[0].total : 0;
    }
    
    return NextResponse.json({
      success: true,
      data: {
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        todayBookings,
        totalUsers,
        totalRevenue,
        completedRevenue,
        timeFilterDetails: {
          filter: timeFilter,
          label: filterLabel,
          dateRange: dateRangeText
        }
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