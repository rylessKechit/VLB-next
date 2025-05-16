// src/components/admin/planning/BookingCard.jsx
import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faPhone, 
  faEye,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import BookingStatusBadge from '@/components/admin/BookingStatusBadge';

const BookingCard = ({ booking, showTime = true, compact = false }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatAddress = (address, maxLength = 30) => {
    if (!address) return '';
    if (address.length <= maxLength) return address;
    return address.substring(0, maxLength) + '...';
  };

  const getBookingIdForUrl = (booking) => {
    return booking.bookingId || booking._id;
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${compact ? 'p-2' : 'p-4'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {showTime && (
              <span className={`font-semibold text-primary ${compact ? 'text-sm' : 'text-lg'}`}>
                {formatTime(booking.pickupDateTime)}
              </span>
            )}
            <BookingStatusBadge status={booking.status} />
            {compact && (
              <span className="text-xs text-gray-500">#{booking.bookingId}</span>
            )}
          </div>
          
          <h3 className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-base'} mb-1`}>
            {booking.customerInfo?.name}
          </h3>
          
          <div className={`space-y-1 ${compact ? 'text-xs' : 'text-sm'} text-gray-600`}>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-500 mr-2 w-4" />
              <span>{formatAddress(booking.pickupAddress, compact ? 25 : 35)}</span>
            </div>
            {!compact && (
              <div className="flex items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500 mr-2 w-4" />
                <span>{formatAddress(booking.dropoffAddress, 35)}</span>
              </div>
            )}
            {!compact && (
              <div className="flex items-center">
                <FontAwesomeIcon icon={faPhone} className="text-primary mr-2 w-4" />
                <a href={`tel:${booking.customerInfo?.phone}`} className="text-primary hover:underline">
                  {booking.customerInfo?.phone}
                </a>
              </div>
            )}
          </div>
        </div>
        
        <Link 
          href={`/admin/bookings/${getBookingIdForUrl(booking)}`}
          className={`text-primary hover:bg-primary-50 rounded-lg transition-colors ${compact ? 'p-1' : 'p-2'} ml-2`}
        >
          <FontAwesomeIcon icon={faEye} className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
        </Link>
      </div>
    </div>
  );
};

export default BookingCard;