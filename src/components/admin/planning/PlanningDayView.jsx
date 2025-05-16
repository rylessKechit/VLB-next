// src/components/admin/planning/PlanningDayView.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import BookingCard from './BookingCard';

const PlanningDayView = ({ bookings, currentDate, groupBookingsByDay }) => {
  const dayBookings = groupBookingsByDay(bookings, currentDate);

  if (dayBookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
        <FontAwesomeIcon icon={faCalendarDay} className="text-4xl mb-3 text-gray-300" />
        <p>Aucune réservation aujourd'hui</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="divide-y divide-gray-200">
        {dayBookings.map((booking) => (
          <div key={booking._id || booking.bookingId} className="p-4">
            <BookingCard booking={booking} showTime={true} compact={false} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanningDayView;