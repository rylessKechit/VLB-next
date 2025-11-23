// src/lib/dateUtils.js - Utilitaires pour les dates
export const getWeekStart = (date) => {
  const day = date.getDay();
  const diff = date.getDate() - (day === 0 ? 6 : day - 1);
  return new Date(date.getFullYear(), date.getMonth(), diff);
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

// NOUVELLE FONCTION AJOUTÉE - Pour corriger le problème de timezone
export const formatDateTimeLocal = (dateTimeString) => {
  if (!dateTimeString) return 'Non spécifié';
  
  // Traiter comme heure locale sans conversion de fuseau horaire
  const [datePart, timePart] = dateTimeString.split('T');
  const [year, month, day] = datePart.split('-');
  const [hours, minutes] = timePart.split(':');
  
  const localDate = new Date(year, month - 1, day, hours, minutes);
  return localDate.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris'  // ← AJOUT CRUCIAL
  });
};

export const formatViewTitle = (view, currentDate) => {
  const options = { month: 'long', year: 'numeric' };
  
  switch (view) {
    case 'day':
      return currentDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    case 'week':
      const startWeek = getWeekStart(currentDate);
      const endWeek = new Date(startWeek);
      endWeek.setDate(startWeek.getDate() + 6);
      
      if (startWeek.getMonth() === endWeek.getMonth()) {
        return `${startWeek.getDate()} - ${endWeek.getDate()} ${startWeek.toLocaleDateString('fr-FR', options)}`;
      } else {
        return `${startWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${endWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
      }
    case 'month':
      return currentDate.toLocaleDateString('fr-FR', options);
    case 'list':
      return 'Vue Liste - Prochaines réservations';
    default:
      return '';
  }
};

export const groupBookingsByDay = (bookingsArray, date) => {
  const dateStr = date.toISOString().split('T')[0];
  
  return bookingsArray.filter(booking => {
    const bookingDate = new Date(booking.pickupDateTime);
    return bookingDate.toISOString().split('T')[0] === dateStr;
  }).sort((a, b) => {
    return new Date(a.pickupDateTime) - new Date(b.pickupDateTime);
  });
};