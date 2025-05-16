// src/components/admin/planning/PlanningMonthView.jsx
import React from 'react';
import Link from 'next/link';
import BookingStatusBadge from '@/components/admin/BookingStatusBadge';

const PlanningMonthView = ({ bookings, currentDate, groupBookingsByDay, getBookingIdForUrl, formatTime }) => {
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  
  const days = [];
  
  // Jours du mois précédent pour remplir
  for (let i = startPadding - 1; i >= 0; i--) {
    const day = new Date(firstDay);
    day.setDate(day.getDate() - i - 1);
    days.push({ date: day, isCurrentMonth: false });
  }
  
  // Jours du mois actuel
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const day = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
    days.push({ date: day, isCurrentMonth: true });
  }
  
  // Compléter la dernière semaine si nécessaire
  while (days.length % 7 !== 0) {
    const day = new Date(lastDay);
    day.setDate(lastDay.getDate() + (days.length % 7) + 1);
    days.push({ date: day, isCurrentMonth: false });
  }
  
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 border-yellow-400 text-yellow-800';
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
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* En-têtes des jours */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
          <div key={index} className="p-2 text-center text-xs font-medium text-gray-500 bg-gray-50">
            {day}
          </div>
        ))}
      </div>
      
      {/* Grille du calendrier */}
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
                  className={`min-h-20 p-1 border-r border-gray-200 last:border-r-0 ${
                    !isCurrentMonth ? 'bg-gray-50' : ''
                  } ${isToday ? 'bg-primary-50' : ''}`}
                >
                  <div className={`text-right text-sm ${
                    !isCurrentMonth ? 'text-gray-400' : 
                    isToday ? 'text-primary font-bold' : 'text-gray-900'
                  }`}>
                    {date.getDate()}
                  </div>
                  
                  <div className="space-y-1 mt-1">
                    {dayBookings.slice(0, 2).map((booking, bookingIndex) => (
                      <Link
                        key={bookingIndex}
                        href={`/admin/bookings/${getBookingIdForUrl(booking)}`}
                        className={`block p-1 rounded text-xs ${getStatusColor(booking.status)} hover:opacity-75`}
                      >
                        <div className="font-medium truncate">{formatTime(booking.pickupDateTime)}</div>
                        <div className="truncate">{booking.customerInfo?.name}</div>
                      </Link>
                    ))}
                    {dayBookings.length > 2 && (
                      <div className="text-xs text-center text-gray-500 bg-gray-100 rounded p-1">
                        +{dayBookings.length - 2}
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

export default PlanningMonthView;