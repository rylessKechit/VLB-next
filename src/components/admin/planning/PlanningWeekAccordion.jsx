// src/components/admin/planning/PlanningWeekAccordion.jsx
import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronDown,
  faChevronRight,
  faClock,
  faMapMarkerAlt,
  faPhone,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import BookingStatusBadge from '@/components/admin/BookingStatusBadge';
import { getWeekStart } from '@/lib/dateUtils';

const PlanningWeekAccordion = ({ bookings, currentDate, groupBookingsByDay }) => {
  const [expandedDays, setExpandedDays] = useState(new Set());
  
  // Obtenir les jours de la semaine
  const weekStart = getWeekStart(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day;
  });
  
  // Toggle un jour spécifique
  const toggleDay = (dayKey) => {
    const newExpandedDays = new Set(expandedDays);
    if (newExpandedDays.has(dayKey)) {
      newExpandedDays.delete(dayKey);
    } else {
      newExpandedDays.add(dayKey);
    }
    setExpandedDays(newExpandedDays);
  };
  
  // Formater l'heure
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };
  
  // Formater l'adresse
  const formatAddress = (address, maxLength = 35) => {
    if (!address) return '';
    if (address.length <= maxLength) return address;
    return address.substring(0, maxLength) + '...';
  };
  
  // Obtenir l'ID pour les URLs
  const getBookingIdForUrl = (booking) => {
    return booking.bookingId || booking._id;
  };
  
  return (
    <div className="space-y-2">
      {weekDays.map((day, index) => {
        const dayKey = day.toISOString().split('T')[0];
        const dayBookings = groupBookingsByDay(bookings, day);
        const isToday = day.toDateString() === new Date().toDateString();
        const isTomorrow = day.toDateString() === new Date(Date.now() + 86400000).toDateString();
        const isExpanded = expandedDays.has(dayKey);
        
        // Formater le label du jour
        let dayLabel = day.toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long' 
        });
        
        if (isToday) dayLabel += ' (Aujourd\'hui)';
        if (isTomorrow) dayLabel += ' (Demain)';
        
        return (
          <div 
            key={dayKey} 
            className={`bg-white rounded-lg shadow-sm border transition-all duration-200 ${
              isToday ? 'border-primary shadow-md' : 'border-gray-200'
            }`}
          >
            {/* Header cliquable */}
            <button
              onClick={() => toggleDay(dayKey)}
              className={`w-full p-4 text-left rounded-lg transition-all duration-200 hover:bg-gray-50 ${
                isToday ? 'bg-primary-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold text-base ${
                      isToday ? 'text-primary' : 'text-gray-900'
                    }`}>
                      {dayLabel}
                    </h3>
                    
                    {/* Nombre de réservations */}
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                        dayBookings.length > 0 
                          ? 'bg-primary-100 text-primary-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {dayBookings.length} réservation{dayBookings.length > 1 ? 's' : ''}
                      </span>
                      
                      {/* Indicateur d'expansion */}
                      <FontAwesomeIcon 
                        icon={isExpanded ? faChevronDown : faChevronRight} 
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isToday ? 'text-primary' : 'text-gray-500'
                        }`}
                      />
                    </div>
                  </div>
                  
                  {/* Aperçu des statuts (quand fermé) */}
                  {!isExpanded && dayBookings.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      {/* Compter les statuts */}
                      {(() => {
                        const statusCounts = dayBookings.reduce((acc, booking) => {
                          acc[booking.status] = (acc[booking.status] || 0) + 1;
                          return acc;
                        }, {});
                        
                        return Object.entries(statusCounts).map(([status, count]) => (
                          <span 
                            key={status}
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              status === 'completed' ? 'bg-indigo-100 text-indigo-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            {count} {
                              status === 'pending' ? 'en attente' :
                              status === 'confirmed' ? 'confirmée' + (count > 1 ? 's' : '') :
                              status === 'in_progress' ? 'en cours' :
                              status === 'completed' ? 'terminée' + (count > 1 ? 's' : '') :
                              'annulée' + (count > 1 ? 's' : '')
                            }
                          </span>
                        ));
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </button>
            
            {/* Contenu dépliable */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
            }`}>
              {dayBookings.length === 0 ? (
                <div className="p-4 text-center text-gray-400 text-sm border-t border-gray-200">
                  Aucune réservation ce jour
                </div>
              ) : (
                <div className="border-t border-gray-200">
                  {dayBookings.map((booking, bookingIndex) => (
                    <div key={booking._id || booking.bookingId} 
                         className={`p-4 hover:bg-gray-50 transition-colors ${
                           bookingIndex < dayBookings.length - 1 ? 'border-b border-gray-100' : ''
                         }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Header de la réservation */}
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-lg font-semibold text-primary">
                              {formatTime(booking.pickupDateTime)}
                            </span>
                            <BookingStatusBadge status={booking.status} />
                            <span className="text-xs text-gray-500 font-mono">
                              #{booking.bookingId}
                            </span>
                          </div>
                          
                          {/* Nom du client */}
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {booking.customerInfo?.name}
                          </h4>
                          
                          {/* Détails du trajet */}
                          <div className="space-y-1.5 text-sm text-gray-600">
                            <div className="flex items-center">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-500 mr-2 w-4" />
                              <span className="font-medium">Départ:</span>
                              <span className="ml-1">{formatAddress(booking.pickupAddress)}</span>
                            </div>
                            <div className="flex items-center">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500 mr-2 w-4" />
                              <span className="font-medium">Arrivée:</span>
                              <span className="ml-1">{formatAddress(booking.dropoffAddress)}</span>
                            </div>
                            <div className="flex items-center">
                              <FontAwesomeIcon icon={faPhone} className="text-primary mr-2 w-4" />
                              <span className="font-medium">Téléphone:</span>
                              <a href={`tel:${booking.customerInfo?.phone}`} 
                                 className="ml-1 text-primary hover:underline">
                                {booking.customerInfo?.phone}
                              </a>
                            </div>
                          </div>
                          
                          {/* Informations supplémentaires */}
                          {(booking.passengers || booking.luggage) && (
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              {booking.passengers && (
                                <span>{booking.passengers} passager{booking.passengers > 1 ? 's' : ''}</span>
                              )}
                              {booking.luggage && (
                                <span>{booking.luggage} bagage{booking.luggage > 1 ? 's' : ''}</span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Bouton voir détails */}
                        <Link 
                          href={`/admin/bookings/${getBookingIdForUrl(booking)}`}
                          className="p-2 text-primary hover:bg-primary-50 rounded-lg transition-colors ml-3"
                        >
                          <FontAwesomeIcon icon={faEye} className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlanningWeekAccordion;