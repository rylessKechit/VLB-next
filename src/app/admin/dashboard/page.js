"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck,
  faCalendarAlt,
  faUsers, 
  faExclamationTriangle, 
  faCheckCircle,
  faChartLine,
  faEye,
  faEdit
} from '@fortawesome/free-solid-svg-icons';
import DashboardStats from '@/components/admin/DashboardStats';
import UpcomingBookings from '@/components/admin/UpcomingBookings';
import BookingChart from '@/components/admin/BookingChart';

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    todayBookings: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Récupérer les statistiques et les réservations à venir
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les statistiques
        const statsResponse = await fetch('/api/dashboard/stats');
        
        if (!statsResponse.ok) {
          throw new Error('Erreur lors de la récupération des statistiques');
        }
        
        const statsData = await statsResponse.json();
        setStats(statsData.data);
        
        // Récupérer les réservations à venir
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + 7);
        endOfWeek.setHours(23, 59, 59, 999);
        
        const bookingsResponse = await fetch(`/api/bookings?startDate=${startOfDay}&endDate=${endOfWeek.toISOString()}&limit=5`);
        
        if (!bookingsResponse.ok) {
          throw new Error('Erreur lors de la récupération des réservations');
        }
        
        const bookingsData = await bookingsResponse.json();
        setUpcomingBookings(bookingsData.data);
        
        // Récupérer les données pour le graphique
        const chartResponse = await fetch('/api/dashboard/chart-data');
        
        if (!chartResponse.ok) {
          throw new Error('Erreur lors de la récupération des données du graphique');
        }
        
        const chartData = await chartResponse.json();
        setBookingData(chartData.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Données pour les statistiques
  const statsItems = [
    {
      title: 'Réservations totales',
      value: stats.totalBookings,
      icon: faCalendarCheck,
      color: 'bg-blue-500',
      link: '/admin/bookings'
    },
    {
      title: 'Réservations en attente',
      value: stats.pendingBookings,
      icon: faExclamationTriangle,
      color: 'bg-yellow-500',
      link: '/admin/bookings?status=pending'
    },
    {
      title: 'Réservations confirmées',
      value: stats.confirmedBookings,
      icon: faCheckCircle,
      color: 'bg-green-500',
      link: '/admin/bookings?status=confirmed'
    },
    {
      title: "Aujourd'hui",
      value: stats.todayBookings,
      icon: faCalendarCheck,
      color: 'bg-purple-500',
      link: '/admin/bookings'
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Vue d'ensemble</h2>
        <span className="text-sm text-gray-500">
          {new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </span>
      </div>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsItems.map((item, index) => (
          <DashboardStats 
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
            color={item.color}
            link={item.link}
          />
        ))}
      </div>
      
      {/* Graphique et réservations à venir */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique des réservations */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Activité des réservations</h3>
            <select 
              className="rounded-md border-gray-300 text-sm focus:ring-primary focus:border-primary"
              defaultValue="thisWeek"
            >
              <option value="today">Aujourd'hui</option>
              <option value="thisWeek">Cette semaine</option>
              <option value="thisMonth">Ce mois</option>
              <option value="lastMonth">Mois dernier</option>
            </select>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64 text-red-500">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              {error}
            </div>
          ) : (
            <div className="h-64">
              <BookingChart data={bookingData} />
            </div>
          )}
        </div>
        
        {/* Réservations à venir */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Réservations à venir</h3>
            <Link 
              href="/admin/bookings" 
              className="text-sm text-primary hover:text-primary-dark"
            >
              Tout voir
            </Link>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64 text-red-500">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              {error}
            </div>
          ) : upcomingBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <FontAwesomeIcon icon={faCalendarCheck} className="h-10 w-10 mb-2" />
              <p>Aucune réservation à venir</p>
            </div>
          ) : (
            <UpcomingBookings bookings={upcomingBookings} />
          )}
        </div>
      </div>
      
      {/* Section réservée aux administrateurs */}
      {session?.user?.role === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Statistiques des revenus */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Revenus</h3>
              <select 
                className="rounded-md border-gray-300 text-sm focus:ring-primary focus:border-primary"
                defaultValue="thisMonth"
              >
                <option value="today">Aujourd'hui</option>
                <option value="thisWeek">Cette semaine</option>
                <option value="thisMonth">Ce mois</option>
                <option value="lastMonth">Mois dernier</option>
              </select>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <FontAwesomeIcon icon={faChartLine} className="h-8 w-8 text-green-500 mr-2" />
                <h4 className="text-lg font-semibold">Revenu total</h4>
              </div>
              <p className="text-3xl font-bold text-green-600">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}