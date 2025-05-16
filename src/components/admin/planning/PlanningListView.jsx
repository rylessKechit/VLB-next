// src/components/admin/planning/PlanningListView.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';
import BookingCard from './BookingCard';

const PlanningListView = ({ bookings }) => {
  const sortedBookings = [...bookings].sort((a, b) => 
    new Date(a.pickupDateTime) - new Date(b.pickupDateTime)
  );
  
  if (sortedBookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
        <FontAwesomeIcon icon={faList} className="text-4xl mb-3 text-gray-300" />
        <p>Aucune réservation à venir</p>
      </div>
    );
  }
  
  // Grouper par jour
  const groupedByDay = {};
  sortedBookings.forEach(booking => {
    const dateKey = new Date(booking.pickupDateTime).toDateString();
    if (!groupedByDay[dateKey]) {
      groupedByDay[dateKey] = [];
    }
    groupedByDay[dateKey].push(booking);
  });
  
  return (
    <div className="space-y-4">
      {Object.entries(groupedByDay).map(([dateKey, dayBookings]) => {
        const date = new Date(dateKey);
        const isToday = date.toDateString() === new Date().toDateString();
        const isTomorrow = date.toDateString() === new Date(Date.now() + 86400000).toDateString();
        
        let dateLabel = date.toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long' 
        });
        
        if (isToday) dateLabel = `Aujourd'hui - ${dateLabel}`;
        if (isTomorrow) dateLabel = `Demain - ${dateLabel}`;
        
        return (
          <div key={dateKey} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className={`p-3 border-b ${isToday ? 'bg-primary-50 border-primary' : 'border-gray-200'}`}>
              <h3 className={`font-semibold ${isToday ? 'text-primary' : 'text-gray-900'}`}>
                {dateLabel}
              </h3>
              <span className="text-sm text-gray-500">
                {dayBookings.length} réservation{dayBookings.length > 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="divide-y divide-gray-200">
              {dayBookings.map((booking) => (
                <div key={booking._id || booking.bookingId} className="p-4">
                  <BookingCard booking={booking} showTime={true} compact={false} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlanningListView;