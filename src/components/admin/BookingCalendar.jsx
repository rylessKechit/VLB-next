"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronLeft, 
  faChevronRight, 
  faSpinner, 
  faExclamationTriangle,
  faClock,
  faMapMarkerAlt,
  faUser
} from '@fortawesome/free-solid-svg-icons';

const BookingCalendar = () => {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // 'day', 'week', 'month'
  
  // Navigation dans le calendrier
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    
    if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
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
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    
    setCurrentDate(newDate);
  };
  
  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  const getBookingIdForUrl = (booking) => {
    // Préférer bookingId car c'est plus lisible et plus stable à travers les sessions
    return booking.bookingId || booking._id;
  };
  
  // Formatage des dates
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };
  
  const formatWeekRange = (date) => {
    const day = date.getDay(); // 0 = dimanche, 1 = lundi, ...
    const firstDay = new Date(date);
    firstDay.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
    
    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6);
    
    // Si même mois
    if (firstDay.getMonth() === lastDay.getMonth()) {
      return `${firstDay.getDate()} - ${lastDay.getDate()} ${firstDay.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`;
    }
    
    // Si même année mais mois différents
    if (firstDay.getFullYear() === lastDay.getFullYear()) {
      return `${firstDay.getDate()} ${firstDay.toLocaleDateString('fr-FR', { month: 'long' })} - ${lastDay.getDate()} ${lastDay.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`;
    }
    
    // Si années différentes
    return `${firstDay.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} - ${lastDay.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  };
  
  const formatDayDate = (date) => {
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };
  
  // Obtenir un tableau des jours de la semaine
  const getWeekDays = (date) => {
    const day = date.getDay(); // 0 = dimanche, 1 = lundi, ...
    const firstDay = new Date(date);
    firstDay.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(firstDay);
      currentDay.setDate(firstDay.getDate() + i);
      days.push(currentDay);
    }
    
    return days;
  };
  
  // Obtenir un tableau des jours du mois
  const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Premier jour du mois
    const firstDay = new Date(year, month, 1);
    // Dernier jour du mois
    const lastDay = new Date(year, month + 1, 0);
    
    // Nombre de jours dans le mois
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Ajouter des jours vides pour le début du mois (si le premier jour n'est pas un lundi)
    const firstDayWeekday = firstDay.getDay(); // 0 = dimanche, 1 = lundi, ...
    const emptyDaysBefore = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;
    
    for (let i = 0; i < emptyDaysBefore; i++) {
      const emptyDay = new Date(year, month, -i);
      days.push({ date: emptyDay, isCurrentMonth: false });
    }
    days.reverse();
    
    // Ajouter les jours du mois
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDay = new Date(year, month, i);
      days.push({ date: currentDay, isCurrentMonth: true });
    }
    
    // Ajouter des jours vides pour la fin du mois (pour compléter la dernière semaine)
    const lastDayWeekday = lastDay.getDay(); // 0 = dimanche, 1 = lundi, ...
    const emptyDaysAfter = lastDayWeekday === 0 ? 0 : 7 - lastDayWeekday;
    
    for (let i = 1; i <= emptyDaysAfter; i++) {
      const emptyDay = new Date(year, month + 1, i);
      days.push({ date: emptyDay, isCurrentMonth: false });
    }
    
    return days;
  };
  
  // Grouper les réservations par jour et heure
  const groupBookingsByDay = (bookingsArray, date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    return bookingsArray.filter(booking => {
      const bookingDate = new Date(booking.pickupDateTime);
      return bookingDate.toISOString().split('T')[0] === dateStr;
    }).sort((a, b) => {
      return new Date(a.pickupDateTime) - new Date(b.pickupDateTime);
    });
  };
  
  // Obtenir la couleur en fonction du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 border-green-400 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 border-blue-400 text-blue-800';
      case 'completed':
        return 'bg-indigo-100 border-indigo-400 text-indigo-800';
      case 'cancelled':
        return 'bg-red-100 border-red-400 text-red-800';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };
  
  // Formatter l'heure
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };
  
  // Formater l'adresse
  const truncateAddress = (address, maxLength = 25) => {
    if (!address) return '';
    if (address.length <= maxLength) return address;
    return address.substring(0, maxLength) + '...';
  };
  
  // Récupérer les réservations pour la période actuelle
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        
        // Calculer les dates de début et de fin en fonction de la vue actuelle
        let startDate, endDate;
        
        if (view === 'day') {
          // Vue jour: uniquement la journée actuelle
          startDate = new Date(currentDate);
          startDate.setHours(0, 0, 0, 0);
          
          endDate = new Date(currentDate);
          endDate.setHours(23, 59, 59, 999);
        } else if (view === 'week') {
          // Vue semaine: du lundi au dimanche
          const day = currentDate.getDay(); // 0 = dimanche, 1 = lundi, ...
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - (day === 0 ? 6 : day - 1));
          startDate.setHours(0, 0, 0, 0);
          
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);
          endDate.setHours(23, 59, 59, 999);
        } else {
          // Vue mois: tout le mois
          startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
          endDate.setHours(23, 59, 59, 999);
        }
        
        // Construire l'URL avec les paramètres de requête
        const url = `/api/bookings?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&limit=100`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erreur serveur:", errorData);
          throw new Error(`Erreur lors de la récupération des réservations: ${errorData.error || response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || "Erreur inconnue");
        }
        
        setBookings(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [currentDate, view]);

  // Rendu du calendrier jour
  const renderDayView = () => {
    // Grouper les réservations par heure
    const dayBookings = groupBookingsByDay(bookings, currentDate);
    
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }
    
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 font-bold text-lg">
          {formatDayDate(currentDate)}
        </div>
        <div className="overflow-y-auto max-h-96">
          {hours.map(hour => {
            // Filtrer les réservations pour cette heure
            const hourBookings = dayBookings.filter(booking => {
              const bookingHour = new Date(booking.pickupDateTime).getHours();
              return bookingHour === hour;
            });
            
            // Si aucune réservation pour cette heure et qu'il s'agit d'une heure nocturne (0-6h ou 22-23h), ne pas afficher la ligne
            if (hourBookings.length === 0 && (hour < 6 || hour >= 22)) {
              return null;
            }
            
            return (
              <div key={hour} className="flex border-b border-gray-100 hover:bg-gray-50">
                <div className="w-16 py-4 px-2 text-center text-gray-500 font-medium border-r border-gray-100">
                  {hour < 10 ? `0${hour}:00` : `${hour}:00`}
                </div>
                <div className="flex-1 px-2 py-2">
                  {hourBookings.length === 0 ? (
                    <div className="h-6"></div>
                  ) : (
                    <div className="space-y-2">
                      {hourBookings.map(booking => (
                        <Link
                          key={booking._id || booking.bookingId}
                          href={`/admin/bookings/${getBookingIdForUrl(booking)}`}
                          className={`block p-2 rounded border-l-4 ${getStatusColor(booking.status)} hover:shadow-md transition-shadow duration-200`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <FontAwesomeIcon icon={faClock} className="mr-1 text-gray-500" />
                              <span className="font-medium">{formatTime(booking.pickupDateTime)}</span>
                            </div>
                            <div className="text-xs font-medium uppercase">{booking.status}</div>
                          </div>
                          <div className="mt-1 flex items-start">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 mt-1 text-gray-500" />
                            <div>
                              <div className="text-sm">{truncateAddress(booking.pickupAddress)}</div>
                              <div className="text-sm text-gray-500">{truncateAddress(booking.dropoffAddress)}</div>
                            </div>
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-600">
                            <FontAwesomeIcon icon={faUser} className="mr-1 text-gray-500" />
                            <span>{booking.customerInfo?.name || 'Client'}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Rendu du calendrier semaine
  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays.map((day, index) => {
            const isToday = day.toDateString() === new Date().toDateString();
            
            return (
              <div 
                key={index} 
                className={`p-4 text-center border-r border-gray-200 last:border-r-0 ${isToday ? 'bg-blue-50' : ''}`}
              >
                <div className="text-sm text-gray-500">
                  {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
                </div>
                <div className={`text-lg font-bold ${isToday ? 'text-blue-600' : ''}`}>
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays.map((day, index) => {
            const dayBookings = groupBookingsByDay(bookings, day);
            
            return (
              <div 
                key={index} 
                className="border-r border-gray-200 last:border-r-0 min-h-72 max-h-96 overflow-y-auto"
              >
                <div className="px-2 py-2 space-y-2">
                  {dayBookings.length === 0 ? (
                    <div className="h-6"></div>
                  ) : (
                    dayBookings.map(booking => (
                      <Link
                        key={booking._id || booking.bookingId}
                        href={`/admin/bookings/${getBookingIdForUrl(booking)}`}
                        className={`block p-2 rounded border-l-4 ${getStatusColor(booking.status)} hover:shadow-md transition-shadow duration-200 text-sm`}
                      >
                        <div className="font-medium">{formatTime(booking.pickupDateTime)}</div>
                        <div className="mt-1 truncate">{truncateAddress(booking.pickupAddress, 20)}</div>
                        <div className="text-xs text-gray-500 truncate">{booking.customerInfo?.name || 'Client'}</div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Rendu du calendrier mois
  const renderMonthView = () => {
    const monthDays = getMonthDays(currentDate);
    
    // Grouper les jours par semaines (7 jours par semaine)
    const weeks = [];
    for (let i = 0; i < monthDays.length; i += 7) {
      weeks.push(monthDays.slice(i, i + 7));
    }
    
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-7 border-b border-gray-200">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
            <div key={index} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 border-b border-gray-200 last:border-b-0">
              {week.map((dayObj, dayIndex) => {
                const { date, isCurrentMonth } = dayObj;
                const isToday = date.toDateString() === new Date().toDateString();
                const dayBookings = groupBookingsByDay(bookings, date);
                
                return (
                  <div 
                    key={dayIndex} 
                    className={`border-r border-gray-200 last:border-r-0 min-h-24 p-1 ${
                      isCurrentMonth ? '' : 'bg-gray-50'
                    } ${isToday ? 'bg-blue-50' : ''}`}
                  >
                    <div className={`text-right p-1 ${
                      isCurrentMonth ? isToday ? 'text-blue-600 font-bold' : '' : 'text-gray-400'
                    }`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayBookings.slice(0, 3).map((booking, bookingIndex) => (
                        <Link
                          key={`${booking._id || booking.bookingId}-${bookingIndex}`}
                          href={`/admin/bookings/${getBookingIdForUrl(booking)}`}
                          className={`block p-1 rounded-sm text-xs ${getStatusColor(booking.status)} hover:shadow-sm transition-shadow duration-200`}
                        >
                          <div className="font-medium truncate">{formatTime(booking.pickupDateTime)}</div>
                          <div className="truncate">{truncateAddress(booking.pickupAddress, 15)}</div>
                        </Link>
                      ))}
                      {dayBookings.length > 3 && (
                        <div className="text-xs text-center text-gray-500 bg-gray-100 rounded-sm p-1">
                          {dayBookings.length - 3} de plus
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      {/* En-tête avec navigation et sélection de vue */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={navigatePrevious}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Période précédente"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          
          <button
            onClick={navigateToday}
            className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors duration-200 text-sm font-medium"
          >
            Aujourd'hui
          </button>
          
          <button
            onClick={navigateNext}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Période suivante"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
          
          <h3 className="text-xl font-semibold">
            {view === 'day' && formatDayDate(currentDate)}
            {view === 'week' && formatWeekRange(currentDate)}
            {view === 'month' && formatMonthYear(currentDate)}
          </h3>
        </div>
        
        <div className="flex rounded-md shadow-sm">
          <button
            onClick={() => setView('day')}
            className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
              view === 'day' 
                ? 'bg-primary text-white border-primary' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Jour
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-4 py-2 text-sm font-medium border-t border-b ${
              view === 'week' 
                ? 'bg-primary text-white border-primary' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Semaine
          </button>
          <button
            onClick={() => setView('month')}
            className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
              view === 'month' 
                ? 'bg-primary text-white border-primary' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Mois
          </button>
        </div>
      </div>
      
      {/* Affichage du calendrier en fonction de la vue sélectionnée */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <FontAwesomeIcon icon={faSpinner} spin className="text-primary text-3xl" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center p-12 text-red-500">
          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
          <span>{error}</span>
        </div>
      ) : (
        <div>
          {view === 'day' && renderDayView()}
          {view === 'week' && renderWeekView()}
          {view === 'month' && renderMonthView()}
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;