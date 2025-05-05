"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faFilter, 
  faSort, 
  faPlus, 
  faEye, 
  faEdit,
  faTrash, 
  faCheckCircle, 
  faTimesCircle,
  faExclamationCircle,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import BookingStatusBadge from '@/components/admin/BookingStatusBadge';

export default function BookingsPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortField, setSortField] = useState('pickupDateTime');
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const bookingsPerPage = 10;
  
  // Récupérer les réservations
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        
        // Construire l'URL avec les paramètres de requête
        let url = `/api/bookings?skip=${(currentPage - 1) * bookingsPerPage}&limit=${bookingsPerPage}`;
        
        if (statusFilter) {
          url += `&status=${statusFilter}`;
        }
        
        // Ajouter la recherche si elle existe
        if (searchTerm) {
          url += `&search=${encodeURIComponent(searchTerm)}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des réservations');
        }
        
        const data = await response.json();
        
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
  }, [currentPage, statusFilter, searchTerm, sortField, sortOrder]);
  
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
  
  // Fonction pour tronquer le texte
  const truncate = (text, maxLength = 25) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  // Fonction pour changer la page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Fonction pour changer le statut d'une réservation
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setActionLoading(true);
      
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }
      
      // Mettre à jour l'état des réservations
      setBookings(bookings.map(booking => 
        booking._id === bookingId || booking.bookingId === bookingId
          ? { ...booking, status: newStatus }
          : booking
      ));
      
      setActionLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setActionLoading(false);
      // Afficher un message d'erreur à l'utilisateur
      alert('Erreur lors de la mise à jour du statut. Veuillez réessayer.');
    }
  };
  
  // Fonction pour supprimer une réservation
  const handleDelete = async (bookingId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation?')) {
      try {
        setActionLoading(true);
        
        const response = await fetch(`/api/bookings/${bookingId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la suppression');
        }
        
        // Mettre à jour l'état des réservations
        setBookings(bookings.filter(booking => 
          booking._id !== bookingId && booking.bookingId !== bookingId
        ));
        
        setActionLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setActionLoading(false);
        // Afficher un message d'erreur à l'utilisateur
        alert('Erreur lors de la suppression de la réservation. Veuillez réessayer.');
      }
    }
  };
  
  // Pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    // Ajouter la première page
    if (currentPage > 3) {
      pageNumbers.push(1);
      if (currentPage > 4) {
        // Ajouter des points de suspension si nécessaire
        pageNumbers.push('...');
      }
    }
    
    // Calculer la plage de pages à afficher
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, currentPage + 1);
    
    // Ajuster pour avoir toujours maxVisiblePages pages si possible
    if (end - start + 1 < maxVisiblePages) {
      if (start === 1) {
        end = Math.min(maxVisiblePages, totalPages);
      } else if (end === totalPages) {
        start = Math.max(1, totalPages - maxVisiblePages + 1);
      }
    }
    
    // Ajouter les pages intermédiaires
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    
    // Ajouter la dernière page
    if (end < totalPages - 1) {
      // Ajouter des points de suspension si nécessaire
      pageNumbers.push('...');
    }
    if (end < totalPages) {
      pageNumbers.push(totalPages);
    }
    
    return (
      <div className="flex justify-center my-4">
        <nav className="flex items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md mr-1 bg-white text-gray-600 border border-gray-300 disabled:opacity-50"
          >
            Précédent
          </button>
          
          {pageNumbers.map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-3 py-1">...</span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md mx-1 ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 border border-gray-300'
                }`}
              >
                {page}
              </button>
            )
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md ml-1 bg-white text-gray-600 border border-gray-300 disabled:opacity-50"
          >
            Suivant
          </button>
        </nav>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Gestion des réservations</h2>
        <Link 
          href="/admin/bookings/new" 
          className="px-4 py-2 bg-primary text-white rounded-md flex items-center hover:bg-primary-dark transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Nouvelle réservation
        </Link>
      </div>
      
      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          {/* Recherche */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filtres */}
          <div className="flex space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
              </div>
              <select
                className="block pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmé</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Liste des réservations */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <FontAwesomeIcon icon={faSpinner} spin className="h-8 w-8 text-primary" />
          </div>
        ) : error ? (
          <div className="text-center p-8 text-red-500">
            <FontAwesomeIcon icon={faExclamationCircle} className="h-8 w-8 mb-4" />
            <p>{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <p>Aucune réservation trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {session?.user?.role === 'admin' && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBookings(bookings.map(b => b._id || b.bookingId));
                          } else {
                            setSelectedBookings([]);
                          }
                        }}
                        checked={selectedBookings.length === bookings.length && bookings.length > 0}
                      />
                    </th>
                  )}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Référence
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center cursor-pointer" onClick={() => setSortField('pickupDateTime')}>
                      Date
                      <FontAwesomeIcon 
                        icon={faSort} 
                        className="ml-1 text-gray-400" 
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    De
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    À
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking._id || booking.bookingId} className="hover:bg-gray-50">
                    {session?.user?.role === 'admin' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBookings([...selectedBookings, booking._id || booking.bookingId]);
                            } else {
                              setSelectedBookings(selectedBookings.filter(id => id !== (booking._id || booking.bookingId)));
                            }
                          }}
                          checked={selectedBookings.includes(booking._id || booking.bookingId)}
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.bookingId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.customerInfo?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.customerInfo?.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDateTime(booking.pickupDateTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900" title={booking.pickupAddress}>
                        {truncate(booking.pickupAddress)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900" title={booking.dropoffAddress}>
                        {truncate(booking.dropoffAddress)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <BookingStatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          href={`/admin/bookings/${booking._id || booking.bookingId}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir les détails"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Link>
                        <Link 
                          href={`/admin/bookings/${booking._id || booking.bookingId}/edit`}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Modifier"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Link>
                        
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(booking._id || booking.bookingId, 'confirmed')}
                            disabled={actionLoading}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            title="Confirmer"
                          >
                            <FontAwesomeIcon icon={faCheckCircle} />
                          </button>
                        )}
                        
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <button
                            onClick={() => handleStatusChange(booking._id || booking.bookingId, 'cancelled')}
                            disabled={actionLoading}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Annuler"
                          >
                            <FontAwesomeIcon icon={faTimesCircle} />
                          </button>
                        )}
                        
                        {session?.user?.role === 'admin' && (
                          <button
                            onClick={() => handleDelete(booking._id || booking.bookingId)}
                            disabled={actionLoading}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Supprimer"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Informations sur le nombre de résultats */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
          Affichage de {bookings.length} réservation{bookings.length > 1 ? 's' : ''} sur {totalBookings}
        </div>
        
        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
}