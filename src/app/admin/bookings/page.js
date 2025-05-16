"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faCalendarAlt, 
  faFilter, 
  faSearch, 
  faSpinner, 
  faExclamationTriangle,
  faEye,
  faCheckCircle,
  faTimesCircle,
  faChevronLeft,
  faChevronRight,
  faCalendarDay,
  faUser,
  faMapMarkerAlt,
  faPhone,
  faClock,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import BookingStatusBadge from '@/components/admin/BookingStatusBadge';

export default function BookingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const bookingsPerPage = 10;
  
  // État pour les filtres
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [showFilters, setShowFilters] = useState(false);
  
  // Récupérer les réservations
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        
        let url = `/api/bookings?skip=${(currentPage - 1) * bookingsPerPage}&limit=${bookingsPerPage}`;
        
        if (statusFilter) {
          url += `&status=${statusFilter}`;
        }
        
        if (dateRange.startDate) {
          url += `&startDate=${dateRange.startDate}`;
        }
        
        if (dateRange.endDate) {
          url += `&endDate=${dateRange.endDate}`;
        }
        
        if (searchTerm) {
          url += `&search=${encodeURIComponent(searchTerm)}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Erreur: ${errorData.error || response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || "Erreur inconnue");
        }
        
        setBookings(data.data);
        setTotalBookings(data.meta.total);
        setTotalPages(Math.ceil(data.meta.total / bookingsPerPage));
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [currentPage, statusFilter, searchTerm, dateRange]);
  
  // Changer le statut d'une réservation
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      if (!bookingId) {
        alert('ID de réservation manquant');
        return;
      }
      
      // Confirmations pour changements importants
      const confirmations = {
        'in_progress': 'Êtes-vous sûr de vouloir démarrer cette course ?',
        'completed': 'Êtes-vous sûr de marquer cette course comme terminée ?',
        'cancelled': 'Êtes-vous sûr de vouloir annuler cette réservation ?'
      };
      
      if (confirmations[newStatus] && !confirm(confirmations[newStatus])) {
        return;
      }
      
      const response = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }
      
      setBookings(bookings.map(booking => 
        (booking._id === bookingId || booking.bookingId === bookingId)
          ? { ...booking, status: newStatus }
          : booking
      ));
      
      // Messages de succès
      const messages = {
        'confirmed': 'Réservation confirmée',
        'in_progress': 'Course démarrée',
        'completed': 'Course terminée',
        'cancelled': 'Réservation annulée'
      };
      
      // Toast notification
      showToast(messages[newStatus] || 'Statut mis à jour', 'success');
      
    } catch (error) {
      console.error('Erreur:', error);
      showToast('Erreur lors de la mise à jour du statut', 'error');
    }
  };
  
  // Fonction pour afficher les toasts
  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    toast.className = `fixed top-20 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg z-50 text-sm`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  };
  
  // Formatage de date optimisé pour mobile
  const formatDateTime = (dateString) => {
    if (!dateString) return 'Non spécifié';
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Si c'est aujourd'hui
    if (date.toDateString() === today.toDateString()) {
      return `Aujourd'hui ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Si c'est demain
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Demain ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Sinon format court
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Formater l'adresse pour mobile
  const formatAddress = (address, maxLength = 35) => {
    if (!address) return '';
    if (address.length <= maxLength) return address;
    return address.substring(0, maxLength) + '...';
  };
  
  // Gestion de la pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Soumission des filtres
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setSearchTerm(formData.get('search'));
    setStatusFilter(formData.get('status'));
    setDateRange({ 
      startDate: formData.get('startDate'), 
      endDate: formData.get('endDate') 
    });
    setCurrentPage(1);
    setShowFilters(false); // Fermer les filtres après application
  };
  
  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDateRange({ startDate: '', endDate: '' });
    setCurrentPage(1);
    document.getElementById('searchForm').reset();
  };
  
  // Définir les dates par défaut
  const getDefaultDates = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return {
      today: today.toISOString().split('T')[0],
      nextWeek: nextWeek.toISOString().split('T')[0]
    };
  };
  
  const defaultDates = getDefaultDates();
  
  return (
    <div className="pb-4">
      {/* Header mobile optimisé */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">Réservations</h2>
          <div className="text-sm text-gray-500">
            {totalBookings} réservation{totalBookings > 1 ? 's' : ''} au total
          </div>
        </div>
        
        {/* Boutons d'action responsive */}
        <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-3">
          <Link 
            href="/admin/bookings/new" 
            className="flex items-center justify-center bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Nouvelle
          </Link>
          <Link 
            href="/admin/planning" 
            className="flex items-center justify-center bg-secondary text-white px-4 py-3 rounded-lg hover:bg-secondary-dark transition-colors text-sm font-medium"
          >
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
            Planning
          </Link>
        </div>
      </div>
      
      {/* Filtres mobile collapsibles */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <div className="flex items-center">
            <FontAwesomeIcon icon={faFilter} className="text-gray-500 mr-2" />
            <span className="font-medium text-gray-700">Filtres</span>
            {(statusFilter || searchTerm || dateRange.startDate) && (
              <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                Actifs
              </span>
            )}
          </div>
          <FontAwesomeIcon 
            icon={faChevronDown} 
            className={`text-gray-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} 
          />
        </button>
        
        {showFilters && (
          <div className="p-4 border-t border-gray-200">
            <form id="searchForm" onSubmit={handleSearchSubmit} className="space-y-4">
              {/* Recherche */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recherche
                </label>
                <div className="relative">
                  <FontAwesomeIcon 
                    icon={faSearch} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  />
                  <input
                    type="text"
                    name="search"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                    placeholder="Nom, email, téléphone..."
                    defaultValue={searchTerm}
                  />
                </div>
              </div>
              
              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  name="status"
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                  defaultValue={statusFilter}
                >
                  <option value="">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmé</option>
                  <option value="in_progress">En cours</option>
                  <option value="completed">Terminé</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>
              
              {/* Période */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date début
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                    defaultValue={dateRange.startDate || defaultDates.today}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date fin
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                    defaultValue={dateRange.endDate || defaultDates.nextWeek}
                  />
                </div>
              </div>
              
              {/* Boutons d'action */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  type="submit" 
                  className="bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors font-medium"
                >
                  <FontAwesomeIcon icon={faFilter} className="mr-2" />
                  Appliquer
                </button>
                <button 
                  type="button" 
                  onClick={handleResetFilters}
                  className="bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Réinitialiser
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      
      {/* Contenu principal */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FontAwesomeIcon icon={faSpinner} spin className="text-primary text-2xl" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-red-500">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl mb-2" />
            <span className="text-center">{error}</span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-5xl mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Aucune réservation trouvée</h3>
            <p className="text-sm text-center">Modifiez vos filtres ou créez une nouvelle réservation.</p>
          </div>
        ) : (
          <>
            {/* Liste mobile-first */}
            <div className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <div key={booking._id || booking.bookingId} className="p-4">
                  {/* Header de la card */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <BookingStatusBadge status={booking.status} />
                        <span className="text-sm font-mono text-gray-500">
                          #{booking.bookingId}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {booking.customerInfo?.name}
                      </h3>
                    </div>
                    <Link 
                      href={`/admin/bookings/${booking._id || booking.bookingId}`}
                      className="p-2 text-primary hover:bg-primary-50 rounded-lg transition-colors ml-2"
                    >
                      <FontAwesomeIcon icon={faEye} className="h-5 w-5" />
                    </Link>
                  </div>
                  
                  {/* Informations principales */}
                  <div className="space-y-3">
                    {/* Date et heure */}
                    <div className="flex items-center text-gray-600">
                      <FontAwesomeIcon icon={faClock} className="text-primary mr-3 w-4" />
                      <span className="font-medium">{formatDateTime(booking.pickupDateTime)}</span>
                    </div>
                    
                    {/* Contact */}
                    <div className="flex items-center text-gray-600">
                      <FontAwesomeIcon icon={faPhone} className="text-primary mr-3 w-4" />
                      <a href={`tel:${booking.customerInfo?.phone}`} 
                         className="text-primary hover:underline font-medium">
                        {booking.customerInfo?.phone}
                      </a>
                    </div>
                    
                    {/* Trajet */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start text-sm">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 mb-1">
                            {formatAddress(booking.pickupAddress)}
                          </div>
                          <div className="border-l-2 border-dashed border-gray-300 ml-2 pl-2 py-1">
                            <div className="flex items-center">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500 mr-2" />
                              <span className="text-gray-700">
                                {formatAddress(booking.dropoffAddress)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {booking.status === 'pending' && (
                        <button 
                          onClick={() => handleStatusChange(booking._id || booking.bookingId, 'confirmed')}
                          className="flex items-center bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                        >
                          <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                          Confirmer
                        </button>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <button 
                          onClick={() => handleStatusChange(booking._id || booking.bookingId, 'in_progress')}
                          className="flex items-center bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                          <FontAwesomeIcon icon={faClock} className="mr-1" />
                          Démarrer
                        </button>
                      )}
                      
                      {booking.status === 'in_progress' && (
                        <button 
                          onClick={() => handleStatusChange(booking._id || booking.bookingId, 'completed')}
                          className="flex items-center bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
                        >
                          <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                          Terminer
                        </button>
                      )}
                      
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <button 
                          onClick={() => handleStatusChange(booking._id || booking.bookingId, 'cancelled')}
                          className="flex items-center bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                        >
                          <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* Pagination mobile optimisée */}
        {!loading && !error && bookings.length > 0 && totalPages > 1 && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Page {currentPage} sur {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-3 rounded-lg border ${
                    currentPage === 1 
                      ? 'bg-gray-50 text-gray-300 border-gray-200' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                
                {/* Pages visibles sur mobile */}
                {totalPages <= 5 ? (
                  Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-4 py-3 rounded-lg border font-medium ${
                        currentPage === i + 1
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))
                ) : (
                  <>
                    {currentPage > 1 && (
                      <button
                        onClick={() => handlePageChange(1)}
                        className="px-4 py-3 rounded-lg border bg-white text-gray-700 border-gray-300 hover:bg-gray-50 font-medium"
                      >
                        1
                      </button>
                    )}
                    
                    {currentPage > 3 && <span className="text-gray-400">...</span>}
                    
                    {Array.from({ length: 3 }, (_, i) => {
                      const page = Math.max(1, Math.min(totalPages, currentPage - 1 + i));
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-3 rounded-lg border font-medium ${
                            currentPage === page
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    {currentPage < totalPages - 2 && <span className="text-gray-400">...</span>}
                    
                    {currentPage < totalPages && (
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className="px-4 py-3 rounded-lg border bg-white text-gray-700 border-gray-300 hover:bg-gray-50 font-medium"
                      >
                        {totalPages}
                      </button>
                    )}
                  </>
                )}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-3 rounded-lg border ${
                    currentPage === totalPages 
                      ? 'bg-gray-50 text-gray-300 border-gray-200' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>
            
            {/* Indicateur de résultats */}
            <div className="text-center mt-3 text-xs text-gray-500">
              {(currentPage - 1) * bookingsPerPage + 1} - {Math.min(currentPage * bookingsPerPage, totalBookings)} sur {totalBookings}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}