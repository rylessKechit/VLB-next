// src/app/admin/planning/page.js - Version refactorisée
"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus,
  faList,
  faSpinner,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

// Composants
import PlanningViewSelector from '@/components/admin/planning/PlanningViewSelector';
import PlanningNavigation from '@/components/admin/planning/PlanningNavigation';
import PlanningFilters from '@/components/admin/planning/PlanningFilters';
import PlanningDayView from '@/components/admin/planning/PlanningDayView';
import PlanningWeekView from '@/components/admin/planning/PlanningWeekView';
import PlanningMonthView from '@/components/admin/planning/PlanningMonthView';
import PlanningListView from '@/components/admin/planning/PlanningListView';

// Utilitaires
import { formatViewTitle, groupBookingsByDay, formatTime } from '@/lib/dateUtils';

export default function PlanningPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('day');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  
  // Navigation dans le calendrier
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    
    if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    
    setCurrentDate(newDate);
  };
  
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    
    setCurrentDate(newDate);
  };
  
  const navigateToday = () => {
    setCurrentDate(new Date());
  };
  
  // Récupérer les réservations
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        
        // Calculer les dates de début et de fin
        let startDate, endDate;
        
        if (view === 'day') {
          startDate = new Date(currentDate);
          startDate.setHours(0, 0, 0, 0);
          
          endDate = new Date(currentDate);
          endDate.setHours(23, 59, 59, 999);
        } else if (view === 'week') {
          const day = currentDate.getDay();
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - (day === 0 ? 6 : day - 1));
          startDate.setHours(0, 0, 0, 0);
          
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);
          endDate.setHours(23, 59, 59, 999);
        } else if (view === 'month') {
          startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
          endDate.setHours(23, 59, 59, 999);
        } else {
          // Vue liste - prochains 30 jours
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date();
          endDate.setDate(endDate.getDate() + 30);
          endDate.setHours(23, 59, 59, 999);
        }
        
        let url = `/api/bookings?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&limit=100`;
        
        if (statusFilter) {
          url += `&status=${statusFilter}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des réservations');
        }
        
        const data = await response.json();
        setBookings(data.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [currentDate, view, statusFilter]);
  
  // Fonction utilitaire pour obtenir l'ID de réservation
  const getBookingIdForUrl = (booking) => {
    return booking.bookingId || booking._id;
  };
  
  // Rendu du contenu selon la vue
  const renderContent = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-primary text-2xl mb-2" />
          <p className="text-gray-500">Chargement du planning...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-red-500">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl mb-2" />
          <p>{error}</p>
        </div>
      );
    }
    
    switch (view) {
      case 'day':
        return <PlanningDayView bookings={bookings} currentDate={currentDate} groupBookingsByDay={groupBookingsByDay} />;
      case 'week':
        return <PlanningWeekView bookings={bookings} currentDate={currentDate} groupBookingsByDay={groupBookingsByDay} getBookingIdForUrl={getBookingIdForUrl} />;
      case 'month':
        return <PlanningMonthView bookings={bookings} currentDate={currentDate} groupBookingsByDay={groupBookingsByDay} getBookingIdForUrl={getBookingIdForUrl} formatTime={formatTime} />;
      case 'list':
        return <PlanningListView bookings={bookings} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="pb-4">
      {/* Header mobile optimisé */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">Planning</h2>
          <div className="text-sm text-gray-500">
            {bookings.length} réservation{bookings.length > 1 ? 's' : ''} 
            {view !== 'list' && ` - ${formatViewTitle(view, currentDate)}`}
          </div>
        </div>
        
        {/* Boutons d'action */}
        <div className="grid grid-cols-2 gap-3">
          <Link 
            href="/admin/bookings/new" 
            className="flex items-center justify-center bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Nouvelle réservation
          </Link>
          <Link 
            href="/admin/bookings" 
            className="flex items-center justify-center bg-secondary text-white px-4 py-3 rounded-lg hover:bg-secondary-dark transition-colors text-sm font-medium"
          >
            <FontAwesomeIcon icon={faList} className="mr-2" />
            Liste des réservations
          </Link>
        </div>
      </div>
      
      {/* Contrôles du planning */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
        {/* Sélecteur de vue */}
        <div className="p-4 border-b border-gray-200">
          <PlanningViewSelector view={view} setView={setView} />
        </div>
        
        {/* Navigation et filtres */}
        <div className="p-4">
          <PlanningNavigation 
            view={view}
            currentDate={currentDate}
            onNavigatePrevious={navigatePrevious}
            onNavigateNext={navigateNext}
            onNavigateToday={navigateToday}
            formatViewTitle={() => formatViewTitle(view, currentDate)}
          />
          
          <PlanningFilters 
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </div>
      </div>
      
      {/* Contenu principal */}
      <div>
        {renderContent()}
      </div>
    </div>
  );
}