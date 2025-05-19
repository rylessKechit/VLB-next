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
  faSpinner,
  faClock,
  faUser,
  faMapMarkerAlt,
  faPlus,
  faCar,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';

// Importer le nouveau composant de filtre
import RevenueTimeFilter from '@/components/admin/RevenueTimeFilter';

const DashboardStats = ({ title, value, icon, color, link }) => {
  const content = (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all duration-300">
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white mr-3 flex-shrink-0`}>
          <FontAwesomeIcon icon={icon} className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</h3>
          <p className="text-lg sm:text-xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
  
  return link ? <Link href={link} className="block">{content}</Link> : content;
};

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    todayBookings: 0,
    totalRevenue: 0,
    completedRevenue: 0,
    timeFilterDetails: {
      filter: 'all',
      label: 'Toutes périodes',
      dateRange: 'Toutes les dates'
    }
  });
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all');
  
  // Utiliser le filtre temporel pour récupérer les statistiques
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        
        // Récupération des données avec le filtre temporel
        const response = await fetch(`/api/dashboard/stats?timeFilter=${timeFilter}`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.success) {
          setStats(data.data);
        } else {
          throw new Error(data.error || "Échec de récupération des données");
        }
        
        // Récupération des prochaines réservations
        const bookingsResponse = await fetch('/api/bookings/upcoming?limit=5');
        if (!bookingsResponse.ok) {
          throw new Error(`Erreur HTTP: ${bookingsResponse.status}`);
        }
        const bookingsData = await bookingsResponse.json();
        
        if (bookingsData.success) {
          setUpcomingBookings(bookingsData.data || []);
        } else {
          throw new Error(bookingsData.error || "Échec de récupération des réservations");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Impossible de charger les données du tableau de bord: " + err.message);
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, [timeFilter]); // Ajouter timeFilter comme dépendance pour recharger les données lors du changement

  // Gérer le changement de filtre temporel
  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter);
  };

  // Format date/heure
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format prix
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Données pour les stats
  const statsItems = [
    {
      title: 'Total Réservations',
      value: stats.totalBookings,
      icon: faCalendarCheck,
      color: 'bg-primary',
      link: '/admin/bookings'
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
      icon: faClock,
      color: 'bg-secondary',
      link: '/admin/planning'
    },
    {
      title: 'Annulées',
      value: stats.cancelledBookings,
      icon: faTimesCircle,
      color: 'bg-red-500',
      link: '/admin/bookings?status=cancelled'
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Header avec date */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-gray-800">Tableau de bord</h1>
        <span className="text-sm text-gray-500 mt-1 sm:mt-0">
          {new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </span>
      </div>
      
      {/* Statistiques en grille responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
      
      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prochains transferts */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-custom p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Prochains transferts</h2>
            <Link href="/admin/bookings" className="text-primary hover:underline text-sm">
              Voir tout
            </Link>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64 text-red-500">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-6 w-6 mr-2" />
              <p>{error}</p>
            </div>
          ) : upcomingBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <FontAwesomeIcon icon={faCalendarCheck} className="h-12 w-12 mb-4" />
              <p>Aucune réservation à venir</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((booking, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-custom transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="font-mono text-sm text-gray-500">{booking.bookingId || booking._id}</span>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'completed' ? 'bg-indigo-100 text-indigo-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status === 'confirmed' ? 'Confirmé' :
                          booking.status === 'in_progress' ? 'En cours' :
                          booking.status === 'completed' ? 'Terminé' :
                          booking.status === 'cancelled' ? 'Annulé' :
                          booking.status}
                        </span>
                      </div>
                      <h3 className="font-medium">
                        {booking.customerInfo?.name || 'Client non spécifié'}
                      </h3>
                    </div>
                    <Link 
                      href={`/admin/bookings/${booking.bookingId || booking._id}`} 
                      className="text-primary hover:text-primary-dark"
                    >
                      <FontAwesomeIcon icon={faEye} className="h-5 w-5" />
                    </Link>
                  </div>
                  
                  <div className="mt-3 space-y-1 text-sm">
                    <div className="flex items-center text-gray-600">
                      <FontAwesomeIcon icon={faClock} className="h-4 w-4 text-primary mr-2" />
                      {formatDateTime(booking.pickupDateTime)}
                    </div>
                    <div className="flex items-start">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 text-primary mr-2 mt-1" />
                      <div className="flex-1">
                        <p className="text-gray-800">{booking.pickupAddress}</p>
                        <p className="text-gray-500">{booking.dropoffAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-primary mr-2" />
                      <a 
                        href={`tel:${booking.customerInfo?.phone || ''}`} 
                        className="text-primary hover:underline"
                      >
                        {booking.customerInfo?.phone || 'Téléphone non spécifié'}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Revenue et stats */}
        <div>
          {/* Ajouter le filtre temporel */}
          <RevenueTimeFilter 
            activeFilter={timeFilter} 
            onFilterChange={handleTimeFilterChange} 
          />
          
          <div className="bg-primary bg-opacity-5 rounded-lg p-6 text-center mb-4 border border-primary border-opacity-20">
            <div className="mb-2">
              <FontAwesomeIcon icon={faChartLine} className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1 mb-3">
              <p className="text-sm text-gray-600">Revenus des courses terminées</p>
              {stats.timeFilterDetails && (
                <p className="text-xs font-medium text-gray-500">
                  {stats.timeFilterDetails.label} ({stats.timeFilterDetails.dateRange})
                </p>
              )}
            </div>
            <p className="text-3xl font-bold text-primary">
              {formatPrice(stats.completedRevenue || 0)}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-custom p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Taux de conversion</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Satisfaction client</span>
                  <span className="text-sm font-medium">94%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Taux d'occupation</span>
                  <span className="text-sm font-medium">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}