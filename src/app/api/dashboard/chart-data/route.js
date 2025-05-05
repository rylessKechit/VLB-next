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
    const period = searchParams.get('period') || 'week';
    
    let data;
    
    switch (period) {
      case 'day':
        data = await getDailyData(session);
        break;
      case 'month':
        data = await getMonthlyData(session);
        break;
      case 'year':
        data = await getYearlyData(session);
        break;
      case 'week':
      default:
        data = await getWeeklyData(session);
        break;
    }
    
    return NextResponse.json({
      success: true,
      data
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des données du graphique:', error);
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des données du graphique.' },
      { status: 500 }
    );
  }
}

// Données quotidiennes (heures de la journée)
async function getDailyData(session) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  
  // Préparer la requête de base
  let query = {
    pickupDateTime: { $gte: startOfDay, $lte: endOfDay }
  };
  
  // Si c'est un chauffeur, filtrer par chauffeur assigné
  if (session.user.role === 'driver') {
    query.assignedDriver = session.user.id;
  }
  
  // Récupérer toutes les réservations de la journée
  const bookings = await Booking.find(query);
  
  // Grouper par heure
  const hourlyData = Array(24).fill().map((_, i) => ({
    hour: `${i}h`,
    confirmées: 0,
    enAttente: 0,
    annulées: 0
  }));
  
  bookings.forEach(booking => {
    const hour = new Date(booking.pickupDateTime).getHours();
    
    switch (booking.status) {
      case 'confirmed':
      case 'completed':
        hourlyData[hour].confirmées += 1;
        break;
      case 'pending':
        hourlyData[hour].enAttente += 1;
        break;
      case 'cancelled':
        hourlyData[hour].annulées += 1;
        break;
    }
  });
  
  return hourlyData;
}

// Données hebdomadaires (jours de la semaine)
async function getWeeklyData(session) {
  // Trouver le premier jour de la semaine (lundi)
  const today = new Date();
  const currentDay = today.getDay(); // 0 pour dimanche, 1 pour lundi, etc.
  const diff = currentDay === 0 ? 6 : currentDay - 1; // Ajuster pour commencer par lundi
  
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - diff);
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  // Préparer la requête de base
  let query = {
    pickupDateTime: { $gte: startOfWeek, $lte: endOfWeek }
  };
  
  // Si c'est un chauffeur, filtrer par chauffeur assigné
  if (session.user.role === 'driver') {
    query.assignedDriver = session.user.id;
  }
  
  // Récupérer toutes les réservations de la semaine
  const bookings = await Booking.find(query);
  
  // Noms des jours de la semaine en français
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  
  // Initialiser les données pour chaque jour
  const dailyData = Array(7).fill().map((_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    
    return {
      date: `${dayNames[i]} ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`,
      confirmées: 0,
      enAttente: 0,
      annulées: 0
    };
  });
  
  // Remplir les données
  bookings.forEach(booking => {
    const bookingDate = new Date(booking.pickupDateTime);
    const dayIndex = Math.floor((bookingDate - startOfWeek) / (24 * 60 * 60 * 1000));
    
    // Vérifier que l'index est valide
    if (dayIndex >= 0 && dayIndex < 7) {
      switch (booking.status) {
        case 'confirmed':
        case 'completed':
          dailyData[dayIndex].confirmées += 1;
          break;
        case 'pending':
          dailyData[dayIndex].enAttente += 1;
          break;
        case 'cancelled':
          dailyData[dayIndex].annulées += 1;
          break;
      }
    }
  });
  
  return dailyData;
}

// Données mensuelles (jours du mois)
async function getMonthlyData(session) {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // Premier jour du mois
  const startOfMonth = new Date(year, month, 1);
  
  // Dernier jour du mois
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);
  
  // Préparer la requête de base
  let query = {
    pickupDateTime: { $gte: startOfMonth, $lte: endOfMonth }
  };
  
  // Si c'est un chauffeur, filtrer par chauffeur assigné
  if (session.user.role === 'driver') {
    query.assignedDriver = session.user.id;
  }
  
  // Récupérer toutes les réservations du mois
  const bookings = await Booking.find(query);
  
  // Nombre de jours dans le mois
  const daysInMonth = endOfMonth.getDate();
  
  // Initialiser les données pour chaque jour
  const monthlyData = Array(daysInMonth).fill().map((_, i) => ({
    date: `${(i + 1).toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}`,
    confirmées: 0,
    enAttente: 0,
    annulées: 0
  }));
  
  // Remplir les données
  bookings.forEach(booking => {
    const day = new Date(booking.pickupDateTime).getDate() - 1; // -1 car les tableaux commencent à 0
    
    switch (booking.status) {
      case 'confirmed':
      case 'completed':
        monthlyData[day].confirmées += 1;
        break;
      case 'pending':
        monthlyData[day].enAttente += 1;
        break;
      case 'cancelled':
        monthlyData[day].annulées += 1;
        break;
    }
  });
  
  return monthlyData;
}

// Données annuelles (mois de l'année)
async function getYearlyData(session) {
  const date = new Date();
  const year = date.getFullYear();
  
  // Premier jour de l'année
  const startOfYear = new Date(year, 0, 1);
  
  // Dernier jour de l'année
  const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);
  
  // Préparer la requête de base
  let query = {
    pickupDateTime: { $gte: startOfYear, $lte: endOfYear }
  };
  
  // Si c'est un chauffeur, filtrer par chauffeur assigné
  if (session.user.role === 'driver') {
    query.assignedDriver = session.user.id;
  }
  
  // Récupérer toutes les réservations de l'année
  const bookings = await Booking.find(query);
  
  // Noms des mois en français
  const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  
  // Initialiser les données pour chaque mois
  const yearlyData = Array(12).fill().map((_, i) => ({
    month: monthNames[i],
    confirmées: 0,
    enAttente: 0,
    annulées: 0
  }));
  
  // Remplir les données
  bookings.forEach(booking => {
    const month = new Date(booking.pickupDateTime).getMonth();
    
    switch (booking.status) {
      case 'confirmed':
      case 'completed':
        yearlyData[month].confirmées += 1;
        break;
      case 'pending':
        yearlyData[month].enAttente += 1;
        break;
      case 'cancelled':
        yearlyData[month].annulées += 1;
        break;
    }
  });
  
  return yearlyData;
}