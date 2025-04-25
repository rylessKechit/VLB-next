"use client";

import { useEffect } from 'react';

const DateTimePicker = ({ 
  dateId, 
  timeId, 
  dateValue, 
  timeValue, 
  onDateChange, 
  onTimeChange,
  minDate
}) => {
  useEffect(() => {
    // Set default date to tomorrow if not set
    if (!dateValue) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const formattedDate = formatDate(tomorrow);
      onDateChange(formattedDate);
    }
    
    // Set default time to current time + 1 hour if not set
    if (!timeValue) {
      const defaultTime = new Date();
      defaultTime.setHours(defaultTime.getHours() + 1);
      const formattedTime = formatTime(defaultTime);
      onTimeChange(formattedTime);
    }
  }, [dateValue, timeValue, onDateChange, onTimeChange]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  // Get minimum date (today)
  const today = new Date();
  const defaultMinDate = formatDate(today);
  
  // Get minimum time (current time if date is today)
  const isToday = dateValue === defaultMinDate;
  const now = new Date();
  const minTime = isToday ? formatTime(now) : '00:00';

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        </span>
        <input
          type="date"
          id={dateId}
          value={dateValue}
          min={minDate || defaultMinDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          required
        />
      </div>
      <div className="relative flex-1">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        </span>
        <input
          type="time"
          id={timeId}
          value={timeValue}
          min={isToday ? minTime : undefined}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          required
        />
      </div>
    </div>
  );
};

export default DateTimePicker;