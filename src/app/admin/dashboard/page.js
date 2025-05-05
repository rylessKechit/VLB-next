"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck, 
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
    totalDrivers: 0,
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
  
  // Réduire le nombre de statistiques pour les chauffeurs
  const driverStatsItems = statsItems.filter(item => 
    !item.title.includes('Utilisateurs')
  );
  
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
        {(session?.user?.role === 'admin' ? statsItems : driverStatsItems).map((item, index) => (
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
          {/* Statistiques des utilisateurs */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Utilisateurs</h3>
              <Link 
                href="/admin/users" 
                className="text-sm text-primary hover:text-primary-dark"
              >
                Gérer les utilisateurs
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                    <FontAwesomeIcon icon={faUsers} className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total utilisateurs</p>
                    <p className="text-xl font-semibold">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white mr-3">
                    <FontAwesomeIcon icon={faUsers} className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Chauffeurs actifs</p>
                    <p className="text-xl font-semibold">{stats.totalDrivers}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
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
      
      {/* Section des actions rapides */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions rapides</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href="/admin/bookings/new" 
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
              <FontAwesomeIcon icon={faCalendarCheck} className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Nouvelle réservation</p>
              <p className="text-sm text-gray-600">Créer manuellement</p>
            </div>
          </Link>
          
          {session?.user?.role === 'admin' && (
            <Link 
              href="/admin/users/new" 
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white mr-3">
                <FontAwesomeIcon icon={faUsers} className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Nouvel utilisateur</p>
                <p className="text-sm text-gray-600">Ajouter chauffeur/admin</p>
              </div>
            </Link>
          )}
          
          <Link 
            href="/admin/bookings" 
            className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white mr-3">
              <FontAwesomeIcon icon={faEye} className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Voir réservations</p>
              <p className="text-sm text-gray-600">Gérer les demandes</p>
            </div>
          </Link>
          
          <Link 
            href="/admin/profile" 
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white mr-3">
              <FontAwesomeIcon icon={faEdit} className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Mon profil</p>
              <p className="text-sm text-gray-600">Modifier informations</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}