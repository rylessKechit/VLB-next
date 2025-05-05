import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCircle, 
  faEye, 
  faCheckCircle, 
  faTimesCircle,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';

/**
 * Composant pour afficher la liste des réservations à venir
 * 
 * @param {Object} props
 * @param {Array} props.bookings - Tableau des réservations à afficher
 */
const UpcomingBookings = ({ bookings }) => {
  // Fonction pour déterminer la couleur et l'icône en fonction du statut
  const getStatusInfo = (status) => {
    switch (status) {
      case 'confirmed':
        return { color: 'text-green-500', icon: faCheckCircle, label: 'Confirmée' };
      case 'pending':
        return { color: 'text-yellow-500', icon: faExclamationCircle, label: 'En attente' };
      case 'cancelled':
        return { color: 'text-red-500', icon: faTimesCircle, label: 'Annulée' };
      case 'completed':
        return { color: 'text-blue-500', icon: faCheckCircle, label: 'Terminée' };
      default:
        return { color: 'text-gray-500', icon: faCircle, label: status };
    }
  };
  
  // Fonction pour formater la date et heure
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    
    // Formater la date
    const dateFormatted = date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    // Formater l'heure
    const timeFormatted = date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `${dateFormatted} ${timeFormatted}`;
  };
  
  // Fonction pour calculer le temps restant avant la réservation
  const getTimeRemaining = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: fr
      });
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
      return 'Date inconnue';
    }
  };
  
  // Fonction pour tronquer le texte
  const truncate = (text, maxLength = 30) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const statusInfo = getStatusInfo(booking.status);
        
        return (
          <div key={booking._id || booking.bookingId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-1">
                  <FontAwesomeIcon icon={statusInfo.icon} className={`${statusInfo.color} mr-2`} />
                  <span className="text-sm font-medium">{booking.bookingId}</span>
                </div>
                <h4 className="font-medium mb-1">{truncate(booking.customerInfo.name)}</h4>
              </div>
              <Link 
                href={`/admin/bookings/${booking._id || booking.bookingId}`}
                className="text-primary hover:text-primary-dark"
              >
                <FontAwesomeIcon icon={faEye} className="h-5 w-5" />
              </Link>
            </div>
            
            <div className="mt-2 space-y-1">
              <div className="text-sm">
                <span className="text-gray-500">De:</span> {truncate(booking.pickupAddress)}
              </div>
              <div className="text-sm">
                <span className="text-gray-500">À:</span> {truncate(booking.dropoffAddress)}
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Quand:</span> {formatDateTime(booking.pickupDateTime)}
              </div>
            </div>
            
            <div className="mt-2 flex justify-between items-center">
              <span className={`text-xs ${statusInfo.color} font-medium`}>
                {statusInfo.label}
              </span>
              <span className="text-xs text-gray-500">
                {getTimeRemaining(booking.pickupDateTime)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UpcomingBookings;