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
  faEdit,
  faSpinner,
  faClock,
  faUser,
  faMapMarkerAlt
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
  const [chartPeriod, setChartPeriod] = useState('thisWeek');
  
  // Récupérer les données du dashboard
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
        
        // Récupérer les données du graphique
        const chartResponse = await fetch(`/api/dashboard/chart-data?period=${chartPeriod}`);
        
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
  }, [chartPeriod]);
  
  // Données pour les statistiques responsive
  const statsItems = [
    {
      title: 'Total',
      value: stats.totalBookings,
      icon: faCalendarCheck,
      color: 'bg-blue-500',
      link: '/admin/bookings'
    },
    {
      title: 'En attente',
      value: stats.pendingBookings,
      icon: faExclamationTriangle,
      color: 'bg-yellow-500',
      link: '/admin/bookings?status=pending'
    },
    {
      title: 'Confirmées',
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
  
  // Gestion du changement de période du graphique
  const handleChartPeriodChange = (newPeriod) => {
    setChartPeriod(newPeriod);
  };
  
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header avec date */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Tableau de bord</h2>
        <span className="text-sm text-gray-500 mt-2 sm:mt-0">
          {new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </span>
      </div>
      
      {/* Statistiques responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
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
      
      {/* Contenu principal responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Graphique responsive */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
              Activité des réservations
            </h3>
            <select 
              className="w-full sm:w-auto rounded-md border-gray-300 text-sm focus:ring-primary focus:border-primary"
              value={chartPeriod}
              onChange={(e) => handleChartPeriodChange(e.target.value)}
            >
              <option value="day">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
            </select>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-48 sm:h-64">
              <FontAwesomeIcon icon={faSpinner} spin className="text-primary text-2xl" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-48 sm:h-64 text-red-500 text-sm">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              {error}
            </div>
          ) : (
            <div className="h-48 sm:h-64">
              <BookingChart data={bookingData} />
            </div>
          )}
        </div>
        
        {/* Réservations à venir responsive */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Prochaines réservations</h3>
            <Link 
              href="/admin/bookings" 
              className="text-sm text-primary hover:text-primary-dark"
            >
              Tout voir
            </Link>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <FontAwesomeIcon icon={faSpinner} spin className="text-primary text-xl" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-32 text-red-500 text-sm">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              Erreur de chargement
            </div>
          ) : upcomingBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <FontAwesomeIcon icon={faCalendarCheck} className="h-8 w-8 mb-2" />
              <p className="text-sm">Aucune réservation à venir</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div key={booking._id || booking.bookingId} 
                     className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow duration-300">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="text-xs font-medium text-gray-900">
                          {booking.bookingId}
                        </span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status === 'confirmed' ? 'Confirmée' :
                           booking.status === 'pending' ? 'En attente' : booking.status}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm mb-1">{booking.customerInfo?.name}</h4>
                    </div>
                    <Link 
                      href={`/admin/bookings/${booking._id || booking.bookingId}`}
                      className="text-primary hover:text-primary-dark p-1"
                    >
                      <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                    </Link>
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-gray-600 flex items-center">
                      <FontAwesomeIcon icon={faClock} className="mr-1" />
                      {new Date(booking.pickupDateTime).toLocaleDateString('fr-FR')} à{' '}
                      {new Date(booking.pickupDateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-xs text-gray-600 flex items-start">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 mt-0.5 flex-shrink-0" />
                      <span className="truncate">{booking.pickupAddress}</span>
                    </div>
                    {booking.dropoffAddress && (
                      <div className="text-xs text-gray-600 flex items-start">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 mt-0.5 flex-shrink-0" />
                        <span className="truncate">{booking.dropoffAddress}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Section admin avec revenus - cachée sur mobile si pas nécessaire */}
      {session?.user?.role === 'admin' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">Revenus</h3>
              <select 
                className="w-full sm:w-auto rounded-md border-gray-300 text-sm focus:ring-primary focus:border-primary"
                defaultValue="thisMonth"
              >
                <option value="today">Aujourd'hui</option>
                <option value="thisWeek">Cette semaine</option>
                <option value="thisMonth">Ce mois</option>
                <option value="lastMonth">Mois dernier</option>
              </select>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 sm:p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <FontAwesomeIcon icon={faChartLine} className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 mr-2" />
                <h4 className="text-base sm:text-lg font-semibold">Revenu total</h4>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(stats.totalRevenue)}
              </p>
            </div>
          </div>
          
          {/* Statistiques supplémentaires pour admin */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Vue d'ensemble</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Réservations ce mois</span>
                <span className="font-semibold">{stats.totalBookings}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taux de confirmation</span>
                <span className="font-semibold text-green-600">
                  {stats.totalBookings > 0 
                    ? Math.round((stats.confirmedBookings / stats.totalBookings) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Utilisateurs actifs</span>
                <span className="font-semibold">{stats.totalUsers}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}