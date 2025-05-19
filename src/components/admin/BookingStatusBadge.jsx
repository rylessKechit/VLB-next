import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faExclamationCircle, 
  faTimesCircle,
  faCheck
} from '@fortawesome/free-solid-svg-icons';

/**
 * Composant pour afficher un badge de statut pour les réservations
 * 
 * @param {Object} props
 * @param {string} props.status - Statut de la réservation ('pending', 'confirmed', 'completed', 'cancelled')
 */
const BookingStatusBadge = ({ status }) => {
  // Configuration par défaut
  let config = {
    label: status,
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    icon: null
  };
  
  // Configurer en fonction du statut
  switch (status) {
    case 'confirmed':
      config = {
        label: 'Confirmée',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        icon: faCheckCircle
      };
      break;
    case 'completed':
      config = {
        label: 'Terminée',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        icon: faCheck
      };
      break;
    case 'cancelled':
      config = {
        label: 'Annulée',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        icon: faTimesCircle
      };
      break;
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      {config.icon && (
        <FontAwesomeIcon icon={config.icon} className="mr-1 h-3 w-3" />
      )}
      {config.label}
    </span>
  );
};

export default BookingStatusBadge;